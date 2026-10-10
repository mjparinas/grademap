import { it } from "vitest";
import { writeFileSync } from "node:fs";
import { COURSES } from "../all";
it("sample", () => {
  const ids = ["exponent-laws","rational-numbers","polynomials","multi-step-equations","linear-relations","similarity-and-scale","statistics-in-society","close-reading","literary-elements","argument-and-rhetoric","grammar-and-style","language-and-style","voices-and-perspectives","word-parts-9","devices-9","digital-9","revise-edit-9","forms-features-9","cells-from-cells","reproduction","ecosystems","bonding-and-reactions","atoms-and-electrons","electric-current","static-charges-9","circuits-9","electrical-energy-9","space-9","compounds-9","periodic-table-9","atoms-9","stem-skills-9","ecosystems-9","climate-change-9","photosynthesis-respiration-9","migration-and-population","indigenous-peoples-and-canada","confederation-and-expansion","resources-9","industries-9","sustainable-development-9","population-patterns-9"];
  let out = "";
  for (const c of COURSES.filter(c => c.grade==="9")) for (const u of c.units) if (ids.includes(u.id)) {
    out += `\n##### ${c.subject}/${u.id} — ${u.title}\n`;
    for (const d of [2] as const) for (const q of u.generate({difficulty:d})) out += `- ${q.prompt} :: ${q.kind==="choice"? q.choices.find(x=>x.id===q.answer)?.label+" | "+q.choices.map(x=>x.label).join(" / ") : (q as any).answer ?? ""}\n`;
  }
  writeFileSync("/tmp/claude-0/ab/s9/sample.txt", out);
});
