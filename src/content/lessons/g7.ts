import { lesson, type GradeLessons } from "./index";

export const lessons: GradeLessons = {
  "math/integer-add-subtract": lesson(
    ["On a number line, adding moves right and subtracting moves left.", "A positive and a negative of the same size cancel out: +1 and −1 make 0.", "Subtracting a negative is the same as adding a positive."],
    "−3 + 5 = ?",
    ["Start at −3 on the number line.", "Move 5 to the right: −2, −1, 0, 1, 2."],
    "2",
  ),
  "math/decimal-operations": lesson(
    ["To add or subtract, line up the decimal points.", "Fill empty places with zeros so the numbers match.", "Then add or subtract like whole numbers."],
    "3.45 + 2.8 = ?",
    ["Write 2.8 as 2.80 and line up the points.", "3.45 + 2.80 = 6.25."],
    "6.25",
  ),
  "math/fractions-decimals-percents": lesson(
    ["A fraction to a decimal: divide the top by the bottom.", "A decimal to a percent: multiply by 100.", "Percent means out of 100."],
    "Write 3/4 as a decimal and a percent.",
    ["3 ÷ 4 = 0.75.", "0.75 × 100 = 75%."],
    "0.75 = 75%",
  ),
  "math/coordinates-transformations": lesson(
    ["A point is (x, y). Go across for x, then up or down for y.", "A translation adds or subtracts from x and y.", "A reflection in the x-axis changes the sign of y."],
    "Move the point (2, 3) right 4 and down 1. Where does it land?",
    ["Right 4: x = 2 + 4 = 6.", "Down 1: y = 3 − 1 = 2."],
    "(6, 2)",
  ),
  "math/linear-relations": lesson(
    ["A table pairs each x with a y.", "Look for how y changes each time x goes up by 1.", "Use that change to carry the pattern on."],
    "x = 1, 2, 3 gives y = 5, 8, 11. What is y when x = 4?",
    ["y goes up by 3 each time.", "11 + 3 = 14."],
    "14",
  ),
  "math/two-step-equations": lesson(
    ["Keep the equation balanced: do the same to both sides.", "Undo the adding or subtracting first.", "Then undo the multiplying or dividing."],
    "2x + 3 = 11",
    ["Subtract 3 from both sides: 2x = 8.", "Divide both sides by 2: x = 4."],
    "x = 4",
  ),
  "math/circles": lesson(
    ["The radius goes from the centre to the edge. The diameter goes all the way across: d = 2r.", "Circumference (the distance around) is C = π × d.", "Area is A = π × r × r. Use π ≈ 3.14."],
    "A circle has diameter 10 cm. What is its circumference?",
    ["C = π × d.", "C ≈ 3.14 × 10 = 31.4."],
    "About 31.4 cm",
  ),
  "math/volume": lesson(
    ["Volume is the amount of space inside a 3D object.", "For a prism: volume = area of the base × height.", "Volume is measured in cubic units, like cm³."],
    "A box is 4 cm long, 3 cm wide and 2 cm high. What is its volume?",
    ["Base area: 4 × 3 = 12 cm².", "Volume: 12 × 2 = 24."],
    "24 cm³",
  ),
  "math/circle-graphs": lesson(
    ["A circle graph shows parts of a whole.", "The whole circle is 100% and 360°.", "Find a part's angle by taking that percent of 360°."],
    "A part of a circle graph is 25%. What angle is it?",
    ["25% = 0.25.", "0.25 × 360° = 90°."],
    "90°",
  ),
  "math/probability": lesson(
    ["Probability = favourable outcomes ÷ all possible outcomes.", "It is always between 0 (impossible) and 1 (certain).", "For two events, list every outcome so none are missed."],
    "You roll a die. What is the probability of an even number?",
    ["Even numbers: 2, 4, 6. That is 3 outcomes.", "There are 6 outcomes in all.", "3/6 = 1/2."],
    "1/2",
  ),
};
