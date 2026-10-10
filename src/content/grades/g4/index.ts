import type { Course } from "../../types";
import { withLessons } from "../../lessons";
import { lessons } from "../../lessons/g4";
import { course as math } from "./math";
import { course as language } from "./language";
import { course as science } from "./science";
import { course as social } from "./social";
import { course as immersion } from "./immersion";

export const courses: Course[] = withLessons([math, language, science, social, immersion], lessons);
