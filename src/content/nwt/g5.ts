import type { Course } from "../types";
import { courses as bc } from "../grades/g5";
import { nwtGrade } from "./kit";

import { units as socialUnits } from "./units/g5-social";


// NWT Grade 5: the BC curriculum as adapted for the NWT.
export const courses: Course[] = nwtGrade(bc, { social: socialUnits });
