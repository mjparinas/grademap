// End-to-end playthrough of the kids' app, parent area, two-device sync and offline mode.
// Plays every mode like a child would (including wrong answers), opens every arcade game
// and parent page, signs up, syncs to a second device, then goes offline and back.
//
//   npm run build && npm start            # in one terminal (offline needs a production build)
//   npm i --no-save playwright && npx playwright install chromium
//   node scripts/e2e.mjs http://localhost:3000 e2e-shots --offline [--speed]
import fs from "node:fs";
import { chromium } from "playwright";
const BASE = process.argv[2] || "http://localhost:3100";
const OUT = process.argv[3] || "e2e-shots";
const OFFLINE = process.argv.includes("--offline");
const SPEED = process.argv.includes("--speed");
fs.mkdirSync(OUT, { recursive: true });

const errors = [];
const log = (...a) => console.log(...a);

async function vis(loc) {
  try {
    return (await loc.count()) > 0 && (await loc.first().isVisible());
  } catch {
    return false;
  }
}

function watch(page, name) {
  page.on("pageerror", (e) => errors.push(`${name} pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    if (/Failed to load resource|net::ERR_INTERNET_DISCONNECTED|Failed to fetch|401/.test(t)) return;
    errors.push(`${name} console: ${t}`);
  });
}

async function shot(page, name, full = false) {
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: full });
}

/** Answer one thing on screen; a click that lands mid-animation just tries again. */
async function step(page) {
  try {
    return await stepOnce(page);
  } catch {
    await page.waitForTimeout(200);
    return "wait";
  }
}

/** Answer one thing on screen (randomly, so we see right, retry and revealed paths). */
async function stepOnce(page) {
  const next = page.getByRole("button", { name: /^(Next →|Finish 🎉)$/ });
  if (await vis(next)) return next.click({ force: true }).then(() => "next");
  const ok = page.locator("[role=status]").getByRole("button", { name: "OK", exact: true });
  if (await vis(ok)) return ok.click({ force: true }).then(() => "ok");
  if (await vis(page.getByRole("button", { name: /Keep going/ }))) return "checkpoint";
  if (await vis(page.getByRole("button", { name: /Play again/ }))) return "summary";

  const choices = page.locator('[data-testid="choice"]:not([disabled])');
  if (await vis(choices)) {
    const n = await choices.count();
    await choices.nth(Math.floor(Math.random() * n)).click({ force: true });
    return "choice";
  }
  if (await vis(page.getByTestId("pool-item"))) {
    for (let i = 0; i < 12 && (await vis(page.getByTestId("pool-item"))); i++) await page.getByTestId("pool-item").first().click({ force: true });
    await page.getByRole("button", { name: /Check/ }).click({ force: true });
    await page.waitForTimeout(600);
    return "order";
  }
  if (await vis(page.getByTestId("bin"))) {
    const before = await page.getByTestId("sort-item").count();
    const bins = page.getByTestId("bin");
    for (let b = 0; b < (await bins.count()); b++) {
      await bins.nth(b).click({ force: true });
      await page.waitForTimeout(120);
      if ((await page.getByTestId("sort-item").count()) < before) break;
      // Wrong basket: dismiss the "try another" bar, then try the next basket.
      const ok = page.locator("[role=status]").getByRole("button", { name: "OK", exact: true });
      if (await vis(ok)) {
        await ok.click({ force: true });
        await page.waitForTimeout(80);
      }
    }
    return "sort";
  }
  if (await vis(page.getByRole("button", { name: "+ Ten" }))) {
    await page.getByRole("button", { name: "+ Ten" }).click({ force: true });
    await page.getByRole("button", { name: "+ One" }).click({ force: true });
    await page.getByRole("button", { name: /Check/ }).click({ force: true });
    return "build";
  }
  const coin = page.getByRole("button", { name: /^(?!Take out).*(nickel|dime|quarter|loonie|toonie|bill)/i });
  if (await vis(coin)) {
    await coin.first().click({ force: true });
    await page.getByRole("button", { name: /Check/ }).click({ force: true });
    return "coins";
  }
  if (await vis(page.getByRole("button", { name: "Delete", exact: true }))) {
    for (const k of ["1", "2"]) await page.getByRole("button", { name: k, exact: true }).click({ force: true });
    await page.getByRole("button", { name: /Check/ }).click({ force: true });
    return "input";
  }
  return "wait";
}

/** Play until the summary (or a checkpoint), up to `max` steps. */
async function playSession(page, label, { max = 300, stopAfter, shots = {} } = {}) {
  const kinds = {};
  let answered = 0;
  let waits = 0;
  for (let i = 0; i < max; i++) {
    const r = await step(page);
    kinds[r] = (kinds[r] ?? 0) + 1;
    if (r === "summary" || r === "checkpoint") return { r, kinds };
    if (r === "next") answered++;
    if (shots[r]) {
      await shot(page, shots[r]);
      delete shots[r];
    }
    if (stopAfter && answered >= stopAfter) {
      await page.getByRole("button", { name: "Stop", exact: true }).first().click({ force: true });
      await page.getByRole("dialog").getByRole("button", { name: "Stop", exact: true }).click({ force: true });
      await page.waitForTimeout(400);
      return { r: (await vis(page.getByRole("button", { name: /Play again/ }))) ? "summary" : "home", kinds };
    }
    if (r === "wait") {
      if (++waits > 40) {
        await shot(page, `stuck-${label}`);
        throw new Error(`${label}: stuck`);
      }
      await page.waitForTimeout(100);
    } else waits = 0;
    await page.waitForTimeout(40);
  }
  throw new Error(`${label}: did not finish`);
}

async function home(page) {
  await page.goto(`${BASE}/play/#/`);
  await page.waitForTimeout(500);
}

async function tile(page, name) {
  await page.getByRole("button", { name }).first().click({ force: true });
  await page.waitForTimeout(400);
}

async function enterPin(page, create) {
  await page.waitForTimeout(400);
  const type = async () => {
    for (const d of "2468") await page.getByRole("button", { name: d, exact: true }).click();
    await page.getByRole("button", { name: "OK", exact: true }).click();
  };
  await type();
  if (create) await type();
  await page.waitForTimeout(500);
}

/** Open a parent page, entering the PIN if the gate shows (it locks on every full load). */
async function parents(page, hash = "") {
  await page.goto(`${BASE}/parents/#/${hash}`);
  await page.waitForTimeout(700);
  if (await vis(page.getByRole("heading", { name: "Parents only" }))) await enterPin(page, false);
}

async function newChild(page, name, grade) {
  await page.getByLabel("Name").fill(name);
  await page.getByRole("button", { name: grade, exact: true }).click();
  await page.getByRole("button", { name: "Start!" }).click({ force: true });
  await page.waitForTimeout(600);
}

async function eventsWaiting(page) {
  return page.evaluate(
    () =>
      new Promise((resolve) => {
        const req = indexedDB.open("grademap");
        req.onsuccess = () => {
          const tx = req.result.transaction("events", "readonly");
          const all = tx.objectStore("events").getAll();
          all.onsuccess = () => resolve({ total: all.result.length, unsynced: all.result.filter((e) => !e.synced).length });
        };
        req.onerror = () => resolve({ total: -1, unsynced: -1 });
      }),
  );
}

(async () => {
  const browser = await chromium.launch();
  const ipad = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true, reducedMotion: "reduce" });
  const page = await ipad.newPage();
  watch(page, "ipad");

  // First run
  await page.goto(`${BASE}/play/`);
  await page.waitForTimeout(800);
  await shot(page, "01-welcome");
  await page.getByRole("button", { name: /Let's go/ }).click({ force: true });
  await shot(page, "02-new-child");
  await newChild(page, "Maya", "Grade 2");
  await shot(page, "03-hub", true);

  // Adventure: to the checkpoint, then stop
  await page.getByRole("button", { name: /Adventure/ }).click({ force: true });
  await page.waitForTimeout(400);
  const adv = await playSession(page, "adventure", { shots: { choice: "04-question", ok: "05-retry" } });
  log("adventure:", adv.r, JSON.stringify(adv.kinds));
  if (adv.r === "checkpoint") {
    await shot(page, "06-checkpoint");
    await page.getByRole("button", { name: /done for now/ }).click({ force: true });
    await page.waitForTimeout(2500);
  }
  await shot(page, "07-summary");
  await page.waitForTimeout(1500);
  await shot(page, "08-summary-toasts");

  // Daily challenge
  await home(page);
  await tile(page, /Daily Challenge/);
  const daily = await playSession(page, "daily");
  log("daily:", daily.r, JSON.stringify(daily.kinds));
  await page.waitForTimeout(2500);
  await shot(page, "09-daily-summary");

  // Practice a unit (with the Practice / Challenge dialog)
  await home(page);
  await tile(page, /^📚|Practice/);
  await shot(page, "10-practice-subjects");
  await page.locator('a[href="#/practice/math"]').click({ force: true });
  await page.waitForTimeout(500);
  await shot(page, "11-units", true);
  await page.locator("main button, [class*=grid] button").filter({ hasText: /Coins|Money/ }).first().click({ force: true }).catch(async () => {
    await page.locator("[class*=grid] button").first().click({ force: true });
  });
  await page.waitForTimeout(400);
  await shot(page, "12-unit-dialog");
  await page.getByRole("button", { name: /▶ Practice/ }).click({ force: true });
  const prac = await playSession(page, "practice", { shots: { coins: "13-coins" } });
  log("practice:", prac.r, JSON.stringify(prac.kinds));
  await page.waitForTimeout(2500);
  await shot(page, "14-practice-summary");

  // Review
  await home(page);
  await tile(page, /Review/);
  const rev = await playSession(page, "review");
  log("review:", rev.r, JSON.stringify(rev.kinds));

  if (SPEED) {
    await home(page);
    await tile(page, /Speed Run/);
    await page.getByRole("button", { name: /Mix|All|Everything/ }).first().click({ force: true }).catch(() => undefined);
    await page.waitForTimeout(300);
    await shot(page, "15-speed-start");
    const t0 = Date.now();
    while (Date.now() - t0 < 95_000 && !(await vis(page.getByRole("button", { name: /Play again/ })))) await step(page);
    await page.waitForTimeout(2500);
    await shot(page, "16-speed-summary");
  }

  // Trophies and shop
  await home(page);
  await shot(page, "17-hub-after", true);
  await tile(page, /Trophies/);
  await shot(page, "18-trophies", true);
  await home(page);
  await tile(page, /Shop/);
  await shot(page, "19-shop", true);

  // Parent area: PIN, free play, reports
  await page.goto(`${BASE}/parents/`);
  await enterPin(page, true);
  await shot(page, "20-parent-overview", true);
  await page.goto(`${BASE}/parents/#/settings`);
  await page.waitForTimeout(500);
  await page.getByRole("switch", { name: /Free play/ }).first().click();
  await shot(page, "21-parent-settings", true);
  for (const p of ["reports", "report-cards", "children", "subscription", "privacy"]) {
    await page.goto(`${BASE}/parents/#/${p}`);
    await page.waitForTimeout(700);
    await shot(page, `22-parent-${p}`, true);
  }

  // Arcade with free play on
  await page.goto(`${BASE}/play/#/arcade`);
  await page.waitForTimeout(600);
  await shot(page, "23-arcade", true);
  for (const g of ["munchers", "ninja", "catch", "bubbles", "memory"]) {
    await page.goto(`${BASE}/play/#/arcade/${g}`);
    await page.waitForTimeout(400);
    await page.getByRole("button", { name: /Play!/ }).click({ force: true });
    await page.waitForTimeout(800);
    for (const k of ["ArrowRight", "ArrowDown", "Space", "ArrowLeft", "Enter"]) await page.keyboard.press(k);
    const box = page.locator("main, body").first();
    await box.click({ position: { x: 600, y: 450 }, force: true }).catch(() => undefined);
    await page.waitForTimeout(1500);
    await shot(page, `24-game-${g}`);
    await page.getByRole("button", { name: "Stop game" }).click({ force: true }).catch(() => undefined);
    await page.waitForTimeout(400);
  }

  // Account + sync
  const email = `e2e${Date.now()}@example.com`;
  await parents(page, "account");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("correct horse 42");
  await page.getByRole("button", { name: /Create account/ }).last().click();
  await page.waitForTimeout(4000);
  await shot(page, "25-account");
  const afterSync = await eventsWaiting(page);
  log("ipad events after sign-up:", JSON.stringify(afterSync));

  // Second device: sign in, see Maya's progress, add a Kindergartener
  const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
  const p2 = await phone.newPage();
  watch(p2, "phone");
  await p2.goto(`${BASE}/parents/#/account`);
  await enterPin(p2, true);
  await p2.getByRole("button", { name: "Sign in", exact: true }).click();
  await p2.getByLabel("Email").fill(email);
  await p2.getByLabel("Password").fill("correct horse 42");
  await p2.getByRole("button", { name: /Sign in & sync/ }).click();
  await p2.waitForTimeout(5000);
  const phoneEvents = await eventsWaiting(p2);
  log("phone events after sign-in:", JSON.stringify(phoneEvents));
  if (phoneEvents.total !== afterSync.total) errors.push(`sync mismatch: ipad ${afterSync.total} vs phone ${phoneEvents.total}`);
  await p2.goto(`${BASE}/play/`);
  await p2.waitForTimeout(800);
  await shot(p2, "26-phone-picker", true);
  await p2.getByRole("button", { name: /Add player/ }).click({ force: true });
  await newChild(p2, "Leo", "Kindergarten");
  await shot(p2, "27-phone-k-hub", true);
  await p2.getByRole("button", { name: /Let's Play/ }).click({ force: true });
  await p2.waitForTimeout(500);
  await shot(p2, "28-phone-k-question");
  const k = await playSession(p2, "k-adventure", { stopAfter: 5, shots: { next: "29-phone-k-feedback" } });
  log("k adventure:", k.r, JSON.stringify(k.kinds));
  await p2.waitForTimeout(2500);
  await shot(p2, "30-phone-k-summary");
  await p2.waitForTimeout(6000);

  // Back on the iPad: Leo should arrive with the next sync
  await parents(page, "account");
  await page.getByRole("button", { name: "Sync now" }).click();
  await page.waitForTimeout(3000);
  await page.goto(`${BASE}/play/`);
  await page.waitForTimeout(800);
  const names = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const req = indexedDB.open("grademap");
        req.onsuccess = () => {
          const get = req.result.transaction("kv", "readonly").objectStore("kv").get("profiles");
          get.onsuccess = () => resolve((get.result ?? []).filter((p) => !p.deleted).map((p) => p.name));
        };
      }),
  );
  log("profiles on iPad:", names.join(", "));
  const leoOnIpad = names.includes("Leo");
  log("Leo synced to iPad:", leoOnIpad);
  if (!leoOnIpad) errors.push("Leo did not sync to the iPad");
  await shot(page, "31-ipad-picker");

  if (OFFLINE) {
    // Offline: reload, keep playing, then reconnect and check it uploads.
    await page.waitForTimeout(1500);
    await ipad.setOffline(true);
    await page.reload();
    await page.waitForTimeout(1500);
    await shot(page, "32-offline-reload");
    await tile(page, /Review/);
    await playSession(page, "offline", { stopAfter: 4 });
    const off = await eventsWaiting(page);
    log("offline events:", JSON.stringify(off));
    if (!off.unsynced) errors.push("no unsynced events while offline");
    await page.goto(`${BASE}/parents/`).catch(() => undefined);
    await page.waitForTimeout(1000);
    await shot(page, "33-offline-parents");
    await ipad.setOffline(false);
    await page.goto(`${BASE}/play/`);
    await page.waitForTimeout(8000);
    const on = await eventsWaiting(page);
    log("after reconnect:", JSON.stringify(on));
    if (on.unsynced) errors.push(`${on.unsynced} events still unsynced after reconnect`);
  }

  await browser.close();
  log(errors.length ? `ERRORS:\n${errors.join("\n")}` : "no errors");
  process.exit(errors.length ? 1 : 0);
})().catch((e) => {
  console.error(e);
  console.log(errors.join("\n"));
  process.exit(1);
});
