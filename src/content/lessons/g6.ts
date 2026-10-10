import { lesson, type GradeLessons } from "./index";

export const lessons: GradeLessons = {
  "math/decimal-multiply-divide": lesson(
    ["Multiply as if there were no decimal points.", "Count the decimal places in the numbers you started with.", "Give your answer that many decimal places."],
    "0.6 × 4 = ?",
    ["Ignore the point: 6 × 4 = 24.", "0.6 has 1 decimal place.", "So the answer has 1 decimal place: 2.4."],
    "2.4",
  ),
  "math/patterns-and-graphs": lesson(
    ["A rule links x and y, like y = 2x + 1.", "Put a number in for x to find y.", "Plot each (x, y) point. A straight line shows a steady pattern."],
    "For y = 2x + 1, what is y when x = 3?",
    ["Replace x with 3.", "2 × 3 = 6.", "6 + 1 = 7."],
    "7",
  ),
  "math/equations": lesson(
    ["Follow the order of operations: brackets first.", "Then multiply and divide, left to right.", "Then add and subtract, left to right."],
    "4 + 3 × 2 = ?",
    ["Multiply first: 3 × 2 = 6.", "Then add: 4 + 6 = 10."],
    "10",
  ),
  "math/transformations": lesson(
    ["A translation slides a shape without turning it.", "A reflection flips a shape over a line.", "A rotation turns a shape around a point."],
    "A shape moves 3 squares to the right and does not turn or flip. Which transformation is it?",
    ["It only slides.", "A slide is a translation."],
    "A translation",
  ),
};
