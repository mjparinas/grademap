import type { Course } from "../types";
import { courses as bc } from "../grades/g3";
import { nwtGrade } from "./kit";
import { units as socialUnits } from "./units/g3-social";

// NWT Grade 3: the BC curriculum as adapted for the NWT.
export const courses: Course[] = nwtGrade(bc, { social: socialUnits });
