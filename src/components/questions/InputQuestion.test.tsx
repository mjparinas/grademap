// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { InputQuestion as Q } from "@/content/types";
import { InputQuestion, isRightAnswer } from "./InputQuestion";

const base: Q = { kind: "input", prompt: "7 + 5 = ?", hint: "Make ten first.", answer: "12" };

describe("isRightAnswer", () => {
  it("accepts the answer with stray spaces", () => expect(isRightAnswer(base, " 12 ")).toBe(true));
  it("rejects empty and wrong entries", () => {
    expect(isRightAnswer(base, "")).toBe(false);
    expect(isRightAnswer(base, "13")).toBe(false);
  });
  it("treats equal decimals as the same number", () => {
    const money: Q = { ...base, answer: "0.5", keypad: "decimal" };
    expect(isRightAnswer(money, "0.50")).toBe(true);
    expect(isRightAnswer(money, "0.6")).toBe(false);
  });
  it("only accepts listed fraction forms", () => {
    const frac: Q = { ...base, answer: "3/4", accept: ["6/8"], keypad: "fraction" };
    expect(isRightAnswer(frac, "3/4")).toBe(true);
    expect(isRightAnswer(frac, "6/8")).toBe(true);
    expect(isRightAnswer(frac, "9/12")).toBe(false);
  });
  it("accepts a typographic minus", () => expect(isRightAnswer({ ...base, answer: "-7", keypad: "integer" }, "−7")).toBe(true));
});

describe("InputQuestion", () => {
  const setup = (q: Q = base) => {
    const onAttempt = vi.fn();
    render(<InputQuestion q={q} status="answering" onAttempt={onAttempt} onSlip={vi.fn()} />);
    return onAttempt;
  };

  it("keeps Check disabled until something is typed", async () => {
    setup();
    const check = screen.getByRole("button", { name: /check/i });
    expect(check).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "1" }));
    expect(check).toBeEnabled();
  });

  it("submits a correct answer from the on-screen keypad", async () => {
    const onAttempt = setup();
    await userEvent.click(screen.getByRole("button", { name: "1" }));
    await userEvent.click(screen.getByRole("button", { name: "2" }));
    await userEvent.click(screen.getByRole("button", { name: /check/i }));
    expect(onAttempt.mock.calls[0][0]).toBe(true);
  });

  it("clears the box after a wrong answer", async () => {
    const onAttempt = setup();
    await userEvent.click(screen.getByRole("button", { name: "9" }));
    await userEvent.click(screen.getByRole("button", { name: /check/i }));
    expect(onAttempt.mock.calls[0][0]).toBe(false);
    expect(screen.getByLabelText("Your answer: empty")).toBeInTheDocument();
  });

  it("deletes the last digit", async () => {
    setup();
    await userEvent.click(screen.getByRole("button", { name: "4" }));
    await userEvent.click(screen.getByRole("button", { name: "5" }));
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByLabelText("Your answer: 4")).toBeInTheDocument();
  });

  it("stops at 9 characters", async () => {
    setup();
    for (let i = 0; i < 11; i++) await userEvent.click(screen.getByRole("button", { name: "1" }));
    expect(screen.getByLabelText("Your answer: 111111111")).toBeInTheDocument();
  });

  it("works with a hardware keyboard", async () => {
    const onAttempt = setup();
    await userEvent.keyboard("12{Enter}");
    expect(onAttempt.mock.calls[0][0]).toBe(true);
  });

  it("only shows a minus key on the integer keypad", async () => {
    const { unmount } = render(<InputQuestion q={base} status="answering" onAttempt={vi.fn()} onSlip={vi.fn()} />);
    expect(screen.queryByRole("button", { name: "−" })).not.toBeInTheDocument();
    unmount();
    render(<InputQuestion q={{ ...base, answer: "-3", keypad: "integer" }} status="answering" onAttempt={vi.fn()} onSlip={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "−" }));
    await userEvent.click(screen.getByRole("button", { name: "3" }));
    expect(screen.getByLabelText("Your answer: -3")).toBeInTheDocument();
  });
});
