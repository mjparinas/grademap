import { lesson, type GradeLessons } from "./index";

export const lessons: GradeLessons = {
  "math/make-5-and-10": lesson(
    ["A ten frame has 10 boxes.", "Fill boxes to show a number.", "The empty boxes show what is missing."],
    "Show 7 on a ten frame. How many more make 10?",
    ["Fill 7 boxes.", "3 boxes are empty."],
    "3",
    { type: "tenFrame", filled: 7 },
  ),
  "math/add-and-take-away": lesson(
    ["Adding puts groups together.", "Taking away means some go away.", "Count what is left or what you have in all."],
    "3 birds sit on a branch. 2 more fly in. How many now?",
    ["Start with 3.", "Count on 2 more: 4, 5."],
    "5 birds",
  ),
  "math/more-less-same": lesson(
    ["Match things one to one.", "The group with extras has more.", "If none are left over, the groups are the same."],
    "There are 5 cats and 3 dogs. Which group has more?",
    ["Match each dog to a cat.", "2 cats have no match."],
    "The cats",
  ),
  "math/patterns": lesson(
    ["A pattern repeats the same part again and again.", "Find the part that repeats.", "Say it out loud to find what comes next."],
    "red, blue, red, blue, red, ?",
    ["The part that repeats is red, blue.", "After red comes blue."],
    "blue",
  ),
  "math/shapes-and-sizes": lesson(
    ["A circle is round with no corners.", "A triangle has 3 sides.", "A square and a rectangle each have 4 sides."],
    "Which shape has 3 sides?",
    ["Count the sides on each shape.", "The triangle has 3."],
    "The triangle",
    { type: "shape", shape: "triangle" },
  ),
  "math/likely-or-unlikely": lesson(
    ["Likely means it will probably happen.", "Unlikely means it probably won't happen.", "Think about what usually happens."],
    "Is it likely that the sun comes up tomorrow?",
    ["The sun comes up every day.", "So it will probably happen."],
    "Likely",
  ),
};
