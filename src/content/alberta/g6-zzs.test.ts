import { it } from "vitest";
import { writeFileSync } from "node:fs";
import { COURSES } from "../all";
const ids = (process.env.IDS ?? "").split(",");
const subj = process.env.SUBJ ?? "math";
const n = Number(process.env.N ?? 4);
it("sample", () => {
  let out = "";
  for (const c of COURSES.filter((c) => c.grade === "6" && c.subject === subj)) for (const u of c.units) {
    if (!ids.includes(u.id)) continue;
    out += `\n## ${u.id}\n`;
    for (const d of [1, 3] as const) for (const q of u.generate({ difficulty: d }).slice(0, n)) {
      const qq = q as any;
      out += `d${d} ${qq.prompt} | ${(qq.choices ?? []).map((x: any) => x.label ?? x.text ?? JSON.stringify(x)).join(" / ")} | ${qq.kind ?? ""}\n`;
    }
  }
  writeFileSync("/tmp/claude-0/s/g6out.txt", out);
});
