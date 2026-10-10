"use client";

import { useEffect, useRef, useState } from "react";
import { AVAILABLE_GRADES, loadGrades, type ContentTarget } from "@/content";
import { getFramework } from "@/content/frameworks";
import { getSubjectMeta } from "@/content/subjects";
import type { FrameworkId, GradeId, SubjectId } from "@/content/types";
import { buildStage, gradesWithSubject, nextGrade, STAGE_SIZE, summarize, toEvent, MAX_STAGES, type Stage, type StageQuestion } from "@/lib/placement";
import { go } from "@/lib/router";
import { speakQuestion } from "@/lib/readaloud";
import { stopSpeaking } from "@/lib/speech";
import { useActiveProfile, useChildSettings, useStore } from "@/lib/store";
import { useBand } from "../band";
import { Critter, SpeechBubble } from "../Critter";
import { Dialog, Page, ProgressBar } from "../ui";
import { QuestionVisual } from "../visuals";
import { QuestionBody } from "./Session";

// The kids' side of the placement test. It looks like a calm lesson but gives no
// right/wrong feedback and no retries; the result goes to the parent area.

type Phase = "intro" | "loading" | "asking" | "done" | "error";

const neighbours = (grade: GradeId, framework: FrameworkId): ContentTarget[] => {
  const grades = AVAILABLE_GRADES.filter((g) => getFramework(framework).grades.includes(g));
  const i = grades.indexOf(grade);
  return [grades[i - 1], grade, grades[i + 1]].filter(Boolean).map((g) => ({ grade: g, framework }));
};

