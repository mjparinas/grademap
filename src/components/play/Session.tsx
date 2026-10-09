"use client";

import { ReportQuestion } from "./ReportQuestion";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { getUnitRef } from "@/content";
import type { Question } from "@/content/types";
import { burstFrom, celebrate, floatText, replay } from "@/lib/juice";
import { pick } from "@/content/random";
import type { Mode } from "@/lib/model";
import { levelInfo, nextStep, unitLevel } from "@/lib/proficiency";
import { go } from "@/lib/router";
import { getItem } from "@/lib/shop";
import { sounds } from "@/lib/sound";
import { speak, stopSpeaking } from "@/lib/speech";
import { derivedFor, useActiveProfile, useChildSettings, useDerived, useStore } from "@/lib/store";
import { useBand } from "../band";
import { Critter, SpeechBubble, type Mood } from "../Critter";
import { BuildQuestion } from "../questions/BuildQuestion";
import { ChoiceQuestion } from "../questions/ChoiceQuestion";
import { CoinsQuestion } from "../questions/CoinsQuestion";
import { InputQuestion } from "../questions/InputQuestion";
import { OrderQuestion } from "../questions/OrderQuestion";
import { SortQuestion } from "../questions/SortQuestion";
import type { QuestionProps, Status } from "../questions/types";
import { Dialog, Page, ProgressBar } from "../ui";
import { QuestionVisual } from "../visuals";
import { makePlan, type Item, type Plan } from "./plans";
import { useAllowed } from "./useAllowed";

const PRAISE = ["Great job!", "You got it!", "Super!", "Awesome!", "Way to go!", "Nailed it!", "Brilliant!"];
const NUDGE = ["Almost! Try again.", "So close! Have another go.", "Good try! Look again."];

/** What read-aloud says: honours `speak`, and never reads choices marked silent. */
export function readAloudText(q: Question): string {
  const parts: string[] = [];
  if (q.visual?.type === "story") parts.push(q.visual.lines.join(" "));
  if (q.visual?.type === "passage") parts.push([q.visual.title, ...q.visual.paragraphs].filter(Boolean).join(". ").replace(/\n/g, " "));
  parts.push(q.speak ?? q.prompt);
  if (q.kind === "choice") {
    const said = q.choices.map((c) => c.speak ?? c.label).filter((s) => s !== "");
    if (said.length === q.choices.length) parts.push(said.join(", or "));
  }
  return parts.join(". ");
}

export function QuestionBody(props: QuestionProps<Question>) {
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
    case "input":
      return <InputQuestion {...props} q={q} />;
  }
}

