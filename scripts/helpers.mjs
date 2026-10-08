// Shared Playwright helpers for the e2e scripts: answer whatever question is on
// screen, create a child, enter the parent PIN.

/** True if the locator matches a visible element (never throws). */
export async function vis(loc) {
  try {
    return (await loc.count()) > 0 && (await loc.first().isVisible());
  } catch {
    return false;
  }
}

/** Answer one thing on screen; a click that lands mid-animation just tries again. */
export async function step(page) {
  try {
    return await stepOnce(page);
  } catch {
    await page.waitForTimeout(200);
    return "wait";
  }
}

/** Answer one thing on screen (randomly, so we see right, retry and revealed paths). */
export async function stepOnce(page) {
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

/** The PIN every e2e script uses. Pass `create` the first time on a device. */
export async function enterPin(page, create) {
  await page.waitForTimeout(400);
  const type = async () => {
    for (const d of "2468") await page.getByRole("button", { name: d, exact: true }).click();
    await page.getByRole("button", { name: "OK", exact: true }).click();
  };
  await type();
  if (create) await type();
  await page.waitForTimeout(500);
}

/** Fills in the new-player screen and starts. */
export async function newChild(page, name, grade) {
  await page.getByLabel("Name").fill(name);
  await page.getByRole("button", { name: grade, exact: true }).click();
  await page.getByRole("button", { name: "Start!" }).click({ force: true });
  await page.waitForTimeout(600);
}

/** Real voice names as Microsoft Edge on Windows reports them. */
export const EDGE_VOICES = [
  { name: "Microsoft David - English (United States)", lang: "en-US", localService: true, default: true },
  { name: "Microsoft Linda - English (Canada)", lang: "en-CA", localService: true, default: false },
  { name: "Microsoft Aria Online (Natural) - English (United States)", lang: "en-US", localService: false, default: false },
  { name: "Microsoft Clara Online (Natural) - English (Canada)", lang: "en-CA", localService: false, default: false },
  { name: "Microsoft Denise Online (Natural) - French (France)", lang: "fr-FR", localService: false, default: false },
];

/**
 * Headless browsers have no voices, so this swaps in a fake speech engine with real
 * voice names that records what it says and with which voice (read with `spoken`).
 */
export async function installFakeVoices(context, voices = EDGE_VOICES) {
  await context.addInitScript((list) => {
    const all = list.map((v) => ({ ...v, voiceURI: v.name }));
    window.__spoken = [];
    const synth = {
      getVoices: () => all,
      speak: (u) => window.__spoken.push({ text: u.text, voice: u.voice ? u.voice.name : null }),
      cancel: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      speaking: false,
      pending: false,
      paused: false,
    };
    Object.defineProperty(window, "speechSynthesis", { value: synth, configurable: true });
    window.SpeechSynthesisUtterance = class {
      constructor(text) {
        this.text = text;
        this.voice = null;
      }
    };
  }, voices);
}

/** Everything the fake speech engine has said so far: [{ text, voice }]. */
export function spoken(page) {
  return page.evaluate(() => window.__spoken ?? []);
}