export function PlacementTest({ subject }: { subject: SubjectId }) {
  const profile = useActiveProfile()!;
  const settings = useChildSettings();
  const band = useBand();
  const log = useStore((s) => s.log);
  const meta = getSubjectMeta(subject);
  const companion = profile.companion ?? "ollie";

  const [phase, setPhase] = useState<Phase>("intro");
  const [stageQs, setStageQs] = useState<StageQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [part, setPart] = useState(1);
  const [confirmExit, setConfirmExit] = useState(false);
  const stages = useRef<Stage[]>([]);
  const current = useRef<{ grade: GradeId; correct: number; missed: string[] }>({ grade: profile.grade, correct: 0, missed: [] });
  const busy = useRef(false);
  const slipped = useRef(false);

  const q = stageQs[index]?.question;

  useEffect(() => {
    if (phase === "asking" && q && settings?.autoRead) speakQuestion(q);
    return stopSpeaking;
  }, [phase, q, settings?.autoRead]);

  async function startStage(grade: GradeId) {
    const qs = buildStage(grade, subject, profile.framework);
    if (!qs.length) return false;
    current.current = { grade, correct: 0, missed: [] };
    setStageQs(qs);
    setIndex(0);
    setPart(stages.current.length + 1);
    busy.current = false;
    return true;
  }

  async function begin() {
    setPhase("loading");
    try {
      await loadGrades(neighbours(profile.grade, profile.framework));
    } catch {
      return setPhase("error");
    }
    if (!(await startStage(profile.grade))) return setPhase("error");
    setPhase("asking");
  }

  async function finishStage() {
    const c = current.current;
    stages.current = [...stages.current, { grade: c.grade, total: STAGE_SIZE, correct: c.correct, asked: stageQs.map((s) => s.unitKey), missed: c.missed }];
    setPhase("loading");
    // Make sure the grades either side are in before deciding where to go next. Offline, just work with what we have.
    await loadGrades(neighbours(c.grade, profile.framework)).catch(() => {});
    const next = nextGrade(stages.current, gradesWithSubject(subject, profile.framework));
    if (next && (await startStage(next))) return setPhase("asking");
    log([toEvent(summarize(subject, profile.grade, stages.current, profile.framework))]);
    setPhase("done");
  }

  function answer(correct: boolean) {
    if (busy.current || !q) return;
    busy.current = true;
    const ok = correct && !slipped.current;
    slipped.current = false;
    const key = stageQs[index].unitKey;
    if (ok) current.current.correct += 1;
    else current.current.missed.push(key);
    stopSpeaking();
    // No right/wrong feedback: just move along.
    setTimeout(() => {
      if (index + 1 >= stageQs.length) void finishStage();
      else {
        setIndex(index + 1);
        busy.current = false;
      }
    }, 220);
  }

  if (phase === "intro" || phase === "loading" || phase === "error" || phase === "done") {
    const copy =
      phase === "done"
        ? { title: "All done! Great effort! 🎉", body: "Thanks for trying your best. Ask a grown-up to look at the results in the parent area.", cta: "Back home" }
        : phase === "error"
          ? { title: "We need the internet for a moment", body: "Ask a grown-up to connect once so the questions can download, then try again.", cta: "Try again" }
          : phase === "loading"
            ? { title: "Getting your questions ready…", body: "", cta: "" }
            : {
                title: `Let's find your best place to start in ${meta.title[band]}!`,
                body: "Answer what you can. There are no points and no tries, so it's okay to say \"I'm not sure\". It takes about 5 minutes.",
                cta: "Let's go!",
              };
    return (
      <Page className="items-center justify-center gap-5 text-center">
        <Critter id={phase === "done" ? companion : meta.mascot} mood={phase === "done" ? "cheer" : phase === "error" ? "think" : "happy"} size={150} />
        <h1 className="max-w-2xl text-3xl font-bold sm:text-4xl">{copy.title}</h1>
        {copy.body && <p className="max-w-xl font-read text-xl text-ink-soft">{copy.body}</p>}
        {copy.cta && (
          <div className="flex w-full max-w-sm flex-col gap-3">
            <button type="button" className="btn btn-good min-h-18 text-2xl" onClick={phase === "done" ? () => go("/") : phase === "error" ? () => void begin() : () => void begin()}>
              {copy.cta}
            </button>
            {phase === "intro" && (
              <button type="button" className="btn min-h-14 text-xl" onClick={() => go("/")}>
                Not now
              </button>
            )}
          </div>
        )}
      </Page>
    );
  }

  if (!q) return null;
  return (
    <Page>
      <header className="flex items-center gap-2 sm:gap-3">
        <button type="button" className="btn h-14 w-14 shrink-0 text-2xl" aria-label="Stop" onClick={() => setConfirmExit(true)}>
          ✕
        </button>
        <ProgressBar value={index} max={STAGE_SIZE} className="flex-1" label={`Part ${part} of up to ${MAX_STAGES}`} />
        <button type="button" className="btn btn-soft h-14 w-14 shrink-0 text-2xl" aria-label="Read it to me" onClick={() => speakQuestion(q)}>
          🔊
        </button>
      </header>
      <section key={`${part}-${index}`} className="flex flex-1 flex-col gap-5 py-5">
        <div className="flex animate-rise-in items-start gap-2 sm:gap-4">
          <Critter id={meta.mascot} mood="happy" size={band === "little" ? 110 : 88} className="sm:hidden" />
          <Critter id={meta.mascot} mood="happy" size={band === "little" ? 140 : 116} className="hidden sm:block" />
          <SpeechBubble className="mt-2 flex-1">
            <p className={`font-read font-bold leading-snug ${band === "little" ? "text-3xl sm:text-4xl" : band === "big" ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"}`}>{q.prompt}</p>
          </SpeechBubble>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-6">
          {q.visual && (
            <div className="flex animate-rise-in justify-center">
              <QuestionVisual visual={q.visual} />
            </div>
          )}
          <QuestionBody q={q} status="answering" onAttempt={(correct) => answer(correct)} onSlip={() => (slipped.current = true)} />
          <div className="flex justify-center">
            <button type="button" className="btn btn-soft min-h-12 px-5 text-lg" onClick={() => answer(false)}>
              I&apos;m not sure
            </button>
          </div>
        </div>
      </section>
      <Dialog open={confirmExit} title="Stop for now?" onClose={() => setConfirmExit(false)}>
        <p className="mb-5 font-read text-lg text-ink-soft">If you stop now, this test won&apos;t be saved. You can start it again any time.</p>
        <div className="flex flex-col gap-3">
          <button type="button" className="btn btn-good min-h-16 text-2xl" onClick={() => setConfirmExit(false)}>
            Keep going
          </button>
          <button type="button" className="btn min-h-14 text-xl" onClick={() => go("/")}>
            Stop
          </button>
        </div>
      </Dialog>
    </Page>
  );
}
