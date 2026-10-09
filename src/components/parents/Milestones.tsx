"use client";

import { useMemo } from "react";
import { derive } from "@/lib/derive";
import { milestones } from "@/lib/milestones";
import type { Profile } from "@/lib/model";
import { eventsFor, useDerived, useStore } from "@/lib/store";
import { useNow } from "@/lib/useNow";
import { Panel } from "./common";

/** Milestone cards for a child, such as "1 year of learning". Renders nothing until there's something to celebrate. */
export function Milestones({ p, limit }: { p: Profile; limit?: number }) {
  const d = useDerived(p.id);
  const events = useStore((s) => s.events);
  const now = useNow();
  const list = useMemo(() => {
    const cutoff = now - 182 * 86_400_000;
    const past = eventsFor(events, p).filter((e) => e.t < cutoff);
    return milestones(p.name, d, past.length ? derive(past, cutoff) : undefined, now);
  }, [d, events, p, now]);
  const shown = list.slice(0, limit ?? list.length);
  if (!shown.length) return null;
  return (
    <Panel title={`${p.name}'s milestones`} className="mb-5">
      <ul className="grid gap-3 sm:grid-cols-2">
        {shown.map((m) => (
          <li key={m.id} className="flex items-start gap-3 rounded-xl bg-paper p-3">
            <span className="text-3xl" aria-hidden="true">{m.icon}</span>
            <span>
              <span className="block font-bold">{m.title}</span>
              <span className="block text-sm text-ink-soft">{m.detail}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-ink-soft">These reflect practice in the app, not a report-card mark. Your child&apos;s teacher decides proficiency.</p>
    </Panel>
  );
}
