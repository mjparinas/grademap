import type { Course } from "../types";
import { courses as bc } from "../grades/g2";
import { nwtGrade } from "./kit";

// NWT Grade 2: the BC curriculum as adapted for the NWT.
export const courses: Course[] = nwtGrade(bc);
