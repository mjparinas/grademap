"use client";

import { useEffect, useState } from "react";
import { useRoute } from "@/lib/router";
import { sounds } from "@/lib/sound";
import { useStore, type Toast } from "@/lib/store";
import { TIER_STYLE } from "@/lib/trophies";

// Console-style achievement pop-ups: one at a time, sliding in from the top
// with a chime, then sliding away.

const SHOW_MS = 4200;

function TrophyGlyph({ toast }: { toast: Toast }) {
  const style = toast.tier ? TIER_STYLE[toast.tier] : undefined;
  return (
    <span
      className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-3xl"
      style={{
        background: style ? `radial-gradient(circle at 35% 30%, ${style.glow}, ${style.colour})` : "linear-gradient(135deg,#7fb4ff,#4f8ef7)",
        boxShadow: style ? `0 0 0 3px ${style.dark}, 0 0 18px ${style.glow}` : "0 0 0 3px #2f6fd6",
      }}
    >
      {toast.icon}
    </span>
  );
}

export function Toasts() {
  const toasts = useStore((s) => s.toasts);
  const quiet = useStore((s) => Boolean(s.activeId && s.settings[s.activeId]?.quietToasts));
  const area = useRoute().path[0];
  // In quiet mode, pop-ups wait until the child is out of a lesson or game.
  const hold = quiet && (area === "session" || area === "arcade");
  const dismiss = useStore((s) => s.dismissToast);
  const current = hold ? undefined : toasts[0];
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!current) return;
    if (current.kind === "trophy") sounds.trophy(current.tier === "platinum" || current.tier === "gold");
    else if (current.kind === "level") sounds.levelUp();
    else sounds.pop(4);
    const out = setTimeout(() => setLeaving(true), SHOW_MS - 350);
    const gone = setTimeout(() => {
      setLeaving(false);
      dismiss(current.id);
    }, SHOW_MS);
    return () => {
      clearTimeout(out);
      clearTimeout(gone);
    };
  }, [current, dismiss]);

  if (!current) return null;
  const label =
    current.kind === "trophy" ? "You earned a trophy" : current.kind === "level" ? "Level up" : current.kind === "quest" ? "Quest" : "";
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[80] flex justify-center px-3" style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}>
      {/* Like a console toast it never takes taps, so it can't block the buttons under it. */}
      <div
        role="status"
        aria-live="polite"
        className={`flex w-full max-w-md items-center gap-3 rounded-2xl bg-[#1d2233]/95 px-3 py-2.5 text-left text-white shadow-2xl ring-1 ring-white/10 ${
          leaving ? "animate-toast-out" : "animate-toast-in"
        }`}
      >
        <TrophyGlyph toast={current} />
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-semibold tracking-wide text-white/60 uppercase">{label}</span>
          <span className="block truncate text-lg font-bold">{current.title}</span>
          <span className="block truncate text-sm text-white/75">{current.subtitle}</span>
        </span>
        {current.tier && (
          <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: TIER_STYLE[current.tier].colour, color: "#1d2233" }}>
            {TIER_STYLE[current.tier].label}
          </span>
        )}
      </div>
    </div>
  );
}
