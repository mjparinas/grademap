// Text on a coloured surface has to be readable. The bright subject colours are too light for
// white text, so this picks white or a very dark navy, whichever has the higher contrast.

export const ON_BRIGHT = "#0f172a";

function channel(c: number): number {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

export function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** The text colour to use on `bg`: white, or dark navy when white would be hard to read. */
export function onColour(bg: string): string {
  return contrast("#ffffff", bg) >= contrast(ON_BRIGHT, bg) ? "#ffffff" : ON_BRIGHT;
}
