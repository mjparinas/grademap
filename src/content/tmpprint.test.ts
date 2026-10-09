import { it } from "vitest"; import { appendFileSync, writeFileSync } from "node:fs"; const OUT = "/tmp/claude-0/-home-user-grademap/0fde0a2d-35cd-5447-a156-39b60e5819b2/scratchpad/out.txt"; writeFileSync(OUT, ""); const log = (s: string) => appendFileSync(OUT, s + "\n");
import { withSeed } from "./random";
import { course as sci } from "./grades/g12/science";
import { course as soc } from "./grades/g12/social";
it("print", () => {
  const which = process.env.COURSE === "social" ? soc : sci;
  const only = process.env.UNIT;
  for (const u of which.units) {
    if (only && u.id !== only) continue;
    for (const d of [1, 3] as const) {
      const qs = withSeed(Number(process.env.SEED ?? 7) + d, () => u.generate({ difficulty: d }));
      log(`\n### ${u.id} d${d}`);
      for (const q of qs) {
        const ans = q.kind === "choice" ? q.choices.find((c) => c.id === q.answer)!.label + "  | " + q.choices.map((c) => c.label).join(" / ") : q.kind === "input" ? q.answer : q.kind === "order" ? q.items.map((i) => i.label).join(" > ") : q.kind === "sort" ? q.items.map((i) => i.label + "=" + i.bin).join("; ") : "";
        log(`- [${q.kind}] ${q.prompt.replace(/\n/g, " ⏎ ")}\n    => ${ans}`);
      }
    }
  }
});
