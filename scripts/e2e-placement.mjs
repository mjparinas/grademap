// Placement test: a child takes the maths and language tests, then the parent area shows the result.
//
//   npm run dev   # or npm run build && npm start
//   node scripts/e2e-placement.mjs http://localhost:3000 [e2e-shots/placement]
import fs from "node:fs";
import { chromium } from "playwright";
import { enterPin, newChild, step, vis } from "./helpers.mjs";

const BASE = process.argv[2] || "http://localhost:3000";
const OUT = process.argv[3];
if (OUT) fs.mkdirSync(OUT, { recursive: true });
const errors = [];

async function takeTest(page, subject) {
  await page.goto(`${BASE}/play/#/placement/${subject}`);
  await page.getByRole("button", { name: /Let's go/ }).click({ force: true });
  let questions = 0;
  for (let i = 0; i < 80; i++) {
    if (await vis(page.getByText(/All done/))) return questions;
    if (await vis(page.getByRole("button", { name: "I'm not sure" }))) {
      // Every question must be answerable and must give no right/wrong feedback bar.
      if (await vis(page.locator("[role=status]"))) errors.push(`${subject}: feedback bar showed during placement`);
      questions++;
      const r = await step(page);
      if (r === "wait") await page.getByRole("button", { name: "I'm not sure" }).click({ force: true });
    }
    await page.waitForTimeout(350);
  }
  errors.push(`${subject}: test never finished`);
  return questions;
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => m.type() === "error" && !/Failed to load resource|401/.test(m.text()) && errors.push(`console: ${m.text()}`));

  await page.goto(`${BASE}/play/`);
  await page.waitForTimeout(800);
  await page.getByRole("button", { name: /Let's go/ }).click({ force: true });
  await newChild(page, "Maya", "Grade 3");

  for (const subject of ["math", "language"]) {
    const n = await takeTest(page, subject);
    console.log(`${subject}: ${n} questions`);
    if (n < 4 || n > 16) errors.push(`${subject}: expected 4 to 16 questions, got ${n}`);
  }

  await page.goto(`${BASE}/parents/#/placement`);
  await page.waitForTimeout(700);
  // First visit creates the parent PIN.
  if (await vis(page.getByRole("heading", { name: "Create a parent PIN" }))) await enterPin(page, true);
  else if (await vis(page.getByRole("heading", { name: "Parents only" }))) await enterPin(page, false);
  await page.waitForTimeout(600);
  await page.screenshot({ path: OUT ? `${OUT}/placement.png` : "e2e-placement.png", fullPage: true });
  if (!(await vis(page.getByText(/Good places to start/).first()))) errors.push("parent page shows no result");
  if (await page.getByRole("link", { name: /Retake/ }).count() < 2) errors.push("parent page missing retake links");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  if (overflow) errors.push("parent placement page scrolls sideways");

  await browser.close();
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exit(1);
  }
  console.log("placement e2e passed");
})();
