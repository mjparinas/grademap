"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { downloadPiper, getPiperState, PIPER_VOICES, piperDownloadBytes, piperSupported, removePiper, setPiperEnabled, subscribePiper, type PiperState } from "@/lib/piper";
import { previewPiper, stopSpeaking, type SpeechLanguage } from "@/lib/speech";
import { Switch } from "./common";

const mb = (bytes: number) => `${Math.max(1, Math.round(bytes / 1e6))} MB`;

/** The downloadable Piper voice for one language on this device. English carries the on/off switch. */
export function PiperVoice({ language }: { language: SpeechLanguage }) {
  const piper = useSyncExternalStore<PiperState | undefined>(subscribePiper, getPiperState, () => undefined);
  const [size, setSize] = useState<number>();
  const [previewing, setPreviewing] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);
  const voice = piper?.voices[language];
  const otherReady = piper?.voices[language === "en" ? "fr" : "en"].state === "ready";

  useEffect(() => {
    if (voice?.state === "missing") void piperDownloadBytes(language).then(setSize);
  }, [voice?.state, language, otherReady]);

  if (!piper || !voice || voice.state === "checking") return null;
  if (!piperSupported()) return language === "en" ? <p className="text-sm text-ink-soft">This browser can&apos;t run the offline voice.</p> : null;

  const french = language === "fr";
  const name = PIPER_VOICES[language].name;
  const preview = () => {
    stopSpeaking();
    setPreviewFailed(false);
    setPreviewing(true);
    previewPiper(language)
      .catch(() => setPreviewFailed(true))
      .finally(() => setPreviewing(false));
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border-2 border-line p-4" data-testid={`piper-${language}`}>
      <div>
        <h3 className="text-lg font-bold">{french ? "Offline French voice" : "Offline natural voice"}</h3>
        <p className="text-sm text-ink-soft">
          {french
            ? `${name}, a French voice that runs on this device. Used for French lessons when the offline voice is on.`
            : `${name}, a natural-sounding voice that runs on this device, so it sounds the same everywhere and works with no internet. It's a one-time download kept on this device.`}
        </p>
      </div>

      {voice.state === "missing" && (
        <>
          <button
            type="button"
            className="self-start rounded-xl bg-[#4f8ef7] px-4 py-2.5 font-bold text-[#0f172a] disabled:opacity-40"
            disabled={french && piper.voices.en.state === "downloading"}
            onClick={() => void downloadPiper(language)}
          >
            ⬇ Download {french ? "French voice" : "voice"}
            {size ? ` (${mb(size)})` : ""}
          </button>
          {voice.error && (
            <p role="alert" className="text-sm font-semibold text-nudge-dark">
              {voice.error}
            </p>
          )}
          {!french && <p className="text-sm text-ink-soft">Best on Wi-Fi. Until it&apos;s downloaded, read-aloud uses the device voice below.</p>}
        </>
      )}

      {voice.state === "downloading" && (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold">Downloading… {voice.total ? `${mb(voice.loaded)} of ${mb(voice.total)}` : ""}</span>
          <div
            role="progressbar"
            aria-label={`Downloading the ${french ? "French " : ""}voice`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={voice.total ? Math.round((voice.loaded / voice.total) * 100) : 0}
            className="h-3 overflow-hidden rounded-full bg-paper"
          >
            <div className="h-full bg-[#2a78d6] transition-[width]" style={{ width: `${voice.total ? (voice.loaded / voice.total) * 100 : 0}%` }} />
          </div>
        </div>
      )}

      {voice.state === "ready" && (
        <>
          {!french && (
            <Switch
              label="Use the offline voice for read-aloud"
              value={piper.enabled}
              onChange={(on) => {
                stopSpeaking();
                setPiperEnabled(on);
              }}
              help="On this device only. Turn it off to use the device voice instead."
            />
          )}
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="rounded-xl bg-[#4f8ef7] px-4 py-2.5 font-bold text-[#0f172a]" onClick={preview} disabled={previewing}>
              {previewing ? "Speaking…" : french ? "▶ Preview French" : "▶ Preview"}
            </button>
            <button type="button" className="rounded-xl border-2 border-line px-4 py-2.5 font-semibold" onClick={() => void removePiper(language)}>
              Remove from this device
            </button>
          </div>
          {previewFailed && (
            <p role="alert" className="text-sm font-semibold text-nudge-dark">
              The voice couldn&apos;t play on this device. Read-aloud will use the device voice.
            </p>
          )}
        </>
      )}
      <p className="text-xs text-ink-soft">
        {PIPER_VOICES[language].credit} Speech by <a className="underline" href="https://github.com/rhasspy/piper">Piper</a> and{" "}
        <a className="underline" href="https://github.com/espeak-ng/espeak-ng">eSpeak NG</a> (GPL-3.0).
      </p>
    </div>
  );
}
