import { lesson, type GradeLessons } from "./index";

export const lessons: GradeLessons = {
  "math/fraction-operations": lesson(
    ["To add or subtract, use a common denominator.", "To multiply, multiply the tops and multiply the bottoms.", "To divide, flip the second fraction and multiply."],
    "2/3 ÷ 4/5 = ?",
    ["Flip the second fraction: 5/4.", "2/3 × 5/4 = 10/12.", "Simplify: 5/6."],
    "5/6",
  ),
  "math/squares-and-roots": lesson(
    ["A square number is a number times itself: 3² = 3 × 3 = 9.", "A square root undoes a square: √81 = 9.", "A cube is a number multiplied 3 times: 2³ = 2 × 2 × 2 = 8."],
    "What is √81 + 3²?",
    ["√81 = 9, because 9 × 9 = 81.", "3² = 9.", "9 + 9 = 18."],
    "18",
  ),
  "math/ratios-and-rates": lesson(
    ["A ratio compares two amounts, like 2 : 3.", "A rate compares different units, like dollars per pen.", "A unit rate is the amount for 1: divide to find it."],
    "6 pens cost $4.50. What is the price for 1 pen?",
    ["Divide the cost by the number of pens.", "4.50 ÷ 6 = 0.75."],
    "$0.75 per pen",
  ),
  "math/linear-equations": lesson(
    ["Do the same thing to both sides to keep the equation balanced.", "Undo adding and subtracting first.", "Then undo multiplying and dividing."],
    "3x − 5 = 16",
    ["Add 5 to both sides: 3x = 21.", "Divide both sides by 3: x = 7."],
    "x = 7",
  ),
  "math/pythagorean-theorem": lesson(
    ["It works for right triangles only.", "The two shorter sides (legs) are a and b. The longest side, across from the right angle, is c.", "a² + b² = c²."],
    "A right triangle has legs 6 cm and 8 cm. How long is the longest side?",
    ["6² + 8² = 36 + 64 = 100.", "c = √100 = 10."],
    "10 cm",
  ),
  "math/surface-area-volume": lesson(
    ["Surface area is the area of all the faces added up.", "Volume of a cylinder: V = π × r² × h.", "Use π ≈ 3.14."],
    "A cylinder has radius 3 cm and height 5 cm. What is its volume?",
    ["r² = 3 × 3 = 9.", "V ≈ 3.14 × 9 × 5 = 141.3."],
    "About 141.3 cm³",
  ),
};
