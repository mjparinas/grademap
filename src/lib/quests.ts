import { hashSeed, sample, withSeed } from "@/content/random";
import { getSubjectMeta } from "@/content/subjects";
import type { AgeBand, SubjectId } from "@/content/types";
import type { DayStat } from "./derive";

// Three fresh quests each day per child. They're picked with a seed so the
// same quests show on every device.

export interface Quest {
  id: string;
  title: string;
  icon: string;
  reward: number;
  target: number;
  progress: (day: DayStat | undefined) => number;
}

const subjectQuest = (subject: SubjectId, band: AgeBand, n: number): Quest => ({
  id: `${subject}-${n}`,
  title: `Answer ${n} ${getSubjectMeta(subject).title[band]} questions`,
  icon: getSubjectMeta(subject).emoji,
  reward: 20,
  target: n,
  progress: (day) => day?.subjects[subject] ?? 0,
});

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
    { id: "lessons", title: "Finish 2 lessons", icon: "📗", reward: 20, target: 2, progress: (day) => day?.sessions ?? 0 },
    {
      id: "minutes",
      title: `Learn for ${little ? 5 : 10} minutes`,
      icon: "⏱️",
      reward: 25,
      target: little ? 5 : 10,
      progress: (day) => Math.floor((day?.learnSeconds ?? 0) / 60),
    },
    subjectQuest("math", band, n),
    subjectQuest("language", band, n),
    subjectQuest("science", band, n),
    subjectQuest("social", band, n),
    { id: "daily", title: "Do the Daily Challenge", icon: "☀️", reward: 25, target: 1, progress: (day) => day?.modes.daily ?? 0 },
    { id: "speed", title: "Try a Speed Run", icon: "⚡", reward: 15, target: 1, progress: (day) => day?.modes.speed ?? 0 },
    { id: "adventure", title: "Play Adventure", icon: "🗺️", reward: 15, target: 1, progress: (day) => day?.modes.adventure ?? 0 },
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
