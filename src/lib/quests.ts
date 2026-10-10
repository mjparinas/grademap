import { hashSeed, sample, withSeed } from "@/content/random";
import { getSubjectMeta } from "@/content/subjects";
import type { AgeBand, SubjectId } from "@/content/types";
import type { DayStat } from "./derive";
import { dayKey } from "./model";

// Three fresh quests each day per child, plus two bigger ones each week. They're
// picked with a seed so the same quests show on every device.

export interface Quest {
  id: string;
  title: string;
  icon: string;
  reward: number;
  target: number;
  progress: (day: DayStat | undefined) => number;
}

/** A weekly quest adds up the seven days from Monday. */
export interface WeeklyQuest extends Omit<Quest, "progress"> {
  progress: (days: DayStat[]) => number;
}

const SUBJECTS: SubjectId[] = ["math", "language", "science", "social"];

const subjectQuest = (subject: SubjectId, band: AgeBand, n: number, reward = 20): Quest => ({
  id: `${subject}-${n}`,
  title: `Answer ${n} ${getSubjectMeta(subject).title[band]} questions`,
  icon: getSubjectMeta(subject).emoji,
  reward,
  target: n,
  progress: (day) => day?.subjects[subject] ?? 0,
});

const subjectsTried = (day: DayStat | undefined) => SUBJECTS.filter((s) => (day?.subjects[s] ?? 0) >= 3).length;

function pool(band: AgeBand): Quest[] {
  const little = band === "little";
  const n = little ? 5 : 8;
  return [
    {
      id: "answers",
      title: `Answer ${little ? 10 : 20} questions`,
      icon: "✏️",
      reward: 20,
      target: little ? 10 : 20,
      progress: (day) => day?.answers ?? 0,
    },
    {
      id: "answers-big",
      title: `Answer ${little ? 20 : 40} questions`,
      icon: "📝",
      reward: 35,
      target: little ? 20 : 40,
      progress: (day) => day?.answers ?? 0,
    },
    { id: "run", title: "Get 5 right in a row", icon: "🔥", reward: 20, target: 5, progress: (day) => day?.bestRun ?? 0 },
    { id: "run-8", title: `Get ${little ? 7 : 8} right in a row`, icon: "☄️", reward: 25, target: little ? 7 : 8, progress: (day) => day?.bestRun ?? 0 },
    { id: "lessons", title: "Finish 2 lessons", icon: "📗", reward: 20, target: 2, progress: (day) => day?.sessions ?? 0 },
    { id: "lessons-3", title: "Finish 3 lessons", icon: "📚", reward: 30, target: 3, progress: (day) => day?.sessions ?? 0 },
    { id: "flawless", title: "Finish a flawless lesson", icon: "💎", reward: 25, target: 1, progress: (day) => day?.perfect ?? 0 },
    {
      id: "minutes",
      title: `Learn for ${little ? 5 : 10} minutes`,
      icon: "⏱️",
      reward: 25,
      target: little ? 5 : 10,
      progress: (day) => Math.floor((day?.learnSeconds ?? 0) / 60),
    },
    {
      id: "minutes-long",
      title: `Learn for ${little ? 8 : 15} minutes`,
      icon: "⌛",
      reward: 35,
      target: little ? 8 : 15,
      progress: (day) => Math.floor((day?.learnSeconds ?? 0) / 60),
    },
    { id: "two-subjects", title: "Try 2 different subjects", icon: "🔀", reward: 20, target: 2, progress: subjectsTried },
    { id: "three-subjects", title: "Try 3 different subjects", icon: "🌈", reward: 30, target: 3, progress: subjectsTried },
    { id: "practice", title: "Practise a topic you pick", icon: "📚", reward: 15, target: 1, progress: (day) => day?.modes.practice ?? 0 },
    subjectQuest("math", band, n),
    subjectQuest("language", band, n),
    subjectQuest("science", band, n),
    subjectQuest("social", band, n),
    ...(little ? [] : SUBJECTS.map((s) => subjectQuest(s, band, 15, 30))),
    { id: "daily", title: "Do the Daily Challenge", icon: "☀️", reward: 25, target: 1, progress: (day) => day?.modes.daily ?? 0 },
    { id: "adventure", title: "Play Adventure", icon: "🗺️", reward: 15, target: 1, progress: (day) => day?.modes.adventure ?? 0 },
    { id: "challenge", title: "Try a Challenge", icon: "🛡️", reward: 30, target: 1, progress: (day) => day?.modes.challenge ?? 0 },
    // Little kids don't get Speed Run or Review.
    ...(little
      ? []
      : [
          { id: "speed", title: "Try a Speed Run", icon: "⚡", reward: 15, target: 1, progress: (day: DayStat | undefined) => day?.modes.speed ?? 0 },
          { id: "review", title: "Do a Review", icon: "🔍", reward: 20, target: 1, progress: (day: DayStat | undefined) => day?.modes.review ?? 0 },
        ]),
  ];
}

