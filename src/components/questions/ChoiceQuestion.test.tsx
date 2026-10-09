// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ChoiceQuestion as Q } from "@/content/types";
import { ChoiceQuestion } from "./ChoiceQuestion";
import type { Status } from "./types";

const q: Q = {
  kind: "choice",
  prompt: "What is 2 + 3?",
  hint: "Count on from 2.",
  answer: "b",
  choices: [
    { id: "a", label: "4" },
    { id: "b", label: "5" },
    { id: "c", label: "6" },
    { id: "d", label: "7" },
  ],
};

const setup = (status: Status = "answering") => {
  const onAttempt = vi.fn();
  const onSlip = vi.fn();
  const view = render(<ChoiceQuestion q={q} status={status} onAttempt={onAttempt} onSlip={onSlip} />);
  return { onAttempt, onSlip, ...view };
};

describe("ChoiceQuestion", () => {
  it("renders every choice as a button", () => {
    setup();
    expect(screen.getAllByTestId("choice").map((b) => b.textContent)).toEqual(["4", "5", "6", "7"]);
  });

  it("reports a correct pick", async () => {
    const { onAttempt } = setup();
    await userEvent.click(screen.getByRole("button", { name: "5" }));
    expect(onAttempt).toHaveBeenCalledTimes(1);
    expect(onAttempt.mock.calls[0][0]).toBe(true);
  });

  it("reports a wrong pick and disables that choice only", async () => {
    const { onAttempt } = setup();
    await userEvent.click(screen.getByRole("button", { name: "6" }));
    expect(onAttempt.mock.calls[0][0]).toBe(false);
    expect(screen.getByRole("button", { name: "6" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "5" })).toBeEnabled();
  });

  it("locks every choice once the question is answered", () => {
    setup("correct");
    for (const b of screen.getAllByTestId("choice")) expect(b).toBeDisabled();
  });

  it("highlights the right answer when it is revealed", () => {
    setup("revealed");
    expect(screen.getByRole("button", { name: "5" })).toHaveClass("btn-primary");
    expect(screen.getByRole("button", { name: "4" })).not.toHaveClass("btn-primary");
  });
});
