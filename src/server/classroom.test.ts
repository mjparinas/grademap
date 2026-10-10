import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

// Classroom mode against the real route handlers and a throwaway SQLite file.

const dir = mkdtempSync(join(tmpdir(), "grademap-class-"));
process.env.DATABASE_URL = `file:${join(dir, "test.db")}`;
delete process.env.RESEND_API_KEY;

type Mod = Record<string, (req: Request) => Promise<Response>>;
let signup: Mod, sync: Mod, classes: Mod, assignments: Mod, join_: Mod, account: Mod;
let dbm: typeof import("@/server/db");

beforeAll(async () => {
  [signup, sync, classes, assignments, join_, account] = (await Promise.all([
    import("@/app/api/auth/signup/route"),
    import("@/app/api/sync/route"),
    import("@/app/api/classes/route"),
    import("@/app/api/classes/assignments/route"),
    import("@/app/api/classes/join/route"),
    import("@/app/api/account/route"),
  ])) as unknown as Mod[];
  dbm = await import("@/server/db");
});
afterAll(() => rmSync(dir, { recursive: true, force: true }));

let ip = 0;
const req = (path: string, method: string, body?: unknown, cookie?: string) =>
  new Request(`http://localhost${path}`, {
    method,
    headers: { "content-type": "application/json", "x-forwarded-for": `10.1.0.${++ip}`, ...(cookie ? { cookie } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

async function account_(email: string, confirmed = true) {
  const res = await signup.POST(req("/api/auth/signup/", "POST", { email, password: "correct horse" }));
  if (confirmed) await dbm.run("UPDATE parents SET email_verified_at = ? WHERE email = ?", [Date.now(), email]);
  return (res.headers.get("set-cookie") ?? "").split(";")[0];
}

async function parentWithChild(email: string, profileId: string, grade = "2") {
  const cookie = await account_(email);
  const now = Date.now();
  const events = Array.from({ length: 10 }, (_, i) => ({
    id: `${profileId}-e${i}`,
    profileId,
    type: "answer",
    t: now - 3600_000 - i * 1000,
    unit: `${grade}/math/tens-and-ones`,
    correct: i % 4 !== 0,
    attempts: 1,
    revealed: false,
    ms: 8000,
    mode: "practice",
    difficulty: 1,
  }));
  await sync.POST(req("/api/sync/", "POST", { profiles: [{ id: profileId, name: "Maya", grade, avatar: "ollie", colour: "#fff", updatedAt: now }], events }, cookie));
  return cookie;
}

describe("classroom mode", () => {
  it("keeps a class to its own province's units and children", async () => {
    const teacher = await account_("on-teacher@example.com");
    const post = (body: unknown) => classes.POST(req("/api/classes/", "POST", body, teacher));
    expect((await post({ name: "Room 3", grade: "2", framework: "nowhere" })).status).toBe(400);
    const { class: cls } = await (await post({ name: "Room 3", grade: "2", framework: "ca-on" })).json();
    expect(cls.framework).toBe("ca-on");
    const assign = (unitKey: string) => assignments.POST(req("/api/classes/assignments/", "POST", { classId: cls.id, unitKey }, teacher));
    expect((await assign("2/math/numbers-to-200")).status).toBe(200);
    expect((await assign("2/math/tens-and-ones")).status).toBe(400);
    // A child set up for British Columbia can't be linked to an Ontario class.
    const parent = await parentWithChild("on-parent@example.com", "kid-bc");
    expect((await join_.POST(req("/api/classes/join/", "POST", { code: cls.joinCode, profileId: "kid-bc" }, parent))).status).toBe(409);
  });

  it("lets a teacher see a linked child's results on assigned units only, and nothing else", async () => {
    const teacher = await account_("teacher@example.com");
    const created = await (await classes.POST(req("/api/classes/", "POST", { name: "Room 12", grade: "2" }, teacher))).json();
    const { id, joinCode } = created.class;
    expect(joinCode).toMatch(/^[A-HJKMNP-Z2-9]{6}$/);

    const bad = await assignments.POST(req("/api/classes/assignments/", "POST", { classId: id, unitKey: "3/math/whatever" }, teacher));
    expect(bad.status).toBe(400);

    const unitKey = "2/math/tens-and-ones";
    expect((await assignments.POST(req("/api/classes/assignments/", "POST", { classId: id, unitKey }, teacher))).status).toBe(200);

    const parent = await parentWithChild("parent@example.com", "kid1");
    // Nothing is shared until the parent joins.
    const before = await (await classes.GET(req(`/api/classes/?id=${id}`, "GET", undefined, teacher))).json();
    expect(before.students).toHaveLength(0);

    expect((await join_.POST(req("/api/classes/join/", "POST", { code: "ZZZZZZ", profileId: "kid1" }, parent))).status).toBe(404);
    expect((await join_.POST(req("/api/classes/join/", "POST", { code: joinCode.toLowerCase(), profileId: "kid1" }, parent))).status).toBe(200);

    const detail = await (await classes.GET(req(`/api/classes/?id=${id}`, "GET", undefined, teacher))).json();
    expect(detail.students).toHaveLength(1);
    const s = detail.students[0];
    expect(Object.keys(s).sort()).toEqual(["avatar", "grade", "lastActive", "name", "profileId", "units"]);
    expect(s.units).toHaveLength(1);
    expect(s.units[0].attempts).toBe(10);
    expect(s.units[0].level).toBeGreaterThanOrEqual(0);

    // The child's devices get the assigned units with their next sync, and only the family's own.
    const down = await (await sync.POST(req("/api/sync/", "POST", {}, parent))).json();
    expect(down.classwork).toEqual([{ profileId: "kid1", classId: id, className: "Room 12", unitKeys: [unitKey], due: {} }]);
    const stranger = await account_("stranger@example.com");
    expect((await (await sync.POST(req("/api/sync/", "POST", {}, stranger))).json()).classwork).toEqual([]);

    // The parent can leave; the teacher stops seeing the child.
    expect((await join_.DELETE(req(`/api/classes/join/?classId=${id}&profileId=kid1`, "DELETE", undefined, parent))).status).toBe(200);
    const after = await (await classes.GET(req(`/api/classes/?id=${id}`, "GET", undefined, teacher))).json();
    expect(after.students).toHaveLength(0);
    expect((await (await sync.POST(req("/api/sync/", "POST", {}, parent))).json()).classwork).toEqual([]);
  });

  it("needs a confirmed email to create a class, and can replace the join code", async () => {
    const unconfirmed = await account_("t-unconfirmed@example.com", false);
    expect((await classes.POST(req("/api/classes/", "POST", { name: "Nope", grade: "2" }, unconfirmed))).status).toBe(403);
    const teacher = await account_("t-rotate@example.com");
    const { class: c } = await (await classes.POST(req("/api/classes/", "POST", { name: "Codes", grade: "2" }, teacher))).json();
    const parent = await parentWithChild("p-rotate@example.com", "kid-rotate");
    const { joinCode } = await (await classes.PATCH(req(`/api/classes/?id=${c.id}`, "PATCH", undefined, teacher))).json();
    expect(joinCode).not.toBe(c.joinCode);
    expect((await join_.POST(req("/api/classes/join/", "POST", { code: c.joinCode, profileId: "kid-rotate" }, parent))).status).toBe(404);
    expect((await join_.POST(req("/api/classes/join/", "POST", { code: joinCode, profileId: "kid-rotate" }, parent))).status).toBe(200);
    expect((await classes.PATCH(req(`/api/classes/?id=${c.id}`, "PATCH", undefined, parent))).status).toBe(404);
  });

  it("keeps classes private to their owner and rejects the wrong grade", async () => {
    const teacher = await account_("t2@example.com");
    const other = await account_("t3@example.com");
    const { class: c } = await (await classes.POST(req("/api/classes/", "POST", { name: "Mine", grade: "3" }, teacher))).json();
    expect((await classes.GET(req(`/api/classes/?id=${c.id}`, "GET", undefined, other))).status).toBe(404);
    expect((await classes.DELETE(req(`/api/classes/?id=${c.id}`, "DELETE", undefined, other))).status).toBe(404);
    expect((await classes.GET(req(`/api/classes/?id=${c.id}`, "GET"))).status).toBe(401);

    const parent = await parentWithChild("p2@example.com", "kid2", "2");
    expect((await join_.POST(req("/api/classes/join/", "POST", { code: c.joinCode, profileId: "kid2" }, parent))).status).toBe(409);
  });

  it("removes links when a class is closed or an account is deleted", async () => {
    const teacher = await account_("t4@example.com");
    const { class: c } = await (await classes.POST(req("/api/classes/", "POST", { name: "Gone", grade: "2" }, teacher))).json();
    const parent = await parentWithChild("p3@example.com", "kid3");
    await join_.POST(req("/api/classes/join/", "POST", { code: c.joinCode, profileId: "kid3" }, parent));

    // Deleting the parent's account unlinks the child.
    await account.DELETE(req("/api/account/", "DELETE", { password: "correct horse" }, parent));
    const detail = await (await classes.GET(req(`/api/classes/?id=${c.id}`, "GET", undefined, teacher))).json();
    expect(detail.students).toHaveLength(0);

    // Closing the class frees it and its code stops working.
    expect((await classes.DELETE(req(`/api/classes/?id=${c.id}`, "DELETE", undefined, teacher))).status).toBe(200);
    const parent2 = await parentWithChild("p4@example.com", "kid4");
    expect((await join_.POST(req("/api/classes/join/", "POST", { code: c.joinCode, profileId: "kid4" }, parent2))).status).toBe(404);
  });
});
