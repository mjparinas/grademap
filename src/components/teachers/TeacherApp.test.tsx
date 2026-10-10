// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { APP_NAME } from "@/lib/brand";

const mocks = vi.hoisted(() => ({ call: vi.fn() }));

vi.mock("@/lib/classroom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/classroom")>();
  return { ...actual, call: mocks.call };
});
vi.mock("@/content", () => ({
  coursesForGrade: () => [{
    grade: "3",
    subject: "math",
    units: [{ id: "counting", emoji: "🔢", title: "Counting" }, { id: "patterns", emoji: "🟣", title: "Patterns" }],
  }],
  getUnitRef: (key: string) => key === "3/math/counting" ? { unit: { title: "Counting", emoji: "🔢" } } : undefined,
  loadGrade: vi.fn().mockResolvedValue(undefined),
}));

import { TeacherApp } from "./TeacherApp";

const cls = { id: "class-1", name: "Room 3", grade: "3", framework: "ca-bc", joinCode: "AB12CD", students: 1 };
const detail = {
  class: cls,
  assignments: ["3/math/counting"],
  due: {},
  students: [{
    profileId: "profile-1", name: "Maya", avatar: "otter", grade: "3", lastActive: null,
    units: [{ key: "3/math/counting", level: 0, attempts: 5, accuracy: 0.4 }],
  }],
  roster: [{ id: "roster-1", profileId: "profile-1", loginCode: "ZX91PQ" }],
};

beforeEach(() => {
  mocks.call.mockReset();
  mocks.call.mockImplementation((url: string, method = "GET") => {
    if (url === "/api/auth/me/") return Promise.resolve({ family: { account: { student: false } } });
    if (url === "/api/auth/login/" || url === "/api/auth/signup/" || url === "/api/auth/logout/") return Promise.resolve({});
    if (url === "/api/classes/" && method === "GET") return Promise.resolve({ classes: [cls] });
    if (url === "/api/classes/" && method === "POST") return Promise.resolve({ class: cls });
    if (url === "/api/classes/?id=class-1") return Promise.resolve(detail);
    return Promise.resolve({});
  });
});

afterEach(() => vi.restoreAllMocks());

