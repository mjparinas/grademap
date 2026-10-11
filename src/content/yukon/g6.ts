import type { Course } from "../types";
import { courses as bc } from "../grades/g6";
import { yukonGrade } from "./kit";

// Yukon Grade 6: the BC curriculum as the Yukon teaches it.
export const courses: Course[] = yukonGrade(bc);
