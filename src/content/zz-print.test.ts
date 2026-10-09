import { it } from "vitest";
import { withSeed } from "./random";
import { course as math } from "./grades/g9/math";
import { course as lang } from "./grades/g9/language";
const which = process.env.COURSE === "lang" ? lang : math;
const only = process.env.UNIT;
it("print", () => {
  const out: string[] = [];
  for (const u of which.units) {
    if (only && u.id !== only) continue;
    for (const lv of [1, 2, 3] as const) {
      const qs = withSeed(42 + lv, () => u.generate({ difficulty: lv }));
      qs.slice(0, Number(process.env.N ?? 3)).forEach((q) => {
        let s = `[${u.id} L${lv}] ${q.prompt}`;
        const v = q.visual as any;
        if (v) s += `\n   VIS: ${v.type === "table" ? JSON.stringify(v.rows) : v.type === "plot" ? "plot " + JSON.stringify(v.points) : v.text ?? v.type}`;
        if (q.kind === "choice") s += `\n   ${q.choices.map((c) => (c.id === q.answer ? "*" : " ") + c.label).join(" | ")}`;
        else if (q.kind === "input") s += `\n   ANS: ${q.answer} ${q.suffix ?? ""} acc=${q.accept?.join(",") ?? ""}`;
        else if (q.kind === "order") s += `\n   ORDER: ${q.items.map((i) => i.label).join(" < ")}`;
        else if (q.kind === "sort") s += `\n   SORT`;
        s += `\n   HINT: ${q.hint}`;
        out.push(s);
      });
    }
  }
  console.log(out.join("\n"));
});
