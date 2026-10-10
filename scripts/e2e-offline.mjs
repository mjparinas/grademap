// Real offline test. It starts the production server itself and then stops it, so
// only the service worker cache can answer. (Playwright's setOffline() doesn't cut
// off service worker requests, so it can't prove the cache works.)
//
//   npm run build
//   npm i --no-save playwright && npx playwright install chromium
//   node scripts/e2e-offline.mjs [out-dir]
//
// Checks, on a first visit with no reloads:
//   1. a Grade 5 child's lessons work in a fresh tab with the server gone;
//   2. adding a Kindergartener offline (never downloaded) shows the friendly screen;
//   3. once the server is back, "Try again" loads Kindergarten;
//   4. the Piper voice, downloaded in Settings, reads a question aloud with the server gone.
import { spawn } from "node:child_process";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { enterPin } from "./helpers.mjs";

const PORT = 4199;
const BASE = `http://localhost:${PORT}`;
const OUT = process.argv[2] || "e2e-shots";
const ROOT = fileURLToPath(new URL("..", import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(OUT, { recursive: true });

let server;
function startServer() {
  server = spawn(`${ROOT}node_modules/.bin/next`, ["start", "-p", String(PORT)], { cwd: ROOT, stdio: "ignore" });
}
async function stopServer() {
  const exited = new Promise((r) => server.once("exit", r));
  server.kill();
  await exited;
}
async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      await fetch(BASE + "/");
      return;
    } catch {
      await sleep(1000);
    }
  }
  throw new Error("server did not start (did you run `npm run build`?)");
}
const questionOnScreen = (page) =>
  page.locator('[data-testid="choice"], [data-testid="bin"], [data-testid="pool-item"], button:has-text("Check")').first();

const errors = [];
let browser;
try {
  startServer();
  await waitForServer();
  browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, reducedMotion: "reduce" });
  // Counts audio clips that start playing, so we know the Piper voice really made sound.
  await ctx.addInitScript(() => {
    window.__audioClips = 0;
    const start = AudioBufferSourceNode.prototype.start;
    AudioBufferSourceNode.prototype.start = function (...args) {
      window.__audioClips++;
      return start.apply(this, args);
    };
  });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto(BASE + "/play/");
  await page.getByRole("button", { name: /Let's go/ }).click({ force: true });
  await page.getByLabel("Name").fill("Ava");
  await page.getByRole("button", { name: "Grade 5", exact: true }).click();
  await page.getByRole("button", { name: "Start!" }).click({ force: true });
  await page.getByRole("button", { name: /Adventure/ }).waitFor();
  await page.waitForTimeout(5000); // let the worker take control and keep the lessons

  // A parent downloads the offline voice and turns it on.
  await page.goto(BASE + "/parents/#/settings");
  await enterPin(page, true);
  const piper = page.getByTestId("piper-en");
  await piper.getByRole("button", { name: /Download voice/ }).click();
  await piper.getByRole("switch", { name: /Use the offline voice/ }).waitFor({ timeout: 180000 });
  await piper.getByRole("switch", { name: /Use the offline voice/ }).click();
  console.log("✓ online: the Piper voice downloads and can be switched on");

  await stopServer();
  if (await fetch(BASE + "/").then(() => true, () => false)) throw new Error("server still answering");

  const tab = await ctx.newPage();
  tab.on("pageerror", (e) => errors.push(e.message));
  await tab.goto(BASE + "/play/");
  await tab.getByRole("button", { name: /Adventure/ }).click({ force: true, timeout: 15000 });
  await questionOnScreen(tab).waitFor({ timeout: 15000 });
  await tab.screenshot({ path: `${OUT}/offline-1-grade5-question.png` });
  console.log("✓ offline: Grade 5 lessons load from the cache");

  const clipsBefore = await tab.evaluate(() => window.__audioClips);
  await tab.getByRole("button", { name: "Read it to me" }).click();
  await tab.waitForFunction((n) => window.__audioClips > n, clipsBefore, { timeout: 30000 });
  await tab.getByRole("button", { name: "Stop", exact: true }).first().click({ force: true });
  await tab.getByRole("dialog").getByRole("button", { name: "Stop", exact: true }).click({ force: true });
  console.log("✓ offline: the Piper voice reads a question aloud");

  await tab.goto(BASE + "/play/");
  await tab.getByText("Ava").first().click({ force: true }); // opens the player picker
  await tab.getByRole("button", { name: /Add player/ }).click({ force: true });
  await tab.getByLabel("Name").fill("Leo");
  await tab.getByRole("button", { name: "Kindergarten", exact: true }).click();
  await tab.getByRole("button", { name: "Start!" }).click({ force: true });
  await tab.getByRole("heading", { name: /We need the internet/ }).waitFor({ timeout: 15000 });
  await tab.screenshot({ path: `${OUT}/offline-2-missing-grade.png` });
  console.log("✓ offline: a grade that was never downloaded shows the friendly screen");

  startServer();
  await waitForServer();
  await tab.getByRole("button", { name: "Try again" }).click();
  await tab.getByRole("button", { name: /Let's Play/ }).waitFor({ timeout: 20000 });
  console.log("✓ online again: Try again loads Kindergarten");
} catch (e) {
  errors.push(e instanceof Error ? e.message.split("\n")[0] : String(e));
} finally {
  await browser?.close();
  if (server && server.exitCode === null) server.kill();
}
console.log(errors.length ? `ERRORS:\n${errors.join("\n")}` : "no errors");
process.exit(errors.length ? 1 : 0);
