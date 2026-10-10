import { it } from "vitest";
import { COURSES } from "../all";
import { writeFileSync } from "node:fs";
it("sample", () => {
  const want = (process.env.IDS ?? "").split(",");
  let out = "";
  for (const c of COURSES) if (c.grade === "8") for (const u of c.units) if (want.includes(u.id)) {
    out += `\n=== ${c.subject}/${u.id}\n`;
    for (const d of [1, 2, 3] as const) for (const q of u.generate({ difficulty: d }).slice(0, 4)) out += `d${d} ${JSON.stringify(q).slice(0, 330)}\n`;
  }
  writeFileSync(process.env.OUT ?? "/tmp/claude-0/ab/g8sample.txt", out);
});
