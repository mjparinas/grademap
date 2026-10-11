import type { Course } from "../types";
import { courses as bc } from "../grades/k";
import { yukonGrade } from "./kit";

// Yukon Kindergarten: the BC curriculum as the Yukon teaches it.
export const courses: Course[] = yukonGrade(bc);
