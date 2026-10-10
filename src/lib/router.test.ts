// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { back, go, href, parse } from "./router";

describe("hash router", () => {
  it("decodes path parts and parses query values", () => {
    expect(parse("/parents/child%20one/reports?range=30&tab=math")).toEqual({
      path: ["parents", "child one", "reports"],
      query: new URLSearchParams("range=30&tab=math"),
    });
    expect(parse("")).toEqual({ path: [], query: new URLSearchParams() });
  });

  it("builds links while omitting undefined query values", () => {
    expect(href("/play", { mode: "review", grade: 4, unused: undefined })).toBe("#/play?mode=review&grade=4");
    expect(href("/parents")).toBe("#/parents");
  });

  it("navigates by hash or replaces the current location", () => {
    go("/play", { mode: "adventure" });
    expect(window.location.hash).toBe("#/play?mode=adventure");
    const replace = vi.fn();
    vi.stubGlobal("window", { location: { replace } });
    go("/parents", undefined, true);
    expect(replace).toHaveBeenCalledWith("#/parents");
    vi.unstubAllGlobals();
  });

  it("goes back when history is available and otherwise uses the fallback", () => {
    const historyBack = vi.spyOn(window.history, "back").mockImplementation(() => {});
    vi.spyOn(window.history, "length", "get").mockReturnValue(2);
    back("/play");
    expect(historyBack).toHaveBeenCalledOnce();

    vi.spyOn(window.history, "length", "get").mockReturnValue(1);
    go("/parents");
    const previous = window.location.hash;
    back("/play");
    expect(window.location.hash).not.toBe(previous);
  });
});
