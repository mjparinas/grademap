import type { Course } from "../types";
import { courses as bc } from "../grades/g8";
import { units as socialUnits } from "./units/g8-social";
import { nwtGrade } from "./kit";

// NWT Grade 8: the BC curriculum as adapted for the NWT.
export const courses: Course[] = nwtGrade(bc, { social: socialUnits });
