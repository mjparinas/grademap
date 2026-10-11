import type { Course } from "../types";
import { courses as bc } from "../grades/g5";
import { yukonGrade } from "./kit";
import { units as socialUnits } from "./units/g5-social";

// Yukon Grade 5: the BC curriculum, plus the Yukon First Nations governance and citizenship units that Yukon adds
// to Social Studies 5 (Yukon Education, Student Transfer Guide 2023).
export const courses: Course[] = yukonGrade(bc, { social: socialUnits });
