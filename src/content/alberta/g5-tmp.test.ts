import { it } from "vitest";
import { writeFileSync } from "fs";
const out: any[] = [];
import { courses as bc } from "../grades/g5";
import { courses as on } from "../ontario/g5";
const all = [...bc, ...on];
const want = (process.env.IDS ?? "").split(",");
it("sample", () => {
  for (const c of all) for (const u of c.units) if (want.includes(u.id)) {
    const qs = u.generate({ difficulty: 2 });
    out.push("=== " + u.id + " / " + c.subject);
    for (const q of qs.slice(0, 6)) out.push(" - " + q.prompt + " | " + ((q as any).choices ? (q as any).choices.map((x: any) => x.label).join(" ; ") : (q as any).answer));
  }
  writeFileSync("/tmp/claude-0/g5sample.txt", out.join("\n"));
});
