import { createPublicKey, createVerify, generateKeyPairSync } from "node:crypto";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";

const dir = mkdtempSync(join(tmpdir(), "grademap-features-"));
process.env.DATABASE_URL = `file:${join(dir, "test.db")}`;
process.env.CRON_SECRET = "cron-secret";
delete process.env.RESEND_API_KEY;
delete process.env.NEXT_PUBLIC_SITE_URL;

type Mod = Record<string, (req: Request) => Promise<Response>>;
let signup: Mod, verify: Mod, login: Mod, sync: Mod, share: Mod, prefs: Mod, unsub: Mod, cron: Mod, feedback: Mod, classes: Mod, students: Mod;
let dbm: typeof import("@/server/db");
let email: typeof import("@/server/email");
let reportData: typeof import("@/server/reportData");

beforeAll(async () => {
  [signup, verify, login, sync, share, prefs, unsub, cron, feedback, classes, students] = (await Promise.all([
    import("@/app/api/auth/signup/route"),
    import("@/app/api/auth/verify/route"),
    import("@/app/api/auth/login/route"),
    import("@/app/api/sync/route"),
    import("@/app/api/share/route"),
    import("@/app/api/account/prefs/route"),
    import("@/app/api/email/unsubscribe/route"),
    import("@/app/api/cron/weekly/route"),
    import("@/app/api/feedback/route"),
    import("@/app/api/classes/route"),
    import("@/app/api/classes/students/route"),
  ])) as unknown as Mod[];
  dbm = await import("@/server/db");
  email = await import("@/server/email");
  reportData = await import("@/server/reportData");
});
afterEach(() => vi.useRealTimers());
afterAll(() => rmSync(dir, { recursive: true, force: true }));

