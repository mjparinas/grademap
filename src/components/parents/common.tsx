"use client";

import type { ReactNode } from "react";
import { GRADE_LABEL } from "@/content/subjects";
import type { Profile } from "@/lib/model";
import { useProfiles } from "@/lib/store";
import { CritterSvg } from "../Critter";

export function PageTitle({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {sub && <p className="font-read text-ink-soft">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({ title, children, className = "" }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-line bg-white p-5 ${className}`}>
      {title && <h2 className="mb-3 text-xl font-bold">{title}</h2>}
      {children}
    </section>
  );
}

export function Avatar({ p, size = 48 }: { p: Profile; size?: number }) {
  return (
    <span className="flex shrink-0 items-center justify-center rounded-2xl p-0.5" style={{ background: p.colour, width: size, height: size }}>
      <CritterSvg id={p.avatar} />
    </span>
  );
}

/** Tabs to pick which child a page is about; keeps the choice in the URL. */
export function ChildTabs({ base, current }: { base: string; current?: Profile }) {
  const profiles = useProfiles();
  if (profiles.length < 2) return null;
  return (
    <div className="mb-5 flex flex-wrap gap-2" role="tablist">
      {profiles.map((p) => (
        <a
          key={p.id}
          role="tab"
          aria-selected={p.id === current?.id}
          href={`#/${base}/${p.id}`}
          className={`flex items-center gap-2 rounded-xl border px-3 py-2 font-semibold ${p.id === current?.id ? "border-[#253047] bg-[#253047] text-white" : "border-line bg-white"}`}
        >
          <Avatar p={p} size={28} /> {p.name} <span className="text-sm opacity-70">{GRADE_LABEL[p.grade]}</span>
        </a>
      ))}
    </div>
  );
}

export function useChild(childId?: string): Profile | undefined {
  const profiles = useProfiles();
  return profiles.find((p) => p.id === childId) ?? profiles[0];
}

export function NoChildren() {
  return (
    <Panel>
      <p className="font-read text-lg">
        No children yet. <a className="font-bold text-[#2f6fd6] underline" href="#/children">Add a child</a> to get started.
      </p>
    </Panel>
  );
}
