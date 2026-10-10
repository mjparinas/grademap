// @ts-nocheck
import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import manifest from "./piper-manifest.json";
import { filesFor, PIPER_BASE, splitSentences, type PiperFileList } from "./piper";

describe("Piper sentence splitting", () => {
  it("splits on sentence ends so the first sentence can play early", () => {
    expect(splitSentences("Hi! I'm Ollie the Otter. Let's count: one, two, three. Great job!")).toEqual([
      "Hi!",
      "I'm Ollie the Otter.",
      "Let's count: one, two, three.",
      "Great job!",
    ]);
    expect(splitSentences("Line one\nLine two")).toEqual(["Line one", "Line two"]);
  });

  it("drops pieces with nothing to say and splits very long sentences between words", () => {
    expect(splitSentences("... ! ?")).toEqual([]);
    const long = Array.from({ length: 120 }, (_, i) => `word${i}`).join(" ");
    const parts = splitSentences(long);
    expect(parts.length).toBeGreaterThan(1);
    expect(parts.every((p) => p.length <= 300)).toBe(true);
    expect(parts.join(" ")).toBe(long);
  });
});

describe("Piper files", () => {
  it("has an English and a French voice pinned by sha256", () => {
    for (const lang of ["en", "fr"] as const) {
      const v = manifest.voices[lang];
      expect(v.id.startsWith(lang)).toBe(true);
      expect(Object.keys(v.files).sort()).toEqual([`${v.id}.onnx`, `${v.id}.onnx.json`]);
      for (const hash of Object.values(v.files)) expect(hash).toMatch(/^[0-9a-f]{64}$/);
    }
    expect(manifest.voiceSource).toBe(`https://github.com/mjparinas/gradelings/releases/download/piper-voices-${manifest.version}/`);
  });

  it("copies engine files that exist in node_modules", () => {
    for (const from of Object.values(manifest.engine)) expect(fs.existsSync(path.join("node_modules", from)), from).toBe(true);
  });

  it("downloads the engine plus only the chosen language's voice", () => {
    const list: PiperFileList = { version: "1", engine: { "a.wasm": 10 }, voices: { en: { "en.onnx": 50 }, fr: { "fr.onnx": 40 } } };
    expect(filesFor(list, "fr")).toEqual([
      [`${PIPER_BASE}a.wasm`, 10],
      [`${PIPER_BASE}fr.onnx`, 40],
    ]);
  });
});

// ---- Download, check and remove, with a fake Cache API ----

const LIST: PiperFileList = { version: manifest.version, engine: { "engine.wasm": 6 }, voices: { en: { "en.onnx": 4 }, fr: { "fr.onnx": 3 } } };

function fakeCaches() {
  const stores = new Map<string, Map<string, Response>>();
  const open = async (name: string) => {
    if (!stores.has(name)) stores.set(name, new Map());
    const m = stores.get(name)!;
    const key = (r: RequestInfo | URL) => new URL(typeof r === "string" ? r : r instanceof URL ? r.href : r.url, "http://x").pathname;
    return {
      match: async (r: RequestInfo) => m.get(key(r))?.clone(),
      put: async (r: RequestInfo, res: Response) => void m.set(key(r), res),
      delete: async (r: RequestInfo) => m.delete(key(r)),
      keys: async () => [...m.keys()].map((k) => new Request(`http://x${k}`)),
    };
  };
  return { stores, api: { open, delete: async (name: string) => stores.delete(name) } };
}

function serve(url: string): Response {
  const name = url.slice(url.lastIndexOf("/") + 1);
  if (url.endsWith("files.json")) return new Response(JSON.stringify(LIST));
  if (url === "/piper-worker.js") return new Response("// worker");
  const bytes = { ...LIST.engine, ...LIST.voices.en, ...LIST.voices.fr }[name];
  return bytes ? new Response(new Uint8Array(bytes)) : new Response("", { status: 404 });
}