describe("TeacherApp", () => {
  it("keeps student sessions out of teacher classes and offers the teacher sign-in flow", async () => {
    mocks.call.mockResolvedValueOnce({ family: { account: { student: true } } });
    const user = userEvent.setup();
    render(<TeacherApp />);

    expect(await screen.findByRole("heading", { name: "Teacher sign in" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Your classes" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "New here? Create an account" }));
    expect(screen.getByRole("heading", { name: "Create a teacher account" })).toBeInTheDocument();

    await user.type(screen.getByLabelText("Email"), "teacher@example.com");
    await user.type(screen.getByLabelText("Password"), "long-enough-password");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByRole("heading", { name: "Your classes" })).toBeInTheDocument();
    expect(mocks.call).toHaveBeenCalledWith("/api/auth/signup/", "POST", { email: "teacher@example.com", password: "long-enough-password" });
  });

  it("shows a useful sign-in error and lets the teacher try again", async () => {
    mocks.call.mockImplementation((url: string, method = "GET") => {
      if (url === "/api/auth/me/") return Promise.reject(new Error("Please sign in."));
      if (url === "/api/auth/login/" && method === "POST") return Promise.reject(new Error("Email or password is incorrect."));
      return Promise.resolve({});
    });
    const user = userEvent.setup();
    render(<TeacherApp />);
    await user.type(await screen.findByLabelText("Email"), "teacher@example.com");
    await user.type(screen.getByLabelText("Password"), "wrong-password");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Email or password is incorrect.");
    expect(screen.getByRole("button", { name: "Sign in" })).toBeEnabled();
    expect(screen.queryByRole("heading", { name: "Your classes" })).not.toBeInTheDocument();
  });

  it("shows a class-list loading error instead of silently displaying an empty roster", async () => {
    mocks.call.mockImplementation((url: string, method = "GET") => {
      if (url === "/api/auth/me/") return Promise.resolve({ family: { account: { student: false } } });
      if (url === "/api/classes/" && method === "GET") return Promise.reject(new Error("Could not load classes."));
      return Promise.resolve({});
    });
    render(<TeacherApp />);

    expect(await screen.findByRole("heading", { name: "Your classes" })).toBeInTheDocument();
    expect(await screen.findByRole("alert")).toHaveTextContent("Could not load classes.");
    expect(screen.queryByText("No classes yet.")).not.toBeInTheDocument();
  });

  it("lets a teacher sign out and return to the sign-in screen", async () => {
    const user = userEvent.setup();
    render(<TeacherApp />);
    expect(await screen.findByRole("heading", { name: "Your classes" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Sign out" }));

    expect(await screen.findByRole("heading", { name: "Teacher sign in" })).toBeInTheDocument();
    expect(mocks.call).toHaveBeenCalledWith("/api/auth/logout/", "POST");
  });

  it("creates a class with the selected grade and province, then opens it", async () => {
    const user = userEvent.setup();
    render(<TeacherApp />);
    await user.click(await screen.findByRole("button", { name: /Room 3/ }));
    expect(await screen.findByRole("heading", { name: "Room 3" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /All classes/ }));

    await user.type(await screen.findByLabelText("Class name"), "Ontario Room");
    await user.selectOptions(screen.getByLabelText("Grade"), "4");
    await user.selectOptions(screen.getByLabelText("Province"), "ca-on");
    await user.click(screen.getByRole("button", { name: "Create class" }));

    await waitFor(() => expect(mocks.call).toHaveBeenCalledWith("/api/classes/", "POST", {
      name: "Ontario Room", grade: "4", framework: "ca-on",
    }));
    expect(await screen.findByText("Students (1)")).toBeInTheDocument();
  });

  it("shows practice as practice, sends due dates and adds students by name", async () => {
    const user = userEvent.setup();
    render(<TeacherApp />);
    await user.click(await screen.findByRole("button", { name: /Room 3/ }));

    expect(await screen.findByText(`This reflects practice in ${APP_NAME}, not a report-card mark. You decide proficiency.`)).toBeInTheDocument();
    expect(screen.getAllByText("Maya")).toHaveLength(3);
    expect(screen.getByLabelText("Login code Z X 9 1 P Q")).toHaveTextContent("ZX91PQ");
    expect(screen.getByText(/Hasn’t started yet/)).toBeInTheDocument();

    const dueDate = screen.getByLabelText("Due date for Counting");
    fireEvent.change(dueDate, { target: { value: "2026-10-14" } });
    await waitFor(() => expect(mocks.call).toHaveBeenCalledWith("/api/classes/assignments/", "PATCH", expect.objectContaining({
      classId: "class-1", unitKey: "3/math/counting", dueAt: expect.any(Number),
    })));

    await user.type(screen.getByLabelText("First names, one per line"), "Sam, Alex P.");
    await user.click(screen.getByRole("button", { name: "Add students" }));
    await waitFor(() => expect(mocks.call).toHaveBeenCalledWith("/api/classes/students/", "POST", {
      classId: "class-1", names: ["Sam", "Alex P."],
    }));
  });

  it("lets a teacher rotate the class code and add or remove assigned units", async () => {
    const user = userEvent.setup();
    render(<TeacherApp />);
    await user.click(await screen.findByRole("button", { name: /Room 3/ }));

    await user.click(await screen.findByRole("button", { name: "Get a new code" }));
    expect(mocks.call).toHaveBeenCalledWith("/api/classes/?id=class-1", "PATCH", undefined);

    await user.selectOptions(screen.getByLabelText("Add a unit"), "3/math/patterns");
    await user.click(screen.getByRole("button", { name: "Assign" }));
    await waitFor(() => expect(mocks.call).toHaveBeenCalledWith("/api/classes/assignments/", "POST", {
      classId: "class-1", unitKey: "3/math/patterns", dueAt: undefined,
    }));

    await user.click(screen.getByRole("button", { name: "Remove Counting" }));
    expect(mocks.call).toHaveBeenCalledWith("/api/classes/assignments/?classId=class-1&unitKey=3%2Fmath%2Fcounting", "DELETE", undefined);
  });

  it("requires confirmation before deleting a student or closing a class", async () => {
    const user = userEvent.setup();
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(true);
    render(<TeacherApp />);
    await user.click(await screen.findByRole("button", { name: /Room 3/ }));

    await user.click(await screen.findByRole("button", { name: "Remove" }));
    expect(confirm).toHaveBeenCalledWith(expect.stringContaining("Remove Maya?"));
    await waitFor(() => expect(mocks.call).toHaveBeenCalledWith("/api/classes/students/?classId=class-1&studentId=roster-1", "DELETE", undefined));

    await user.click(screen.getByRole("button", { name: "Close class" }));
    expect(await screen.findByRole("button", { name: "Yes, close Room 3" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Yes, close Room 3" }));
    await waitFor(() => expect(mocks.call).toHaveBeenCalledWith("/api/classes/?id=class-1", "DELETE", undefined));
    expect(await screen.findByRole("heading", { name: "Your classes" })).toBeInTheDocument();
  });
});
