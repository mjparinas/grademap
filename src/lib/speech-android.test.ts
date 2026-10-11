import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Chrome on Android drops an utterance spoken straight after cancel(), and lists voices whose
// data isn't downloaded. Device read-aloud has to work around both.
vi.mock("./piper", () => ({
  piperCanSpeak: () => false,
  piperMightSpeak: () => false,
  piperWanted: async () => false,
  speakPiper: async () => {},
  stopPiper: () => {},
}));

type Utterance = { text: string; voice?: { voiceURI: string }; lang?: string; onend?: () => void; onerror?: (e: { error: string }) => void };
const VOICES = [
  { voiceURI: "English Canada", name: "English Canada", lang: "en_CA", localService: true, default: false },
  { voiceURI: "English United States", name: "English United States", lang: "en-US", localService: true, default: true },
];
const synth = { speaking: false, pending: false, cancels: 0, said: [] as Utterance[], failVoice: "" };

beforeEach(() => {
  vi.resetModules();
  vi.useFakeTimers();
  Object.assign(synth, { speaking: false, pending: false, cancels: 0, said: [], failVoice: "" });
  vi.stubGlobal("window", globalThis);
  vi.stubGlobal("navigator", { onLine: true, userAgent: "Mozilla/5.0 (Linux; Android 15; SM-S936W) Chrome/141.0 Mobile" });
  vi.stubGlobal("localStorage", { getItem: () => null, setItem: () => {}, removeItem: () => {} });
  vi.stubGlobal("speechSynthesis", {
    getVoices: () => VOICES,
    get speaking() {
      return synth.speaking;
    },
    get pending() {
      return synth.pending;
    },
    speak: (u: Utterance) => {
      synth.said.push(u);
      if (u.voice && u.voice.voiceURI === synth.failVoice) u.onerror?.({ error: "synthesis-failed" });
    },
    cancel: () => void synth.cancels++,
    addEventListener: () => {},
  });
  vi.stubGlobal(
    "SpeechSynthesisUtterance",
    class {
      constructor(public text: string) {}
    },
  );
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("device read-aloud on Android", () => {
  it("speaks at once without a cancel when nothing is playing", async () => {
    const { speak } = await import("./speech");
    speak("Hello");
    expect(synth.cancels).toBe(0);
    expect(synth.said.map((u) => u.text)).toEqual(["Hello"]);
  });

  it("waits a moment after cancelling speech that was playing, and drops it if cancelled again", async () => {
    const { speak, stopSpeaking } = await import("./speech");
    synth.speaking = true;
    speak("First");
    expect(synth.cancels).toBe(1);
    expect(synth.said).toEqual([]);
    vi.advanceTimersByTime(200);
    expect(synth.said.map((u) => u.text)).toEqual(["First"]);

    speak("Second");
    stopSpeaking();
    vi.advanceTimersByTime(200);
    expect(synth.said.map((u) => u.text)).toEqual(["First"]);
  });

  it("writes Android's underscore language as a valid tag", async () => {
    const { speak } = await import("./speech");
    speak("Hello", "English Canada");
    expect(synth.said[0].lang).toBe("en-CA");
  });

  it("retries with the system's default voice when the chosen voice fails", async () => {
    const { speak } = await import("./speech");
    synth.failVoice = "English Canada";
    speak("Hello", "English Canada");
    expect(synth.said).toHaveLength(2);
    expect(synth.said[1].voice).toBeUndefined();
    expect(synth.said[1].lang).toBe("en-CA");
  });
});
