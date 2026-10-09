import { describe, expect, it } from "vitest";
import { COMPETITORS } from "@/content/compare";
import { FRAMEWORKS } from "@/content/frameworks";
import { GUIDES, GUIDE_FRAMEWORKS } from "@/content/guides";
import { GRADE_ORDER } from "@/content/subjects";
import { allCurriculumPaths } from "./curriculum";
import { allGuidePaths } from "./guides";

describe("guide pages", () => {
  const paths = allGuidePaths().map((p) => p.path);

  it("has unique paths with a trailing slash", () => {
    expect(new Set(paths).size).toBe(paths.length);
    for (const p of paths) expect(p.endsWith("/")).toBe(true);
  });

  it("does not collide with curriculum pages", () => {
    const curriculum = new Set(allCurriculumPaths());
    for (const p of paths) expect(curriculum.has(p)).toBe(false);
  });

  it("has a worksheet and a help page for every course", () => {
    for (const f of GUIDE_FRAMEWORKS) {
      const subjects = paths.filter((p) => p.startsWith(`/guides/${f.slug}/`) && p.split("/").length === 6 && !p.endsWith("/worksheet/"));
      expect(subjects.length).toBeGreaterThan(0);
      for (const s of subjects) expect(paths).toContain(`${s}worksheet/`);
    }
  });

  it("has guide copy for every framework and grade", () => {
    for (const f of FRAMEWORKS) {
      const g = GUIDES[f.id];
      if (!g) continue;
      expect(g).toBeDefined();
      for (const grade of GRADE_ORDER) expect(g.gradeNotes[grade].overview.length).toBeGreaterThan(40);
      expect(g.competencies.items.length).toBeGreaterThan(0);
      expect(g.assessment.faqs.length).toBeGreaterThan(0);
      expect(g.french.faqs.length).toBeGreaterThan(0);
    }
  });

  it("gives every competitor sources and a fair take for both sides", () => {
    for (const c of COMPETITORS) {
      expect(c.sources.length).toBeGreaterThan(0);
      for (const s of c.sources) expect(s.url.startsWith("https://")).toBe(true);
      expect(c.chooseThem.length).toBeGreaterThan(0);
      expect(c.chooseUs.length).toBeGreaterThan(0);
    }
  });
});
