import { courses as k } from "./grades/k";
import { courses as g1 } from "./grades/g1";
import { courses as g2 } from "./grades/g2";
import { courses as g3 } from "./grades/g3";
import { courses as g4 } from "./grades/g4";
import { courses as g5 } from "./grades/g5";
import { courses as g6 } from "./grades/g6";
import { courses as g7 } from "./grades/g7";
import { courses as onK } from "./ontario/k";
import { courses as on1 } from "./ontario/g1";
import { courses as on2 } from "./ontario/g2";
import { courses as on3 } from "./ontario/g3";
import { courses as on4 } from "./ontario/g4";
import { courses as on5 } from "./ontario/g5";
import { courses as on6 } from "./ontario/g6";
import { courses as on7 } from "./ontario/g7";
import { courses as on8 } from "./ontario/g8";
import { courses as on9 } from "./ontario/g9";
import { courses as abK } from "./alberta/k";
import { courses as ab1 } from "./alberta/g1";
import { courses as ab2 } from "./alberta/g2";
import { courses as ab3 } from "./alberta/g3";
import { courses as ab4 } from "./alberta/g4";
import { courses as ab5 } from "./alberta/g5";
import { courses as ab6 } from "./alberta/g6";
import { courses as ab7 } from "./alberta/g7";
import { courses as ab8 } from "./alberta/g8";
import { courses as ab9 } from "./alberta/g9";
import { courses as mbK } from "./manitoba/k";
import { courses as mb1 } from "./manitoba/g1";
import { courses as mb2 } from "./manitoba/g2";
import { courses as mb3 } from "./manitoba/g3";
import { courses as mb4 } from "./manitoba/g4";
import { courses as mb5 } from "./manitoba/g5";
import { courses as mb6 } from "./manitoba/g6";
import { courses as mb7 } from "./manitoba/g7";
import { courses as mb8 } from "./manitoba/g8";
import { courses as mb9 } from "./manitoba/g9";
import { courses as nsK } from "./nova-scotia/k";
import { courses as ns1 } from "./nova-scotia/g1";
import { courses as ns2 } from "./nova-scotia/g2";
import { courses as ns3 } from "./nova-scotia/g3";
import { courses as ns4 } from "./nova-scotia/g4";
import { courses as ns5 } from "./nova-scotia/g5";
import { courses as ns6 } from "./nova-scotia/g6";
import { courses as ns7 } from "./nova-scotia/g7";
import { courses as ns8 } from "./nova-scotia/g8";
import { courses as ns9 } from "./nova-scotia/g9";
import { courses as ytK } from "./yukon/k";
import { courses as yt1 } from "./yukon/g1";
import { courses as yt2 } from "./yukon/g2";
import { courses as yt3 } from "./yukon/g3";
import { courses as yt4 } from "./yukon/g4";
import { courses as yt5 } from "./yukon/g5";
import { courses as yt6 } from "./yukon/g6";
import { courses as yt7 } from "./yukon/g7";
import { courses as yt8 } from "./yukon/g8";
import { courses as yt9 } from "./yukon/g9";
import { courses as ntK } from "./nwt/k";
import { courses as nt1 } from "./nwt/g1";
import { courses as nt2 } from "./nwt/g2";
import { courses as nt3 } from "./nwt/g3";
import { courses as nt4 } from "./nwt/g4";
import { courses as nt5 } from "./nwt/g5";
import { courses as nt6 } from "./nwt/g6";
import { courses as nt7 } from "./nwt/g7";
import { courses as nt8 } from "./nwt/g8";
import { courses as nt9 } from "./nwt/g9";
import { courses as skK } from "./saskatchewan/k";
import { courses as sk1 } from "./saskatchewan/g1";
import { courses as sk2 } from "./saskatchewan/g2";
import { courses as sk3 } from "./saskatchewan/g3";
import { courses as sk4 } from "./saskatchewan/g4";
import { courses as sk5 } from "./saskatchewan/g5";
import { courses as sk6 } from "./saskatchewan/g6";
import { courses as sk7 } from "./saskatchewan/g7";
import { courses as sk8 } from "./saskatchewan/g8";
import { courses as sk9 } from "./saskatchewan/g9";
import { mergeCourses } from "./index";
import { courses as g8 } from "./grades/g8";
import { courses as g9 } from "./grades/g9";
import type { Course, GradeId, SubjectId } from "./types";

// Every grade at once, for the statically generated public pages and for tests.
// Never import this from client code (the apps): it would put all content back
// into the first download. ESLint enforces this; the apps use ./index.

/** Every course with at least one unit. */
export const COURSES: Course[] = mergeCourses([k, g1, g2, g3, g4, g5, g6, g7, g8, g9, onK, on1, on2, on3, on4, on5, on6, on7, on8, on9, abK, ab1, ab2, ab3, ab4, ab5, ab6, ab7, ab8, ab9, skK, sk1, sk2, sk3, sk4, sk5, sk6, sk7, sk8, sk9, mbK, mb1, mb2, mb3, mb4, mb5, mb6, mb7, mb8, mb9, ytK, yt1, yt2, yt3, yt4, yt5, yt6, yt7, yt8, yt9, ntK, nt1, nt2, nt3, nt4, nt5, nt6, nt7, nt8, nt9, nsK, ns1, ns2, ns3, ns4, ns5, ns6, ns7, ns8, ns9]).filter(
  (c) => c.units.length > 0,
);

export function getCourse(grade: GradeId, subject: SubjectId | string): Course | undefined {
  return COURSES.find((c) => c.grade === grade && c.subject === subject);
}
