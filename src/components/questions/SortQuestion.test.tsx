// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import type { SortQuestion as Q } from "@/content/types";
import { SortQuestion } from "./SortQuestion";

const q: Q = {
  kind: "sort",
  prompt: "Sort the living things.",
  hint: "A living thing grows.",
  bins: [
    { id: "yes", label: "living", emoji: "🌱" },
    { id: "no", label: "not living", emoji: "🪨" },
  ],
  items: [
    { id: "cat", label: "cat", emoji: "🐱", bin: "yes" },
    { id: "rock", label: "rock", emoji: "🪨", bin: "no" },
    { id: "tree", label: "tree", emoji: "🌳", bin: "yes" },
  ],
};

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: () => ({ matches: true, addEventListener() {}, removeEventListener() {} }),
  });
});

const setup = (status: "answering" | "correct" = "answering") => {
  const onAttempt = vi.fn();
  const onSlip = vi.fn();
  render(<SortQuestion q={q} status={status} onAttempt={onAttempt} onSlip={onSlip} />);
  return { onAttempt, onSlip };
};

describe("SortQuestion", () => {
  it("treats a wrong basket as a slip and finishes only when everything is in", async () => {
    const { onAttempt, onSlip } = setup();
    const basket = (label: "living" | "not living") =>
      screen.getAllByTestId("bin").find((bin) => {
        const text = bin.textContent ?? "";
        return label === "not living" ? text.includes("not living") : text.includes("living") && !text.includes("not");
      })!;
    await userEvent.click(screen.getByRole("button", { name: /rock/ }));
    await userEvent.click(basket("living"));
    expect(onSlip).toHaveBeenCalledTimes(1);
    expect(onAttempt).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /rock/ })).toBeInTheDocument();

    await userEvent.click(basket("not living"));
    expect(screen.queryByRole("button", { name: /rock/ })).not.toBeInTheDocument();
    expect(onAttempt).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole("button", { name: /cat/ }));
    await userEvent.click(basket("living"));
    await userEvent.click(screen.getByRole("button", { name: /tree/ }));
    await userEvent.click(basket("living"));
    expect(onAttempt).toHaveBeenCalledTimes(1);
    expect(onAttempt.mock.calls[0][0]).toBe(true);
    expect(screen.getByText(/All sorted/)).toBeInTheDocument();
  });

  it("locks the baskets once the question is answered", () => {
    setup("correct");
    for (const bin of screen.getAllByTestId("bin")) expect(bin).toBeDisabled();
  });
});
