// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

// The gate only talks to three store members; fake them so no IndexedDB is needed.
const store = vi.hoisted(() => ({ pin: null as { hash: string; salt: string } | null, setPin: vi.fn(), checkPin: vi.fn() }));
vi.mock("@/lib/store", () => ({
  useStore: (select: (s: typeof store) => unknown) => select(store),
}));
vi.mock("../Critter", () => ({ Critter: () => null }));

import { Gate } from "./Gate";

const type = async (digits: string) => {
  for (const d of digits) await userEvent.click(screen.getByRole("button", { name: d }));
};
const ok = () => userEvent.click(screen.getByRole("button", { name: "OK" }));

beforeEach(() => {
  store.pin = null;
  store.setPin = vi.fn().mockResolvedValue(undefined);
  store.checkPin = vi.fn();
});

describe("parent Gate", () => {
  it("asks a new parent to create a PIN, then confirm it", async () => {
    const onPass = vi.fn();
    render(<Gate onPass={onPass} />);
    expect(screen.getByRole("heading", { name: "Create a parent PIN" })).toBeInTheDocument();
    await type("1234");
    await ok();
    expect(screen.getByRole("heading", { name: "Type it again to confirm" })).toBeInTheDocument();
    await type("1234");
    await ok();
    await waitFor(() => expect(onPass).toHaveBeenCalled());
    expect(store.setPin).toHaveBeenCalledWith("1234");
  });

  it("rejects a PIN shorter than 4 digits", async () => {
    render(<Gate onPass={vi.fn()} />);
    await type("12");
    await ok();
    expect(screen.getByText("Use at least 4 digits.")).toBeInTheDocument();
  });

  it("starts again when the confirmation doesn't match", async () => {
    const onPass = vi.fn();
    render(<Gate onPass={onPass} />);
    await type("1234");
    await ok();
    await type("4321");
    await ok();
    expect(screen.getByText("The PINs didn't match. Start again.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Create a parent PIN" })).toBeInTheDocument();
    expect(onPass).not.toHaveBeenCalled();
    expect(store.setPin).not.toHaveBeenCalled();
  });

  it("opens with the right PIN and refuses the wrong one", async () => {
    store.pin = { hash: "h", salt: "s" };
    store.checkPin.mockImplementation(async (p: string) => p === "2468");
    const onPass = vi.fn();
    render(<Gate onPass={onPass} />);
    expect(screen.getByRole("heading", { name: "Parents only" })).toBeInTheDocument();
    await type("1111");
    await ok();
    expect(await screen.findByText("Wrong PIN.")).toBeInTheDocument();
    expect(onPass).not.toHaveBeenCalled();
    await type("2468");
    await ok();
    await waitFor(() => expect(onPass).toHaveBeenCalled());
  });

  it("caps PIN length at 6 digits", async () => {
    store.pin = { hash: "h", salt: "s" };
    store.checkPin.mockResolvedValue(false);
    render(<Gate onPass={vi.fn()} />);
    await type("1234567");
    expect(screen.getByRole("img", { name: "6 digits entered" })).toBeInTheDocument();
  });

  it("lets a parent who forgot the PIN reset it by answering the multiplication", async () => {
    store.pin = { hash: "h", salt: "s" };
    render(<Gate onPass={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "Forgot PIN?" }));
    const [a, b] = screen.getByRole("heading").textContent!.match(/\d+/g)!.map(Number);
    await type(String(a * b));
    await ok();
    expect(screen.getByRole("heading", { name: "Create a parent PIN" })).toBeInTheDocument();
  });

  it("keeps a wrong multiplication answer out", async () => {
    store.pin = { hash: "h", salt: "s" };
    render(<Gate onPass={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "Forgot PIN?" }));
    await type("1");
    await ok();
    expect(screen.getByText("That's not right. Try again.")).toBeInTheDocument();
    expect(screen.getByRole("heading").textContent).toMatch(/What is/);
  });
});
