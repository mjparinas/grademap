"use client";

import { useSyncExternalStore } from "react";
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
import { Panel } from "./common";

const NONE: VoiceOption[] = [];

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
};

/** "Microsoft Aria Online (Natural) - English (United States)" → "Aria". */
function shortName(name: string): string {
  return name
    .replace(/^Microsoft\s+/i, "")
    .replace(/\s+Online/i, "")
    .replace(/\s*\((Natural|Premium|Enhanced)\)/i, "")
    .replace(/\s+-\s+English.*$/i, "")
    .replace(/\s*\(English.*\)$/i, "")
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
  const offline = typeof navigator !== "undefined" && navigator.onLine === false;
  const best = chooseVoice(options, null, offline);
  const current = chooseVoice(options, preferred, offline);

  return (
    <Panel title="🗣️ Read-aloud voice (this device)">
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
            <span className="font-semibold">Voice</span>
            <select
              value={preferred && options.some((o) => o.uri === preferred) ? preferred : ""}
              onChange={(e) => {
                stopSpeaking();
                setVoicePreference(e.target.value || null);
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
    </Panel>
  );
}
