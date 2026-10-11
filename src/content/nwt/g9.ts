import type { Course } from "../types";
import { courses as bc } from "../grades/g9";
import { nwtGrade } from "./kit";

// NWT Grade 9: the BC curriculum as adapted for the NWT.
export const courses: Course[] = nwtGrade(bc);
