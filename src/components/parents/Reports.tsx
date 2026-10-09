"use client";

import { useMemo, useState } from "react";
import { getFramework } from "@/content/frameworks";
import { GRADE_LABEL, getSubjectMeta, SUBJECTS } from "@/content/subjects";
import { buildReport } from "@/lib/reports";
import { eventsFor, useDerived, useStore } from "@/lib/store";
import { getTrophy, TIER_STYLE } from "@/lib/trophies";
import { ColumnChart, LevelStacks, LineChart, RowBars, StatTile } from "./charts";
import { ShareReport } from "./ShareReport";
import { ChildTabs, NoChildren, PageTitle, Panel, useChild } from "./common";

const pct = (v: number) => `${Math.round(v * 100)}%`;

export function ReportsPage({ childId }: { childId?: string }) {
  const child = useChild(childId);
  const events = useStore((s) => s.events);
  const d = useDerived(child?.id ?? null);
  const [period, setPeriod] = useState(14);
  const report = useMemo(
    () => (child ? buildReport(eventsFor(events, child), d, child.grade, period) : null),
    [child, events, d, period],
  );
  if (!child || !report) return <NoChildren />;
  const scheme = getFramework(child.framework).scoringFor(child.grade);
  const t = report.totals;
  const prev = report.previous;
  const acc = t.answers ? t.correct / t.answers : 0;
  const prevAcc = prev.answers ? prev.correct / prev.answers : 0;

  return (
    <>
      <PageTitle
        title={`${child.name}'s report`}
        sub={`${GRADE_LABEL[child.grade]} · ${getFramework(child.framework).curriculumName}`}
        action={
          <div className="flex flex-wrap gap-2 print:hidden">
            {[7, 14, 30, 90].map((p) => (
              <button key={p} type="button" onClick={() => setPeriod(p)} className={`rounded-xl border px-3 py-2 text-sm font-semibold ${period === p ? "border-[#253047] bg-[#253047] text-white" : "border-line bg-white"}`}>
                {p} days
              </button>
            ))}
            <ShareReport profileId={child.id} name={child.name} days={period} />
            <button type="button" onClick={() => window.print()} className="rounded-xl border border-line bg-white px-3 py-2 text-sm font-semibold">
              🖨️ Print
            </button>
          </div>
        }
      />
      <div className="print:hidden">
        <ChildTabs base="reports" current={child} />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          label="Time learning"
          value={`${Math.round(t.minutes)} min`}
          sub={`${t.activeDays} active day${t.activeDays === 1 ? "" : "s"}`}
          delta={prev.minutes ? { text: `${Math.round(Math.abs(t.minutes - prev.minutes))} min vs previous ${period} days`, good: t.minutes >= prev.minutes } : undefined}
        />
        <StatTile label="Questions answered" value={String(t.answers)} sub={`${t.sessions} sessions finished`} />
        <StatTile
          label="Right on the first try"
          value={t.answers ? pct(acc) : "–"}
          delta={prev.answers && t.answers ? { text: `${Math.round(Math.abs(acc - prevAcc) * 100)} points vs before`, good: acc >= prevAcc } : undefined}
        />
        <StatTile label="Average time per question" value={t.answers ? `${Math.round(t.avgSeconds)} s` : "–"} sub={`Streak: ${d.streak.current} days (best ${d.streak.best})`} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <ColumnChart
          title="Minutes learning per day"
          subtitle={`Last ${period} days`}
          unit="min"
          data={report.days.map((x) => ({ label: x.label, value: Math.round(x.minutes * 10) / 10, detail: `${x.answers} questions` }))}
          format={(v) => String(Math.round(v))}
        />
        <LineChart
          title="Right on the first try, by week"
          subtitle="Last 12 weeks (weeks with 5+ questions)"
          data={report.weeks.map((w) => ({ label: w.label, value: w.accuracy, detail: `${w.answers} questions` }))}
          format={pct}
        />
        <RowBars
          title="Questions by subject"
          subtitle={`Last ${period} days`}
          rows={report.subjects.map((s) => ({
            label: getSubjectMeta(s.subject).title.big,
            value: s.answers,
            note: `${pct(s.correct / s.answers)} first try · ${Math.round(s.minutes)} min`,
          }))}
        />
        <LevelStacks
          title="Proficiency by subject"
          subtitle={`Units at each level on the ${scheme.name}`}
          levels={scheme.levels.map((l) => l.label)}
          rows={SUBJECTS.map((s) => {
            const units = report.units.filter((u) => u.ref.course.subject === s.id);
            return {
              label: s.title.big,
              counts: [0, 1, 2, 3].map((i) => units.filter((u) => u.level === i).length),
              notStarted: units.filter((u) => u.level < 0).length,
            };
          }).filter((r) => r.counts.some(Boolean) || r.notStarted)}
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel title="🌟 Strengths">
          {report.strengths.length ? (
            <ul className="flex flex-col gap-2">
              {report.strengths.map((u) => (
                <li key={u.ref.key} className="flex justify-between gap-2">
                  <span>
                    {u.ref.unit.emoji} <b>{u.ref.unit.title}</b> <span className="text-sm text-ink-soft">({getSubjectMeta(u.ref.course.subject).title.big})</span>
                  </span>
                  <span className="text-sm text-ink-soft">{pct(u.accuracy)} recent</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-read text-ink-soft">Strengths show up after a few lessons in a unit.</p>
          )}
        </Panel>
        <Panel title="🌱 Worth practising">
          {report.needs.length ? (
            <ul className="flex flex-col gap-2">
              {report.needs.map((u) => (
                <li key={u.ref.key}>
                  <p className="flex justify-between gap-2">
                    <span>
                      {u.ref.unit.emoji} <b>{u.ref.unit.title}</b>
                    </span>
                    <span className="text-sm text-ink-soft">{pct(u.accuracy)} recent</span>
                  </p>
                  <p className="text-sm text-ink-soft">{u.ref.unit.parentNote}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-read text-ink-soft">Nothing stands out as tricky right now. 🎉 Adventure and Review mode automatically focus on weaker spots.</p>
          )}
          {report.notStarted > 0 && <p className="mt-3 text-sm text-ink-soft">{report.notStarted} units in {GRADE_LABEL[child.grade]} haven&apos;t been started yet.</p>}
        </Panel>
      </div>

      <Panel title="Every unit" className="mt-5">
        <p className="mb-3 text-sm text-ink-soft">
          Levels use the {scheme.name}, based on recent first-try answers. They show progress in practice, not a report card mark: your child&apos;s teacher decides proficiency.
        </p>
        {SUBJECTS.map((s) => {
          const units = report.units.filter((u) => u.ref.course.subject === s.id);
          if (!units.length) return null;
          return (
            <details key={s.id} className="border-t border-line py-2" open={period <= 14}>
              <summary className="cursor-pointer py-1 text-lg font-bold">
                {s.emoji} {s.title.big}
              </summary>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-ink-soft">
                      <th className="py-1 pr-3">Unit</th>
                      <th className="py-1 pr-3">Learning standard</th>
                      <th className="py-1 pr-3">Level</th>
                      <th className="py-1 pr-3">Recent</th>
                      <th className="py-1">Last practised</th>
                    </tr>
                  </thead>
                  <tbody>
                    {units.map((u) => {
                      const level = scheme.levels[u.level];
                      return (
                        <tr key={u.ref.key} className="border-t border-line/60 align-top">
                          <td className="py-1.5 pr-3 font-semibold">
                            {u.ref.unit.emoji} {u.ref.unit.title}
                          </td>
                          <td className="py-1.5 pr-3 text-ink-soft">{u.ref.unit.standards[child.framework]}</td>
                          <td className="py-1.5 pr-3 whitespace-nowrap">{level ? `${level.icon} ${level.label}` : "Not started"}</td>
                          <td className="py-1.5 pr-3 tabular-nums">{u.attempts ? pct(u.accuracy) : "–"}</td>
                          <td className="py-1.5 whitespace-nowrap text-ink-soft">{u.lastT ? new Date(u.lastT).toLocaleDateString("en-CA", { month: "short", day: "numeric" }) : "–"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </details>
          );
        })}
      </Panel>

      <Panel title="🏆 Trophies this period" className="mt-5">
        {report.trophies.length ? (
          <ul className="flex flex-wrap gap-2">
            {report.trophies.map((tr) => {
              const trophy = getTrophy(tr.id);
              if (!trophy) return null;
              return (
                <li key={tr.id} className="flex items-center gap-2 rounded-xl bg-paper px-3 py-2 text-sm">
                  <span aria-hidden="true">{trophy.icon}</span> <b>{trophy.name}</b>
                  <span className="text-ink-soft">{TIER_STYLE[trophy.tier].label}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="font-read text-ink-soft">No new trophies in this period.</p>
        )}
      </Panel>
    </>
  );
}
