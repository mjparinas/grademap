// Layout checks across common Android, iPhone, iPad and tablet screens.
//
//   npm run build && npm start   # or npm run dev
//   npm i --no-save playwright && npx playwright install chromium webkit
//   node scripts/e2e-devices.mjs http://localhost:3000 [out-dir] [--only "iPad Mini"] [--shard 1/3]
//
// Not every test runs everywhere. Cheap layout checks run on every device; the
// riskier flows run once per class of device; the full playthrough
// (scripts/e2e.mjs) and offline test (scripts/e2e-offline.mjs) stay on one tablet
// and one phone.
//
//   Every device:
//     - public landing page: no sideways scroll, header CTA visible and tappable;
//     - kids' first run and hub: no sideways scroll, Adventure button above the fold, big tiles;
//     - a question: Stop and read-aloud reachable, answer buttons big enough, and the
//       feedback bar's button fully on screen;
//     - parent reports: wide tables scroll inside the page, never the whole page.
//   One per class (smallest phone, phone landscape, tablet portrait, tablet landscape):
//     - a Kindergarten child: big prompt text and big answer buttons;
//     - an arcade game: the play area fits on screen;
//     - a trophy toast never blocks the Stop button underneath it.
//
// iPhone and iPad profiles run in WebKit when it's installed, otherwise in Chromium
// with the same screen size, pixel ratio, touch and user agent.
import fs from "node:fs";
import { chromium, devices, webkit } from "playwright";
import { enterPin, newChild, step, vis } from "./helpers.mjs";

const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const OUT = process.argv[3] && !process.argv[3].startsWith("--") ? process.argv[3] : "e2e-shots/devices";
const ONLY = process.argv.includes("--only") ? process.argv[process.argv.indexOf("--only") + 1] : undefined;
// --shard 2/3 runs one third of the devices, so CI can test them on several machines at once.
const SHARD = (() => {
  const i = process.argv.indexOf("--shard");
  if (i < 0) return undefined;
  const [n, of] = process.argv[i + 1].split("/").map(Number);
  return { n, of };
})();
fs.mkdirSync(OUT, { recursive: true });

// Minimum touch target: 48 px for kids (Android's 48 dp), 44 px elsewhere (Apple's 44 pt).
const KID_TARGET = 48;
const TARGET = 44;

const DEVICES = [
  // Phones: the narrowest Android, the most common Android width, a large Android.
  { name: "Galaxy S9+", cls: "phone", deep: true },
  { name: "Galaxy S24", cls: "phone" },
  { name: "Pixel 7", cls: "phone" },
  // iPhones: small, standard, large.
  { name: "iPhone SE (3rd gen)", cls: "phone" },
  { name: "iPhone 15", cls: "phone" },
  { name: "iPhone 15 Pro Max", cls: "phone" },
  // Phones held sideways: very little height.
  { name: "iPhone 15 landscape", cls: "phone-landscape", deep: true },
  { name: "Pixel 7 landscape", cls: "phone-landscape" },
  // Tablets.
  { name: "iPad Mini", cls: "tablet", deep: true },
  { name: "iPad Pro 11", cls: "tablet" },
  { name: "iPad Pro 11 landscape", cls: "tablet-landscape" },
  { name: "Galaxy Tab S4", cls: "tablet" },
  { name: "Galaxy Tab S4 landscape", cls: "tablet-landscape", deep: true },
  // Chromebooks and small laptops.
  { name: "Chromebook 1366×768", cls: "desktop", descriptor: { viewport: { width: 1366, height: 768 }, deviceScaleFactor: 1, isMobile: false, hasTouch: true } },
];

const results = [];
let failures = 0;

function record(device, check, ok, detail = "") {
  results.push({ device, check, ok, detail });
  if (!ok) failures++;
  console.log(`  ${ok ? "✓" : "✗"} ${check}${detail ? ` (${detail})` : ""}`);
}

async function sideScroll(page) {
  return page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
}

/** A box that has stopped moving: the feedback bar slides in, and measuring it mid-slide gives false alarms. */
async function settledBox(loc) {
  let box = await loc.first().boundingBox();
  for (let i = 0; i < 20; i++) {
    await loc.page().waitForTimeout(100);
    const next = await loc.first().boundingBox();
    const same = box && next && ["x", "y", "width", "height"].every((k) => Math.abs(box[k] - next[k]) < 0.5);
    box = next;
    if (same) break;
  }
  return box;
}

