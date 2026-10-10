import type { Course } from "../../types";
import { withLessons } from "../../lessons";
import { lessons } from "../../lessons/g5";
import { course as math } from "./math";
import { course as language } from "./language";
import { course as science } from "./science";
import { course as social } from "./social";
import { course as immersion } from "./immersion";
import { course as coreFrench } from "./core-french";

export const courses: Course[] = withLessons([math, language, science, social, immersion, coreFrench], lessons);
