// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Question } from "@/content/types";
import type { Plan } from "./plans";

// Session talks to the store, the plan builder and a lot of sensory effects.
// Fake all of them so these tests are only about the answer flow.
const h = vi.hoisted(() => ({
  log: vi.fn(),
  go: vi.fn(),
  plan: null as unknown,
  settings: {} as Record<string, unknown>,
}));

vi.mock("@/lib/store", () => {
  const derived = { xp: 0, coins: 0, units: {}, speedBest: {}, days: {}, dailyDone: [] as string[], level: 1, levelXp: 0, levelNeed: 80 };
  const useStore = Object.assign((select: (s: unknown) => unknown) => select({ log: h.log }), { getState: () => ({}) });
  return {
    useStore,
    derivedFor: () => derived,
    useDerived: () => derived,
    useActiveProfile: () => ({ id: "p1", name: "Ava", grade: "2", framework: "bc", companion: "ollie", confetti: "classic" }),
    useChildSettings: () => h.settings,
  };
});
vi.mock("./plans", () => ({ makePlan: () => h.plan }));
vi.mock("./useAllowed", () => ({ useAllowed: () => () => true }));
vi.mock("@/content", () => ({ getUnitRef: () => undefined }));
vi.mock("@/lib/router", () => ({ go: h.go }));
vi.mock("@/lib/juice", () => ({ burstFrom: vi.fn(), celebrate: vi.fn(), floatText: vi.fn(), replay: vi.fn() }));
vi.mock("@/lib/speech", () => ({ speak: vi.fn(), stopSpeaking: vi.fn() }));
vi.mock("@/lib/sound", () => {
  const noop = vi.fn();
  return { sounds: new Proxy({}, { get: () => noop }) };
});
vi.mock("../Critter", () => ({ Critter: () => null, SpeechBubble: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }));
vi.mock("./ReportQuestion", () => ({ ReportQuestion: () => null }));

import { Session } from "./Session";

const question = (n: number): Question => ({
  kind: "choice",
  prompt: `Question number ${n}`,
  hint: `Hint ${n}`,
  answer: "right",
  choices: [
    { id: "right", label: "Yes" },
    { id: "wrong", label: "No" },
    { id: "wrong2", label: "Nope" },
  ],
});

const makePlan = (over: Partial<Plan> = {}): Plan => ({
  mode: "practice",
  scope: "math-1",
  title: "Practice",
  icon: "✏️",
  total: 2,
  retries: true,
  feedback: "bar",
  next: ({ index }) => ({ question: question(index + 1), unitKey: "math-1:u1", difficulty: 2 }),
  ...over,
});

const answers = () => h.log.mock.calls.flatMap((c) => c[0]).filter((e: { type: string }) => e.type === "answer");
const click = (name: string | RegExp) => userEvent.click(screen.getByRole("button", { name }));

beforeEach(() => {
  h.log.mockClear();
  h.go.mockClear();
  h.settings = {};
  h.plan = makePlan();
});

const start = () => render(<Session mode="practice" scope="math-1" />);

describe("Session answer flow", () => {
  it("counts a first-try correct answer as clean and moves on", async () => {
    start();
    expect(screen.getByText("Question number 1")).toBeInTheDocument();
    await click("Yes");
    expect(answers()).toEqual([expect.objectContaining({ correct: true, attempts: 1, revealed: false })]);
    expect(screen.getByRole("status")).toBeInTheDocument();
    await click(/next/i);
    expect(screen.getByText("Question number 2")).toBeInTheDocument();
  });

  it("gives a retry after the first miss and doesn't record yet", async () => {
    start();
    await click("No");
    expect(answers()).toHaveLength(0);
    expect(screen.getByRole("button", { name: "OK" })).toBeInTheDocument();
    await click("OK");
    expect(screen.getByRole("button", { name: "No" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Yes" })).toBeEnabled();
  });

  it("a fix after one miss is correct but not first-try", async () => {
    start();
    await click("No");
    await click("OK");
    await click("Yes");
    expect(answers()).toEqual([expect.objectContaining({ correct: false, attempts: 2, revealed: false })]);
  });

  it("reveals the answer after a second miss", async () => {
    start();
    await click("No");
    await click("OK");
    await click("Nope");
    expect(answers()).toEqual([expect.objectContaining({ correct: false, attempts: 2, revealed: true })]);
    expect(screen.getByText("Here's how:")).toBeInTheDocument();
    expect(screen.getByText("Hint 1")).toBeInTheDocument();
  });

  it("a hint opened first means no first-try credit", async () => {
    start();
    await click(/need a hint/i);
    expect(screen.getByText("Hint 1")).toBeInTheDocument();
    await click("Yes");
    expect(answers()).toEqual([expect.objectContaining({ correct: false, hinted: true })]);
  });

  it("'Hints count as first try' keeps the credit", async () => {
    h.settings = { freeHints: true };
    start();
    await click(/need a hint/i);
    await click("Yes");
    expect(answers()).toEqual([expect.objectContaining({ correct: true, hinted: true, attempts: 1 })]);
  });

  it("has no hint button or retry when the mode allows no retries", async () => {
    h.plan = makePlan({ retries: false });
    start();
    expect(screen.queryByRole("button", { name: /need a hint/i })).not.toBeInTheDocument();
    await click("No");
    expect(answers()).toEqual([expect.objectContaining({ correct: false, revealed: true })]);
    expect(screen.getByText("Not quite. Here's how:")).toBeInTheDocument();
  });

  it("finishes after the last question and logs one session", async () => {
    start();
    await click("Yes");
    await click(/next/i);
    await click("Yes");
    await click(/finish/i);
    expect(screen.getByText("You did it, Ava!")).toBeInTheDocument();
    expect(screen.getByText(/2\/2 first try/)).toBeInTheDocument();
    const sessions = h.log.mock.calls.flatMap((c) => c[0]).filter((e: { type: string }) => e.type === "session");
    expect(sessions).toEqual([expect.objectContaining({ total: 2, correct: 2 })]);
  });

  it("shows a checkpoint every N questions in endless modes", async () => {
    h.plan = makePlan({ mode: "adventure", total: undefined, checkpoint: 2 });
    start();
    await click("Yes");
    await click(/next/i);
    await click("Yes");
    await click(/next/i);
    expect(screen.getByRole("heading", { name: /checkpoint/i })).toBeInTheDocument();
    expect(screen.getByText(/right on the first try/)).toHaveTextContent("2 of 2");
    await click(/keep going/i);
    expect(screen.getByText("Question number 3")).toBeInTheDocument();
  });

  it("speed run: advances by itself after a miss, no feedback bar", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      h.plan = makePlan({ mode: "speed", feedback: "flash", retries: false, total: undefined, timeLimit: 60 });
      start();
      await click("No");
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      expect(answers()).toEqual([expect.objectContaining({ correct: false, revealed: true })]);
      await vi.advanceTimersByTimeAsync(500);
      expect(screen.getByText("Question number 2")).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("stopping early asks first, and Stop with fewer than 3 answers goes home", async () => {
    start();
    await click("Stop");
    // (the ✕ button is labelled "Stop"; the dialog's own button shares the name once open)
    expect(screen.getByText("Every answer you gave is already saved.")).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole("button", { name: "Stop" }).at(-1)!);
    expect(h.go).toHaveBeenCalledWith("/");
  });
});
