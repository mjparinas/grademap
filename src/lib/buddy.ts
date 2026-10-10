// A child's buddy grows with their level. It only reads the level, which is already derived from the
// event log, so nothing is stored and every device agrees.

export interface GrowthStage {
  stage: 1 | 2 | 3 | 4 | 5;
  name: string;
  /** First level that reaches this stage. */
  level: number;
  /** What the buddy gains, in a few words. */
  gain: string;
}

export const GROWTH_STAGES: GrowthStage[] = [
  { stage: 1, name: "Cub", level: 1, gain: "Just getting started" },
  { stage: 2, name: "Explorer", level: 5, gain: "A bow tie" },
  { stage: 3, name: "Adventurer", level: 15, gain: "A flowing cape" },
  { stage: 4, name: "Hero", level: 30, gain: "A shiny medal" },
  { stage: 5, name: "Legend", level: 50, gain: "A golden crown" },
];

export function growthStage(level: number): GrowthStage {
  let current = GROWTH_STAGES[0];
  for (const s of GROWTH_STAGES) if (level >= s.level) current = s;
  return current;
}

export function nextGrowthStage(level: number): GrowthStage | undefined {
  return GROWTH_STAGES.find((s) => s.level > level);
}
