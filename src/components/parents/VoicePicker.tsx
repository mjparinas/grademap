"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  canSpeak,
  chooseVoice,
  getVoiceOptions,
  getVoicePreference,
  previewVoice,
  setVoicePreference,
  stopSpeaking,
  subscribeVoices,
  type VoiceOption,
  type VoiceQuality,
} from "@/lib/speech";
import { disableLocalVoice, enableLocalVoice, getLocalVoiceSnapshot, isLocalVoiceEnabled, subscribeLocalVoice } from "@/lib/localVoice";
import { Panel } from "./common";

const NONE: VoiceOption[] = [];
const LOCAL_VOICE_OFF = { state: "off" as const, progress: null, error: null };

const QUALITY: Record<VoiceQuality, { label: string; className: string }> = {
  natural: { label: "Sounds natural", className: "bg-good-soft text-good-dark" },
  enhanced: { label: "Good", className: "bg-[#e6f0ff] text-[#2f6fd6]" },
  standard: { label: "OK", className: "bg-paper text-ink-soft" },
  basic: { label: "Robotic", className: "bg-nudge-soft text-nudge-dark" },
};

const ACCENT: Record<string, string> = {
  "en-CA": "Canadian",
  "en-US": "American",
  "en-GB": "British",
  "en-AU": "Australian",
  "en-NZ": "New Zealand",
  "en-IE": "Irish",
  "en-IN": "Indian",
  "en-ZA": "South African",
  "fr-CA": "Canadian French",
  "fr-FR": "French (France)",
  "fr-BE": "Belgian French",
  "fr-CH": "Swiss French",
};

/** "Microsoft Aria Online (Natural) - English (United States)" → "Aria". */
function shortName(name: string): string {
  return name
    .replace(/^Microsoft\s+/i, "")
    .replace(/\s+Online/i, "")
    .replace(/\s*\((Natural|Premium|Enhanced)\)/i, "")
    .replace(/\s+-\s+(English|French|français).*$/i, "")
    .replace(/\s*\((English|French|français).*\)$/i, "")
    .trim();
}

function describe(o: VoiceOption): string {
  const accent = ACCENT[o.lang.replace("_", "-")] ?? o.lang;
  return [shortName(o.name), accent, QUALITY[o.quality].label, o.online ? "needs internet" : ""].filter(Boolean).join(" · ");
}

function Tips({ open }: { open: boolean }) {
  return (
    <details open={open} className="rounded-xl bg-paper p-3 text-sm">
      <summary className="cursor-pointer font-semibold">How to get a more natural voice</summary>
      <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-ink-soft">
        <li>
          <b>iPad and iPhone:</b> Settings → Accessibility → Spoken Content → Voices → English. Pick a voice and download its <i>Enhanced</i> or <i>Premium</i> version.
        </li>
        <li>
          <b>Android tablets and phones:</b> Settings → Accessibility → Text-to-speech output. Choose <i>Speech Services by Google</i>, then install the English voice data.
        </li>
        <li>
          <b>Windows:</b> open GradeMap in Microsoft Edge. Its <i>Natural</i> voices are the most lifelike (they need internet).
        </li>
        <li>
          <b>Mac:</b> System Settings → Accessibility → Spoken Content → System voice → Manage Voices, and download a <i>Premium</i> voice.
        </li>
        <li>
          <b>Chromebook:</b> Settings → Accessibility → Text-to-Speech, and install the natural Google voices.
        </li>
      </ul>
      <p className="mt-2 text-ink-soft">Then close and reopen GradeMap so it can see the new voice.</p>
    </details>
  );
}

