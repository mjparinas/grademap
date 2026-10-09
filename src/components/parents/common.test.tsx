// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Profile } from "@/lib/model";

const profiles = vi.hoisted(() => ({ list: [] as unknown[] }));
vi.mock("@/lib/store", () => ({ useProfiles: () => profiles.list }));
vi.mock("../Critter", () => ({ CritterSvg: () => <svg data-testid="critter" /> }));

import { ChildTabs, NoChildren, PageTitle } from "./common";

const kid = (id: string, name: string, grade: number) => ({ id, name, grade, avatar: "otter", colour: "#fff" }) as unknown as Profile;

describe("parent common pieces", () => {
  it("PageTitle shows the title, optional sub line and action", () => {
    render(<PageTitle title="Reports" sub="Last 7 days" action={<button>Print</button>} />);
    expect(screen.getByRole("heading", { name: "Reports" })).toBeInTheDocument();
    expect(screen.getByText("Last 7 days")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Print" })).toBeInTheDocument();
  });

  it("NoChildren links to the Children page", () => {
    render(<NoChildren />);
    expect(screen.getByRole("link", { name: "Add a child" })).toHaveAttribute("href", "#/children");
  });

  describe("ChildTabs", () => {
    it("is hidden for a single child", () => {
      profiles.list = [kid("a", "Ava", 2)];
      const { container } = render(<ChildTabs base="reports" />);
      expect(container).toBeEmptyDOMElement();
    });

    it("lists each child, links by id and marks the current one", () => {
      profiles.list = [kid("a", "Ava", 2), kid("b", "Ben", 4)];
      render(<ChildTabs base="reports" current={profiles.list[1] as Profile} />);
      const tabs = screen.getAllByRole("tab");
      expect(tabs).toHaveLength(2);
      expect(tabs[0]).toHaveAttribute("href", "#/reports/a");
      expect(tabs[0]).toHaveAttribute("aria-selected", "false");
      expect(tabs[1]).toHaveAttribute("href", "#/reports/b");
      expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    });
  });
});
