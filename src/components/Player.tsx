"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { getUnit, unitKey } from "@/lib/curriculum";
import { burstFrom, celebrate, floatText, replay } from "@/lib/juice";
import { pick } from "@/lib/random";
import { sounds } from "@/lib/sound";
import { speak, stopSpeaking } from "@/lib/speech";
import { useActiveProfile, useHydrated, useStore } from "@/lib/store";
import type { Question, Subject, Unit } from "@/lib/types";
import { Mascot, SpeechBubble, type MascotMood } from "./Mascot";
import { BuildQuestion } from "./questions/BuildQuestion";
import { ChoiceQuestion } from "./questions/ChoiceQuestion";
import { CoinsQuestion } from "./questions/CoinsQuestion";
import { OrderQuestion } from "./questions/OrderQuestion";
import { SortQuestion } from "./questions/SortQuestion";
import type { QuestionProps, Status } from "./questions/types";
import { Dialog, LoadingScreen, Page, ProgressBar, subjectVars } from "./ui";
import { QuestionVisual } from "./visuals";

const PRAISE = ["Great job!", "You got it!", "Super!", "Awesome!", "Way to go!", "Nailed it!", "Brilliant!"];
const NUDGE = ["Almost! Try again.", "So close! Have another go.", "Good try! Look again."];

export function starsFor(firstTry: number, total: number): number {
  const ratio = total ? firstTry / total : 0;
  return ratio >= 0.85 ? 3 : ratio >= 0.6 ? 2 : 1;
}

function readAloudText(q: Question): string {
  const parts: string[] = [];
  if (q.visual?.type === "story") parts.push(q.visual.lines.join(" "));
  parts.push(q.prompt);
  if (q.kind === "choice") parts.push(q.choices.map((c) => c.label).join(", or "));
  return parts.join(". ");
}

function QuestionBody(props: QuestionProps<Question>) {
  const { q } = props;
  switch (q.kind) {
    case "choice":
      return <ChoiceQuestion {...props} q={q} />;
    case "build":
      return <BuildQuestion {...props} q={q} />;
    case "coins":
      return <CoinsQuestion {...props} q={q} />;
    case "order":
      return <OrderQuestion {...props} q={q} />;
    case "sort":
      return <SortQuestion {...props} q={q} />;
  }
}

export function Player({ subjectId, unitId }: { subjectId: string; unitId: string }) {
  const hydrated = useHydrated();
  const profile = useActiveProfile();
  const router = useRouter();
  const [round, setRound] = useState(0);
  const found = getUnit(subjectId, unitId);

  useEffect(() => {
    if (hydrated && !profile) router.replace("/");
  }, [hydrated, profile, router]);

  if (!found) return null;
  if (!hydrated || !profile) return <LoadingScreen />;
  return (
    <Session
      key={`${unitId}-${round}`}
      subject={found.subject}
      unit={found.unit}
      onAgain={() => setRound((r) => r + 1)}
    />
  );
}

