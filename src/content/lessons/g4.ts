import { lesson, type GradeLessons } from "./index";

export const lessons: GradeLessons = {
  "math/numbers-to-10000": lesson(
    ["To round, look at the digit just to the right of your place.", "If it is 5 or more, round up. If it is 4 or less, stay.", "Change every digit after your place to 0."],
    "Round 4 763 to the nearest hundred.",
    ["The hundreds digit is 7. Look at the tens digit: 6.", "6 is 5 or more, so round up to 8 hundreds.", "4 800."],
    "4 800",
  ),
  "math/add-subtract": lesson(
    ["Line up the digits by place value.", "Work from the ones to the thousands.", "Regroup when a place has more than 9."],
    "4 582 + 2 749 = ?",
    ["Ones: 2 + 9 = 11. Write 1, regroup 1.", "Tens: 8 + 4 + 1 = 13. Write 3, regroup 1.", "Hundreds: 5 + 7 + 1 = 13. Write 3, regroup 1.", "Thousands: 4 + 2 + 1 = 7."],
    "7 331",
  ),
  "math/times-tables": lesson(
    ["Use facts you know to find the ones you don't.", "Split a number into easy parts.", "Division is the opposite of multiplication."],
    "7 × 8 = ?",
    ["5 × 8 = 40.", "2 × 8 = 16.", "40 + 16 = 56."],
    "56",
  ),
  "math/multiply-divide": lesson(
    ["Break the bigger number into tens and ones.", "Multiply each part.", "Add the parts back together."],
    "3 × 24 = ?",
    ["24 is 20 + 4.", "3 × 20 = 60 and 3 × 4 = 12.", "60 + 12 = 72."],
    "72",
  ),
  "math/patterns-and-tables": lesson(
    ["A table lists each step and its number.", "Find how much the numbers change each step.", "Use that rule to carry on the pattern."],
    "A pattern starts at 4 and adds 3 each time. What is the 5th number?",
    ["4, 7, 10, 13, 16.", "The 5th number is 16."],
    "16",
  ),
  "math/telling-time": lesson(
    ["An analog clock has hands. A digital clock shows numbers.", "A 24-hour clock counts the whole day: 13:00 is 1 p.m.", "For p.m. times after 12, add 12 to the hour."],
    "Write 3:45 p.m. on a 24-hour clock.",
    ["It is p.m., so add 12 to the hour.", "3 + 12 = 15."],
    "15:45",
  ),
};