async function onScreen(page, loc) {
  const box = await settledBox(loc);
  const vp = page.viewportSize();
  if (!box) return { ok: false, detail: "not rendered" };
  const ok = box.x >= -1 && box.y >= -1 && box.x + box.width <= vp.width + 1 && box.y + box.height <= vp.height + 1;
  return { ok, detail: ok ? "" : `at ${Math.round(box.x)},${Math.round(box.y)} size ${Math.round(box.width)}×${Math.round(box.height)} in ${vp.width}×${vp.height}` };
}

async function smallest(loc) {
  let min = Infinity;
  let label = "";
  for (const el of await loc.all()) {
    if (!(await el.isVisible())) continue;
    const b = await el.boundingBox();
    if (b && Math.min(b.width, b.height) < min) {
      min = Math.min(b.width, b.height);
      label = ((await el.getAttribute("aria-label")) ?? (await el.innerText())).trim().slice(0, 24);
    }
  }
  return { min, label };
}

async function checkTargets(device, check, loc, size) {
  const { min, label } = await smallest(loc);
  record(device, check, min >= size, min === Infinity ? "none found" : `smallest ${Math.round(min)} px${min < size ? ` "${label}"` : ""}`);
}

async function noSideScroll(device, page, where) {
  const extra = await sideScroll(page);
  record(device, `${where}: no sideways scroll`, extra <= 1, extra > 1 ? `${extra} px too wide` : "");
}

async function shot(page, device, name) {
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${OUT}/${device.replace(/[^\w]+/g, "-")}-${name}.png` });
}

/** Answers until a feedback bar shows, returning its main button. */
async function answerUntilFeedback(page) {
  const bar = page.locator("[role=status]").filter({ has: page.getByRole("button") });
  for (let i = 0; i < 40; i++) {
    if (await vis(bar)) return bar.getByRole("button", { name: /^(Next →|Finish 🎉|OK)$/ });
    await step(page);
    await page.waitForTimeout(150);
  }
  return undefined;
}

async function openFirstRun(page) {
  await page.goto(`${BASE}/play/`);
  await page.getByRole("button", { name: /Let's go/ }).waitFor();
}

async function everyDevice(device, page) {
  // Public landing page
  await page.goto(`${BASE}/`);
  await noSideScroll(device, page, "landing");
  const cta = page.getByRole("banner").getByRole("link", { name: "Play free" });
  const ctaPos = await onScreen(page, cta);
  record(device, "landing: header CTA on screen", ctaPos.ok, ctaPos.detail);
  await checkTargets(device, "landing: header CTA tappable", cta, TARGET);
  await shot(page, device, "1-landing");

  // Kids' first run
  await openFirstRun(page);
  const go = page.getByRole("button", { name: /Let's go/ });
  const goPos = await onScreen(page, go);
  record(device, "first run: Let's go above the fold", goPos.ok, goPos.detail);
  await go.click();
  await checkTargets(device, "new player: grade buttons", page.getByRole("button", { name: /^(Kindergarten|Grade \d)$/ }), KID_TARGET);
  await newChild(page, "Maya", "Grade 3");

  // Hub
  const adventure = page.getByRole("button", { name: /Adventure/ });
  await adventure.waitFor();
  await page.waitForTimeout(400);
  await noSideScroll(device, page, "hub");
  const advPos = await onScreen(page, adventure);
  record(device, "hub: Adventure above the fold", advPos.ok, advPos.detail);
  await checkTargets(device, "hub: tiles", page.locator("main .grid button"), KID_TARGET);
  await shot(page, device, "2-hub");

  // A question
  await adventure.click();
  await page.getByRole("button", { name: "Stop", exact: true }).waitFor();
  await page.waitForTimeout(400);
  await noSideScroll(device, page, "question");
  for (const name of ["Stop", "Read it to me"]) {
    const pos = await onScreen(page, page.getByRole("button", { name, exact: true }));
    record(device, `question: ${name} on screen`, pos.ok, pos.detail);
  }
  const answers = page.locator('[data-testid="choice"], [data-testid="bin"], [data-testid="sort-item"], [data-testid="pool-item"], main button:has-text("Check")');
  await checkTargets(device, "question: answer buttons", answers, KID_TARGET);
  await shot(page, device, "3-question");
  const hintButton = page.getByRole("button", { name: /Need a hint/ });
  if (await vis(hintButton)) {
    const hp = await onScreen(page, hintButton);
    record(device, "question: hint button on screen", hp.ok, hp.detail);
    await checkTargets(device, "question: hint button", hintButton, KID_TARGET);
    await hintButton.click();
    await page.waitForTimeout(150);
    record(device, "question: hint shows and answers stay reachable", (await vis(page.getByText("💡").first())) && (await vis(answers.first())));
    await noSideScroll(device, page, "question with hint");
  }
  const next = await answerUntilFeedback(page);
  if (!next) record(device, "question: feedback bar appears", false, "no feedback after 40 tries");
  else {
    const pos = await onScreen(page, next);
    record(device, "question: feedback button fully on screen", pos.ok, pos.detail);
    await checkTargets(device, "question: feedback button", next, KID_TARGET);
    await shot(page, device, "4-feedback");

    // "Report a problem" is hidden on short landscape screens; elsewhere it must be reachable
    // and must not sit on top of the Next button.
    const flag = page.getByRole("button", { name: /Report a problem/ });
    if (await vis(flag)) {
      const fp = await onScreen(page, flag);
      record(device, "question: report flag on screen", fp.ok, fp.detail);
      await checkTargets(device, "question: report flag", flag, KID_TARGET);
      const [fb, nb] = [await flag.boundingBox(), await next.boundingBox()];
      const overlaps = fb && nb && fb.x < nb.x + nb.width && fb.x + fb.width > nb.x && fb.y < nb.y + nb.height && fb.y + fb.height > nb.y;
      record(device, "question: report flag doesn't cover Next", !overlaps);
      await flag.click();
      await page.getByRole("dialog").getByRole("button", { name: /answer looks wrong/ }).click();
      const thanked = await page
        .getByRole("heading", { name: /Thank you/ })
        .waitFor({ timeout: 5000 })
        .then(() => true, () => false);
      record(device, "question: report is sent", thanked);
      await page.getByRole("dialog").getByRole("button", { name: /Back to the question/ }).click();
    }
  }

  // Parent reports
  await page.goto(`${BASE}/parents/`);
  await enterPin(page, true);
  await page.goto(`${BASE}/parents/#/reports`);
  await page.getByRole("heading", { name: /report/i }).first().waitFor();
  await page.waitForTimeout(400);
  await noSideScroll(device, page, "parent reports");
  await shot(page, device, "5-parent-reports");
}

