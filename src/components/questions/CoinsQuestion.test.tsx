// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { CoinsQuestion as Q } from "@/content/types";
import { CoinsQuestion } from "./CoinsQuestion";

const q: Q = { kind: "coins", prompt: "Make 30¢.", hint: "A quarter and a nickel.", target: 30, coins: [25, 10, 5] };

const add = (cents: string) => screen.getByRole("button", { name: new RegExp(cents) });

const setup = (question: Q = q, status: "answering" | "revealed" = "answering") => {
  const onAttempt = vi.fn();
  render(<CoinsQuestion q={question} status={status} onAttempt={onAttempt} onSlip={vi.fn()} />);
  return onAttempt;
};

describe("CoinsQuestion", () => {
  it("checks the coins in the purse, and lets a coin be taken back out", async () => {
    const onAttempt = setup();
    const check = screen.getByRole("button", { name: "Check ✓" });
    expect(check).toBeDisabled();

    await userEvent.click(add("dime, 10¢"));
    await userEvent.click(check);
    expect(onAttempt.mock.calls[0][0]).toBe(false);

    await userEvent.click(screen.getByRole("button", { name: "Take out dime" }));
    expect(check).toBeDisabled();

    await userEvent.click(add("quarter, 25¢"));
    await userEvent.click(add("nickel, 5¢"));
    expect(screen.getByText("30¢")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Check ✓" }));
    expect(onAttempt.mock.calls[1][0]).toBe(true);
  });

  it("holds at most 14 coins", async () => {
    setup({ ...q, target: 70 });
    const nickel = add("nickel, 5¢");
    for (let i = 0; i < 16; i++) await userEvent.click(nickel);
    expect(screen.getAllByRole("button", { name: "Take out nickel" })).toHaveLength(14);
    expect(screen.getByText("70¢")).toBeInTheDocument();
  });

  it("shows the fewest coins when the answer is revealed", () => {
    setup({ ...q, target: 40 }, "revealed");
    expect(screen.getByRole("button", { name: "Take out quarter" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Take out dime" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Take out nickel" })).toBeInTheDocument();
    expect(screen.getByText("40¢")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Check ✓" })).toBeDisabled();
  });
});
