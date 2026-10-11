import type { Course } from "../types";
import { courses as bc } from "../grades/k";
import { nwtGrade } from "./kit";

// NWT Grade k: the BC curriculum as adapted for the NWT.
export const courses: Course[] = nwtGrade(bc);