describe("Piper download on this device", () => {
  let caches: ReturnType<typeof fakeCaches>;
  beforeEach(() => {
    vi.resetModules();
    caches = fakeCaches();
    const storage = new Map<string, string>();
    vi.stubGlobal("window", globalThis);
    vi.stubGlobal("caches", caches.api);
    vi.stubGlobal("Worker", class {});
    vi.stubGlobal("AudioContext", class {});
    vi.stubGlobal("localStorage", { getItem: (k: string) => storage.get(k) ?? null, setItem: (k: string, v: string) => storage.set(k, v), removeItem: (k: string) => storage.delete(k) });
    vi.stubGlobal("fetch", vi.fn(async (url: string) => serve(url)));
  });
  afterEach(() => vi.unstubAllGlobals());

  it("starts off, downloads with progress, and is used once switched on", async () => {
    const piper = await import("./piper");
    expect(await piper.piperWanted("en")).toBe(false);
    expect(piper.getPiperState().voices.en.state).toBe("missing");
    expect(await piper.piperDownloadBytes("en")).toBe(10);

    await piper.downloadPiper("en");
    const s = piper.getPiperState();
    expect(s.voices.en).toMatchObject({ state: "ready", loaded: 10, total: 10 });
    expect(s.voices.fr.state).toBe("missing");
    // Downloaded but not switched on yet.
    expect(await piper.piperWanted("en")).toBe(false);
    piper.setPiperEnabled(true);
    expect(await piper.piperWanted("en")).toBe(true);
    expect(await piper.piperWanted("fr")).toBe(false);
    // French only needs its own voice now that the engine is here.
    expect(await piper.piperDownloadBytes("fr")).toBe(3);
  });

  it("remembers the download and the choice after a reload, and clears old versions", async () => {
    let piper = await import("./piper");
    await piper.downloadPiper("en");
    piper.setPiperEnabled(true);
    const store = caches.stores.get(piper.PIPER_CACHE)!;
    store.set("/piper/0/old.onnx", new Response("old"));

    vi.resetModules();
    piper = await import("./piper");
    expect(await piper.piperWanted("en")).toBe(true);
    expect(store.has("/piper/0/old.onnx")).toBe(false);
    expect(store.has("/piper-worker.js")).toBe(true);
  });

  it("isn't ready if a file is missing, and says so when the download fails offline", async () => {
    let piper = await import("./piper");
    await piper.downloadPiper("en");
    caches.stores.get(piper.PIPER_CACHE)!.delete(`${piper.PIPER_BASE}en.onnx`);
    vi.resetModules();
    piper = await import("./piper");
    expect((await piper.piperWanted("en"), piper.getPiperState().voices.en.state)).toBe("missing");

    vi.stubGlobal("fetch", vi.fn(async () => Promise.reject(new TypeError("offline"))));
    vi.stubGlobal("navigator", { onLine: false });
    await piper.downloadPiper("en");
    expect(piper.getPiperState().voices.en).toMatchObject({ state: "missing", error: expect.stringMatching(/offline/) });
  });

  it("knows without waiting when Piper won't read, so the device voice starts inside the tap", async () => {
    let piper = await import("./piper");
    expect(piper.piperMightSpeak("en")).toBe(false);
    await piper.downloadPiper("en");
    piper.setPiperEnabled(true);
    vi.resetModules();
    piper = await import("./piper");
    // Switched on but not checked yet: it might, so read-aloud waits for the check.
    expect(piper.piperMightSpeak("en")).toBe(true);
    await piper.piperWanted("en");
    expect(piper.piperMightSpeak("en")).toBe(true);
    expect(piper.piperMightSpeak("fr")).toBe(false);
    piper.setPiperEnabled(false);
    expect(piper.piperMightSpeak("en")).toBe(false);
  });

  it("removing French keeps English, and removing English turns the voice off", async () => {
    const piper = await import("./piper");
    await piper.downloadPiper("en");
    await piper.downloadPiper("fr");
    piper.setPiperEnabled(true);
    await piper.removePiper("fr");
    expect(await piper.piperWanted("en")).toBe(true);
    expect(piper.getPiperState().voices.fr.state).toBe("missing");
    await piper.removePiper("en");
    expect(piper.getPiperState().enabled).toBe(false);
    expect(caches.stores.has(piper.PIPER_CACHE)).toBe(false);
  });
});
