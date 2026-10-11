import { describe, expect, it } from "vitest";
import { COURSES } from "../all";
import { getFramework } from "../frameworks";

describe("Yukon", () => {
  it("is selectable and reports on the BC proficiency scale", () => {
    const yukon = getFramework("yukon");
    expect(yukon.id).toBe("ca-yt");
    expect(yukon.scoringFor("4")).toBe(getFramework("ca-bc").scoringFor("4"));
  });

  it("carries every BC unit, so the two curricula share progress", () => {
    for (const c of COURSES) {
      for (const u of c.units.filter((u) => u.standards["ca-bc"])) {
        expect(u.standards["ca-yt"], `${c.grade}/${c.subject}/${u.id}`).toBe(u.standards["ca-bc"]);
      }
    }
  });

  it("adds the Yukon First Nations units to Grade 5 social studies only for Yukon", () => {
    const social = COURSES.find((c) => c.grade === "5" && c.subject === "social")!;
    const yk = social.units.filter((u) => u.id.startsWith("yk-"));
    expect(yk.length).toBe(3);
    for (const u of yk) {
      expect(u.standards["ca-yt"]).toBeTruthy();
      expect(u.standards["ca-bc"]).toBeUndefined();
    }
  });
});
