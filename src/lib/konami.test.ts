import { describe, expect, it } from "vitest";
import { createKonamiMatcher, KONAMI, stepForGesture, stepForKey } from "./konami";

describe("konami", () => {
  it("matches the full sequence once, even after a slip", () => {
    const feed = createKonamiMatcher();
    expect(feed("up")).toBe(false);
    expect(feed("left")).toBe(false); // slip: restart
    const results = KONAMI.map((s) => feed(s));
    expect(results.at(-1)).toBe(true);
    expect(results.slice(0, -1).some(Boolean)).toBe(false);
  });

  it("restarts on an extra leading up", () => {
    const feed = createKonamiMatcher();
    feed("up");
    const results = KONAMI.map((s) => feed(s));
    expect(results.at(-1)).toBe(true);
  });

  it("reads keys and swipes", () => {
    expect(stepForKey("ArrowUp")).toBe("up");
    expect(stepForKey("B")).toBe("b");
    expect(stepForKey("x")).toBeNull();
    expect(stepForGesture(0, -80)).toBe("up");
    expect(stepForGesture(90, 10)).toBe("right");
    expect(stepForGesture(5, 5)).toBeNull();
    expect(stepForGesture(60, 60)).toBeNull();
  });
});

describe("konami taps", () => {
  it("accepts two taps for B and A after the swipes", () => {
    const feed = createKonamiMatcher();
    KONAMI.slice(0, 8).forEach((s) => feed(s));
    expect(feed("tap")).toBe(false);
    expect(feed("tap")).toBe(true);
  });
  it("ignores a tap before the swipes are done", () => {
    const feed = createKonamiMatcher();
    feed("up");
    feed("tap");
    KONAMI.slice(0, 8).forEach((s) => feed(s));
    expect(feed("tap")).toBe(false);
  });
});
