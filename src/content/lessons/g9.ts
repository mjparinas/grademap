import { lesson, type GradeLessons } from "./index";

export const lessons: GradeLessons = {
  "math/rational-numbers": lesson(
    ["A rational number can be written as a fraction.", "To add or subtract, use a common denominator.", "A negative times a negative is positive."],
    "−1/2 + 3/4 = ?",
    ["Common denominator 4: −2/4 + 3/4.", "−2 + 3 = 1, so 1/4."],
    "1/4",
  ),
  "math/exponent-laws": lesson(
    ["Same base, multiply: add the exponents.", "Same base, divide: subtract the exponents.", "A power of a power multiplies the exponents. Anything to the power 0 is 1."],
    "2³ × 2⁴ = ?",
    ["The base is the same, so add the exponents: 3 + 4 = 7.", "2⁷ = 128."],
    "2⁷ = 128",
  ),
  "math/polynomials": lesson(
    ["Like terms have the same variable and exponent. Only combine those.", "To add polynomials, combine like terms.", "To expand, multiply each term inside the brackets: a(b + c) = ab + ac."],
    "(3x + 2) + (x − 5) = ?",
    ["Combine the x terms: 3x + x = 4x.", "Combine the numbers: 2 − 5 = −3."],
    "4x − 3",
  ),
  "math/multi-step-equations": lesson(
    ["Expand brackets first.", "Collect like terms.", "Then undo adding or subtracting, and finally multiplying or dividing."],
    "2(x + 3) = 14",
    ["Expand: 2x + 6 = 14.", "Subtract 6: 2x = 8.", "Divide by 2: x = 4."],
    "x = 4",
  ),
  "math/linear-relations": lesson(
    ["A line has the equation y = mx + b.", "The slope m is rise ÷ run. The y-intercept b is where the line crosses the y-axis.", "Find the slope from two points on the line."],
    "A line goes through (0, 1) and (2, 5). What is its slope?",
    ["Rise: 5 − 1 = 4.", "Run: 2 − 0 = 2.", "Slope: 4 ÷ 2 = 2."],
    "2 (so y = 2x + 1)",
  ),
};
