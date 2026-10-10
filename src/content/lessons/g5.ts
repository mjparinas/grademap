import { lesson, type GradeLessons } from "./index";

export const lessons: GradeLessons = {
  "math/patterns-and-equations": lesson(
    ["A pattern rule tells how each term changes.", "A letter, like n, stands for a mystery number.", "Do the opposite operation to find it: the opposite of × is ÷."],
    "n × 4 = 28",
    ["Undo × 4 by dividing by 4.", "28 ÷ 4 = 7."],
    "n = 7",
  ),
};
