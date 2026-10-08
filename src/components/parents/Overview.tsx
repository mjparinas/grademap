"use client";

import { GRADE_LABEL, getSubjectMeta } from "@/content/subjects";
import { getFramework } from "@/content/frameworks";
import { dayKey, type Profile } from "@/lib/model";
import { subjectSummaries } from "@/lib/proficiency";
import { useDerived, useProfiles, useStore } from "@/lib/store";
import { useNow } from "@/lib/useNow";
import { Avatar, NoChildren, PageTitle, Panel } from "./common";

function ChildCard({ p }: { p: Profile }) {
  const d = useDerived(p.id);
  const scheme = getFramework(p.framework).scoringFor(p.grade);
  const now = useNow();
  const week = Array.from({ length: 7 }, (_, i) => d.days[dayKey(now - i * 86_400_000)]);
  const minutes = Math.round(week.reduce((s, x) => s + (x?.learnSeconds ?? 0), 0) / 60);
  const answers = week.reduce((s, x) => s + (x?.answers ?? 0), 0);
  const correct = week.reduce((s, x) => s + (x?.correct ?? 0), 0);
  const lastActive = Math.max(0, ...Object.values(d.units).map((u) => u.lastT));
  return (
    <Panel>
      <div className="flex items-center gap-3">
        <Avatar p={p} size={56} />
        <div className="flex-1">
          <p className="text-xl font-bold">{p.name}</p>
          <p className="text-sm text-ink-soft">
            {GRADE_LABEL[p.grade]} · Level {d.level} · 🔥 {d.streak.current}-day streak
          </p>
        </div>
        <a href={`#/reports/${p.id}`} className="rounded-xl bg-[#253047] px-3 py-2 text-sm font-bold text-white">
          Full report →
        </a>
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-paper p-3">
          <dt className="text-xs font-semibold text-ink-soft">This week</dt>
          <dd className="text-2xl font-bold">{minutes} min</dd>
        </div>
        <div className="rounded-xl bg-paper p-3">
          <dt className="text-xs font-semibold text-ink-soft">Questions</dt>
          <dd className="text-2xl font-bold">{answers}</dd>
        </div>
        <div className="rounded-xl bg-paper p-3">
          <dt className="text-xs font-semibold text-ink-soft">First-try right</dt>
          <dd className="text-2xl font-bold">{answers ? `${Math.round((correct / answers) * 100)}%` : "–"}</dd>
        </div>
      </dl>
      <ul className="mt-4 flex flex-col gap-2">
        {subjectSummaries(d, p.grade).map((s) => {
          const level = scheme.levels[s.level];
          return (
            <li key={s.subject} className="flex items-center justify-between gap-2 text-sm">
              <span className="font-semibold">
                {getSubjectMeta(s.subject).emoji} {getSubjectMeta(s.subject).title.big}
              </span>
              <span className="text-ink-soft">
                {level ? (
                  <>
                    <span aria-hidden="true">{level.icon}</span> mostly <b>{level.label}</b> · {s.started}/{s.total} units started
                  </>
                ) : (
                  "Not started yet"
                )}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-ink-soft">{lastActive ? `Last practised ${new Date(lastActive).toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short" })}` : "Hasn't practised yet"}</p>
    </Panel>
  );
}

export function Overview() {
  const profiles = useProfiles();
  const account = useStore((s) => s.family.account);
  return (
    <>
      <PageTitle title="Overview" sub="How everyone is doing this week." />
      {!account && (
        <Panel className="mb-5 border-[#4f8ef7]/40 bg-[#eef4ff]">
          <p className="font-read">
            💾 Progress is saved on this device only. <a href="#/account" className="font-bold text-[#2f6fd6] underline">Create a free account</a> to back it up and sync between tablets, phones and computers. It keeps working offline either way.
          </p>
        </Panel>
      )}
      {profiles.length === 0 ? (
        <NoChildren />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {profiles.map((p) => (
            <ChildCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </>
  );
}
