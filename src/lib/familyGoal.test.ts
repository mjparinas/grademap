import { describe, expect, it } from "vitest";
import { derive } from "./derive";
import { activeNudge, NUDGE_PRESETS, weekProgress } from "./familyGoal";
import { dayKey, type AppEvent } from "./model";
import { weekStart } from "./quests";

const DAY = 86_400_000;
const answers = (t: number): AppEvent[] =>
  Array.from({ length: 5 }, (_, i) => ({ id: `${t}-${i}`, profileId: "p", t: t + i * 1000, type: "answer", unit: "2/math/tens-and-ones", correct: true, attempts: 1, revealed: false, ms: 4000, mode: "practice" }));

describe("weekly family goal", () => {
  // A Wednesday at noon.
  const wed = new Date(2026, 9, 7, 12).getTime();
  it("counts days practised from Monday and flags the goal as met", () => {
    const monday = new Date(`${weekStart(wed)}T12:00:00`).getTime();
    const d = derive([...answers(monday), ...answers(monday + 2 * DAY), ...answers(monday - DAY)], wed);
    const p = weekProgress(d, 2, wed);
    expect(p.days).toBe(2);
    expect(p.met).toBe(true);
    expect(p.dots).toHaveLength(7);
    expect(p.dots[0].day).toBe(dayKey(monday));
    expect(weekProgress(d, 3, wed).met).toBe(false);
  });
  it("shows no days for a quiet week", () => {
    expect(weekProgress(derive([], wed), 3, wed).days).toBe(0);
  });
});

describe("parent notes", () => {
  const now = Date.now();
  it("show a known preset for three days only", () => {
    const preset = NUDGE_PRESETS[0].id;
    expect(activeNudge({ id: "n1", preset, sentAt: now - DAY }, now)?.text).toBe(NUDGE_PRESETS[0].text);
    expect(activeNudge({ id: "n1", preset, sentAt: now - 4 * DAY }, now)).toBeUndefined();
    expect(activeNudge({ id: "n1", preset: "made-up", sentAt: now }, now)).toBeUndefined();
    expect(activeNudge(undefined, now)).toBeUndefined();
  });
  it("are fixed phrases with unique ids, never free text", () => {
    expect(new Set(NUDGE_PRESETS.map((n) => n.id)).size).toBe(NUDGE_PRESETS.length);
  });
});
