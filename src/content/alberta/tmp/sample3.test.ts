import { it } from "vitest";
import { COURSES } from "../../all";
const want = (process.env.IDS ?? "").split(",");
import { writeFileSync } from "node:fs";
const out: any[] = [];
it("sample", () => {
  for (const c of COURSES) {
    if (c.grade !== "3") continue;
    for (const u of c.units) {
      if (!want.includes(`${c.subject}/${u.id}`)) continue;
      for (const d of [1, 3] as const) {
        const qs = u.generate({ difficulty: d });
        out.push(`=== ${c.subject}/${u.id} d${d}`);
        for (const q of qs.slice(0, 5)) out.push(" -", q.prompt, "|", (q as any).visual?.text ?? "", "|", (q as any).choices?.map((x: any) => x.label).join(" / ") ?? q.kind);
      }
    }
  }
  writeFileSync("/tmp/claude-0/-home-user-grademap/9518b1db-dd94-54ab-b901-88ad3fb7fc4b/scratchpad/sample.txt", out.map((o)=>(Array.isArray(o)?o.join(" "):String(o))).join("\n"));
});
