// Automated accessibility checks (axe-core, WCAG 2.2 A and AA rules) on the public pages, the
// kids' app and the parent area. This finds the problems a machine can find; it doesn't replace
// trying the app with a screen reader and a keyboard.
//
//   npm run build && npm start
//   npm i --no-save playwright && npx playwright install chromium
//   node scripts/e2e-a11y.mjs http://localhost:3000
import AxeBuilder from "@axe-core/playwright";
import { chromium, devices } from "playwright";
import { mkdirSync } from "node:fs";
import { DEFICIENCIES, contrastAs, shootAll, visibleColour } from "./colour-blind.mjs";
import { enterPin, newChild, step, vis } from "./helpers.mjs";

const BASE = process.argv[2] || "http://localhost:3000";
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const SHOTS = process.argv[3] && !process.argv[3].startsWith("--") ? process.argv[3] : "e2e-shots/a11y";
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
for (const path of ["/", "/pricing/", "/help/", "/contact/", "/privacy/", "/terms/", "/curriculum/", "/curriculum/bc/", "/curriculum/bc/grade-3/math/", "/report-cards/bc/", "/account/reset/?token=x", "/account/verify/?token=x", "/account/unsubscribe/?token=x"]) {
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
for (const route of ["trophies", "shop", "practice", "arcade"]) {
  await page.goto(`${BASE}/play/#/${route}`);
  await scan(page, `/play/#/${route}`);
}

// Colour-blind check. Things that mean different things must not depend on colour alone, and
// where two states sit side by side they must still differ in lightness when seen with each
// kind of colour blindness. Screenshots of every simulation go to SHOTS for a human to look at.
console.log("Colour-blind (kids' app)");
mkdirSync(SHOTS, { recursive: true });
const cdp = await ctx.newCDPSession(page);
const check = (ok, what) => {
  console.log(`  ${ok ? "✓" : "✗"} ${what}`);
  if (!ok) failures.push(`colour-blind: ${what}`);
};
const SEEN = ["hub", "practice", "trophies", "shop"];
await page.goto(`${BASE}/play/#/`);
await page.waitForTimeout(500);
await shootAll(page, cdp, SHOTS, "hub");
for (const route of SEEN.slice(1)) {
  await page.goto(`${BASE}/play/#/${route}`);
  await page.waitForTimeout(600);
  await shootAll(page, cdp, SHOTS, route);
  if (route === "trophies") {
    // The four medals in the header: each must carry its tier name, since the colours alone
    // (bronze, silver, gold, platinum) can't be told apart with some kinds of colour blindness.
    const medals = page.locator("span", { hasText: /^🏆$/ }).locator("xpath=..").filter({ has: page.locator("span", { hasText: /^[0-9]+$/ }) });
    const names = (await medals.allInnerTexts()).map((t) => t.replace(/[^A-Za-z]/g, ""));
    check([...names].sort().join() === "Bronze,Gold,Platinum,Silver", `trophy medals are named, not just coloured (${names.join(", ") || "none found"})`);
  }
  if (route === "shop") {
    for (const tab of ["Buddies", "Celebrations", "Titles"]) {
      await page.getByRole("tab", { name: new RegExp(tab) }).click();
      const grid = page.locator("[class*=grid] button.btn");
      const n = await grid.count();
      const cards = grid.filter({ hasText: /Using|Owned|🪙/ });
      check(n > 0 && (await cards.count()) === n, `every shop item says in words whether it is owned, in use or its price (${tab})`);
    }
  }
}
await page.goto(`${BASE}/play/#/`);
await page.getByRole("button", { name: /Adventure/ }).click();
await page.getByRole("button", { name: "Stop", exact: true }).waitFor();
const choices = page.locator('[data-testid="choice"]');
const bar = page.locator("[role=status]");
let sawChoice = false;
let sawWrongAndRight = false;
let sawRetry = false;
for (let i = 0; i < 80 && !sawWrongAndRight; i++) {
  if (!(await vis(choices.locator(":scope:not([disabled])")))) {
    await step(page);
    continue;
  }
  sawChoice = true;
  // Click choices in order: the first miss shows the "try again" state, the right one the tick.
  for (let k = 0; k < (await choices.count()); k++) {
    const pick = choices.nth(k);
    if (await pick.isDisabled()) continue;
    await pick.click({ force: true });
    await page.waitForTimeout(450);
    const text = await bar.innerText().catch(() => "");
    if (/OK/.test(text)) {
      sawRetry = true;
      check(text.includes("🤔") && /\w{3,}/.test(text), "'try again' bar has an icon and words, not just orange");
      await shootAll(page, cdp, SHOTS, "feedback-retry");
      await bar.getByRole("button", { name: "OK", exact: true }).click({ force: true });
    } else if (/Next|Finish/.test(text)) {
      await shootAll(page, cdp, SHOTS, "feedback-correct");
      check(/✓/.test(await pick.innerText()), "the right answer has a tick as well as turning green");
      check(text.includes("✓"), "'correct' bar has a tick as well as turning green");
      const wrong = page.locator('[data-testid="choice"][disabled]').filter({ hasNot: page.locator("text=✓") });
      if (await wrong.count()) {
        const [good, bad] = await Promise.all([pick.evaluate(visibleColour), wrong.first().evaluate(visibleColour)]);
        for (const type of DEFICIENCIES) {
          const ratio = contrastAs(good, bad, type);
          check(ratio >= 1.3, `right and missed answers differ in lightness as seen with ${type} (${ratio.toFixed(2)}:1)`);
        }
        sawWrongAndRight = true;
      }
      break;
    }
  }
}
check(sawChoice && sawRetry && sawWrongAndRight, "played a multiple-choice question through a miss and a right answer");
await cdp.send("Emulation.setEmulatedVisionDeficiency", { type: "none" });

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
