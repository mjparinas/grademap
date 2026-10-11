// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { BuildQuestion as Q } from "@/content/types";
import { BuildQuestion } from "./BuildQuestion";

const q: Q = { kind: "build", prompt: "Build 23.", hint: "Two tens and three ones.", target: 23 };

const setup = (question: Q = q, status: "answering" | "revealed" = "answering") => {
  const onAttempt = vi.fn();
  render(<BuildQuestion q={question} status={status} onAttempt={onAttempt} onSlip={vi.fn()} />);
  return onAttempt;
};

describe("BuildQuestion", () => {
  it("checks the blocks against the target, and stays quiet until there is something to check", async () => {
    const onAttempt = setup();
    const check = screen.getByRole("button", { name: "Check ✓" });
    expect(check).toBeDisabled();
    expect(screen.queryByRole("button", { name: "+ Hundred" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Take away a one" })).toBeDisabled();

    await userEvent.click(screen.getByRole("button", { name: "+ One" }));
    expect(check).toBeEnabled();
    await userEvent.click(check);
    expect(onAttempt.mock.calls[0][0]).toBe(false);

    await userEvent.click(screen.getByRole("button", { name: "Take away a one" }));
    await userEvent.click(screen.getByRole("button", { name: "+ Ten" }));
    await userEvent.click(screen.getByRole("button", { name: "+ Ten" }));
    await userEvent.click(screen.getByRole("button", { name: "+ One" }));
    await userEvent.click(screen.getByRole("button", { name: "+ One" }));
    await userEvent.click(screen.getByRole("button", { name: "+ One" }));
    await userEvent.click(screen.getByRole("button", { name: "Check ✓" }));
    expect(onAttempt.mock.calls[1][0]).toBe(true);
  });

  it("stops at nine of each block", async () => {
    setup();
    for (let i = 0; i < 11; i++) await userEvent.click(screen.getByRole("button", { name: "+ One" }));
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText(/9 ones/)).toBeInTheDocument();
  });

  it("can add hundreds when the question uses them", async () => {
    const onAttempt = setup({ ...q, target: 100, hundreds: true });
    await userEvent.click(screen.getByRole("button", { name: "+ Hundred" }));
    await userEvent.click(screen.getByRole("button", { name: "Check ✓" }));
    expect(onAttempt.mock.calls[0][0]).toBe(true);
  });

  it("shows the target in blocks when the answer is revealed", () => {
    setup(q, "revealed");
    expect(screen.getByText(/2 tens \+ 3 ones/)).toBeInTheDocument();
    expect(screen.getByText("23")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Check ✓" })).toBeDisabled();
  });
});
