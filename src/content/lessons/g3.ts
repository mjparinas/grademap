import { lesson, type GradeLessons } from "./index";

export const lessons: GradeLessons = {
  "math/numbers-to-1000": lesson(
    ["A 3-digit number has hundreds, tens and ones.", "Each digit is worth its place: 4 in the hundreds place is 400.", "Add the parts to write the number."],
    "Write 4 hundreds, 3 tens and 6 ones as a number.",
    ["400 + 30 + 6"],
    "436",
    { type: "blocks", hundreds: 4, tens: 3, ones: 6 },
  ),
  "math/add-subtract-1000": lesson(
    ["Line up the ones, tens and hundreds.", "Start with the ones, then tens, then hundreds.", "If a place goes over 9 when adding, regroup to the next place."],
    "276 + 148 = ?",
    ["Ones: 6 + 8 = 14. Write 4 and regroup 1 ten.", "Tens: 7 + 4 + 1 = 12. Write 2 and regroup 1 hundred.", "Hundreds: 2 + 1 + 1 = 4."],
    "424",
  ),
  "math/multiplication": lesson(
    ["Multiplying means equal groups.", "3 × 4 means 3 groups of 4.", "An array shows the groups as rows and columns."],
    "4 × 5 = ?",
    ["That is 4 groups of 5.", "5 + 5 + 5 + 5 = 20."],
    "20",
    { type: "array", rows: 4, cols: 5 },
  ),
  "math/division": lesson(
    ["Dividing shares things equally or makes equal groups.", "Think of the multiplication fact that goes with it.", "Ask: what times the divisor makes the number?"],
    "20 ÷ 4 = ?",
    ["What times 4 makes 20?", "4 × 5 = 20."],
    "5",
  ),
  "math/patterns-and-equations": lesson(
    ["An equation has an = sign. Both sides are the same.", "A letter or box stands for a missing number.", "Do the opposite to find it: the opposite of + is −."],
    "n + 7 = 15",
    ["Undo + 7 by taking away 7.", "15 − 7 = 8."],
    "n = 8",
  ),
  "math/measuring": lesson(
    ["Length: millimetres, centimetres, metres and kilometres.", "Mass: grams (g) and kilograms (kg).", "Capacity: millilitres (mL) and litres (L). Pick a unit that fits."],
    "Which unit fits the mass of an apple?",
    ["An apple is light.", "Light things are measured in grams."],
    "Grams (g)",
  ),
  "math/time": lesson(
    ["The short hand shows the hour. The long hand shows the minutes.", "Each number on the clock is 5 minutes.", "Long hand on 6 means 30 minutes past."],
    "The short hand is just past the 3 and the long hand is on the 6. What time is it?",
    ["Long hand on 6: 30 minutes.", "Short hand just past 3: the hour is 3."],
    "3:30",
    { type: "clock", hour: 3, minute: 30 },
  ),
  "math/3d-objects": lesson(
    ["A face is a flat side.", "An edge is where two faces meet.", "A vertex is a corner."],
    "How many faces does a cube have?",
    ["A cube is shaped like a die.", "A die has 6 flat faces."],
    "6",
    { type: "shape", shape: "cube" },
  ),
};
