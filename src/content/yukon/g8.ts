import type { Course } from "../types";
import { courses as bc } from "../grades/g8";
import { yukonGrade } from "./kit";

// Yukon Grade 8: the BC curriculum as the Yukon teaches it.
export const courses: Course[] = yukonGrade(bc);
