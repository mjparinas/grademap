"use client";

import { onColour } from "@/lib/contrast";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { getUnitRef } from "@/content";
import { getSubjectMeta } from "@/content/subjects";
import { weakest } from "@/lib/adaptive";
import { gameTime } from "@/lib/gametime";
import { dayKey } from "@/lib/model";
import { canUse, type Feature } from "@/lib/plan";
import { dailyQuests, weekDays, weeklyQuests, weekStart } from "@/lib/quests";
import { unitLevel } from "@/lib/proficiency";
import { go } from "@/lib/router";
import { useActiveProfile, useChildSettings, useDerived, useStore } from "@/lib/store";
import { useNow } from "@/lib/useNow";
import { useBand } from "../band";
import { Critter, SpeechBubble } from "../Critter";
import { Dialog, Page, ProgressBar } from "../ui";
import { Hud } from "./Hud";
import { BuddyButton, MooseVisitor } from "./Secrets";
import { suggestions } from "./plans";
import { useAllowed } from "./useAllowed";
import { useClasswork } from "./useClasswork";
import { LevelChip } from "./Practice";

interface Tile {
  id: string;
  title: string;
  desc: string;
  icon: string;
  colour: string;
  dark: string;
  href: string;
  feature?: Feature;
  badge?: string;
  done?: boolean;
}

function greeting(name: string, hour: number): string {
  if (hour < 12) return `Good morning, ${name}!`;
  if (hour < 17) return `Hi, ${name}!`;
  return `Good evening, ${name}!`;
}

