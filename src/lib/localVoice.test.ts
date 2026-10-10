import { describe, expect, it } from "vitest";
import { shouldUseLocalVoice } from "./localVoice";

describe("opt-in local neural voice", () => {
  it("uses the downloaded model only for opted-in English speech", () => {
    expect(shouldUseLocalVoice("en", true, "ready")).toBe(true);
    expect(shouldUseLocalVoice("en", false, "ready")).toBe(false);
    expect(shouldUseLocalVoice("en", true, "loading")).toBe(false);
    expect(shouldUseLocalVoice("fr", true, "ready")).toBe(false);
  });
});
