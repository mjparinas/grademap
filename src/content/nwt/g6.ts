import type { Course } from "../types";
import { courses as bc } from "../grades/g6";
import { nwtGrade } from "./kit";


import { units as socialUnits } from "./units/g6-social";

// NWT Grade 6: the BC curriculum as adapted for the NWT.
export const courses: Course[] = nwtGrade(bc, { social: socialUnits });
