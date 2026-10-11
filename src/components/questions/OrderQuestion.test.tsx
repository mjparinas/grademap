// @vitest-environment jsdom
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { OrderQuestion as Q } from "@/content/types";
import { OrderQuestion } from "./OrderQuestion";

const q: Q = {
  kind: "order",
  prompt: "Put these in order.",
  hint: "Start with the smallest.",
  items: [
    { id: "a", label: "one" },
    { id: "b", label: "two" },
    { id: "c", label: "three" },
  ],
};

const pool = () => screen.queryAllByTestId("pool-item").map((b) => b.textContent);

const setup = (status: "answering" | "revealed" = "answering") => {
  const onAttempt = vi.fn();
  render(<OrderQuestion q={q} status={status} onAttempt={onAttempt} onSlip={vi.fn()} />);
  return onAttempt;
};

describe("OrderQuestion", () => {
  it("keeps Check off until every item is placed, and accepts the right order", async () => {
    const onAttempt = setup();
    const check = screen.getByRole("button", { name: "Check ✓" });
    expect(check).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "one" }));
    expect(check).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "two" }));
    await userEvent.click(screen.getByRole("button", { name: "three" }));
    expect(pool()).toEqual([]);
    expect(check).toBeEnabled();
    await userEvent.click(check);
    expect(onAttempt).toHaveBeenCalledTimes(1);
    expect(onAttempt.mock.calls[0][0]).toBe(true);
  });

  it("sends back the part that is out of order and keeps the part that was right", async () => {
    const onAttempt = setup();
    await userEvent.click(screen.getByRole("button", { name: "one" }));
    await userEvent.click(screen.getByRole("button", { name: "three" }));
    await userEvent.click(screen.getByRole("button", { name: "two" }));
    await userEvent.click(screen.getByRole("button", { name: "Check ✓" }));
    expect(onAttempt.mock.calls[0][0]).toBe(false);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 700));
    });
    expect(pool().sort()).toEqual(["three", "two"]);
  });

  it("puts an item back when it is tapped in the row", async () => {
    setup();
    await userEvent.click(screen.getByRole("button", { name: "two" }));
    expect(pool()).not.toContain("two");
    await userEvent.click(screen.getByRole("button", { name: "two" }));
    expect(pool()).toContain("two");
  });

  it("shows the right order when the answer is revealed", () => {
    setup("revealed");
    expect(screen.queryByRole("button", { name: "Check ✓" })).not.toBeInTheDocument();
    expect(screen.getAllByRole("button").map((b) => b.textContent)).toEqual(["one", "two", "three"]);
  });
});
