import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

// Teacher-made student accounts against the real route handlers and a throwaway SQLite file.

const dir = mkdtempSync(join(tmpdir(), "grademap-students-"));
process.env.DATABASE_URL = `file:${join(dir, "test.db")}`;
delete process.env.RESEND_API_KEY;

type Mod = Record<string, (req: Request) => Promise<Response>>;
let signup: Mod, sync: Mod, classes: Mod, assignments: Mod, studentRoutes: Mod, studentLogin: Mod, me: Mod, share: Mod, account: Mod;
let dbm: typeof import("@/server/db");

beforeAll(async () => {
  [signup, sync, classes, assignments, studentRoutes, studentLogin, me, share, account] = (await Promise.all([
    import("@/app/api/auth/signup/route"),
    import("@/app/api/sync/route"),
    import("@/app/api/classes/route"),
    import("@/app/api/classes/assignments/route"),
    import("@/app/api/classes/students/route"),
    import("@/app/api/students/login/route"),
    import("@/app/api/auth/me/route"),
    import("@/app/api/share/route"),
    import("@/app/api/account/route"),
  ])) as unknown as Mod[];
  dbm = await import("@/server/db");
});
afterAll(() => rmSync(dir, { recursive: true, force: true }));

let ip = 0;
const req = (path: string, method: string, body?: unknown, cookie?: string) =>
  new Request(`http://localhost${path}`, {
    method,
    headers: { "content-type": "application/json", "x-forwarded-for": `10.2.0.${++ip}`, ...(cookie ? { cookie } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

async function teacher(email: string, confirmed = true) {
  const res = await signup.POST(req("/api/auth/signup/", "POST", { email, password: "correct horse" }));
  if (confirmed) await dbm.run("UPDATE parents SET email_verified_at = ? WHERE email = ?", [Date.now(), email]);
  return (res.headers.get("set-cookie") ?? "").split(";")[0];
}

async function classWith(cookie: string, framework = "ca-bc") {
  const { class: cls } = await (await classes.POST(req("/api/classes/", "POST", { name: "Room 4", grade: "3", framework }, cookie))).json();
  return cls as { id: string; joinCode: string };
}

describe("teacher-made student accounts", () => {
  it("lets a teacher add students who sign in with codes and play, but nothing else", async () => {
    const t = await teacher("st-teacher@example.com");
    const cls = await classWith(t);
    const added = await (await studentRoutes.POST(req("/api/classes/students/", "POST", { classId: cls.id, names: ["Maya", " Sam <b>", ""] }, t))).json();
    expect(added.students.map((s: { name: string }) => s.name)).toEqual(["Maya", "Sam b"]);
    const [maya] = added.students as { loginCode: string; profileId: string }[];
    expect(maya.loginCode).toMatch(/^[A-Z2-9]{6}$/);

    // Wrong codes fail; the right pair signs in.
    expect((await studentLogin.POST(req("/api/students/login/", "POST", { classCode: cls.joinCode, studentCode: "ZZZZZZ" }))).status).toBe(401);
    const login = await studentLogin.POST(req("/api/students/login/", "POST", { classCode: cls.joinCode, studentCode: maya.loginCode }));
    expect(login.status).toBe(200);
    const cookie = (login.headers.get("set-cookie") ?? "").split(";")[0];
    const { family } = await login.json();
    expect(family.account.student).toBe(true);
    expect(family.plan).toBe("premium");

    // Sync works and hands the child the profile the teacher made.
    const synced = await (await sync.POST(req("/api/sync/", "POST", {}, cookie))).json();
    expect(synced.profiles).toHaveLength(1);
    expect(synced.profiles[0]).toMatchObject({ name: "Maya", grade: "3", framework: "ca-bc" });

    // A class account can't rename itself, add a child or delete anyone.
    const now = Date.now() + 1000;
    await sync.POST(req("/api/sync/", "POST", { profiles: [{ ...synced.profiles[0], name: "Hacker", grade: "9", deleted: true, updatedAt: now }, { id: "extra", name: "Extra", grade: "3", avatar: "ollie", colour: "#fff", updatedAt: now }] }, cookie));
    const after = await (await sync.POST(req("/api/sync/", "POST", {}, cookie))).json();
    expect(after.profiles).toHaveLength(1);
    expect(after.profiles[0]).toMatchObject({ name: "Maya", grade: "3" });
    expect(after.profiles[0].deleted).toBeFalsy();

    // It is not a parent or teacher account: classes, sharing and account deletion are all closed to it.
    expect((await classes.GET(req("/api/classes/", "GET", undefined, cookie))).status).toBe(401);
    expect((await share.GET(req("/api/share/", "GET", undefined, cookie))).status).toBe(401);
    expect((await account.DELETE(req("/api/account/", "DELETE", { password: "x" }, cookie))).status).toBe(401);
    const who = await (await me.GET(req("/api/auth/me/", "GET", undefined, cookie))).json();
    expect(who.family.account.student).toBe(true);
  });

  it("shows the teacher the students' progress and removes everything on request", async () => {
    const t = await teacher("st-teacher2@example.com");
    const cls = await classWith(t);
    const { students } = await (await studentRoutes.POST(req("/api/classes/students/", "POST", { classId: cls.id, names: ["Ana"] }, t))).json();
    const ana = students[0] as { id: string; loginCode: string; profileId: string };
    await assignments.POST(req("/api/classes/assignments/", "POST", { classId: cls.id, unitKey: "3/math/fractions", dueAt: Date.now() + 5 * 86_400_000 }, t));
    const view = await (await classes.GET(req(`/api/classes/?id=${cls.id}`, "GET", undefined, t))).json();
    expect(view.students.map((s: { name: string }) => s.name)).toEqual(["Ana"]);
    expect(view.roster[0].loginCode).toBe(ana.loginCode);
    expect(Object.keys(view.due)).toEqual(["3/math/fractions"]);

    // The student sees the unit and its due date through sync.
    const login = await studentLogin.POST(req("/api/students/login/", "POST", { classCode: cls.joinCode, studentCode: ana.loginCode }));
    const cookie = (login.headers.get("set-cookie") ?? "").split(";")[0];
    const synced = await (await sync.POST(req("/api/sync/", "POST", {}, cookie))).json();
    expect(synced.classwork[0].unitKeys).toEqual(["3/math/fractions"]);
    expect(Object.keys(synced.classwork[0].due)).toEqual(["3/math/fractions"]);

    // A new code signs the old one out.
    const renewed = await (await studentRoutes.PATCH(req(`/api/classes/students/?classId=${cls.id}&studentId=${ana.id}`, "PATCH", undefined, t))).json();
    expect(renewed.loginCode).not.toBe(ana.loginCode);
    expect((await sync.POST(req("/api/sync/", "POST", {}, cookie))).status).toBe(401);
    expect((await studentLogin.POST(req("/api/students/login/", "POST", { classCode: cls.joinCode, studentCode: ana.loginCode }))).status).toBe(401);

    // Removing the student deletes their records.
    expect((await studentRoutes.DELETE(req(`/api/classes/students/?classId=${cls.id}&studentId=${ana.id}`, "DELETE", undefined, t))).status).toBe(200);
    expect(await dbm.query("SELECT 1 FROM students WHERE id = ?", [ana.id])).toHaveLength(0);
    expect(await dbm.query("SELECT 1 FROM profiles WHERE id = ?", [ana.profileId])).toHaveLength(0);
    expect(await dbm.query("SELECT 1 FROM class_members WHERE profile_id = ?", [ana.profileId])).toHaveLength(0);
    expect(await dbm.query("SELECT 1 FROM parents WHERE email = ?", [`student-${ana.id}@students.invalid`])).toHaveLength(0);
  });

  it("keeps students to their own teacher, and deletes them when the class closes or the teacher leaves", async () => {
    const t = await teacher("st-teacher3@example.com");
    const other = await teacher("st-other@example.com");
    const cls = await classWith(t);
    const { students } = await (await studentRoutes.POST(req("/api/classes/students/", "POST", { classId: cls.id, names: ["Lee"] }, t))).json();
    const lee = students[0] as { id: string };
    // Another teacher can't add to, change or remove them.
    expect((await studentRoutes.POST(req("/api/classes/students/", "POST", { classId: cls.id, names: ["Intruder"] }, other))).status).toBe(404);
    expect((await studentRoutes.DELETE(req(`/api/classes/students/?classId=${cls.id}&studentId=${lee.id}`, "DELETE", undefined, other))).status).toBe(404);
    // Closing the class deletes the students.
    expect((await classes.DELETE(req(`/api/classes/?id=${cls.id}`, "DELETE", undefined, t))).status).toBe(200);
    expect(await dbm.query("SELECT 1 FROM students WHERE class_id = ?", [cls.id])).toHaveLength(0);
    expect(await dbm.query("SELECT 1 FROM parents WHERE role = 'student' AND email = ?", [`student-${lee.id}@students.invalid`])).toHaveLength(0);

    // Deleting a teacher account deletes the students in every class they had.
    const cls3 = await classWith(t);
    const made = await (await studentRoutes.POST(req("/api/classes/students/", "POST", { classId: cls3.id, names: ["Noor"] }, t))).json();
    expect(made.students).toHaveLength(1);
    expect((await account.DELETE(req("/api/account/", "DELETE", { password: "correct horse" }, t))).status).toBe(200);
    expect(await dbm.query("SELECT 1 FROM students WHERE class_id = ?", [cls3.id])).toHaveLength(0);
    expect(await dbm.query("SELECT 1 FROM profiles WHERE id = ?", [made.students[0].profileId])).toHaveLength(0);
  });

  it("limits guessing at the login", async () => {
    const t = await teacher("st-teacher4@example.com");
    const cls = await classWith(t);
    await studentRoutes.POST(req("/api/classes/students/", "POST", { classId: cls.id, names: ["Zed"] }, t));
    const attempt = () =>
      studentLogin.POST(new Request("http://localhost/api/students/login/", { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": "10.9.9.9" }, body: JSON.stringify({ classCode: cls.joinCode, studentCode: "AAAAAA" }) }));
    let last = 0;
    for (let i = 0; i < 20; i++) last = (await attempt()).status;
    expect(last).toBe(429);
  });
});
