import type { Course, Unit } from "../types";

// Yukon follows the BC curriculum (adapted for the Yukon), so a Yukon course is the matching BC course with Yukon's
// own standards entry. Nothing is copied: every BC unit is listed under `shares`, which adds the "ca-yt" standards
// to the BC unit, so progress is the same whichever of the two curricula a family picks.

/** A Yukon course from the BC course for the same grade and subject, plus any units written for the Yukon. */
export function yukonCourse(bc: Course, own: Unit[] = [], ownIds?: string[]): Course {
  const bcUnits = bc.units.filter((u) => u.standards["ca-bc"]);
  const shares = Object.fromEntries(bcUnits.map((u) => [u.id, { standards: { "ca-yt": u.standards["ca-bc"] } }]));
  const order = bc.order?.["ca-bc"] ?? bcUnits.map((u) => u.id);
  return {
    grade: bc.grade,
    subject: bc.subject,
    bigIdeas: { "ca-yt": bc.bigIdeas["ca-bc"] ?? [] },
    units: own,
    shares,
    order: { "ca-yt": ownIds ?? [...order, ...own.map((u) => u.id)] },
  };
}

/** A Yukon grade: every BC course, with the Yukon-only units added to the subject they belong to. */
export function yukonGrade(bc: Course[], own: Record<string, Unit[]> = {}): Course[] {
  return bc.map((c) => yukonCourse(c, own[c.subject]));
}

/** Standards text for a unit written for the Yukon. */
export function yt(area: string, text: string): Unit["standards"] {
  return { "ca-yt": `${area} · ${text}` };
}
