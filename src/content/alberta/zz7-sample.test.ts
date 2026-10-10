import { it } from "vitest";
import { COURSES } from "../all";
import { writeFileSync } from "node:fs";
it("sample", () => {
  const out: string[] = [];
  for (const c of COURSES.filter((c) => c.grade === "7" && ["math","language","science","social"].includes(c.subject))) {
    for (const u of c.units) {
      out.push(`### ${c.subject}/${u.id}`);
      for (const q of u.generate({ difficulty: 2 }).slice(0, 3)) {
        const ch = q.kind === "choice" ? " | " + q.choices.map((x) => x.label).join(" / ") : "";
        out.push(`- ${q.prompt}${ch}`);
      }
    }
  }
  writeFileSync("/tmp/claude-0/x/g7.txt", out.join("\n"));
});
