import { it } from "vitest";
import { writeFileSync } from "node:fs";
import { withSeed } from "./random";
import { course as math } from "./grades/g12/math";
import { course as lang } from "./grades/g12/language";
const OUT = "/tmp/claude-0/-home-user-grademap/0fde0a2d-35cd-5447-a156-39b60e5819b2/scratchpad/";
function dump(course: typeof math, file: string, per = 4) {
  let out = "";
  for (const u of course.units) {
    out += `\n===== ${u.id}\n`;
    for (const lv of [1, 2, 3] as const) {
      const qs = withSeed(lv * 7 + 3 + Number(process.env.SEEDX ?? 0), () => u.generate({ difficulty: lv }));
      out += `-- level ${lv}\n`;
      qs.slice(0, per + 4).forEach((q, i) => {
        out += `${i + 1}. [${q.kind}] ${q.prompt}\n`;
        if (q.visual) out += `   (visual ${q.visual.type}${q.visual.type === "passage" ? ": " + q.visual.paragraphs.join(" / ").slice(0, 80) : ""})\n`;
        if (q.kind === "choice") q.choices.forEach((c) => (out += `   ${c.id === q.answer ? "*" : " "} ${c.label}\n`));
        else if (q.kind === "input") out += `   = ${q.answer}  (${q.keypad})\n`;
        else if (q.kind === "order") out += `   order: ${q.items.map((i) => i.label).join(" | ")}\n`;
        else if (q.kind === "sort") out += `   sort: ${q.items.map((i) => i.label + ">" + i.bin).join(" | ")}\n`;
        out += `   hint: ${q.hint}\n`;
      });
    }
  }
  writeFileSync(OUT + file, out);
}
it("dump", () => {
  dump(math, "math.txt");
  if (lang.units.length) dump(lang as never, "lang.txt");
});
