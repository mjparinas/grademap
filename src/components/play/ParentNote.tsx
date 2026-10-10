"use client";

import { useState } from "react";
import { activeNudge } from "@/lib/familyGoal";
import { useActiveProfile, useChildSettings } from "@/lib/store";
import { useNow } from "@/lib/useNow";

const key = (profileId: string) => `grademap.note.seen.${profileId}`;
const seen = (profileId: string): string | null => {
  try {
    return localStorage.getItem(key(profileId));
  } catch {
    return null;
  }
};

/** A kind note a parent sent, shown once on the home screen until the child closes it. */
export function ParentNote() {
  const profile = useActiveProfile();
  const settings = useChildSettings();
  const now = useNow();
  const [closed, setClosed] = useState<string | null>(null);
  const note = activeNudge(settings?.nudge, now);
  if (!profile || !note || closed === note.id || seen(profile.id) === note.id) return null;
  return (
    <section className="card flex items-center gap-3 p-4" aria-label="A note from your grown-up">
      <span className="text-3xl" aria-hidden="true">💌</span>
      <p className="flex-1 font-read text-lg font-bold">{note.text}</p>
      <button
        type="button"
        className="btn btn-soft min-h-12 px-4 font-bold"
        onClick={() => {
          try {
            localStorage.setItem(key(profile.id), note.id);
          } catch {}
          setClosed(note.id);
        }}
      >
        Thanks!
      </button>
    </section>
  );
}
