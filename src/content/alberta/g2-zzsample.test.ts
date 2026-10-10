import { writeFileSync } from "node:fs";
import { it } from "vitest";
import { COURSES } from "../all";
const ids = (process.env.G2IDS ?? "").split(",");
const out: string[] = [];
it("sample", () => {
  for (const c of COURSES.filter((c) => c.grade === "2")) for (const u of c.units) {
    if (!ids.includes(`${c.subject}/${u.id}`)) continue;
    for (const d of [1, 3] as const) {
      const qs = u.generate({ difficulty: d });
      out.push(`=== ${c.subject}/${u.id} d${d}`);
      for (const q of qs.slice(0, 5)) out.push(" - " + [q.prompt, "|", JSON.stringify(q.visual ?? "").slice(0, 50), "|", (q as any).choices?.map((x: any) => x.label).join(" / ") ?? q.kind].join(" "));
    }
  }
  writeFileSync("/tmp/claude-0/ab/g2-sample.txt", out.join("\n"));
});
