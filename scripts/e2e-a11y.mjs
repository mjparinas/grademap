// Automated accessibility checks (axe-core, WCAG 2.2 A and AA rules) on the public pages, the
// kids' app and the parent area. This finds the problems a machine can find; it doesn't replace
// trying the app with a screen reader and a keyboard.
//
//   npm run build && npm start
//   npm i --no-save playwright && npx playwright install chromium
//   node scripts/e2e-a11y.mjs http://localhost:3000
import AxeBuilder from "@axe-core/playwright";
import { chromium, devices } from "playwright";
import { enterPin, newChild, step, vis } from "./helpers.mjs";

const BASE = process.argv[2] || "http://localhost:3000";
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const failures = [];
let scanned = 0;

async function scan(page, name) {
  await page.waitForTimeout(500);
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  scanned++;
  if (!violations.length) return console.log(`  ✓ ${name}`);
  for (const v of violations) {
    const where = v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ");
    console.log(`  ✗ ${name}: ${v.id} (${v.impact}) ${v.help}\n      ${v.nodes.length} element(s), e.g. ${where}`);
    failures.push(`${name}: ${v.id}`);
  }
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices["iPad (gen 7)"], reducedMotion: "reduce" });
const page = await ctx.newPage();

console.log("Public pages");
for (const path of ["/", "/pricing/", "/help/", "/contact/", "/privacy/", "/terms/", "/curriculum/", "/curriculum/bc/", "/curriculum/bc/grade-3/math/", "/report-cards/bc/", "/guides/bc/", "/guides/bc/grade-4/", "/guides/bc/grade-4/math/", "/guides/bc/grade-4/math/worksheet/", "/guides/bc/kindergarten/language/worksheet/", "/guides/bc/core-competencies/", "/guides/bc/fsa/", "/compare/", "/compare/ixl/", "/account/reset/?token=x", "/account/verify/?token=x", "/account/unsubscribe/?token=x"]) {
  await page.goto(BASE + path);
  await scan(page, path);
}

console.log("Kids' app");
await page.goto(`${BASE}/play/`);
await scan(page, "/play/ first run");
await page.getByRole("button", { name: /Let's go/ }).click();
await scan(page, "new player");
await newChild(page, "Maya", "Grade 3");
await scan(page, "hub");
await page.getByRole("button", { name: /Adventure/ }).click();
await page.getByRole("button", { name: "Stop", exact: true }).waitFor();
await scan(page, "question");
for (let i = 0; i < 40 && !(await vis(page.locator("[role=status]").getByRole("button"))); i++) await step(page);
await scan(page, "feedback bar");
for (const route of ["trophies", "shop", "practice", "map", "arcade"]) {
  await page.goto(`${BASE}/play/#/${route}`);
  await scan(page, `/play/#/${route}`);
}

console.log("Parent area");
await page.goto(`${BASE}/parents/`);
await scan(page, "PIN gate");
await enterPin(page, true);
for (const route of ["", "reports", "report-cards", "children", "settings", "account", "subscription", "privacy"]) {
  await page.goto(`${BASE}/parents/#/${route}`);
  await scan(page, `/parents/#/${route}`);
}

await browser.close();
console.log(failures.length ? `\n${failures.length} accessibility problem(s) in ${scanned} screens.` : `\nNo automated accessibility problems in ${scanned} screens.`);
process.exit(failures.length ? 1 : 0);
