import { it } from "vitest";
import { writeFileSync } from "node:fs";
import { withSeed } from "./random";
import { course as sci } from "./grades/g11/science";
import { course as soc } from "./grades/g11/social";
it("dump", () => {
  let out = "";
  for (const c of [sci, soc]) for (const u of c.units) {
    out += `\n=== ${c.subject}/${u.id}\n`;
    for (const d of [1, 2, 3] as const) {
      const qs = withSeed(d * 77 + u.id.length, () => u.generate({ difficulty: d }));
      qs.forEach((q) => {
        out += `[d${d}] ${q.kind}: ${q.prompt}\n`;
        if (q.kind === "choice") out += `   ${q.choices.map((x) => (x.id === q.answer ? "*" : "") + x.label).join(" | ")}\n`;
        if (q.kind === "input") out += `   = ${q.answer} ${q.suffix ?? ""}\n`;
        if (q.kind === "order") out += `   ${q.items.map((i) => i.label).join(" > ")}\n`;
        if (q.kind === "sort") out += `   ${q.items.map((i) => i.label + "->" + i.bin).join("; ")}\n`;
        if (q.visual && q.visual.type === "passage") out += `   [passage] ${q.visual.paragraphs.join(" ")}\n`;
      });
    }
  }
  writeFileSync("/tmp/claude-0/-home-user-grademap/0fde0a2d-35cd-5447-a156-39b60e5819b2/scratchpad/dump.txt", out);
});