export function dailyQuests(profileId: string, day: string, band: AgeBand): Quest[] {
  return withSeed(hashSeed(`${profileId}:${day}`), () => {
    const all = pool(band);
    // One "answer questions" quest, plus two others.
    const answer = sample(all.filter((q) => q.id.startsWith("answers")), 1);
    const rest = sample(all.filter((q) => !q.id.startsWith("answers")), 2);
    return [...answer, ...rest];
  });
}

/** The Monday (local) of the week a time falls in, as a day key. */
export function weekStart(t: number): string {
  const d = new Date(t);
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return dayKey(d.getTime());
}

/** The seven day keys of the week that starts on `start`. */
export function weekDays(start: string): string[] {
  const base = new Date(`${start}T12:00:00`).getTime();
  return Array.from({ length: 7 }, (_, i) => dayKey(base + i * 86_400_000));
}

export const activeDay = (d: DayStat) => d.sessions > 0 || d.answers >= 5;

function weeklyPool(band: AgeBand): WeeklyQuest[] {
  const little = band === "little";
  const total = (f: (d: DayStat) => number) => (days: DayStat[]) => days.reduce((a, d) => a + f(d), 0);
  const answers = little ? 100 : 200;
  const minutes = little ? 30 : 60;
  return [
    { id: "w-answers", title: `Answer ${answers} questions this week`, icon: "✏️", reward: 60, target: answers, progress: total((d) => d.answers) },
    { id: "w-days", title: "Practise on 4 different days", icon: "📅", reward: 60, target: 4, progress: (days) => days.filter(activeDay).length },
    { id: "w-flawless", title: "Finish 3 flawless lessons", icon: "💎", reward: 60, target: 3, progress: total((d) => d.perfect) },
    {
      id: "w-all-subjects",
      title: "Answer 15 questions in every subject",
      icon: "🌈",
      reward: 80,
      target: 4,
      progress: (days) => SUBJECTS.filter((s) => days.reduce((a, d) => a + (d.subjects[s] ?? 0), 0) >= 15).length,
    },
    { id: "w-daily", title: "Do the Daily Challenge 3 times", icon: "☀️", reward: 70, target: 3, progress: total((d) => d.modes.daily ?? 0) },
    { id: "w-minutes", title: `Learn for ${minutes} minutes this week`, icon: "⏱️", reward: 70, target: minutes, progress: (days) => Math.floor(days.reduce((a, d) => a + d.learnSeconds, 0) / 60) },
    { id: "w-lessons", title: "Finish 10 lessons", icon: "📗", reward: 60, target: 10, progress: total((d) => d.sessions) },
    { id: "w-run", title: `Get ${little ? 8 : 12} right in a row`, icon: "🔥", reward: 50, target: little ? 8 : 12, progress: (days) => Math.max(0, ...days.map((d) => d.bestRun)) },
    { id: "w-challenge", title: "Finish 2 Challenges", icon: "🛡️", reward: 70, target: 2, progress: total((d) => d.modes.challenge ?? 0) },
  ];
}

/** Two bigger quests per week, claimed automatically like the daily ones. */
export function weeklyQuests(profileId: string, start: string, band: AgeBand): WeeklyQuest[] {
  return withSeed(hashSeed(`${profileId}:${start}:week`), () => sample(weeklyPool(band), 2));
}