async function deepChecks(device, browser, descriptor, page) {
  // Toasts never block taps: the first answer earns a trophy, and the toast sits on top.
  await page.goto(`${BASE}/play/`);
  await page.getByRole("button", { name: /Adventure/ }).click();
  await page.getByRole("button", { name: "Stop", exact: true }).waitFor();
  const toast = page.locator("[role=status]").filter({ hasText: /trophy|level up/i });
  for (let i = 0; i < 40 && !(await vis(toast)); i++) {
    await step(page);
    await page.waitForTimeout(100);
  }
  if (await vis(toast)) {
    const stopHit = await page.evaluate(() => {
      // Answering can scroll a long question on a small screen; the header is at the top.
      window.scrollTo({ top: 0 });
      const stop = document.querySelector('button[aria-label="Stop"]');
      const r = stop.getBoundingClientRect();
      return document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)?.closest('button[aria-label="Stop"]') === stop;
    });
    record(device, "toast: Stop button still tappable under a toast", stopHit);
    await shot(page, device, "6-toast");
  } else record(device, "toast: a trophy toast appeared", false, "no toast seen");

  // An arcade game: turn on free play, then check the play area fits.
  await page.goto(`${BASE}/parents/#/settings`);
  await enterPin(page, false);
  const freePlay = page.getByRole("switch", { name: /Free play/ }).first();
  await freePlay.click();
  await page.waitForFunction((el) => el?.getAttribute("aria-checked") === "true", await freePlay.elementHandle());
  await page.getByRole("switch", { name: /Calm motion/ }).click();
  await page.getByRole("switch", { name: /Hide timers/ }).click();
  await page.waitForTimeout(600); // let the settings reach IndexedDB before leaving the page
  await page.goto(`${BASE}/play/#/arcade/ninja`);
  const calmClass = await page
    .waitForFunction(() => document.documentElement.classList.contains("calm"), undefined, { timeout: 5000 })
    .then(() => true, () => false);
  record(device, "calm motion: page gets the calm class", calmClass);
  await page.getByRole("button", { name: /Play!/ }).click();
  const board = page.getByTestId("game-board");
  await board.waitFor();
  await page.waitForTimeout(500);
  await noSideScroll(device, page, "arcade game");
  const boardPos = await onScreen(page, board);
  record(device, "arcade game: play area fits on screen", boardPos.ok, boardPos.detail);
  const stopGame = await onScreen(page, page.getByRole("button", { name: "Stop game" }));
  record(device, "arcade game: Stop game on screen", stopGame.ok, stopGame.detail);
  await shot(page, device, "7-game");

  // A Kindergarten child: big prompt and big answers.
  const ctx = await browser.newContext({ ...descriptor, reducedMotion: "reduce" });
  const kpage = await ctx.newPage();
  await openFirstRun(kpage);
  await kpage.getByRole("button", { name: /Let's go/ }).click();
  await newChild(kpage, "Leo", "Kindergarten");
  const play = kpage.getByRole("button", { name: /Let's Play/ });
  await play.waitFor();
  const playPos = await onScreen(kpage, play);
  record(device, "Kindergarten hub: Let's Play above the fold", playPos.ok, playPos.detail);
  await play.click();
  await kpage.getByRole("button", { name: "Stop", exact: true }).waitFor();
  await kpage.waitForTimeout(400);
  const promptPx = await kpage.locator("section p.font-read").first().evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  record(device, "Kindergarten: prompt text at least 28 px", promptPx >= 28, `${promptPx} px`);
  await checkTargets(device, "Kindergarten: answer buttons at least 64 px", kpage.locator('[data-testid="choice"], [data-testid="sort-item"], [data-testid="bin"], [data-testid="pool-item"]'), 64);
  await noSideScroll(device, kpage, "Kindergarten question");
  await shot(kpage, device, "8-kindergarten");
  await ctx.close();
}

let webkitOk = true;
const browsers = {};
async function browserFor(type) {
  if (type === "webkit" && webkitOk) {
    try {
      browsers.webkit ??= await webkit.launch();
      return browsers.webkit;
    } catch {
      webkitOk = false;
      console.log("(WebKit isn't installed: running iPhone and iPad profiles in Chromium.)\n");
    }
  }
  browsers.chromium ??= await chromium.launch();
  return browsers.chromium;
}

// The slower "deep" devices are dealt out first so every shard gets a similar share.
const dealt = [...DEVICES.filter((d) => d.deep), ...DEVICES.filter((d) => !d.deep)];
const inShard = (d) => !SHARD || dealt.indexOf(d) % SHARD.of === SHARD.n - 1;

for (const d of DEVICES) {
  if (ONLY && d.name !== ONLY) continue;
  if (!inShard(d)) continue;
  const descriptor = d.descriptor ?? devices[d.name];
  if (!descriptor) {
    record(d.name, "device profile exists", false, "not in this Playwright version");
    continue;
  }
  const { defaultBrowserType, ...options } = descriptor;
  const browser = await browserFor(defaultBrowserType ?? "chromium");
  console.log(`${d.name} (${options.viewport.width}×${options.viewport.height}, ${d.cls}${d.deep ? ", deep checks" : ""})`);
  // A fresh "client address" per device and run, so the server's rate limits (20 reports an hour) never trip.
  const fakeIp = `10.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`;
  const ctx = await browser.newContext({ ...options, reducedMotion: "reduce", extraHTTPHeaders: { "x-forwarded-for": fakeIp } });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => record(d.name, "no page errors", false, e.message));
  try {
    await everyDevice(d.name, page);
    if (d.deep) await deepChecks(d.name, browser, options, page);
  } catch (e) {
    record(d.name, "finished without errors", false, e instanceof Error ? e.message.split("\n")[0] : String(e));
    await page.screenshot({ path: `${OUT}/${d.name.replace(/[^\w]+/g, "-")}-error.png` }).catch(() => {});
  }
  await ctx.close();
}
for (const b of Object.values(browsers)) await b.close();

const devicesRun = new Set(results.map((r) => r.device)).size;
console.log(`\n${results.length - failures}/${results.length} checks passed on ${devicesRun} devices. Screenshots: ${OUT}/`);
if (failures) {
  console.log("\nFailures:");
  for (const r of results.filter((x) => !x.ok)) console.log(`  ${r.device}: ${r.check}${r.detail ? ` (${r.detail})` : ""}`);
}
process.exit(failures ? 1 : 0);
