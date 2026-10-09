// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ColumnChart, StatTile } from "./charts";

describe("StatTile", () => {
  it("shows label, value and optional sub text", () => {
    render(<StatTile label="Minutes" value="42" sub="this week" />);
    expect(screen.getByText("Minutes")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("this week")).toBeInTheDocument();
  });

  it("marks the change as up or down", () => {
    const { rerender } = render(<StatTile label="A" value="1" delta={{ text: "5 more", good: true }} />);
    expect(screen.getByText("▲")).toBeInTheDocument();
    rerender(<StatTile label="A" value="1" delta={{ text: "5 fewer", good: false }} />);
    expect(screen.getByText("▼")).toBeInTheDocument();
    expect(screen.getByText(/5 fewer/)).toBeInTheDocument();
  });

  it("omits the change line when there is none", () => {
    render(<StatTile label="A" value="1" />);
    expect(screen.queryByText("▲")).not.toBeInTheDocument();
    expect(screen.queryByText("▼")).not.toBeInTheDocument();
  });
});

describe("ColumnChart", () => {
  const data = [
    { label: "Mon", value: 10 },
    { label: "Tue", value: 0 },
    { label: "Wed", value: 25 },
  ];

  it("labels the chart for assistive tech and includes every day in the table view", () => {
    render(<ColumnChart title="Minutes per day" data={data} unit="Minutes" />);
    expect(screen.getByRole("img", { name: "Minutes per day" })).toBeInTheDocument();
    for (const d of data) expect(screen.getAllByText(d.label).length).toBeGreaterThan(0);
    expect(screen.getByText("25")).toBeInTheDocument();
  });

  it("copes with all-zero data", () => {
    expect(() => render(<ColumnChart title="Empty" data={[{ label: "Mon", value: 0 }]} unit="Minutes" />)).not.toThrow();
  });
});
