import type { Course } from "../types";
import { courses as bc } from "../grades/g7";
import { nwtGrade } from "./kit";

// NWT Grade 7: the BC curriculum as adapted for the NWT.
export const courses: Course[] = nwtGrade(bc);
