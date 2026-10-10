import { beforeAll, describe, expect, it } from "vitest";
import { allUnitRefs, loadGrade } from "@/content";
import { derive } from "./derive";
import type { AppEvent } from "./model";
import { countEarned, momentStickers, MOMENT_COUNT, unitStickers } from "./stickers";

beforeAll(() => loadGrade("2"));

const T = new Date("2026-10-10T12:00:00").getTime();
const KEY = "2/math/tens-and-ones";
const answers = (n: number, correct = true): AppEvent[] =>
  Array.from({ length: n }, (_, i) => ({ id: `a${i}${correct}`, profileId: "p", t: T + i * 1000, type: "answer", unit: KEY, correct, attempts: 1, revealed: false, ms: 3000, mode: "practice" }));
const refs = () => allUnitRefs("2", "ca-bc");

describe("sticker book", () => {
  it("starts empty and gives a lesson sticker once the lesson is grown", () => {
    const empty = unitStickers(refs(), derive([]));
    expect(countEarned(empty.math)).toBe(0);
    const grown = unitStickers(refs(), derive(answers(10)));
    const mine = grown.math.find((s) => s.id === KEY)!;
    expect(mine.earned).toBe(true);
    expect(mine.shiny).toBe(false);
    expect(countEarned(grown.math)).toBe(1);
  });
  it("shines a Star lesson", () => {
    const events = [...answers(20), { id: "s1", profileId: "p", t: T + 99_000, type: "session", mode: "challenge", scope: KEY, total: 10, correct: 10, ms: 1000 } as AppEvent];
    expect(unitStickers(refs(), derive(events)).math.find((s) => s.id === KEY)?.shiny).toBe(true);
  });
  it("hides French until it has been started", () => {
    const pages = unitStickers(refs(), derive([]));
    expect(pages.immersion).toBeUndefined();
    expect(pages["core-french"]).toBeUndefined();
  });
  it("earns moment stickers from practice", () => {
    expect(countEarned(momentStickers(derive([])))).toBe(0);
    const d = derive(answers(100));
    const got = momentStickers(d).filter((s) => s.earned).map((s) => s.id);
    expect(got).toContain("hundred");
    expect(got).toContain("run-5");
    expect(momentStickers(d)).toHaveLength(MOMENT_COUNT);
  });
});
