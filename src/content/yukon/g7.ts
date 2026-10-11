import type { Course } from "../types";
import { courses as bc } from "../grades/g7";
import { yukonGrade } from "./kit";

// Yukon Grade 7: the BC curriculum as the Yukon teaches it.
export const courses: Course[] = yukonGrade(bc);