function formatTime(seconds: number): string {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

interface Result {
  correct: boolean;
}

export function Session({ mode, scope }: { mode: Mode; scope: string }) {
  const profile = useActiveProfile()!;
  const settings = useChildSettings();
  const band = useBand();
  const allowed = useAllowed();
  const derivedNow = useDerived();
  const [plan] = useState<Plan | null>(() =>
    makePlan({
      mode,
      scope,
      grade: profile.grade,
      framework: profile.framework,
      band,
      profileId: profile.id,
      subjects: settings?.enabledSubjects ?? ["math", "language", "science", "social"],
      derived: derivedNow,
      allowed,
      short: settings?.shortSessions,
    }),
  );
  if (!plan) {
    return (
      <Page className="items-center justify-center gap-4 text-center">
        <p className="text-2xl font-bold">Hmm, that lesson isn&apos;t here.</p>
        <button type="button" className="btn btn-good min-h-14 px-6 text-xl" onClick={() => go("/")}>
          Go home
        </button>
      </Page>
    );
  }
  return <Runner plan={plan} />;
}

function Runner({ plan }: { plan: Plan }) {
  const profile = useActiveProfile()!;
  const settings = useChildSettings();
  const band = useBand();
  const log = useStore((s) => s.log);
  const startDerived = useMemo(() => derivedFor(useStore.getState(), profile.id), [profile.id]);

  const [started] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const recent = useRef<string[]>([]);
  const [index, setIndex] = useState(0);
  const [item, setItem] = useState<Item | undefined>(() => plan.next({ index: 0, recent: [], derived: startDerived }));
  const [shownAt, setShownAt] = useState(() => Date.now());
  const [status, setStatus] = useState<Status>("answering");
  const [misses, setMisses] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [run, setRun] = useState(0);
  const [mood, setMood] = useState<Mood>("happy");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const [checkpoint, setCheckpoint] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const [hinted, setHinted] = useState(false);
  const [flash, setFlash] = useState<"good" | "bad" | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const loggedUpTo = useRef(0);

  const q = item?.question;
  const elapsed = (now - started) / 1000;
  const remaining = plan.timeLimit ? plan.timeLimit - elapsed : undefined;
  const answered = status === "correct" || status === "revealed";
  const firstTry = results.filter((r) => r.correct).length;
  const guide = getUnitRef(item?.unitKey ?? "")?.course.subject;
  const companion = profile.companion ?? "ollie";

  // Clock.
  useEffect(() => {
    if (done || checkpoint) return;
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [done, checkpoint]);

  // Countdown tick in the last 5 seconds, and time's up.
  const lastTick = useRef(0);
  useEffect(() => {
    if (remaining === undefined || done) return;
    const whole = Math.ceil(remaining);
    if (whole <= 5 && whole > 0 && whole !== lastTick.current && !settings?.hideTimers) {
      lastTick.current = whole;
      sounds.tick();
    }
    if (remaining <= 0) finish();
  });

  // Read each question aloud when the setting is on.
  useEffect(() => {
    if (q && settings?.autoRead && !done && !checkpoint) speak(readAloudText(q));
    return stopSpeaking;
  }, [q, settings?.autoRead, done, checkpoint]);

  function record(correct: boolean, attempts: number, revealed: boolean) {
    if (!item) return;
    log([
      {
        type: "answer",
        unit: item.unitKey,
        correct,
        attempts,
        revealed,
        ...(hinted ? { hinted: true } : {}),
        ms: Date.now() - shownAt,
        mode: plan.mode,
        difficulty: item.difficulty,
      },
    ]);
    setResults((r) => [...r, { correct }]);
  }

  function logSession(list: Result[]) {
    const slice = list.slice(loggedUpTo.current);
    if (slice.length === 0) return;
    loggedUpTo.current = list.length;
    log([
      {
        type: "session",
        mode: plan.mode,
        scope: plan.scope,
        total: slice.length,
        correct: slice.filter((r) => r.correct).length,
        ms: Date.now() - started,
      },
    ]);
  }

  function finish() {
    if (done) return;
    stopSpeaking();
    setDone(true);
    // Results state may lag one render behind a final answer, so read it fresh.
    setResults((list) => {
      if (plan.mode !== "adventure" || list.length - loggedUpTo.current >= 3) logSession(list);
      return list;
    });
  }

  function advance() {
    stopSpeaking();
    const nextIndex = index + 1;
    if (plan.total !== undefined && nextIndex >= plan.total) return finish();
    if (plan.checkpoint && nextIndex % plan.checkpoint === 0 && !checkpoint) {
      setResults((list) => {
        logSession(list);
        return list;
      });
      setCheckpoint(true);
      return;
    }
    if (item) recent.current = [...recent.current.slice(-5), item.unitKey];
    const nextItem = plan.next({ index: nextIndex, recent: recent.current, derived: derivedFor(useStore.getState(), profile.id) });
    if (!nextItem) return finish();
    setIndex(nextIndex);
    setItem(nextItem);
    setShownAt(Date.now());
    setStatus("answering");
    setMisses(0);
    setHinted(false);
    setMood("happy");
    setMessage("");
  }

  function showHint() {
    if (!q || hinted) return;
    setHinted(true);
    if (settings?.autoRead || band === "little") speak(q.hint);
  }

  function onAttempt(correct: boolean, el?: Element | null) {
    if (!item || answered) return;
    const fast = plan.feedback === "flash";
    if (correct) {
      // A hint opened first counts like a retry, unless the parent turned that off for this child.
      const helped = hinted && !settings?.freeHints;
      const clean = misses === 0 && !helped;
      const newRun = clean ? run + 1 : 0;
      setRun(newRun);
      record(clean, misses + 1 + (helped && misses === 0 ? 1 : 0), false);
      sounds.correct(newRun);
      burstFrom(el ?? null, fast ? 14 : 26);
      floatText(el ?? null, clean ? (newRun >= 3 ? `🔥 ${newRun}` : "+1 ⭐") : "✓");
      if (fast) {
        setFlash("good");
        setTimeout(() => setFlash(null), 300);
        setTimeout(advance, 280);
        return;
      }
      setStatus("correct");
      setMood("cheer");
      const praise = newRun >= 3 ? `${newRun} in a row! 🔥` : pick(PRAISE);
      setMessage(praise);
      if (settings?.autoRead && band === "little") speak(praise.replace("🔥", ""));
      return;
    }

    const n = misses + 1;
    setMisses(n);
    setRun(0);
    if (fast) {
      sounds.boop();
      record(false, 1, true);
      setFlash("bad");
      replay(stage.current, "animate-shake");
      setTimeout(() => setFlash(null), 300);
      setTimeout(advance, 450);
      return;
    }
    sounds.tryAgain();
    if (!plan.retries || n >= 2) {
      record(false, n, true);
      setStatus("revealed");
      setMood("think");
      setMessage(plan.retries ? "Here's how:" : "Not quite. Here's how:");
    } else {
      setStatus("retry");
      setMood("oops");
      setMessage(pick(NUDGE));
    }
  }

  function onSlip() {
    setMisses((n) => n + 1);
    setRun(0);
    setStatus("retry");
    setMood("oops");
    setMessage(pick(["Not that basket. Try another one!", "Hmm, try a different basket."]));
    sounds.tryAgain();
  }

  if (done) {
    return <Summary plan={plan} results={results} startDerived={startDerived} />;
  }

  if (checkpoint) {
    const last = results.slice(-plan.checkpoint!);
    return (
      <Page className="items-center justify-center gap-5 text-center">
        <Critter id={companion} mood="cheer" size={140} />
        <h1 className="text-4xl font-bold">Checkpoint! 🚩</h1>
        <p className="text-2xl">
          <b>{last.filter((r) => r.correct).length}</b> of {last.length} right on the first try
        </p>
        <div className="flex w-full max-w-md flex-col gap-3">
          <button
            type="button"
            className="btn btn-good min-h-18 text-2xl"
            onClick={() => {
              setCheckpoint(false);
              advance();
            }}
          >
            Keep going →
          </button>
          <button type="button" className="btn min-h-14 text-xl" onClick={finish}>
            I&apos;m done for now
          </button>
        </div>
      </Page>
    );
  }

  if (!q || !item) {
    return (
      <Page className="items-center justify-center gap-4 text-center">
        <Critter id={companion} mood="think" size={130} />
        <p className="text-2xl font-bold">Nothing to practise here yet. Try a lesson first!</p>
        <button type="button" className="btn btn-good min-h-14 px-6 text-xl" onClick={() => go("/")}>
          Go home
        </button>
      </Page>
    );
  }

  const progressValue = plan.total ? index + (answered ? 1 : 0) : plan.checkpoint ? (index % plan.checkpoint) + (answered ? 1 : 0) : 0;
  const progressMax = plan.total ?? plan.checkpoint ?? 1;
  const hideTimers = Boolean(settings?.hideTimers);
  const timerText = hideTimers ? null : remaining !== undefined ? formatTime(remaining) : settings?.showTimer ? formatTime(elapsed) : null;
  const urgent = !hideTimers && remaining !== undefined && remaining <= 10;

  return (
    <Page className={flash === "good" ? "animate-flash-good" : flash === "bad" ? "animate-flash-bad" : ""}>
      <header className="flex items-center gap-2 sm:gap-3">
        <button type="button" className="btn h-14 w-14 shrink-0 text-2xl" aria-label="Stop" onClick={() => setConfirmExit(true)}>
          ✕
        </button>
        {plan.mode === "speed" ? (
          <div className="flex flex-1 items-center justify-center gap-2 text-2xl font-bold">
            ⚡ <span key={firstTry} className="inline-block animate-pop-in">{firstTry}</span>
          </div>
        ) : (
          <ProgressBar value={progressValue} max={progressMax} className="flex-1" label="Questions answered" />
        )}
        {hideTimers && plan.timeLimit && remaining !== undefined && (
          <ProgressBar value={Math.max(0, remaining)} max={plan.timeLimit} className="w-16 shrink-0 sm:w-28" label="Time left" />
        )}
        {run >= 2 && !hideTimers && (
          <span className="flex h-14 min-w-14 items-center justify-center rounded-2xl bg-nudge-soft px-2 text-xl font-bold text-nudge-dark" aria-label={`${run} in a row`}>
            🔥{run}
          </span>
        )}
        {timerText && (
          <span
            className={`flex h-14 min-w-20 items-center justify-center rounded-2xl px-3 text-xl font-bold tabular-nums ${
              urgent ? "animate-pulse-soft bg-nudge text-[#0f172a]" : "bg-white text-ink shadow-[0_4px_0_var(--color-line)]"
            }`}
            aria-label={remaining !== undefined ? `${Math.ceil(remaining)} seconds left` : "time"}
          >
            ⏱ {timerText}
          </span>
        )}
        <button type="button" className="btn btn-soft h-14 w-14 shrink-0 text-2xl" aria-label="Read it to me" onClick={() => speak(readAloudText(q))}>
          🔊
        </button>
      </header>

      <section ref={stage} key={index} className="flex flex-1 flex-col gap-5 py-5">
        <div className="flex animate-rise-in items-start gap-2 sm:gap-4">
          <Critter id={guide && band !== "little" ? subjectGuide(guide, companion) : companion} mood={mood} size={band === "little" ? 110 : 88} className="sm:hidden" />
          <Critter id={guide && band !== "little" ? subjectGuide(guide, companion) : companion} mood={mood} size={band === "little" ? 140 : 116} className="hidden sm:block" />
          <SpeechBubble className="mt-2 flex-1">
            <p className={`font-read font-bold leading-snug ${band === "little" ? "text-3xl sm:text-4xl" : band === "big" ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"}`}>
              {q.prompt}
            </p>
          </SpeechBubble>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-6">
          {plan.retries && status === "answering" && (
            <div className="flex flex-col items-center gap-2">
              {hinted ? (
                <p className="max-w-2xl rounded-2xl border-[3px] border-help bg-help-soft px-4 py-3 text-center font-read text-lg leading-snug sm:text-xl">
                  <span aria-hidden="true">💡 </span>
                  {q.hint}
                </p>
              ) : (
                <button type="button" className="btn btn-soft min-h-12 px-5 text-lg" onClick={showHint}>
                  <span aria-hidden="true">💡</span> Need a hint?
                </button>
              )}
            </div>
          )}
          {q.visual && (
            <div className="flex animate-rise-in justify-center" style={{ animationDelay: "80ms" }}>
              <QuestionVisual visual={q.visual} />
            </div>
          )}
          <QuestionBody q={q} status={status} onAttempt={onAttempt} onSlip={onSlip} />
        </div>
        {status !== "answering" && plan.feedback === "bar" && <div className="h-44 shrink-0" aria-hidden="true" />}
      </section>

      {status !== "answering" && plan.feedback === "bar" && (
        <FeedbackBar
          status={status}
          message={message}
          hint={q.hint}
          report={band === "little" || !item ? undefined : { unitKey: item.unitKey, prompt: q.prompt }}
          onNext={advance}
          onDismiss={() => setStatus("answering")}
          last={plan.total !== undefined && index + 1 >= plan.total}
        />
      )}

      <Dialog open={confirmExit} title={plan.mode === "adventure" ? "Stop your adventure?" : "Stop now?"} onClose={() => setConfirmExit(false)}>
        <p className="mb-5 font-read text-lg text-ink-soft">Every answer you gave is already saved.</p>
        <div className="flex flex-col gap-3">
          <button type="button" className="btn btn-good min-h-16 text-2xl" onClick={() => setConfirmExit(false)}>
            Keep playing
          </button>
          <button
            type="button"
            className="btn min-h-14 text-xl"
            onClick={() => {
              setConfirmExit(false);
              if (results.length >= 3) finish();
              else go("/");
            }}
          >
            Stop
          </button>
        </div>
      </Dialog>
    </Page>
  );
}

/** Each subject's guide appears during mixed modes, unless the child picked their own buddy. */
function subjectGuide(subject: string, companion: string): string {
  if (companion !== "ollie") return companion;
  return { math: "hoot", language: "ruby", science: "bolt", social: "juniper" }[subject] ?? "ollie";
}

function FeedbackBar({
  status,
  message,
  hint,
  report,
  onNext,
  onDismiss,
  last,
}: {
  status: Status;
  message: string;
  hint: string;
  report?: { unitKey: string; prompt: string };
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
    <div role="status" aria-live="polite" className={`fixed inset-x-0 bottom-0 z-40 animate-slide-up border-t-4 ${theme.bg} ${theme.border}`} style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
      <div className="relative mx-auto flex max-w-5xl flex-col gap-3 px-4 pt-4 sm:flex-row sm:items-center sm:px-6">
        {report && <ReportQuestion unitKey={report.unitKey} prompt={report.prompt} />}
        <div className="flex flex-1 items-start gap-3">
          <span className={`flex h-14 w-14 shrink-0 animate-pop-in items-center justify-center rounded-full text-3xl text-[#0f172a] ${theme.iconBg}`}>{theme.icon}</span>
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

function Summary({ plan, results, startDerived }: { plan: Plan; results: Result[]; startDerived: ReturnType<typeof derivedFor> }) {
  const profile = useActiveProfile()!;
  const d = useDerived();
  const stage = useRef<HTMLDivElement>(null);
  const total = results.length;
  const correct = results.filter((r) => r.correct).length;
  const ratio = total ? correct / total : 0;
  const stars = total === 0 ? 0 : ratio >= 0.85 ? 3 : ratio >= 0.6 ? 2 : 1;
  const xp = d.xp - startDerived.xp;
  const coins = d.coins - startDerived.coins;
  const unit = getUnitRef(plan.scope);
  const level = unit ? unitLevel(d.units[unit.key]) : -1;
  const info = unit ? levelInfo(profile.framework, profile.grade, level) : undefined;
  const best = plan.mode === "speed" ? (startDerived.speedBest[plan.scope] ?? 0) : 0;
  const newBest = plan.mode === "speed" && correct > best;
  const passed = plan.mode === "challenge" && ratio >= 0.8;
  const confetti = getItem(profile.confetti)?.confetti ?? [];

  useEffect(() => {
    if (total === 0) return;
    sounds.complete();
    celebrate(confetti);
    const timers = Array.from({ length: stars }, (_, i) =>
      setTimeout(() => {
        sounds.starLand(i);
        replay(stage.current, "animate-screen-thump");
      }, 700 + i * 380),
    );
    return () => timers.forEach(clearTimeout);
    // Celebrate once, when the summary first shows.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const headline =
    plan.mode === "speed"
      ? newBest
        ? "New best! 🏆"
        : "Time's up!"
      : plan.mode === "challenge"
        ? passed
          ? "Challenge passed! 🛡️"
          : "Good effort!"
        : `You did it, ${profile.name}!`;

  return (
    <Page className="items-center justify-center text-center">
      <div ref={stage} className="flex w-full max-w-xl flex-col items-center gap-5">
        <Critter id={profile.companion} mood="cheer" size={150} />
        <h1 className="animate-pop-in text-4xl font-bold sm:text-5xl">{headline}</h1>

        {plan.mode === "speed" ? (
          <p className="text-3xl font-bold">
            ⚡ {correct} right {best > 0 && <span className="text-xl text-ink-soft">(best: {Math.max(best, correct)})</span>}
          </p>
        ) : (
          <div className="flex gap-3" role="img" aria-label={`${stars} of 3 stars`}>
            {[0, 1, 2].map((i) => (
              <svg key={i} width="84" height="84" viewBox="0 0 24 24" className={i < stars ? "animate-star-land" : ""} style={{ animationDelay: `${520 + i * 380}ms` }}>
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
        )}

        <div className="flex flex-wrap justify-center gap-2 animate-rise-in" style={{ animationDelay: "1.2s" }}>
          <span className="rounded-full bg-white px-4 py-2 text-lg font-bold shadow-[0_4px_0_var(--color-line)]">
            ✅ {correct}/{total} first try
          </span>
          <span className="rounded-full bg-[#ede9fe] px-4 py-2 text-lg font-bold text-[#6d3fd6]">+{xp} XP</span>
          <span className="rounded-full bg-[#fff4cc] px-4 py-2 text-lg font-bold text-[#7a5700]">🪙 +{coins}</span>
        </div>

        {unit && info && (
          <div className="card flex w-full items-center gap-4 p-4 text-left animate-rise-in" style={{ animationDelay: "1.5s" }}>
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-4xl" style={{ background: `${info.colour}22`, outline: `3px solid ${info.colour}` }}>
              {info.icon}
            </span>
            <div>
              <p className="text-sm font-semibold text-ink-soft">{unit.unit.title}</p>
              <p className="text-2xl font-bold" style={{ color: info.colour }}>
                {info.label} <span className="text-base font-semibold text-ink-soft">({info.kidLabel})</span>
              </p>
              <p className="font-read text-base text-ink-soft">{nextStep(d.units[unit.key])}</p>
            </div>
          </div>
        )}

        <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row">
          <button type="button" className="btn btn-soft min-h-16 flex-1 text-xl" onClick={() => go("/session", { mode: plan.mode, scope: plan.scope, r: Date.now() }, true)}>
            ↻ Play again
          </button>
          <button type="button" className="btn btn-good min-h-16 flex-1 text-xl" onClick={() => go(unit ? `/practice/${unit.course.subject}` : "/")}>
            {unit ? "More lessons →" : "Home →"}
          </button>
        </div>
      </div>
    </Page>
  );
}
