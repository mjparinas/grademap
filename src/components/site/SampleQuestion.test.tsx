// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Question } from "@/content/types";
import { SampleQuestion } from "./SampleQuestion";

const show = (q: Question) =>
  render(
    <ul>
      <SampleQuestion q={q} n={3} seedText="seed" />
    </ul>,
  );

describe("SampleQuestion", () => {
  it("shows the number, prompt, choices, answer and hint", () => {
    show({
      kind: "choice",
      prompt: "Which is biggest?",
      hint: "Compare the tens.",
      answer: "b",
      choices: [
        { id: "a", label: "12" },
        { id: "b", label: "45" },
      ],
    });
    expect(screen.getByText("Question 3")).toBeInTheDocument();
    expect(screen.getByText("Which is biggest?")).toBeInTheDocument();
    expect(within(screen.getByRole("list", { name: "Choices" })).getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("Show answer")).toBeInTheDocument();
    expect(screen.getByText("Hint: Compare the tens.")).toBeInTheDocument();
  });

  it("keeps the answer inside a closed <details>", () => {
    show({ kind: "input", prompt: "7 + 5 = ?", hint: "Make ten.", answer: "12", suffix: "apples" });
    const details = screen.getByText("Show answer").closest("details");
    expect(details).not.toHaveAttribute("open");
    expect(within(details!).getByText("12 apples")).toBeInTheDocument();
  });

  it("describes an order question's answer in sequence", () => {
    show({
      kind: "order",
      prompt: "Put in order",
      hint: "Smallest first",
      items: [
        { id: "1", label: "1" },
        { id: "2", label: "2" },
        { id: "3", label: "3" },
      ],
    } as Question);
    expect(screen.getByText("1 → 2 → 3")).toBeInTheDocument();
  });
});
