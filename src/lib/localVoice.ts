"use client";

export type LocalVoiceState = "off" | "ready-to-download" | "loading" | "ready" | "error";
type Snapshot = { state: LocalVoiceState; progress: number | null; error: string | null };

export function shouldUseLocalVoice(language: "en" | "fr", enabled: boolean, state: LocalVoiceState) {
  return language === "en" && enabled && state === "ready";
}

const KEY = "grademap.local-voice.enabled";
const INITIAL: Snapshot = { state: "off", progress: null, error: null };
let snapshot = INITIAL;
let worker: Worker | undefined;
let readyPromise: Promise<void> | undefined;
let nextId = 0;
let activeAudio: HTMLAudioElement | undefined;
let activeUrl: string | undefined;
const listeners = new Set<() => void>();
const pending = new Map<number, { resolve: (played: boolean) => void; reject: (error: Error) => void }>();

function publish(next: Snapshot) {
  snapshot = next;
  for (const listener of listeners) listener();
}

export function subscribeLocalVoice(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getLocalVoiceSnapshot() {
  return snapshot;
}

export function isLocalVoiceEnabled() {
  try {
    return localStorage.getItem(KEY) === "true";
  } catch {
    return false;
  }
}

function getWorker() {
  if (worker) return worker;
  worker = new Worker(new URL("./localVoice.worker.ts", import.meta.url), { type: "module" });
  worker.addEventListener("message", (event: MessageEvent) => {
    const data = event.data;
    if (data.type === "progress") {
      const progress = typeof data.progress === "number" ? Math.max(0, Math.min(100, Math.round(data.progress))) : null;
      publish({ state: "loading", progress, error: null });
    } else if (data.type === "ready") {
      publish({ state: "ready", progress: 100, error: null });
    } else if (data.type === "error") {
      readyPromise = undefined;
      publish({ state: "error", progress: null, error: data.message });
    } else if (data.type === "audio") {
      const request = pending.get(data.id);
      if (!request) return;
      pending.delete(data.id);
      if (activeUrl) URL.revokeObjectURL(activeUrl);
      activeUrl = URL.createObjectURL(data.blob);
      activeAudio?.pause();
      activeAudio = new Audio(activeUrl);
      activeAudio.onended = () => request.resolve(true);
      activeAudio.onerror = () => request.resolve(false);
      void activeAudio.play().then(() => undefined).catch(() => request.resolve(false));
    } else if (data.type === "speak-error") {
      const request = pending.get(data.id);
      if (!request) return;
      pending.delete(data.id);
      request.reject(new Error(data.message));
    }
  });
  worker.addEventListener("error", (event) => {
    readyPromise = undefined;
    publish({ state: "error", progress: null, error: event.message || "The offline voice could not start." });
  });
  return worker;
}

/** Parent opt-in. The model is downloaded only after the parent turns this on. */
export function enableLocalVoice() {
  try {
    localStorage.setItem(KEY, "true");
  } catch {
    // The opt-in is session-only in private browsing.
  }
  if (snapshot.state === "off") publish({ state: "ready-to-download", progress: null, error: null });
  if (snapshot.state === "ready") return Promise.resolve();
  if (!readyPromise) {
    publish({ state: "loading", progress: 0, error: null });
    readyPromise = new Promise<void>((resolve, reject) => {
      const onChange = () => {
        if (snapshot.state === "ready") {
          unsubscribe();
          resolve();
        } else if (snapshot.state === "error") {
          unsubscribe();
          reject(new Error(snapshot.error ?? "Could not load the offline voice."));
        }
      };
      const unsubscribe = subscribeLocalVoice(onChange);
      getWorker().postMessage({ type: "load" });
      onChange();
    }).catch((error: unknown) => {
      readyPromise = undefined;
      throw error;
    });
  }
  return readyPromise;
}

export function disableLocalVoice() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Ignore unavailable storage.
  }
  stopLocalVoice();
  publish({ state: snapshot.state === "ready" ? "ready" : "off", progress: null, error: null });
}

export function stopLocalVoice() {
  activeAudio?.pause();
  activeAudio = undefined;
  if (activeUrl) URL.revokeObjectURL(activeUrl);
  activeUrl = undefined;
  for (const [id, request] of pending) {
    pending.delete(id);
    request.resolve(false);
  }
}

/** Returns true when the local model played the text, false when native speech should be used. */
export async function speakWithLocalVoice(text: string) {
  if (!isLocalVoiceEnabled() || snapshot.state !== "ready") return false;
  const id = ++nextId;
  const speaking = new Promise<boolean>((resolve, reject) => pending.set(id, { resolve, reject }));
  getWorker().postMessage({ type: "speak", id, text });
  return speaking;
}
