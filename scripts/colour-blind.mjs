// Colour-vision simulation for the e2e scripts. Chromium can render the whole page as a
// colour-blind child would see it (Emulation.setEmulatedVisionDeficiency); this adds the same
// simulation for colours we read out of the page, so we can check that two things that mean
// different things (a right and a wrong answer) still differ in lightness.
export const DEFICIENCIES = ["protanopia", "deuteranopia", "tritanopia", "achromatopsia"];

// Machado, Oliveira & Fernandes (2009), severity 1.0, applied to linear RGB.
const MATRIX = {
  protanopia: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deuteranopia: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]],
  tritanopia: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.3039]],
};
const toLinear = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const clamp = (v) => Math.min(1, Math.max(0, v));

/** Relative luminance (0–1) of an [r,g,b] colour (0–255) as seen with `type` ("none" = typical vision). */
export function luminanceAs(rgb, type = "none") {
  const [r, g, b] = rgb.map(toLinear);
  if (type === "achromatopsia" || type === "none") return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const [lr, lg, lb] = MATRIX[type].map((row) => clamp(row[0] * r + row[1] * g + row[2] * b));
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

/** Contrast ratio (1–21) between two [r,g,b] colours as seen with `type`. */
export function contrastAs(a, b, type = "none") {
  const [hi, lo] = [luminanceAs(a, type), luminanceAs(b, type)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** The colour an element looks like: its background blended with white by its effective opacity. */
export function visibleColour(el) {
  const m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g).map(Number);
  let opacity = 1;
  for (let e = el; e; e = e.parentElement) opacity *= Number(getComputedStyle(e).opacity);
  const alpha = (m[3] ?? 1) * opacity;
  return m.slice(0, 3).map((c) => Math.round(c * alpha + 255 * (1 - alpha)));
}

/** Screenshot the current page once per simulation (and once as normal) into `dir`. */
export async function shootAll(page, cdp, dir, name) {
  for (const type of ["none", ...DEFICIENCIES]) {
    await cdp.send("Emulation.setEmulatedVisionDeficiency", { type });
    await page.screenshot({ path: `${dir}/${name}-${type}.png` });
  }
  await cdp.send("Emulation.setEmulatedVisionDeficiency", { type: "none" });
}
