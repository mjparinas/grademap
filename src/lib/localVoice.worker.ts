import { KokoroTTS } from "kokoro-js";

type Request = { type: "load" } | { type: "speak"; id: number; text: string };
let model: KokoroTTS | undefined;
let loading: Promise<KokoroTTS> | undefined;

self.addEventListener("message", (event: MessageEvent<Request>) => {
  const request = event.data;
  if (request.type === "load") {
    loading ??= KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", {
      dtype: "q8",
      device: "wasm",
      progress_callback: (progress) => {
        self.postMessage({
          type: "progress",
          progress: "progress" in progress ? progress.progress : null,
          file: "file" in progress ? progress.file : null,
        });
      },
    }).then((loaded) => {
      model = loaded;
      self.postMessage({ type: "ready" });
      return loaded;
    }).catch((error: unknown) => {
      loading = undefined;
      self.postMessage({ type: "error", message: error instanceof Error ? error.message : "Could not load the offline voice." });
      throw error;
    });
    void loading.catch(() => undefined);
    return;
  }

  if (request.type === "speak") {
    void (async () => {
      const tts = model ?? (await loading);
      if (!tts) throw new Error("Offline voice is not ready.");
      const audio = await tts.generate(request.text, { voice: "af_heart", speed: 0.92 });
      self.postMessage({ type: "audio", id: request.id, blob: audio.toBlob() });
    })().catch((error: unknown) => {
      self.postMessage({ type: "speak-error", id: request.id, message: error instanceof Error ? error.message : "Could not speak this text." });
    });
  }
});
