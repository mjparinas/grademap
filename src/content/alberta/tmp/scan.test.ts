import { it } from "vitest";
import { writeFileSync } from "node:fs";
import { COURSES } from "../../all";
it("scan", () => {
  const out: string[] = [];
  const want = (process.env.IDS ?? "").split(",");
  for (const c of COURSES) {
    if (c.grade !== "3") continue;
    for (const u of c.units) {
      if (!want.includes(c.subject + "/" + u.id)) continue;
      const seen = new Set<string>();
      for (let i = 0; i < 25; i++) for (const d of [1, 2, 3] as const) for (const q of u.generate({ difficulty: d })) seen.add(JSON.stringify(q));
      for (const s of seen) if (/Ontario|British Columbia|\bBC\b|B\.C\.|Toronto|Vancouver|Ottawa|Quebec|Niagara|Haida|Salish|Métis|Inuit|First Nation|Indigenous/i.test(s)) out.push(c.subject + "/" + u.id + " :: " + s.slice(0, 260));
      out.push("##count " + u.id + " " + seen.size);
    }
  }
  writeFileSync("/tmp/claude-0/-home-user-grademap/9518b1db-dd94-54ab-b901-88ad3fb7fc4b/scratchpad/scan.txt", out.join("\n"));
});
