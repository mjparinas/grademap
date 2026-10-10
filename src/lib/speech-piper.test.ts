import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Read-aloud picks Piper when a parent has turned it on and the voice is on this device,
// and falls back to the device voice when Piper can't play.
const piper = vi.hoisted(() => ({
  wanted: false,
  fail: false,
  spoken: [] as { text: string; lang: string }[],
  stops: 0,
}));
vi.mock("./piper", () => ({
  piperCanSpeak: () => piper.wanted,
  piperWanted: async () => piper.wanted,
  speakPiper: async (text: string, lang: string) => {
    if (piper.fail) throw new Error("no wasm");
    piper.spoken.push({ text, lang });
  },
  stopPiper: () => void piper.stops++,
}));

const synthSaid: string[] = [];
beforeEach(() => {
  Object.assign(piper, { wanted: false, fail: false, spoken: [], stops: 0 });
  synthSaid.length = 0;
  vi.stubGlobal("window", globalThis);
  vi.stubGlobal("navigator", { onLine: true });
  vi.stubGlobal("localStorage", { getItem: () => null, setItem: () => {}, removeItem: () => {} });
  vi.stubGlobal("speechSynthesis", {
    getVoices: () => [],
    speak: (u: { text: string; onend?: () => void }) => {
      synthSaid.push(u.text);
      u.onend?.();
    },
    cancel: () => {},
    addEventListener: () => {},
  });
  vi.stubGlobal(
    "SpeechSynthesisUtterance",
    class {
      constructor(public text: string) {}
    },
  );
});
afterEach(() => vi.unstubAllGlobals());

const flush = () => new Promise((r) => setTimeout(r, 0));

describe("read-aloud with the Piper voice", () => {
  it("uses the device voice when Piper is off", async () => {
    const { speak } = await import("./speech");
    speak("Seven take away 2¢");
    await flush();
    expect(synthSaid).toEqual(["Seven take away 2 cents"]);
    expect(piper.spoken).toEqual([]);
  });

  it("uses Piper when it's on, with the same speech clean-up", async () => {
    piper.wanted = true;
    const { speak } = await import("./speech");
    speak("3 − 1 = ☐", undefined, "fr");
    await flush();
    expect(piper.spoken).toEqual([{ text: "3 minus 1 = mot manquant", lang: "fr" }]);
    expect(synthSaid).toEqual([]);
  });

  it("falls back to the device voice when Piper can't play", async () => {
    piper.wanted = true;
    piper.fail = true;
    const { speak } = await import("./speech");
    speak("Hello");
    await flush();
    expect(synthSaid).toEqual(["Hello"]);
  });

  it("previewing a device voice always uses that voice", async () => {
    piper.wanted = true;
    const { previewVoice } = await import("./speech");
    previewVoice(null);
    await flush();
    expect(piper.spoken).toEqual([]);
    expect(synthSaid[0]).toMatch(/Ollie the Otter/);
  });

  it("reads each piece of a question in order and stops Piper when cancelled", async () => {
    piper.wanted = true;
    const { speakSegments, stopSpeaking } = await import("./speech");
    speakSegments([
      { text: "Which word means cat?", lang: "en" },
      { text: "chat", lang: "fr" },
    ]);
    for (let i = 0; i < 5; i++) await flush();
    expect(piper.spoken).toEqual([
      { text: "Which word means cat?", lang: "en" },
      { text: "chat", lang: "fr" },
    ]);
    const before = piper.stops;
    stopSpeaking();
    expect(piper.stops).toBe(before + 1);
  });
});
