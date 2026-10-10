// Piper read-aloud, off the main thread so taps and animations never stutter (src/lib/piper.ts).
// Each sentence is turned into phonemes (espeak-ng, piper_phonemize.wasm) and then into audio
// (the voice model, run by onnxruntime-web), and posted back as soon as it's ready.
//
// Files come from the Piper cache first, so this works offline whether or not the service
// worker controls this worker. Scripts are loaded from blob URLs of the cached copies.
/* global ort, createPiperPhonemize */
const CACHE = "grademap-piper";

let engine;
const voices = new Map();
const cancelled = new Set();
let queue = Promise.resolve();

async function file(url) {
  const hit = await caches.open(CACHE).then((c) => c.match(url));
  const res = hit || (await fetch(url));
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res;
}

async function scriptUrl(url) {
  const text = await (await file(url)).text();
  return URL.createObjectURL(new Blob([text], { type: "text/javascript" }));
}

function loadEngine(base) {
  engine ??= (async () => {
    importScripts(await scriptUrl(base + "ort.wasm.min.js"), await scriptUrl(base + "piper_phonemize.js"));
    ort.env.wasm.numThreads = 1;
    ort.env.wasm.wasmPaths = { mjs: await scriptUrl(base + "ort-wasm-simd-threaded.mjs") };
    ort.env.wasm.wasmBinary = await (await file(base + "ort-wasm-simd-threaded.wasm")).arrayBuffer();
    const [wasm, data] = await Promise.all([
      file(base + "piper_phonemize.wasm").then((r) => r.arrayBuffer()),
      file(base + "piper_phonemize.data").then((r) => r.arrayBuffer()),
    ]);
    let printed;
    const phonemizer = await createPiperPhonemize({
      print: (line) => (printed = line),
      printErr: () => {},
      wasmBinary: wasm,
      getPreloadedPackage: () => data,
    });
    return (text, espeakVoice) => {
      printed = undefined;
      phonemizer.callMain(["-l", espeakVoice, "--input", JSON.stringify([{ text }]), "--espeak_data", "/espeak-ng-data"]);
      if (!printed) throw new Error("No phonemes");
      return JSON.parse(printed).phoneme_ids;
    };
  })();
  engine.catch(() => (engine = undefined));
  return engine;
}

function loadVoice(base, id) {
  if (!voices.has(id)) {
    const loading = (async () => {
      const config = await (await file(`${base}${id}.onnx.json`)).json();
      const model = await (await file(`${base}${id}.onnx`)).arrayBuffer();
      const session = await ort.InferenceSession.create(model, { executionProviders: ["wasm"] });
      return { config, session };
    })();
    loading.catch(() => voices.delete(id));
    voices.set(id, loading);
  }
  return voices.get(id);
}

async function speak({ id, base, voice, sentences, rate }) {
  const phonemize = await loadEngine(base);
  const { config, session } = await loadVoice(base, voice);
  const { noise_scale, length_scale, noise_w } = config.inference;
  for (const text of sentences) {
    if (cancelled.has(id)) return;
    const ids = phonemize(text, config.espeak.voice);
    const feeds = {
      input: new ort.Tensor("int64", BigInt64Array.from(ids, BigInt), [1, ids.length]),
      input_lengths: new ort.Tensor("int64", BigInt64Array.from([BigInt(ids.length)]), [1]),
      scales: new ort.Tensor("float32", Float32Array.from([noise_scale, length_scale / rate, noise_w]), [3]),
    };
    if (Object.keys(config.speaker_id_map ?? {}).length) feeds.sid = new ort.Tensor("int64", BigInt64Array.from([0n]), [1]);
    const { output } = await session.run(feeds);
    if (cancelled.has(id)) return;
    const pcm = new Float32Array(output.data);
    self.postMessage({ type: "chunk", id, pcm, sampleRate: config.audio.sample_rate }, [pcm.buffer]);
  }
}

self.onmessage = (event) => {
  const m = event.data;
  if (m?.type === "cancel") {
    cancelled.add(m.id);
    return;
  }
  if (m?.type !== "speak") return;
  // One request at a time: a new one is usually preceded by a cancel, so the old one stops early.
  queue = queue
    .then(() => speak(m))
    .catch((e) => self.postMessage({ type: "error", id: m.id, message: e instanceof Error ? e.message : String(e) }))
    .finally(() => cancelled.delete(m.id));
};
