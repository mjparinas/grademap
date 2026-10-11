import type { Course } from "../types";
import { courses as bc } from "../grades/g4";
import { units as socialUnits } from "./units/g4-social";
import { nwtGrade } from "./kit";

// NWT Grade 4: the BC curriculum as adapted for the NWT.
export const courses: Course[] = nwtGrade(bc, { social: socialUnits });
