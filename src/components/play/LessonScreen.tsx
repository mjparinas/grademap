"use client";

import { useEffect } from "react";
import { getUnitRef } from "@/content";
import { getSubjectMeta } from "@/content/subjects";
import { go } from "@/lib/router";
import { speak, stopSpeaking } from "@/lib/speech";
import { useChildSettings } from "@/lib/store";
import { useBand } from "../band";
import { Critter, SpeechBubble } from "../Critter";
import { QuestionVisual } from "../visuals";
import { Page, subjectVars } from "../ui";
import { BackButton } from "./Practice";

/** The words read aloud: the steps, then the worked example. */
export function lessonSpeech(lesson: NonNullable<ReturnType<typeof getUnitRef>>["unit"]["lesson"]): string {
  if (!lesson) return "";
  const { example } = lesson;
  return `${lesson.steps.join(" ")} Let's try one. ${example.question} ${example.work.join(" ")} The answer is ${example.answer}.`;
}

/** A short "how it works" before practising: a few steps and one worked example. */
export function LessonScreen({ unitKey }: { unitKey: string }) {
  const ref = getUnitRef(unitKey);
  const band = useBand();
  const settings = useChildSettings();
  const lesson = ref?.unit.lesson;
  const auto = Boolean(settings?.autoRead) || band === "little";
  useEffect(() => {
    if (!lesson) go("/session", { mode: "practice", scope: unitKey }, true);
    else if (auto) speak(lessonSpeech(lesson));
    return stopSpeaking;
    // Read once when the lesson opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitKey]);
  if (!ref || !lesson) return null;
  const meta = getSubjectMeta(ref.course.subject);
  const practise = () => go("/session", { mode: "practice", scope: unitKey });
  return (
    <Page style={subjectVars(meta)} className="gap-5">
      <header className="flex items-center gap-3">
        <BackButton to={`/practice/${ref.course.subject}`} />
        <h1 className="text-2xl font-bold sm:text-3xl" style={{ color: meta.colourDark }}>
          {ref.unit.emoji} {ref.unit.title}
        </h1>
      </header>
      <div className="flex items-center gap-3">
        <Critter id={meta.mascot} mood="happy" size={band === "little" ? 96 : 80} />
        <SpeechBubble className="flex-1">
          <p className="font-read text-xl font-bold sm:text-2xl">Here&apos;s how it works!</p>
        </SpeechBubble>
      </div>
      <ol className="card flex flex-col gap-3 p-4 sm:p-5" aria-label="Steps">
        {lesson.steps.map((step, i) => (
          <li key={i} className="flex items-start gap-3 font-read text-xl leading-snug sm:text-2xl">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/10 text-lg font-bold" aria-hidden="true">
              {i + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <section className="card flex flex-col gap-3 p-4 sm:p-5" aria-label="An example">
        <h2 className="text-lg font-bold text-ink-soft">Let&apos;s try one</h2>
        {lesson.example.visual && (
          <div className="flex justify-center">
            <QuestionVisual visual={lesson.example.visual} />
          </div>
        )}
        <p className="font-read text-xl font-bold sm:text-2xl">{lesson.example.question}</p>
        <ul className="flex flex-col gap-1 font-read text-lg text-ink-soft sm:text-xl">
          {lesson.example.work.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
        <p className="rounded-2xl bg-good-soft p-3 font-read text-xl font-bold sm:text-2xl">Answer: {lesson.example.answer}</p>
      </section>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" className="btn btn-good min-h-16 flex-1 text-2xl" onClick={practise}>
          Let&apos;s practise! ▶
        </button>
        <button type="button" className="btn min-h-16 text-xl" onClick={() => speak(lessonSpeech(lesson))}>
          🔊 Read to me
        </button>
      </div>
    </Page>
  );
}
