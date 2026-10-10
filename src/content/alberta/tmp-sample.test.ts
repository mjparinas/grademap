import { writeFileSync } from "node:fs";
import { it } from "vitest";
import { COURSES } from "../all";
const want = (process.env.U ?? "").split(",");
const out: string[] = [];
it("sample", () => {
  for (const c of COURSES) if (c.grade === "1") for (const u of c.units) if (want.includes(`${c.subject}/${u.id}`)) {
    for (const d of [1, 3] as const) {
      const qs = u.generate({ difficulty: d });
      out.push(`\n### ${c.subject}/${u.id} d${d}`);
      for (const q of qs.slice(0, 5)) out.push(` - ${q.prompt} | ${q.kind === "choice" ? q.choices.map((x) => x.label).join("/") : q.kind}`);
    }
  }
  writeFileSync(process.env.OUT!, out.join("\n"));
});
