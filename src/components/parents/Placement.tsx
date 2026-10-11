"use client";

import Link from "next/link";
import { useMemo } from "react";
import { getUnitRef, parseUnitKey } from "@/content";
import { DEFAULT_FRAMEWORK, getFramework } from "@/content/frameworks";
import { GRADE_LABEL, getSubjectMeta } from "@/content/subjects";
import type { GradeId, SubjectId } from "@/content/types";
import { compareToGrade, latestPlacements, PLACEMENT_SUBJECTS, placementSentence, STAGE_SIZE, type PlacementEvent } from "@/lib/placement";
import { eventsFor, useStore } from "@/lib/store";
import { useGradeContent } from "@/lib/useGradeContent";
import type { Profile } from "@/lib/model";
import { ChildTabs, NoChildren, PageTitle, Panel, useChild } from "./common";

function unitTitle(key: string): string {
  const ref = getUnitRef(key);
  if (ref) return `${ref.unit.emoji} ${ref.unit.title}`;
  const parsed = parseUnitKey(key);
  return parsed ? `${GRADE_LABEL[parsed.grade]} · ${parsed.unitId}` : key;
}

function SubjectResult({ child, subject, result }: { child: Profile; subject: SubjectId; result?: PlacementEvent }) {
  const meta = getSubjectMeta(subject);
  const updateProfile = useStore((s) => s.updateProfile);
  const where = result ? compareToGrade(result.placedGrade, child.grade) : "at";
  return (
    <Panel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">
          <span aria-hidden="true">{meta.emoji}</span> {meta.title.big}
        </h2>
        {/* The test runs in the kids' app as the active child. */}
        <Link href={`/play/#/placement/${subject}`} onClick={() => useStore.getState().setActive(child.id)} className="rounded-xl bg-[#253047] px-3 py-2 text-sm font-bold text-white">
          {result ? "Retake" : "Start the test"} →
        </Link>
      </div>
      {!result ? (
        <p className="mt-3 font-read text-ink-soft">
          Not taken yet. {child.name} answers about 8 to 16 questions, starting at {GRADE_LABEL[child.grade]} and moving up or down. It takes about 5 minutes and is not scored out loud, so it stays low-pressure.
        </p>
      ) : (
        <>
          <p className="mt-3 text-lg font-bold">{placementSentence(result, child.name, child.grade)}</p>
          <p className="font-read text-sm text-ink-soft">
            Taken {new Date(result.t).toLocaleDateString("en-CA", { dateStyle: "medium" })}
            {result.confidence === "low" && " · A close call: answers were mixed, so treat this as a starting point."}
          </p>
          <ul className="mt-4 flex flex-col gap-2" aria-label="Results by grade">
            {result.stages.map((s) => (
              <li key={s.grade} className="flex items-center gap-3 text-sm">
                <span className="w-28 shrink-0 font-semibold">{GRADE_LABEL[s.grade as GradeId]}</span>
                <span className="h-3 flex-1 overflow-hidden rounded-full bg-black/10" aria-hidden="true">
                  <span className="block h-full rounded-full bg-[#2a78d6]" style={{ width: `${(s.correct / s.total) * 100}%` }} />
                </span>
                <span className="w-24 shrink-0 text-right tabular-nums">
                  {s.correct} of {s.total || STAGE_SIZE} right
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-paper p-4">
              <h3 className="font-bold">Good places to start ({GRADE_LABEL[result.placedGrade]})</h3>
              <ul className="mt-1 list-disc pl-5 font-read">
                {result.startUnits.map((k) => (
                  <li key={k}>{unitTitle(k)}</li>
                ))}
              </ul>
            </div>
            {result.reviewUnits.length > 0 && (
              <div className="rounded-xl bg-paper p-4">
                <h3 className="font-bold">Worth a quick revisit</h3>
                <ul className="mt-1 list-disc pl-5 font-read">
                  {result.reviewUnits.map((k) => (
                    <li key={k}>{unitTitle(k)}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {where !== "at" && (
            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-[#4f8ef7]/40 bg-[#eef4ff] p-4">
              <p className="min-w-0 flex-1 font-read">
                Lessons follow {child.name}&apos;s grade ({GRADE_LABEL[child.grade]}). To practise {GRADE_LABEL[result.placedGrade]} lessons instead, switch the grade. Their progress is kept.
              </p>
              <button type="button" onClick={() => updateProfile(child.id, { grade: result.placedGrade })} className="rounded-xl bg-[#253047] px-3 py-2 text-sm font-bold text-white">
                Practise {GRADE_LABEL[result.placedGrade]}
              </button>
            </div>
          )}
        </>
      )}
    </Panel>
  );
}

export function PlacementPage({ childId }: { childId?: string }) {
  const child = useChild(childId);
  const events = useStore((s) => s.events);
  const placements = useMemo(() => (child ? latestPlacements(eventsFor(events, child)) : {}), [events, child]);
  // Results can mention grades other than the child's own, so make sure their lessons are in to show unit names.
  const grades = useMemo(
    () =>
      Object.values(placements).flatMap((p) =>
        [p.placedGrade, ...p.stages.map((s) => s.grade as GradeId)].map((grade) => ({ grade, framework: child?.framework ?? DEFAULT_FRAMEWORK })),
      ),
    [placements, child],
  );
  useGradeContent(grades);
  if (!child) return <NoChildren />;
  return (
    <>
      <PageTitle title="Placement test" sub="A short check of where your child sits against grade-level expectations, so you can pick the right units." />
      <ChildTabs base="placement" current={child} />
      <div className="flex flex-col gap-5">
        {PLACEMENT_SUBJECTS.map((s) => (
          <SubjectResult key={s} child={child} subject={s} result={placements[s]} />
        ))}
        <Panel>
          <p className="font-read text-sm text-ink-soft">
            This is a short snapshot built from the same {getFramework(child.framework).curriculumName} questions used in practice. It is not a report-card mark, and it does not change {child.name}&apos;s stars, XP or levels. Only a teacher decides proficiency. One tricky afternoon can lower a result, so feel free to retake it.
          </p>
        </Panel>
      </div>
    </>
  );
}