export function Hub() {
  const profile = useActiveProfile()!;
  const settings = useChildSettings();
  const d = useDerived();
  const band = useBand();
  const family = useStore((s) => s.family);
  const allowed = useAllowed();
  const [locked, setLocked] = useState(false);
  const now = useNow();
  const today = dayKey(now);
  const dayStat = d.days[today];
  const minutes = Math.floor((dayStat?.learnSeconds ?? 0) / 60);
  const goal = settings?.dailyGoalMinutes ?? 15;
  const subjects = settings?.enabledSubjects ?? ["math", "language", "science", "social"];
  const games = gameTime(settings, d, now);
  const weak = weakest({ grade: profile.grade, framework: profile.framework, derived: d, subjects }, 10).length;
  const dailyDone = d.dailyDone.includes(today);
  const quests = dailyQuests(profile.id, today, band);
  const claimed = d.questsClaimed[today] ?? [];
  const monday = weekStart(now);
  const weekly = weeklyQuests(profile.id, monday, band);
  const weekStats = weekDays(monday).flatMap((k) => (d.days[k] ? [d.days[k]] : []));
  const weekClaimed = d.questsClaimed[monday] ?? [];
  const suggested = suggestions(profile.grade, profile.framework, d, subjects, allowed, 1)[0];
  const little = band === "little";
  const classwork = useClasswork();

  const message = !d.totals.answers
    ? `${greeting(profile.name, new Date(now).getHours())} Tap the big button to start your first adventure!`
    : minutes >= goal
      ? `You hit today's goal! ${minutes} minutes of learning. Amazing!`
      : d.streak.current > 1 && !d.streak.activeToday
        ? d.streak.saved
          ? `A rest-day shield kept your ${d.streak.current}-day streak safe. 🛡️ Play today to keep it going!`
          : `Keep your ${d.streak.current}-day streak going! 🔥`
        : `${greeting(profile.name, new Date(now).getHours())} ${goal - minutes} more minutes to reach today's goal.`;

  const gameDesc = !games.enabled
    ? "Turned off"
    : games.availableSeconds > 0
      ? `${Math.ceil(games.availableSeconds / 60)} min ready!`
      : games.nextInSeconds > 0
        ? `Learn ${Math.ceil(games.nextInSeconds / 60)} more min`
        : "Done for today";

  const tiles: Tile[] = [
    {
      id: "daily",
      title: "Daily Challenge",
      desc: dailyDone ? "Done today! ✓" : "10 questions · new every day",
      icon: "☀️",
      colour: "#ffb020",
      dark: "#d68a00",
      href: "#/session?mode=daily&scope=mix",
      done: dailyDone,
    },
    { id: "practice", title: little ? "Lessons" : "Practice", desc: "Pick a subject and topic", icon: "📚", colour: "#4f8ef7", dark: "#2f6fd6", href: "#/practice" },
    ...(little
      ? []
      : [
          { id: "speed", title: "Speed Run", desc: "How many in 60 seconds?", icon: "⚡", colour: "#e9559a", dark: "#c43a7c", href: "#/speed", feature: "speed" as Feature },
          {
            id: "review",
            title: "Review",
            desc: weak ? `${weak} tricky spot${weak === 1 ? "" : "s"} to practise` : "Practise tricky spots",
            icon: "🔍",
            colour: "#25b47e",
            dark: "#16925f",
            href: "#/session?mode=review&scope=mix",
            feature: "review" as Feature,
          },
        ]),
    { id: "arcade", title: little ? "Games" : "Arcade", desc: gameDesc, icon: "🕹️", colour: "#7c4fe0", dark: "#5d34c4", href: "#/arcade", feature: "arcade" },
    { id: "trophies", title: "Trophies", desc: `${Object.keys(d.trophies).length} earned · ${d.trophyPoints} pts`, icon: "🏆", colour: "#f0bd2a", dark: "#b88905", href: "#/trophies" },
    { id: "shop", title: "Shop", desc: `🪙 ${d.coins} to spend`, icon: "🛍️", colour: "#06b6d4", dark: "#0891b2", href: "#/shop" },
  ];

  const open = (t: { href: string; feature?: Feature }) => {
    if (t.feature && !canUse(family, t.feature)) setLocked(true);
    else window.location.hash = t.href.slice(1);
  };

  return (
    <Page className="gap-5 short:gap-3">
      <Hud />

      <div className="flex items-center gap-3">
        {/* Smaller on the narrowest phones, hidden on phones held sideways, so the big button stays in view. */}
        <BuddyButton name={"your buddy"}>
          <Critter id={profile.companion} mood="wave" size={little ? 130 : 104} className="narrow:hidden short:hidden" />
          <Critter id={profile.companion} mood="wave" size={72} className="hidden narrow:block short:hidden" />
        </BuddyButton>
        <SpeechBubble className="flex-1">
          <p className={`font-read font-bold leading-snug ${little ? "text-2xl sm:text-3xl narrow:text-xl" : "text-xl sm:text-2xl"} short:text-lg`}>{message}</p>
          <div className="mt-2 flex items-center gap-2">
            <ProgressBar value={minutes} max={goal} className="flex-1" label="Minutes learned today" />
            <span className="text-sm font-semibold whitespace-nowrap text-ink-soft">
              ⏱ {minutes}/{goal} min
            </span>
          </div>
        </SpeechBubble>
      </div>

      {/* The big adaptive button: no need to pick a topic. */}
      <button
        type="button"
        onClick={() => open({ href: "#/session?mode=adventure&scope=mix", feature: "adventure" })}
        className="btn min-h-28 animate-rise-in justify-between gap-4 px-6 text-left narrow:gap-3 narrow:px-4 short:min-h-20"
        style={{ "--btn-bg": "linear-gradient(135deg,#7b6fd6,#4f8ef7)", "--btn-fg": "#fff", "--btn-edge": "#3a4fb8", background: "linear-gradient(135deg,#8a6ff0,#4f8ef7)" } as CSSProperties}
      >
        <span className="flex items-center gap-4">
          <span className="animate-float text-6xl narrow:text-4xl short:text-5xl">🗺️</span>
          <span>
            <span className="block text-3xl font-bold sm:text-4xl narrow:text-2xl">{little ? "Let's Play!" : "Adventure"}</span>
            <span className="block text-base font-semibold sm:text-lg narrow:text-sm">
              {little ? "Fun questions from everything!" : "Endless questions picked just for you"}
            </span>
          </span>
        </span>
        <span className="text-4xl narrow:hidden">▶</span>
      </button>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {tiles.map((t, i) => {
          const isLocked = t.feature && !canUse(family, t.feature);
          return (
            <div key={t.id} className="animate-rise-in" style={{ animationDelay: `${80 + i * 60}ms` }}>
              <button
                type="button"
                onClick={() => open(t)}
                className="btn relative h-full min-h-32 w-full flex-col items-start justify-between gap-2 p-4 text-left"
                style={{ "--btn-bg": t.colour, "--btn-edge": t.dark, "--btn-fg": onColour(t.colour) } as CSSProperties}
              >
                <span className="flex w-full items-start justify-between">
                  <span className="text-5xl drop-shadow-sm">{t.icon}</span>
                  {isLocked && <span className="rounded-full bg-black/25 px-2 py-0.5 text-sm">🔒</span>}
                  {t.done && <span className="rounded-full bg-white/30 px-2 py-0.5 text-sm font-bold">✓</span>}
                </span>
                <span>
                  <span className="block text-2xl leading-tight font-bold">{t.title}</span>
                  <span className="block text-sm font-semibold">{t.desc}</span>
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {classwork.length > 0 && (
        <section className="card p-4 sm:p-5" aria-label="From your teacher">
          <h2 className="mb-3 flex items-center justify-between gap-2 text-xl font-bold sm:text-2xl">
            <span>🍎 From your teacher</span>
            <span className="text-sm font-semibold text-ink-soft">{classwork[0].className}</span>
          </h2>
          <ul className="flex flex-col gap-2.5">
            {classwork.map(({ ref }) => {
              const meta = getSubjectMeta(ref.course.subject);
              const done = unitLevel(d.units[ref.key]) >= 2;
              return (
                <li key={ref.key}>
                  <Link
                    href={`#/session?mode=practice&scope=${encodeURIComponent(ref.key)}`}
                    className={`flex min-h-14 items-center gap-3 rounded-2xl border-2 p-2.5 ${done ? "bg-good-soft" : "bg-paper"}`}
                    style={{ borderColor: meta.colour }}
                  >
                    <span className="text-3xl">{ref.unit.emoji}</span>
                    <span className="flex-1">
                      <span className="block font-read text-lg font-bold">{ref.unit.title}</span>
                      <span className="block text-sm font-semibold text-ink-soft">{meta.title[band]}</span>
                    </span>
                    <LevelChip level={unitLevel(d.units[ref.key])} compact={little} />
                    <span className="text-xl">▶</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="card p-4 sm:p-5">
        <h2 className="mb-3 flex items-center justify-between text-xl font-bold sm:text-2xl">
          <span>🎯 Today&apos;s quests</span>
          <span className="text-sm font-semibold text-ink-soft">New quests tomorrow</span>
        </h2>
        <ul className="flex flex-col gap-2.5">
          {quests.map((q) => {
            const got = claimed.includes(q.id);
            const value = Math.min(q.target, q.progress(dayStat));
            return (
              <li key={q.id} className={`flex items-center gap-3 rounded-2xl p-2.5 ${got ? "bg-good-soft" : "bg-paper"}`}>
                <span className="text-3xl">{got ? "✅" : q.icon}</span>
                <div className="flex-1">
                  <p className="font-read text-lg font-bold">{q.title}</p>
                  <ProgressBar value={value} max={q.target} height={12} label={q.title} />
                </div>
                <span className="rounded-full bg-[#fff4cc] px-3 py-1 text-sm font-bold text-[#7a5700]">🪙 {q.reward}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="card p-4 sm:p-5">
        <h2 className="mb-3 flex items-center justify-between text-xl font-bold sm:text-2xl">
          <span>🗓️ This week</span>
          <span className="text-sm font-semibold text-ink-soft">New goals on Monday</span>
        </h2>
        <ul className="flex flex-col gap-2.5">
          {weekly.map((q) => {
            const got = weekClaimed.includes(q.id);
            const value = Math.min(q.target, q.progress(weekStats));
            return (
              <li key={q.id} className={`flex items-center gap-3 rounded-2xl p-2.5 ${got ? "bg-good-soft" : "bg-paper"}`}>
                <span className="text-3xl">{got ? "✅" : q.icon}</span>
                <div className="flex-1">
                  <p className="font-read text-lg font-bold">{q.title}</p>
                  <ProgressBar value={value} max={q.target} height={12} label={q.title} />
                </div>
                <span className="rounded-full bg-[#fff4cc] px-3 py-1 text-sm font-bold text-[#7a5700]">🪙 {q.reward}</span>
              </li>
            );
          })}
        </ul>
      </section>

      {suggested && (
        <Link
          href={`#/session?mode=practice&scope=${encodeURIComponent(suggested.key)}`}
          className="card flex items-center gap-3 p-4"
          style={{ borderColor: getSubjectMeta(suggested.course.subject).colour }}
        >
          <span className="text-4xl">{suggested.unit.emoji}</span>
          <span className="flex-1">
            <span className="block text-sm font-semibold text-ink-soft">Try this lesson · {getSubjectMeta(suggested.course.subject).title[band]}</span>
            <span className="block text-xl font-bold">{getUnitRef(suggested.key)?.unit.title}</span>
          </span>
          <span className="text-2xl">▶</span>
        </Link>
      )}

      <div className="flex justify-center pb-4">
        <Link href="/parents/" className="btn h-12 px-4 text-base text-ink-soft">
          🔒 Grown-ups
        </Link>
      </div>

      <MooseVisitor />

      <Dialog open={locked} title="Ask a grown-up" onClose={() => setLocked(false)}>
        <div className="mb-4 flex justify-center">
          <Critter id={profile.companion} mood="think" size={110} />
        </div>
        <p className="mb-5 font-read text-lg text-ink-soft">This part opens with a family membership. A grown-up can turn it on in the grown-ups area.</p>
        <button type="button" className="btn btn-good min-h-14 w-full text-xl" onClick={() => setLocked(false)}>
          OK
        </button>
      </Dialog>
    </Page>
  );
}

export function goHome() {
  go("/");
}