/** Read-aloud voice for this device. Voices are part of each device, so this isn't synced. */
export function VoicePicker() {
  const options = useSyncExternalStore(subscribeVoices, getVoiceOptions, () => NONE);
  const preferred = useSyncExternalStore(subscribeVoices, getVoicePreference, () => null);
  const localVoice = useSyncExternalStore(subscribeLocalVoice, getLocalVoiceSnapshot, () => LOCAL_VOICE_OFF);
  const optedIn = useSyncExternalStore(subscribeLocalVoice, isLocalVoiceEnabled, () => false);
  const offline = optedIn || (typeof navigator !== "undefined" && navigator.onLine === false);
  const best = chooseVoice(options, null, offline);
  const current = chooseVoice(options, preferred, offline);

  useEffect(() => {
    if (optedIn && localVoice.state === "off") void enableLocalVoice().catch(() => undefined);
  }, [optedIn, localVoice.state]);

  return (
    <Panel title="🗣️ Read-aloud voice (this device)">
      <div className="mb-4 rounded-xl border border-line p-3">
        <button
          type="button"
          role="switch"
          aria-checked={optedIn}
          onClick={() => {
            if (optedIn) disableLocalVoice();
            else void enableLocalVoice().catch(() => undefined);
          }}
          className="flex w-full items-center justify-between gap-4 text-left"
        >
          <span>
            <span className="block font-semibold">Download an offline neural voice</span>
            <span className="block text-sm text-ink-soft">Parent choice for this device. English only; about 100 MB. Speech stays on this device. Turning it off keeps the download for later.</span>
          </span>
          <span className={`relative h-8 w-14 shrink-0 rounded-full ${optedIn ? "bg-good" : "bg-ink/20"}`} aria-hidden="true">
            <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow ${optedIn ? "left-7" : "left-1"}`} />
          </span>
        </button>
        {optedIn && localVoice.state === "loading" && <p className="mt-2 text-sm text-ink-soft" aria-live="polite">Downloading the offline voice… {localVoice.progress === null ? "Preparing" : `${localVoice.progress}%`}</p>}
        {optedIn && localVoice.state === "ready" && <p className="mt-2 text-sm text-good-dark">Offline English voice is ready on this device. French continues to use the device&apos;s French voice.</p>}
        {optedIn && localVoice.state === "error" && <p className="mt-2 text-sm text-nudge-dark" role="alert">Could not download the offline voice. Check your connection and try again. {localVoice.error}</p>}
        {optedIn && localVoice.state === "ready-to-download" && <p className="mt-2 text-sm text-ink-soft">Ready to download. Connect to the internet to get the voice files.</p>}
      </div>
      {!canSpeak() ? (
        <p className="text-ink-soft">This browser can&apos;t read aloud.</p>
      ) : options.length === 0 ? (
        <>
          <p className="mb-3 text-ink-soft">No English voices found on this device yet.</p>
          <Tips open />
        </>
      ) : (
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="font-semibold">{optedIn ? "Device voice if the offline model is unavailable" : "Voice"}</span>
            <select
              value={preferred && options.some((o) => o.uri === preferred) ? preferred : ""}
              onChange={(e) => {
                stopSpeaking();
                setVoicePreference(e.target.value || null);
              }}
              className="rounded-xl border-2 border-line bg-white px-3 py-2.5 text-base"
            >
              <option value="">Automatic: {best ? describe(best) : "best available"}</option>
              {options.filter((o) => !offline || !o.online).map((o) => (
                <option key={o.uri} value={o.uri}>
                  {describe(o)}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="rounded-xl bg-[#4f8ef7] px-4 py-2.5 font-bold text-[#0f172a]" onClick={() => previewVoice(preferred)}>
              ▶ Preview
            </button>
            {current && (
              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${QUALITY[current.quality].className}`}>
                {shortName(current.name)}: {QUALITY[current.quality].label}
              </span>
            )}
          </div>
          {current?.online && <p className="text-sm text-ink-soft">This voice needs internet. When offline, read-aloud switches to the best voice on the device.</p>}
          <p className="text-sm text-ink-soft">Each device has its own voices, so choose one on every tablet or phone your children use.</p>
          <Tips open={best?.quality === "basic" || best?.quality === "standard"} />
        </div>
      )}
      {canSpeak() && <FrenchVoice />}
    </Panel>
  );
}

/** The voice for French Immersion and Core French questions. Separate from the English voice because every voice speaks one language. */
function FrenchVoice() {
  const options = useSyncExternalStore((l) => subscribeVoices(l), () => getVoiceOptions("fr"), () => NONE);
  const preferred = useSyncExternalStore(subscribeVoices, () => getVoicePreference("fr"), () => null);
  const offline = isLocalVoiceEnabled() || (typeof navigator !== "undefined" && navigator.onLine === false);
  const best = chooseVoice(options, null, offline);
  const current = chooseVoice(options, preferred, offline);
  return (
    <div className="mt-5 flex flex-col gap-3 border-t border-line pt-4">
      <h3 className="text-lg font-bold">French voice</h3>
      {options.length === 0 ? (
        <p className="text-sm text-ink-soft">
          No French voices found on this device yet, so French lessons will be read in an English voice. Add a French voice in your device&apos;s speech settings
          (the same place as the English tips above, but choose French, ideally Canadian French), then reopen GradeMap.
        </p>
      ) : (
        <>
          <label className="flex flex-col gap-1">
            <span className="font-semibold">Voice for French lessons</span>
            <select
              value={preferred && options.some((o) => o.uri === preferred) ? preferred : ""}
              onChange={(e) => {
                stopSpeaking();
                setVoicePreference(e.target.value || null, "fr");
              }}
              className="rounded-xl border-2 border-line bg-white px-3 py-2.5 text-base"
            >
              <option value="">Automatic: {best ? describe(best) : "best available"}</option>
              {options.map((o) => (
                <option key={o.uri} value={o.uri}>
                  {describe(o)}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="rounded-xl bg-[#4f8ef7] px-4 py-2.5 font-bold text-[#0f172a]" onClick={() => previewVoice(preferred, "fr")}>
              ▶ Preview French
            </button>
            {current && (
              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${QUALITY[current.quality].className}`}>
                {shortName(current.name)}: {QUALITY[current.quality].label}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
