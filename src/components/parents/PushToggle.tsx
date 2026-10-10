"use client";

import { useEffect, useState } from "react";
import { disablePush, enablePush, pushState, pushSupported, type PushState } from "@/lib/push";

/** "Weekly report notification on this device". Hidden where the browser or the server can't do it. */
export function PushToggle() {
  const [state, setState] = useState<PushState | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (pushSupported()) void pushState().then(setState, () => setState(null));
  }, []);
  if (!state?.available) return null;
  async function toggle() {
    setBusy(true);
    setError("");
    try {
      if (state?.on) await disablePush();
      else await enablePush();
      setState(await pushState());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="mt-3">
      <button type="button" role="switch" aria-checked={state.on} disabled={busy || state.blocked} onClick={() => void toggle()} className="flex w-full items-center justify-between gap-4 rounded-xl bg-paper px-4 py-3 text-left disabled:opacity-60">
        <span>
          <span className="block font-semibold">Weekly report notification</span>
          <span className="block text-sm text-ink-soft">
            {state.blocked ? "Blocked in your browser settings for this site." : "A short heads-up on Sundays on this device. It never includes a child's name or results."}
          </span>
        </span>
        <span className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${state.on ? "bg-good" : "bg-ink/20"}`} aria-hidden="true">
          <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${state.on ? "left-7" : "left-1"}`} />
        </span>
      </button>
      {error && <p role="alert" className="mt-1 text-sm font-semibold text-nudge-dark">{error}</p>}
    </div>
  );
}
