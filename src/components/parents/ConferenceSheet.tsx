"use client";

import { useMemo, useState } from "react";
import { APP_NAME } from "@/lib/brand";
import { buildConferenceSheet } from "@/lib/conference";
import { buildReport } from "@/lib/reports";
import { eventsFor, useChildSettings, useDerived, useStore } from "@/lib/store";
import { Panel, useChild } from "./common";

const pct = (v: number) => `${Math.round(v * 100)}%`;

/** A printable one-pager for a parent-teacher conference: where practice stands, what to ask, and a two-week plan. */
export function ConferenceSheet({ childId }: { childId?: string }) {
  const child = useChild(childId);
  const events = useStore((s) => s.events);
  const d = useDerived(child?.id ?? null);
  const settings = useChildSettings(child?.id);
  // Fixed for this view, so the sheet doesn't shift while it's open.
  const [now] = useState(() => Date.now());
  const sheet = useMemo(() => {
    if (!child) return null;
    const report = buildReport(eventsFor(events, child), d, child.grade, child.framework, 90, now);
    return buildConferenceSheet({ name: child.name, grade: child.grade, framework: child.framework, report, derived: d, dailyGoalMinutes: settings?.dailyGoalMinutes ?? 15 });
  }, [child, events, d, settings?.dailyGoalMinutes, now]);
  if (!child || !sheet) return null;

  return (
    <Panel className="print:border-0 print:p-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Report card conversation sheet</h2>
          <p className="font-read text-ink-soft">
            {sheet.name} · {sheet.gradeLabel} · {sheet.curriculumName} · last 90 days, {new Date(now).toLocaleDateString("en-CA", { dateStyle: "long" })}
          </p>
        </div>
        <button type="button" onClick={() => window.print()} className="rounded-xl border border-line bg-white px-3 py-2 font-semibold print:hidden">
          🖨️ Print or save as PDF
        </button>
      </div>
      <p className="mt-2 font-read text-sm text-ink-soft">
        This describes practice in {APP_NAME} using the language of the {sheet.scaleName}. It is not a report-card mark. {sheet.name}&apos;s teacher decides proficiency.
      </p>

      <h3 className="mt-5 text-lg font-bold">Where practice stands</h3>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        {sheet.subjects.map((s) => (
          <div key={s.subject} className="break-inside-avoid rounded-xl border border-line p-3">
            <p className="flex flex-wrap items-baseline justify-between gap-2">
              <b className="text-lg">{s.title}</b>
              <span className="font-semibold">
                {s.levelLabel}
                {s.marks ? ` (${s.marks})` : ""}
              </span>
            </p>
            <p className="font-read text-sm text-ink-soft">{s.atHome}</p>
            <p className="mt-1 font-read text-sm">
              {s.started} of {s.total} units started{s.accuracy !== null ? ` · ${pct(s.accuracy)} right on the first try` : ""}
            </p>
            {s.strengths.length > 0 && <p className="font-read text-sm">🌟 Going well: {s.strengths.join(", ")}</p>}
            {s.growing.length > 0 && <p className="font-read text-sm">🌱 Still growing: {s.growing.join(", ")}</p>}
          </div>
        ))}
      </div>

      <h3 className="mt-5 text-lg font-bold">Questions to ask the teacher</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 font-read">
        {sheet.questions.map((q) => (
          <li key={q}>{q}</li>
        ))}
      </ul>

      <h3 className="mt-5 text-lg font-bold">A gentle two-week plan</h3>
      <p className="font-read text-sm text-ink-soft">
        About {sheet.sessionsPerWeek} sessions a week of {sheet.minutesPerSession} minutes. In {APP_NAME}, open the unit and tap Practice. Short and regular beats long and rare.
      </p>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        {sheet.plan.map((week, i) => (
          <div key={i} className="break-inside-avoid rounded-xl border border-line p-3">
            <b>Week {i + 1}</b>
            {week.length === 0 ? (
              <p className="font-read text-sm text-ink-soft">Free choice. Anything your child enjoys.</p>
            ) : (
              <ul className="mt-1 space-y-1 font-read text-sm">
                {week.map((p) => (
                  <li key={p.key}>
                    <b>{p.title}</b> ({p.subject}). {p.goal}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
}
