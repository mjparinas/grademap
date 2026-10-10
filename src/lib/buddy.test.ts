import { describe, expect, it } from "vitest";
import { GROWTH_STAGES, growthStage, nextGrowthStage } from "./buddy";

describe("buddy growth", () => {
  it("starts as a cub and grows at fixed levels", () => {
    expect(growthStage(1).name).toBe("Cub");
    expect(growthStage(4).stage).toBe(1);
    expect(growthStage(5).name).toBe("Explorer");
    expect(growthStage(29).name).toBe("Adventurer");
    expect(growthStage(30).name).toBe("Hero");
    expect(growthStage(500).name).toBe("Legend");
  });
  it("says what comes next, until the last stage", () => {
    expect(nextGrowthStage(1)?.level).toBe(5);
    expect(nextGrowthStage(50)).toBeUndefined();
  });
  it("lists stages in order, each at a higher level", () => {
    const levels = GROWTH_STAGES.map((s) => s.level);
    expect(levels).toEqual([...levels].sort((a, b) => a - b));
    expect(new Set(levels).size).toBe(levels.length);
  });
});
