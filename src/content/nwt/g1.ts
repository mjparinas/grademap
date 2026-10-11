import type { Course } from "../types";
import { courses as bc } from "../grades/g1";
import { nwtGrade } from "./kit";

// NWT Grade 1: the BC curriculum as adapted for the NWT.
export const courses: Course[] = nwtGrade(bc);
