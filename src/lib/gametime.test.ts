import { describe, expect, it } from "vitest";
import { gameTime } from "./gametime";
import type { Derived } from "./derive";

const day = (learnSeconds: number, playSeconds: number) => ({
  day: "2026-10-09",
  learnSeconds,
  playSeconds,
  answers: 0,
  correct: 0,
  sessions: 0,
  perfect: 0,
  bestRun: 0,
  subjects: {},
  modes: {},
});
const derived = (days: Derived["days"]): Derived => ({ days } as Derived);
const today = new Date("2026-10-09T12:00:00").getTime();

describe("gameTime", () => {
  it("awards game time in configured learning increments", () => {
    const d = derived({ "2026-10-09": day(2_500, 60) });
    expect(gameTime(undefined, d, today)).toMatchObject({
      enabled: true,
      freePlay: false,
      earnedSeconds: 600,
      usedSeconds: 60,
      availableSeconds: 540,
      nextInSeconds: 1_100,
      capSeconds: 1_200,
      learnSecondsToday: 2_500,
    });
  });

  it("uses parent settings, clamps earned rewards to the cap, and handles free play", () => {
    const d = derived({ "2026-10-09": day(9_000, 120) });
    expect(gameTime({ learnMinutesPerReward: 10, rewardGameMinutes: 8, maxGameMinutesPerDay: 12, freePlay: true, gamesEnabled: false } as never, d, today)).toMatchObject({
      enabled: false,
      freePlay: true,
      earnedSeconds: 720,
      availableSeconds: 600,
      nextInSeconds: 0,
      capSeconds: 720,
    });
  });

  it("returns zero when the daily allowance is used and safely handles invalid zero settings", () => {
    const d = derived({ "2026-10-09": day(0, 900) });
    expect(gameTime({ learnMinutesPerReward: 0, rewardGameMinutes: 0, maxGameMinutesPerDay: 0 } as never, d, today)).toMatchObject({
      earnedSeconds: 0,
      availableSeconds: 0,
      nextInSeconds: 0,
      capSeconds: 0,
    });
  });
});
