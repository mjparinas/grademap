// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FRAMEWORKS } from "@/content/frameworks";
import { ProvinceMenu } from "./ProvinceMenu";

const menu = () => screen.getByRole("combobox", { name: "Where do you live?" });

describe("ProvinceMenu", () => {
  it("lists every province and reports the one you pick", async () => {
    const onChange = vi.fn();
    render(<ProvinceMenu value="ca-bc" onChange={onChange} />);
    const box = menu();
    expect(box).toHaveAttribute("aria-expanded", "false");
    expect(box).toHaveTextContent("British Columbia");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    await userEvent.click(box);
    expect(box).toHaveAttribute("aria-expanded", "true");
    const list = screen.getByRole("listbox", { name: "Where do you live?" });
    for (const framework of FRAMEWORKS) {
      expect(within(list).getByRole("option", { name: framework.name })).toBeInTheDocument();
    }
    expect(within(list).getByRole("option", { name: "British Columbia" })).toHaveAttribute("aria-selected", "true");

    await userEvent.click(within(list).getByRole("option", { name: "Alberta" }));
    expect(onChange).toHaveBeenCalledWith("ca-ab");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(box).toHaveFocus();
  });

  it("chooses a province with the arrow keys", async () => {
    const onChange = vi.fn();
    render(<ProvinceMenu value="ca-bc" onChange={onChange} />);
    menu().focus();
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{Enter}");
    expect(onChange).toHaveBeenCalledWith("ca-on");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("jumps to a province as its name is typed", async () => {
    const onChange = vi.fn();
    render(<ProvinceMenu value="ca-bc" onChange={onChange} />);
    menu().focus();
    await userEvent.keyboard("ont{Enter}");
    expect(onChange).toHaveBeenCalledWith("ca-on");
  });

  it("closes when Escape is pressed or the tap lands outside", async () => {
    const onChange = vi.fn();
    render(<ProvinceMenu value="ca-bc" onChange={onChange} />);
    const box = menu();
    await userEvent.click(box);
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(box).toHaveFocus();
    expect(onChange).not.toHaveBeenCalled();

    await userEvent.click(box);
    await userEvent.click(document.body);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });
});
