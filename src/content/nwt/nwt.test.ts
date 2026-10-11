import { describe, expect, it } from "vitest";
import { COURSES } from "../all";
import { getFramework } from "../frameworks";

describe("Northwest Territories", () => {
  it("is selectable and reports on the BC proficiency scale", () => {
    const nwt = getFramework("northwest-territories");
    expect(nwt.id).toBe("ca-nt");
    expect(nwt.scoringFor("4")).toBe(getFramework("ca-bc").scoringFor("4"));
  });

  it("carries every BC unit, so the curricula share progress", () => {
    for (const c of COURSES) {
      for (const u of c.units.filter((u) => u.standards["ca-bc"])) {
        expect(u.standards["ca-nt"], `${c.grade}/${c.subject}/${u.id}`).toBe(u.standards["ca-bc"]);
      }
    }
  });

  it("adds Our Territory, Dene Kede and Inuuqatigiit to social studies only for the NWT", () => {
    const own = COURSES.flatMap((c) => c.units.filter((u) => u.id.startsWith("nt-")).map((u) => ({ g: c.grade, s: c.subject, u })));
    expect(own.map((o) => `${o.g}/${o.s}/${o.u.id}`).sort()).toEqual(["3/social/nt-our-territory", "5/social/nt-dene-kede", "6/social/nt-inuuqatigiit"]);
    for (const { u } of own) {
      expect(u.standards["ca-nt"]).toBeTruthy();
      expect(u.standards["ca-bc"]).toBeUndefined();
    }
  });
});
