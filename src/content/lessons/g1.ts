import { lesson, type GradeLessons } from "./index";

export const lessons: GradeLessons = {
  "math/make-ten": lesson(
    ["Some pairs make 10: 6 and 4, 7 and 3, 8 and 2.", "Start at one number and count up to 10.", "The steps you counted are the other number."],
    "7 + ? = 10",
    ["Start at 7.", "Count up: 8, 9, 10. That is 3 steps."],
    "3",
    { type: "tenFrame", filled: 7 },
  ),
  "math/adding": lesson(
    ["Adding puts groups together.", "Start with the bigger number.", "Count on the smaller number."],
    "5 + 3 = ?",
    ["Start at 5.", "Count on 3: 6, 7, 8."],
    "8",
  ),
  "math/take-away": lesson(
    ["Taking away means some go away.", "Start with the whole group.", "Count back the number you take away."],
    "9 − 4 = ?",
    ["Start at 9.", "Count back 4: 8, 7, 6, 5."],
    "5",
  ),
  "math/equal-or-not": lesson(
    ["The = sign means both sides are the same amount.", "Work out one side first.", "Then find what the other side needs."],
    "3 + 4 = 5 + ?",
    ["3 + 4 is 7.", "5 + 2 is 7, so ? is 2."],
    "2",
  ),
  "math/patterns": lesson(
    ["Some patterns grow. They go up by the same amount.", "Find how much it goes up each time.", "Use that to find the next one."],
    "2, 4, 6, 8, ?",
    ["Each number is 2 more.", "8 + 2 = 10."],
    "10",
  ),
  "math/measuring": lesson(
    ["Start at the very end of the thing.", "Use units that are all the same size.", "Leave no gaps. Count the units."],
    "A book is 5 cubes long. A pencil is 8 cubes long. Which is longer?",
    ["Compare 5 and 8.", "8 is more than 5."],
    "The pencil",
  ),
  "math/shapes": lesson(
    ["Flat shapes have sides and corners.", "Solid shapes can roll, stack or slide.", "A sphere rolls every way, like a ball."],
    "Which solid shape rolls every way, like a ball?",
    ["A cube has flat sides, so it slides.", "Only a sphere rolls every way."],
    "A sphere",
  ),
};