let ip = 0;
function req(path: string, method: string, body?: unknown, cookie?: string): Request {
  return new Request(`http://localhost${path}`, {
    method,
    headers: { "content-type": "application/json", "x-forwarded-for": `10.1.0.${++ip}`, ...(cookie ? { cookie } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
const tokenIn = (text: string) => decodeURIComponent(/token=([^\s&"]+)/.exec(text)![1]);

async function family(address: string, opts: { verified?: boolean; children?: number } = {}) {
  const res = await signup.POST(req("/api/auth/signup/", "POST", { email: address, password: "correct horse" }));
  const cookie = (res.headers.get("set-cookie") ?? "").split(";")[0];
  if (opts.verified !== false) {
    const mail = email.outbox().filter((m) => m.to === address).at(-1)!;
    await verify.POST(req("/api/auth/verify/", "POST", { token: tokenIn(mail.text) }));
  }
  const now = Date.now();
  const ids: string[] = [];
  const profiles = Array.from({ length: opts.children ?? 1 }, (_, i) => {
    const id = `${address.split("@")[0]}-kid${i}`;
    ids.push(id);
    return { id, name: i ? "Leo" : "Maya", grade: "2", framework: "bc", avatar: "ollie", colour: "#fff", createdAt: now, updatedAt: now };
  });
  const events = ids.flatMap((id) =>
    Array.from({ length: 10 }, (_, i) => ({
      id: `${id}-e${i}`,
      profileId: id,
      type: "answer",
      t: now - 3600_000 - i * 1000,
      unit: "2/math/tens-and-ones",
      correct: i % 4 !== 0,
      attempts: 1,
      revealed: false,
      ms: 8000,
      mode: "practice",
      difficulty: 1,
    })),
    // A broken upload (no unit) must not take reports down.
    ...ids.map((id) => ({ id: `${id}-bad`, profileId: id, type: "answer", t: now - 5000 })),
  );
  await sync.POST(req("/api/sync/", "POST", { profiles, events }, cookie));
  const familyId = (await dbm.query<{ family_id: string }>("SELECT family_id FROM parents WHERE email = ?", [address]))[0].family_id;
  return { cookie, ids, familyId };
}

describe("shared reports", () => {
  it("creates a link that shows the report, and stops working when revoked", async () => {
    const a = await family("share-a@example.com");
    const created = await share.POST(req("/api/share/", "POST", { profileId: a.ids[0], days: 14 }, a.cookie));
    expect(created.status).toBe(200);
    const { url } = await created.json();
    const token = /\/shared\/([^/]+)\//.exec(url)![1];

    const shared = await reportData.loadSharedReport(token);
    expect(shared?.profile.name).toBe("Maya");
    expect(shared?.days).toBe(14);
    expect(shared?.report.totals.answers).toBe(10);
    // Nothing about the account owner is exposed.
    expect(JSON.stringify(shared)).not.toContain("share-a@example.com");

    expect(await (await share.GET(req(`/api/share/?profileId=${a.ids[0]}`, "GET", undefined, a.cookie))).json()).toEqual({ active: 1 });
    await share.DELETE(req(`/api/share/?profileId=${a.ids[0]}`, "DELETE", undefined, a.cookie));
    expect(await reportData.loadSharedReport(token)).toBeNull();
  });

  it("expires links and refuses other families' children", async () => {
    const a = await family("share-b@example.com");
    const b = await family("share-c@example.com");
    expect((await share.POST(req("/api/share/", "POST", { profileId: a.ids[0], days: 7 }, b.cookie))).status).toBe(404);
    expect((await share.POST(req("/api/share/", "POST", { profileId: a.ids[0], days: 5 }, a.cookie))).status).toBe(400);
    expect((await share.POST(req("/api/share/", "POST", { profileId: a.ids[0], days: 7 }))).status).toBe(401);

    const { url } = await (await share.POST(req("/api/share/", "POST", { profileId: a.ids[0], days: 7 }, a.cookie))).json();
    const token = /\/shared\/([^/]+)\//.exec(url)![1];
    await dbm.run("UPDATE report_shares SET expires_at = ? WHERE family_id = ?", [Date.now() - 1, a.familyId]);
    expect(await reportData.loadSharedReport(token)).toBeNull();
    expect(await reportData.loadSharedReport("not-a-token")).toBeNull();
  });
});

describe("weekly email preference and unsubscribe", () => {
  it("needs a confirmed email, and one-click unsubscribe turns it off", async () => {
    const unconfirmed = await family("pref-a@example.com", { verified: false });
    expect((await prefs.POST(req("/api/account/prefs/", "POST", { weeklyReport: true }, unconfirmed.cookie))).status).toBe(403);

    const ok = await family("pref-b@example.com");
    expect(await (await prefs.POST(req("/api/account/prefs/", "POST", { weeklyReport: true }, ok.cookie))).json()).toEqual({ weeklyReport: true, practiceReminders: false });
    const { unsubscribeToken } = await import("@/server/auth");
    const parentId = (await dbm.query<{ id: string }>("SELECT id FROM parents WHERE email = ?", ["pref-b@example.com"]))[0].id;
    const token = await unsubscribeToken(parentId);
    expect(await unsubscribeToken(parentId)).toBe(token); // stable
    expect((await unsub.POST(req("/api/email/unsubscribe/?token=wrong", "POST"))).status).toBe(400);
    expect((await unsub.POST(req(`/api/email/unsubscribe/?token=${token}`, "POST"))).status).toBe(200);
    expect(await (await prefs.GET(req("/api/account/prefs/", "GET", undefined, ok.cookie))).json()).toEqual({ weeklyReport: false, practiceReminders: false });
  });
});

describe("daily email job", () => {
  const run = () => cron.GET(new Request("http://localhost/api/cron/weekly/", { headers: { authorization: "Bearer cron-secret" } }));

  it("refuses callers without the secret", async () => {
    expect((await cron.GET(new Request("http://localhost/api/cron/weekly/"))).status).toBe(401);
    expect((await cron.GET(new Request("http://localhost/api/cron/weekly/", { headers: { authorization: "Bearer nope" } }))).status).toBe(401);
  });

  it("sends the weekly report on Sundays only, once, to opted-in confirmed parents", async () => {
    const f = await family("weekly@example.com", { children: 2 });
    await prefs.POST(req("/api/account/prefs/", "POST", { weeklyReport: true }, f.cookie));

    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(Date.now() + ((3 - new Date().getUTCDay() + 7) % 7 || 7) * 86_400_000)); // a Wednesday... then check
    const notSunday = new Date().getUTCDay() !== 0;
    expect(notSunday).toBe(true);
    const before = email.outbox().length;
    expect((await (await run()).json()).weekly).toBe(0);
    expect(email.outbox().length).toBe(before);

    // Move to the next Sunday.
    const d = new Date();
    vi.setSystemTime(new Date(d.getTime() + ((7 - d.getUTCDay()) % 7) * 86_400_000));
    expect(new Date().getUTCDay()).toBe(0);
    const res = await (await run()).json();
    expect(res.weekly).toBeGreaterThanOrEqual(1);
    const mail = email.outbox().filter((m) => m.to === "weekly@example.com" && m.subject.includes("week")).at(-1)!;
    expect(mail.text).toContain("Maya");
    expect(mail.text).toContain("Leo");
    expect(mail.text).toContain("report-card mark");
    expect(mail.unsubscribeUrl).toContain("/api/email/unsubscribe/?token=");

    const count = email.outbox().length;
    await run();
    expect(email.outbox().length).toBe(count); // not twice in one week
  });

  it("sends a practice reminder only to opted-in parents, only after quiet days, at most once a week", async () => {
    const f = await family("nudge@example.com");
    await family("nudge-off@example.com");
    await prefs.POST(req("/api/account/prefs/", "POST", { practiceReminders: true }, f.cookie));
    const reminders = (to: string) => email.outbox().filter((m) => m.to === to && m.text.includes("last practised"));

    await run();
    expect(reminders("nudge@example.com").length).toBe(0); // practised today

    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(Date.now() + 4 * 86_400_000));
    expect((await (await run()).json()).reminders).toBeGreaterThanOrEqual(1);
    const mail = reminders("nudge@example.com").at(-1)!;
    expect(mail.text).toContain("Maya");
    expect(mail.text).not.toMatch(/accuracy|%/);
    expect(mail.unsubscribeUrl).toContain("kind=reminders");
    expect(reminders("nudge-off@example.com").length).toBe(0);

    const count = email.outbox().length;
    await run();
    expect(email.outbox().length).toBe(count); // not twice in one week

    // Unsubscribing from reminders leaves the weekly report as it was.
    await prefs.POST(req("/api/account/prefs/", "POST", { weeklyReport: true }, f.cookie));
    const { unsubscribeToken } = await import("@/server/auth");
    const parentId = (await dbm.query<{ id: string }>("SELECT id FROM parents WHERE email = ?", ["nudge@example.com"]))[0].id;
    expect((await unsub.POST(req(`/api/email/unsubscribe/?kind=reminders&token=${await unsubscribeToken(parentId)}`, "POST"))).status).toBe(200);
    expect(await (await prefs.GET(req("/api/account/prefs/", "GET", undefined, f.cookie))).json()).toEqual({ weeklyReport: true, practiceReminders: false });
  });

  it("warns once when a trial is about to end, for confirmed parents only", async () => {
    const soon = await family("trial-soon@example.com");
    const unconfirmed = await family("trial-unconfirmed@example.com", { verified: false });
    await dbm.run("UPDATE families SET trial_ends_at = ? WHERE id IN (?, ?)", [Date.now() + 2 * 86_400_000, soon.familyId, unconfirmed.familyId]);
    await run();
    const notices = email.outbox().filter((m) => m.subject.includes("free trial ends"));
    expect(notices.map((m) => m.to)).toContain("trial-soon@example.com");
    expect(notices.map((m) => m.to)).not.toContain("trial-unconfirmed@example.com");
    const n = notices.length;
    await run();
    expect(email.outbox().filter((m) => m.subject.includes("free trial ends")).length).toBe(n);
  });

  it("warns after 11 months and deletes an inactive class after 12 months", async () => {
    const teacher = await family("inactive-class@example.com");
    const { class: cls } = await (await classes.POST(req("/api/classes/", "POST", { name: "Room 7", grade: "2" }, teacher.cookie))).json();
    const { students: made } = await (await students.POST(req("/api/classes/students/", "POST", { classId: cls.id, names: ["Riley"] }, teacher.cookie))).json();
    const student = (await dbm.query<{ family_id: string; profile_id: string }>("SELECT family_id, profile_id FROM students WHERE class_id = ?", [cls.id]))[0];
    await dbm.run("INSERT INTO events (id, family_id, profile_id, t, data) VALUES (?, ?, ?, ?, ?)", ["inactive-student-event", student.family_id, student.profile_id, Date.now(), JSON.stringify({ type: "answer" })]);
    await dbm.run("INSERT INTO class_assignments (class_id, unit_key, created_at) VALUES (?, ?, ?)", [cls.id, "2/math/tens-and-ones", Date.now()]);
    await dbm.run("INSERT INTO class_members (class_id, profile_id, family_id, joined_at) VALUES (?, ?, ?, ?)", [cls.id, teacher.ids[0], teacher.familyId, Date.now()]);

    const year = 365.25 * 86_400_000;
    const now = Date.now() + 2 * year;
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(now);
    await dbm.run("UPDATE classes SET last_activity_at = ?, inactive_warning_at = NULL WHERE id = ?", [now - (11 / 12) * year, cls.id]);

    const firstRun = await (await run()).json();
    expect(firstRun.inactiveClassWarnings).toBe(1);
    expect(firstRun.inactiveClassesDeleted).toBe(0);
    const warning = email.outbox().filter((m) => m.to === "inactive-class@example.com" && m.subject.includes("deleted in 1 month")).at(-1)!;
    expect(warning.text).toContain("Room 7");
    expect(warning.text).toContain("sign in to your teacher account");
    expect((await (await run()).json()).inactiveClassWarnings).toBe(0);
    expect(email.outbox().filter((m) => m.to === "inactive-class@example.com" && m.subject.includes("deleted in 1 month"))).toHaveLength(1);

    vi.setSystemTime(now + 31 * 86_400_000);
    const expired = await (await run()).json();
    expect(expired.inactiveClassesDeleted).toBe(1);
    expect(expired.studentsDeleted).toBe(1);
    expect(await dbm.query("SELECT id FROM classes WHERE id = ?", [cls.id])).toHaveLength(0);
    expect(await dbm.query("SELECT unit_key FROM class_assignments WHERE class_id = ?", [cls.id])).toHaveLength(0);
    expect(await dbm.query("SELECT id FROM students WHERE class_id = ?", [cls.id])).toHaveLength(0);
    expect(await dbm.query("SELECT id FROM profiles WHERE id = ?", [student.profile_id])).toHaveLength(0);
    expect(await dbm.query("SELECT id FROM events WHERE id = ?", ["inactive-student-event"])).toHaveLength(0);
    expect(await dbm.query("SELECT profile_id FROM class_members WHERE class_id = ?", [cls.id])).toHaveLength(0);
    // A parent-linked child's own family account and data are retained.
    expect(await dbm.query("SELECT id FROM profiles WHERE id = ?", [teacher.ids[0]])).toHaveLength(1);
    expect(await dbm.query("SELECT id FROM events WHERE profile_id = ?", [teacher.ids[0]])).toHaveLength(10);
    expect(made).toHaveLength(1);
  });

  it("resets the inactivity clock and cancels a warning when the teacher signs in", async () => {
    const teacher = await family("inactive-signin@example.com");
    const { class: cls } = await (await classes.POST(req("/api/classes/", "POST", { name: "Room 9", grade: "2" }, teacher.cookie))).json();
    const now = Date.now();
    await dbm.run("UPDATE classes SET last_activity_at = ?, inactive_warning_at = ? WHERE id = ?", [now - 400 * 86_400_000, now - 1, cls.id]);

    expect((await login.POST(req("/api/auth/login/", "POST", { email: "inactive-signin@example.com", password: "correct horse" }))).status).toBe(200);
    const row = (await dbm.query<{ last_activity_at: number; inactive_warning_at: number | null }>("SELECT last_activity_at, inactive_warning_at FROM classes WHERE id = ?", [cls.id]))[0];
    expect(Math.abs(row.last_activity_at - Date.now())).toBeLessThan(1000);
    expect(row.inactive_warning_at).toBeNull();
  });
});

describe("report a problem", () => {
  const body = { unitKey: "2/math/tens-and-ones", prompt: "What is 3 tens and 4 ones?", reason: "wrong-answer" };

  it("stores a report with a fixed reason and emails the team", async () => {
    const before = email.outbox().length;
    expect((await feedback.POST(req("/api/feedback/", "POST", body))).status).toBe(200);
    const rows = await dbm.query<{ reason: string; family_id: string | null }>("SELECT reason, family_id FROM question_reports");
    expect(rows.at(-1)).toMatchObject({ reason: "wrong-answer", family_id: null });
    expect(email.outbox().length).toBe(before + 1);
  });

  it("rejects free-text reasons, odd unit keys and floods", async () => {
    expect((await feedback.POST(req("/api/feedback/", "POST", { ...body, reason: "my free text" }))).status).toBe(400);
    expect((await feedback.POST(req("/api/feedback/", "POST", { ...body, unitKey: "../../etc/passwd" }))).status).toBe(400);
    const r = new Request("http://localhost/api/feedback/", { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": "9.9.9.9" }, body: JSON.stringify(body) });
    let last = 200;
    for (let i = 0; i < 22; i++) last = (await feedback.POST(r.clone())).status;
    expect(last).toBe(429);
  });
});

describe("weekly report notifications", () => {
  const pair = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
  const jwk = pair.privateKey.export({ format: "jwk" }) as { x: string; y: string; d: string };
  const publicKey = Buffer.concat([Buffer.from([4]), Buffer.from(jwk.x, "base64url"), Buffer.from(jwk.y, "base64url")]).toString("base64url");
  const endpoint = "https://fcm.googleapis.com/fcm/send/abc123";
  const call = async (method: string, body?: unknown, cookie?: string, path = "/api/push/") => {
    const m = (await import("@/app/api/push/route")) as Record<string, (r: Request) => Promise<Response>>;
    return m[method](req(path, method, body, cookie));
  };
  const cronRun = () => cron.GET(new Request("http://localhost/api/cron/weekly/", { headers: { authorization: "Bearer cron-secret" } }));
  afterEach(() => {
    delete process.env.VAPID_PUBLIC_KEY;
    delete process.env.VAPID_PRIVATE_KEY;
    vi.unstubAllGlobals();
  });

  it("signs a VAPID token a push service can verify, and only accepts real push services", async () => {
    process.env.VAPID_PUBLIC_KEY = publicKey;
    process.env.VAPID_PRIVATE_KEY = jwk.d;
    const push = await import("@/server/push");
    const header = push.vapidAuthorization(endpoint);
    const [, jwt] = /t=([^,]+), k=(.+)$/.exec(header)!;
    const [h, c, sig] = jwt.split(".");
    expect(JSON.parse(Buffer.from(c, "base64url").toString()).aud).toBe("https://fcm.googleapis.com");
    const ok = createVerify("SHA256").update(`${h}.${c}`).verify({ key: createPublicKey({ key: { kty: "EC", crv: "P-256", x: jwk.x, y: jwk.y }, format: "jwk" }), dsaEncoding: "ieee-p1363" }, Buffer.from(sig, "base64url"));
    expect(ok).toBe(true);
    for (const good of [endpoint, "https://updates.push.services.mozilla.com/wpush/v2/x", "https://web.push.apple.com/x", "https://wns2-par02p.notify.windows.com/w/?token=x"]) expect(push.validEndpoint(good)).toBe(true);
    for (const bad of ["http://fcm.googleapis.com/x", "https://evil.example.com/x", "https://fcm.googleapis.com.evil.com/x", "https://localhost/x", "https://169.254.169.254/x", "https://user@fcm.googleapis.com/x", "https://fcm.googleapis.com:8443/x", 42]) expect(push.validEndpoint(bad)).toBe(false);
  });

  it("stores a browser for a signed-in parent, and says whether it is on", async () => {
    const f = await family("push-a@example.com");
    expect((await call("GET", undefined, f.cookie)).status).toBe(200);
    expect((await (await call("GET", undefined, f.cookie)).json()).configured).toBe(false);
    expect((await call("POST", { endpoint }, f.cookie)).status).toBe(503); // not set up

    process.env.VAPID_PUBLIC_KEY = publicKey;
    process.env.VAPID_PRIVATE_KEY = jwk.d;
    expect((await call("POST", { endpoint }, undefined)).status).toBe(401);
    expect((await call("POST", { endpoint: "https://evil.example.com/x" }, f.cookie)).status).toBe(400);
    expect((await call("POST", { endpoint }, f.cookie)).status).toBe(200);
    const state = await (await call("GET", undefined, f.cookie, `/api/push/?endpoint=${encodeURIComponent(endpoint)}`)).json();
    expect(state).toEqual({ configured: true, publicKey, subscribed: true });
    expect((await call("DELETE", { endpoint }, f.cookie)).status).toBe(200);
    expect((await (await call("GET", undefined, f.cookie, `/api/push/?endpoint=${encodeURIComponent(endpoint)}`)).json()).subscribed).toBe(false);
  });

  it("pushes on Sundays only, once, with no body, and forgets browsers that are gone", async () => {
    process.env.VAPID_PUBLIC_KEY = publicKey;
    process.env.VAPID_PRIVATE_KEY = jwk.d;
    const f = await family("push-b@example.com");
    const gone = "https://fcm.googleapis.com/fcm/send/gone";
    await call("POST", { endpoint: "https://fcm.googleapis.com/fcm/send/live" }, f.cookie);
    await call("POST", { endpoint: gone }, f.cookie);
    const sent: { url: string; init: RequestInit }[] = [];
    vi.stubGlobal("fetch", async (url: string, init: RequestInit) => {
      sent.push({ url, init });
      return new Response(null, { status: url === gone ? 410 : 201 });
    });

    vi.useFakeTimers({ toFake: ["Date"] });
    const d = new Date();
    d.setUTCDate(d.getUTCDate() + ((3 - d.getUTCDay() + 7) % 7 || 7)); // a Wednesday
    vi.setSystemTime(d);
    await cronRun();
    expect(sent.length).toBe(0);

    d.setUTCDate(d.getUTCDate() + 4); // the Sunday
    vi.setSystemTime(d);
    expect(new Date().getUTCDay()).toBe(0);
    expect((await (await cronRun()).json()).pushes).toBeGreaterThanOrEqual(1);
    expect(sent.map((s) => s.url).sort()).toEqual(["https://fcm.googleapis.com/fcm/send/gone", "https://fcm.googleapis.com/fcm/send/live"]);
    expect((sent[0].init.headers as Record<string, string>).authorization).toMatch(/^vapid t=.+, k=/);
    expect(sent[0].init.body).toBeUndefined();
    expect((await dbm.query("SELECT endpoint FROM push_subscriptions WHERE parent_id = (SELECT id FROM parents WHERE email = ?)", ["push-b@example.com"])).map((r) => r.endpoint)).toEqual(["https://fcm.googleapis.com/fcm/send/live"]);

    const n = sent.length;
    await cronRun();
    expect(sent.length).toBe(n); // not twice in one week
  });
});
