import { lesson, type GradeLessons } from "./index";

export const lessons: GradeLessons = {
  "math/facts-to-20": lesson(
    ["Use 10 as a stepping stone.", "Break one number to make a 10 with the other.", "Then add what is left over."],
    "8 + 5 = ?",
    ["8 needs 2 more to make 10.", "Take 2 from 5. That leaves 3.", "10 + 3 = 13."],
    "13",
  ),
  "math/adding-to-100": lesson(
    ["Add the tens first.", "Then add the ones.", "Put the two answers together. To take away, work the same way."],
    "34 + 25 = ?",
    ["Tens: 30 + 20 = 50.", "Ones: 4 + 5 = 9.", "50 + 9 = 59."],
    "59",
  ),
  "math/patterns": lesson(
    ["Look at how much each number changes.", "That change is the rule.", "Use the rule to find the next number."],
    "5, 10, 15, 20, ?",
    ["Each step adds 5.", "20 + 5 = 25."],
    "25",
  ),
  "math/measuring": lesson(
    ["Centimetres (cm) measure short lengths.", "Metres (m) measure long lengths.", "Line up the 0 on the ruler with one end."],
    "Would you measure a pencil in cm or m?",
    ["A pencil is short.", "Short things use centimetres."],
    "cm",
  ),
};
