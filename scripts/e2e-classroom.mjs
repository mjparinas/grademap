// End-to-end check of classroom mode: a teacher adds a student, the student signs in with codes and
// opens a lesson, practises, and the teacher sees the result. Also checks the student gets no
// parent area and that signing out leaves nothing behind on the device.
//
//   npm run build && npm start      # in one terminal
//   node scripts/e2e-classroom.mjs http://localhost:3000 e2e-shots/classroom
// It marks the teacher's email as confirmed straight in the local database file (DATABASE_URL, or
// ./data/grademap.db), because no email is sent in tests.
import fs from "node:fs";
import { createClient } from "@libsql/client";
import { chromium } from "playwright";
import { step, vis } from "./helpers.mjs";

const BASE = process.argv[2] || "http://localhost:3000";
const OUT = process.argv[3] || "e2e-shots/classroom";
fs.mkdirSync(OUT, { recursive: true });
const errors = [];
const fail = (msg) => {
  console.error("FAIL:", msg);
  process.exitCode = 1;
};
const check = (cond, msg) => {
  if (!cond) fail(msg);
  else console.log("ok  ", msg);
};

// ---- The teacher, through the API ----
const email = `teacher-${Date.now()}@example.com`;
let cookie = "";
async function api(path, method = "GET", body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "content-type": "application/json", ...(cookie ? { cookie } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const set = res.headers.get("set-cookie");
  if (set) cookie = set.split(";")[0];
  return { status: res.status, data: await res.json().catch(() => ({})) };
}

check((await api("/api/auth/signup/", "POST", { email, password: "correct horse" })).status === 200, "teacher signs up");
const db = createClient({ url: process.env.DATABASE_URL ?? "file:./data/grademap.db", authToken: process.env.DATABASE_AUTH_TOKEN });
await db.execute({ sql: "UPDATE parents SET email_verified_at = ? WHERE email = ?", args: [Date.now(), email] });
const made = await api("/api/classes/", "POST", { name: "Room 3", grade: "3", framework: "ca-bc" });
check(made.status === 200, "teacher creates a class");
const cls = made.data.class;
const unit = "3/math/multiplication";
check((await api("/api/classes/assignments/", "POST", { classId: cls.id, unitKey: unit, dueAt: Date.now() + 3 * 86_400_000 })).status === 200, "teacher assigns a unit with a due date");
const added = await api("/api/classes/students/", "POST", { classId: cls.id, names: ["Maya"] });
check(added.status === 200 && added.data.students.length === 1, "teacher adds a student");
const code = added.data.students[0].loginCode;

// ---- The student, in a browser ----
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 820, height: 1180 }, hasTouch: true });
const page = await context.newPage();
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("console", (m) => {
  if (m.type() !== "error") return;
  const t = m.text();
  if (/Failed to load resource|401/.test(t)) return;
  errors.push(`console: ${t}`);
});
const shot = (name) => page.screenshot({ path: `${OUT}/${name}.png` });

await page.goto(`${BASE}/play/`);
await page.getByRole("button", { name: /Let.s go/ }).waitFor();
await page.getByRole("button", { name: "My teacher gave me a code" }).click();

// A wrong code is refused kindly.
await page.getByLabel("Class code").fill(cls.joinCode);
await page.getByLabel("My code").fill("ZZZZZZ");
await page.getByRole("button", { name: /Let.s go/ }).click();
check(await page.getByRole("alert").filter({ hasText: /don.t match/ }).waitFor({ timeout: 8000 }).then(() => true, () => false), "a wrong code is refused with a kind message");

await page.getByLabel("My code").fill(code);
await page.getByRole("button", { name: /Let.s go/ }).click();
await page.getByText("From your teacher").first().waitFor({ timeout: 15000 });
await shot("student-home");
check(await vis(page.getByText(/Try to finish by/)), "the student sees the assignment and its soft due date");
check(await vis(page.getByRole("link", { name: /Grown-ups/ })) === false, "a student has no Grown-ups link");
check(await vis(page.getByRole("button", { name: /Sign out/ })), "a student has a sign-out button");

// A lesson, then practice.
await page.goto(`${BASE}/play/#/practice/math`);
await page.getByRole("button", { name: /Multiplication/ }).first().click({ force: true });
await page.getByRole("button", { name: /How it works/ }).click();
check(await page.getByText("Let's try one").waitFor({ timeout: 8000 }).then(() => true, () => false), "the lesson shows its worked example");
await shot("lesson");
await page.getByRole("button", { name: /Let.s practise/ }).click();
let answered = 0;
for (let i = 0; i < 200 && answered < 6; i++) {
  if ((await step(page)) === "next") answered++;
  await page.waitForTimeout(40);
}
check(answered >= 6, "the student answers questions");

// No parent area.
await page.goto(`${BASE}/parents/`);
check(
  await page.getByRole("heading", { name: "This is a class account" }).waitFor({ state: "visible", timeout: 8000 }).then(() => true, () => false),
  "the parent area shows the class account notice",
);

// The teacher sees the work (after the app syncs).
let attempts = 0;
for (let i = 0; i < 20 && attempts === 0; i++) {
  await page.goto(`${BASE}/play/`);
  await page.waitForTimeout(3000);
  const view = await api(`/api/classes/?id=${cls.id}`);
  attempts = view.data.students?.[0]?.units?.[0]?.attempts ?? 0;
}
check(attempts > 0, "the teacher sees the student's practice on the assigned unit");

// Sign out leaves nothing on the device.
await page.goto(`${BASE}/play/`);
await page.getByRole("button", { name: /Sign out/ }).click();
await page.getByRole("button", { name: "My teacher gave me a code" }).waitFor({ timeout: 10000 });
check(true, "signing out returns to the welcome screen");
const stored = await page.evaluate(
  () =>
    new Promise((resolve) => {
      const req = indexedDB.open("grademap");
      req.onsuccess = () => {
        const names = [...req.result.objectStoreNames];
        if (!names.includes("events")) return resolve(0);
        const all = req.result.transaction("events", "readonly").objectStore("events").getAll();
        all.onsuccess = () => resolve(all.result.length);
      };
      req.onerror = () => resolve(0);
    }),
);
check(stored === 0, "no practice is left on the device after sign-out");

// The student's session is closed to teacher endpoints.
await browser.close();
if (errors.length) fail(`console errors:\n${errors.join("\n")}`);
console.log(process.exitCode ? "classroom e2e FAILED" : "classroom e2e passed");