function Session({ subject, unit, onAgain }: { subject: Subject; unit: Unit; onAgain: () => void }) {
  // Mounted only on the client, so random questions never clash with the prerendered HTML.
  const [questions] = useState(() => unit.generate());
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<Status>("answering");
  const [misses, setMisses] = useState(0);
  const [firstTry, setFirstTry] = useState(0);
  const [streak, setStreak] = useState(0);
  const [mood, setMood] = useState<MascotMood>("happy");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const recordUnit = useStore((s) => s.recordUnit);
  const autoRead = useStore((s) => s.settings.autoRead);
  const router = useRouter();
  const streakRef = useRef<HTMLSpanElement>(null);

  const q = questions[index];
  const total = questions.length;
  const answered = status === "correct" || status === "revealed";

  useEffect(() => {
    if (autoRead && !done) speak(readAloudText(questions[index]));
    return stopSpeaking;
  }, [index, autoRead, done, questions]);

  const onAttempt = (correct: boolean, el?: Element | null) => {
    if (correct) {
      const clean = misses === 0;
      const newStreak = clean ? streak + 1 : 0;
      if (clean) setFirstTry((n) => n + 1);
      setStreak(newStreak);
      setStatus("correct");
      setMood("cheer");
      setMessage(newStreak >= 3 ? `${newStreak} in a row! 🔥` : pick(PRAISE));
      sounds.correct(newStreak);
      burstFrom(el ?? null);
      floatText(el ?? null, clean ? "+1 ⭐" : "✓");
      if (newStreak >= 3) replay(streakRef.current, "animate-correct-pop");
      return;
    }
    const n = misses + 1;
    setMisses(n);
    setStreak(0);
    sounds.tryAgain();
    if (n >= 2) {
      setStatus("revealed");
      setMood("think");
      setMessage("Here's how:");
    } else {
      setStatus("retry");
      setMood("oops");
      setMessage(pick(NUDGE));
    }
  };

  const onSlip = () => {
    setMisses((n) => n + 1);
    setStreak(0);
    setStatus("retry");
    setMood("oops");
    setMessage(pick(["Not that basket. Try the other one!", "Hmm, try another basket."]));
    sounds.tryAgain();
  };

  const next = () => {
    stopSpeaking();
    if (index + 1 >= total) {
      recordUnit(unitKey(subject.id, unit.id), starsFor(firstTry, total));
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setStatus("answering");
    setMisses(0);
    setMood("happy");
    setMessage("");
  };

  if (done) {
    return <UnitComplete subject={subject} unit={unit} firstTry={firstTry} total={total} onAgain={onAgain} />;
  }

  return (
    <Page style={subjectVars(subject)}>
      <header className="flex items-center gap-3">
        <button type="button" className="btn h-14 w-14 shrink-0 text-2xl" aria-label="Stop lesson" onClick={() => setConfirmExit(true)}>
          ✕
        </button>
        <ProgressBar value={index + (answered ? 1 : 0)} max={total} className="flex-1" />
        <span
          ref={streakRef}
          className={`flex h-14 min-w-14 items-center justify-center rounded-2xl px-2 text-xl font-bold transition-opacity ${
            streak >= 2 ? "bg-nudge-soft text-nudge-dark opacity-100" : "opacity-0"
          }`}
          aria-label={`${streak} in a row`}
        >
          🔥{streak}
        </span>
        <button
          type="button"
          className="btn btn-soft h-14 w-14 shrink-0 text-2xl"
          aria-label="Read it to me"
          onClick={() => speak(readAloudText(q))}
        >
          🔊
        </button>
      </header>

      <section key={index} className="flex flex-1 flex-col gap-5 py-5">
        <div className="flex animate-rise-in items-start gap-2 sm:gap-4">
          <Mascot mood={mood} size={88} className="sm:hidden" />
          <Mascot mood={mood} size={116} className="hidden sm:block" />
          <SpeechBubble className="mt-2 flex-1">
            <p className="font-read text-2xl font-bold leading-snug sm:text-3xl">{q.prompt}</p>
          </SpeechBubble>
        </div>

        {/* Centred in the space below the question, so tall tablets don't leave answers stranded at the top. */}
        <div className="flex flex-1 flex-col justify-center gap-6">
          {q.visual && (
            <div className="flex animate-rise-in justify-center" style={{ animationDelay: "80ms" }}>
              <QuestionVisual visual={q.visual} />
            </div>
          )}
          <QuestionBody q={q} status={status} onAttempt={onAttempt} onSlip={onSlip} />
        </div>

        {/* Room so the feedback bar never covers the answers. */}
        {status !== "answering" && <div className="h-44 shrink-0" aria-hidden="true" />}
      </section>

      {status !== "answering" && (
        <FeedbackBar
          status={status}
          message={message}
          hint={q.hint}
          onNext={next}
          onDismiss={() => setStatus("answering")}
          last={index + 1 >= total}
        />
      )}

      <Dialog open={confirmExit} title="Stop this lesson?" onClose={() => setConfirmExit(false)}>
        <p className="mb-5 font-read text-lg text-ink-soft">Your stars for this lesson aren&apos;t saved until you finish.</p>
        <div className="flex flex-col gap-3">
          <button type="button" className="btn btn-good min-h-16 text-2xl" onClick={() => setConfirmExit(false)}>
            Keep playing
          </button>
          <button type="button" className="btn min-h-14 text-xl" onClick={() => router.push(`/learn/${subject.id}/`)}>
            Stop
          </button>
        </div>
      </Dialog>
    </Page>
  );
}

function FeedbackBar({
  status,
  message,
  hint,
  onNext,
  onDismiss,
  last,
}: {
  status: Status;
  message: string;
  hint: string;
  onNext: () => void;
  onDismiss: () => void;
  last: boolean;
}) {
  const theme =
    status === "correct"
      ? { bg: "bg-good-soft", border: "border-good", icon: "✓", iconBg: "bg-good", text: "text-good-dark" }
      : status === "revealed"
        ? { bg: "bg-help-soft", border: "border-help", icon: "💡", iconBg: "bg-help", text: "text-[#2f6fd6]" }
        : { bg: "bg-nudge-soft", border: "border-nudge", icon: "🤔", iconBg: "bg-nudge", text: "text-nudge-dark" };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-x-0 bottom-0 z-40 animate-slide-up border-t-4 ${theme.bg} ${theme.border}`}
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 pt-4 sm:flex-row sm:items-center sm:px-6">
        <div className="flex flex-1 items-start gap-3">
          <span
            className={`flex h-14 w-14 shrink-0 animate-pop-in items-center justify-center rounded-full text-3xl text-white ${theme.iconBg}`}
          >
            {theme.icon}
          </span>
          <div>
            <p className={`text-2xl font-bold sm:text-3xl ${theme.text}`}>{message}</p>
            <p className="font-read text-lg leading-snug text-ink sm:text-xl">{hint}</p>
          </div>
        </div>
        {status === "retry" ? (
          <button type="button" className="btn btn-nudge min-h-16 px-8 text-2xl" onClick={onDismiss}>
            OK
          </button>
        ) : (
          <button
            type="button"
            autoFocus
            className={`btn min-h-16 px-10 text-2xl ${status === "correct" ? "btn-good" : "btn-primary"}`}
            style={status === "revealed" ? ({ "--c": "#4f8ef7", "--c-dark": "#2f6fd6" } as CSSProperties) : undefined}
            onClick={onNext}
          >
            {last ? "Finish 🎉" : "Next →"}
          </button>
        )}
      </div>
    </div>
  );
}

function UnitComplete({
  subject,
  unit,
  firstTry,
  total,
  onAgain,
}: {
  subject: Subject;
  unit: Unit;
  firstTry: number;
  total: number;
  onAgain: () => void;
}) {
  const stars = starsFor(firstTry, total);
  const profile = useActiveProfile();
  const stage = useRef<HTMLDivElement>(null);
  const nextUnit = subject.units[subject.units.findIndex((u) => u.id === unit.id) + 1];

  useEffect(() => {
    sounds.complete();
    celebrate();
    // Each star thumps down with a rising note and a tiny screen bump.
    const timers = Array.from({ length: stars }, (_, i) =>
      setTimeout(() => {
        sounds.starLand(i);
        replay(stage.current, "animate-screen-thump");
      }, 700 + i * 380),
    );
    return () => timers.forEach(clearTimeout);
  }, [stars]);

  return (
    <Page style={subjectVars(subject)} className="items-center justify-center text-center">
      <div ref={stage} className="flex w-full max-w-xl flex-col items-center gap-5">
        <Mascot mood="cheer" size={150} />
        <h1 className="animate-pop-in text-4xl font-bold sm:text-5xl">You did it{profile ? `, ${profile.name}` : ""}!</h1>

        <div className="flex gap-3" role="img" aria-label={`${stars} of 3 stars`}>
          {[0, 1, 2].map((i) => (
            <svg
              key={i}
              width="84"
              height="84"
              viewBox="0 0 24 24"
              className={i < stars ? "animate-star-land" : "opacity-100"}
              style={{ animationDelay: `${520 + i * 380}ms` }}
            >
              <path
                d="M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.5L12 17.1l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z"
                fill={i < stars ? "var(--color-star)" : "#e5e7eb"}
                stroke={i < stars ? "#e0a100" : "#d1d5db"}
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
          ))}
        </div>

        <div className="card flex w-full items-center gap-4 p-4 text-left animate-rise-in" style={{ animationDelay: "1.4s" }}>
          <span
            className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white text-5xl shadow-md"
            style={{ background: "var(--c-soft)", outline: "3px solid var(--c)" }}
          >
            {unit.emoji}
            <span className="absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          </span>
          <div>
            <p className="text-lg font-semibold text-ink-soft">Sticker collected!</p>
            <p className="text-2xl font-bold">{unit.title}</p>
            <p className="font-read text-lg text-ink-soft">
              {firstTry} of {total} right on the first try
            </p>
          </div>
        </div>

        <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row">
          <button type="button" className="btn btn-soft min-h-16 flex-1 text-xl" onClick={onAgain}>
            ↻ Play again
          </button>
          {nextUnit ? (
            <Link href={`/learn/${subject.id}/${nextUnit.id}/`} className="btn btn-primary min-h-16 flex-1 text-xl">
              Next: {nextUnit.title} →
            </Link>
          ) : (
            <Link href={`/learn/${subject.id}/`} className="btn btn-primary min-h-16 flex-1 text-xl">
              All {subject.title} →
            </Link>
          )}
        </div>
        <Link href="/" className="text-lg font-semibold text-ink-soft underline-offset-4 hover:underline">
          Back to home
        </Link>
      </div>
    </Page>
  );
}
