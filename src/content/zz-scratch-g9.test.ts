import { it } from "vitest";
import { withSeed } from "./random";
import { course as math } from "./grades/g9/math";
import { course as lang } from "./grades/g9/language";
it("scan", () => {
  for (const c of [math, lang]) for (const u of c.units) {
    const errs = new Map<string, number>();
    for (let i = 0; i < 5000; i++) {
      try { withSeed(i + 1, () => u.generate({ difficulty: ((i % 3) + 1) as 1 | 2 | 3 })); }
      catch (e) { const m = String((e as Error).message).slice(0, 160); errs.set(m, (errs.get(m) ?? 0) + 1); }
    }
    for (const [m, n] of errs) console.log(`${c.subject}/${u.id}: ${n}x ${m}`);
  }
});
