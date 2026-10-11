import { bankUnit, type Q } from "../own";

// Grade 1 math: subitizing and counting on (1.N.2, 1.N.3), then estimating and equal groups (1.N.6, 1.N.7).

const QUICK: Q[] = [
  ["A dice shows 3 dots in a row. How many dots?", "3", ["2", "4"], "Three dots in a row make 3."],
  ["Look at a dice face with 4 dots in the corners. How many?", "4", ["3", "5"], "Four dots in a square pattern make 4."],
  ["A dice face has 5 dots, like the corners and the middle. How many?", "5", ["4", "6"], "Four corners and one in the middle make 5."],
  ["A dice face has two rows of 3 dots. How many dots?", "6", ["5", "7"], "Three and three make 6."],
  ["You see 2 dots and 2 dots side by side. How many dots?", "4", ["3", "5"], "Two and two make 4."],
  ["You see 1 dot and 1 dot. How many dots?", "2", ["1", "3"], "One and one make 2."],
  ["A ten frame has 5 dots on top and none on the bottom. How many?", "5", ["10", "4"], "A full top row is 5."],
  ["A ten frame has a full top row and 2 on the bottom. How many?", "7", ["5", "6"], "Five and two more make 7."],
  ["A ten frame is full. How many dots?", "10", ["5", "8"], "A full ten frame has 10."],
  ["A ten frame has 1 empty space. How many dots?", "9", ["1", "8"], "Ten take away the 1 empty space is 9."],
  ["Count on from 5: 5, 6, 7. What comes next?", "8", ["9", "6"], "Count on: the next number is 8."],
  ["Count on from 8: 8, 9. What comes next?", "10", ["11", "7"], "After 9 comes 10."],
  ["You have 6 blocks and add 1 more. Count on: 6, …", "7", ["5", "8"], "One more than 6 is 7."],
  ["Start at 4. Count on 2 more. Where do you land?", "6", ["5", "7"], "4, then 5, then 6."],
  ["Start at 7. Count on 3 more. Where do you land?", "10", ["9", "11"], "7, then 8, 9, 10."],
  ["A group of 5 and a group of 3. Start at 5. Count on 3. Where do you land?", "8", ["7", "9"], "5, then 6, 7, 8."],
  ["Count on from 9 with 1 more. What number is it?", "10", ["8", "11"], "9, then 10."],
  ["There are 3 red and 4 blue. Start at 4 and count on 3. You land on…", "7", ["6", "8"], "4, then 5, 6, 7."],
  ["Start at 10. Count on 2 more. Where do you land?", "12", ["11", "13"], "10, then 11, 12."],
  ["Start at 12. Count on 3 more. Where do you land?", "15", ["14", "16"], "12, then 13, 14, 15."],
  ["Which is faster for 6 and 2: count all from 1, or start at 6?", "start at 6 and count on 2", ["count all from 1 to 8", "count only to 2"], "Counting on from the bigger number saves time.", true],
  ["Count on from 14: 14, 15, 16. What comes next?", "17", ["18", "15"], "After 16 comes 17.", true],
  ["Start at 16. Count on 4 more. Where do you land?", "20", ["19", "21"], "17, 18, 19, 20.", true],
  ["A ten frame has 8 dots. How many more make 10?", "2", ["1", "3"], "8 and 2 more make 10.", true],
  ["You see 4 dots and 3 dots in two groups. How many in all?", "7", ["6", "8"], "Count on from 4: 5, 6, 7.", true],
  ["Dice faces show 5 and 5. How many dots in all?", "10", ["9", "11"], "Five and five make 10.", true],
  ["A ten frame has 3 empty spaces. How many dots?", "7", ["3", "8"], "Ten take away 3 is 7.", true],
];

const GROUPS: Q[] = [
  ["There are 20 beans in a jar that is almost full. Which guess is closest?", "20", ["5", "50"], "Use what you know: a small jar holds about 20."],
  ["A ten frame has 10 dots. Is a pile of dots about the same as 10?", "Yes, about 10", ["No, about 100", "No, about 1"], "Use the ten frame as a referent to compare."],
  ["You see a few more than 10 stickers. Which guess is best?", "12", ["2", "40"], "A little more than 10 is about 12."],
  ["Which is the best guess for the number of fingers on two hands?", "10", ["5", "50"], "Ten fingers is a good referent."],
  ["A pile has about twice as many as 10. Which guess is best?", "20", ["10", "2"], "Two tens make 20."],
  ["A pile is about the same as 5. Which guess is best?", "5", ["15", "50"], "Match it to what you know."],
  ["Which number is a reasonable guess for the days in a week?", "7", ["70", "2"], "A week has 7 days."],
  ["Which is a reasonable guess for the crayons in a small box of 10?", "10", ["100", "1"], "A small box holds around 10."],
  ["An estimate is…", "a smart guess", ["a wrong answer", "a long wait"], "An estimate is close to the real number."],
  ["Which estimate is closer for 18 beans: 2 or 20?", "20", ["2", "100"], "18 is close to 20."],
  ["Which estimate is closer for 9 toys: 10 or 30?", "10", ["30", "1"], "9 is close to 10."],
  ["6 groups of 1 is how many?", "6", ["1", "7"], "Six singles make 6."],
  ["3 groups of 2 is how many?", "6", ["5", "8"], "2, 4, 6."],
  ["4 groups of 2 is how many?", "8", ["6", "10"], "2, 4, 6, 8."],
  ["5 groups of 2 is how many?", "10", ["7", "12"], "2, 4, 6, 8, 10."],
  ["2 groups of 5 is how many?", "10", ["7", "25"], "5 and 5 make 10."],
  ["3 groups of 5 is how many?", "15", ["8", "35"], "5, 10, 15."],
  ["4 groups of 5 is how many?", "20", ["9", "45"], "5, 10, 15, 20."],
  ["2 groups of 10 is how many?", "20", ["12", "102"], "10 and 10 make 20."],
  ["3 groups of 10 is how many?", "30", ["13", "310"], "10, 20, 30."],
  ["2 groups of 10 and 3 singles is how many?", "23", ["5", "32"], "Twenty and three more is 23."],
  ["1 group of 10 and 4 singles is how many?", "14", ["5", "41"], "Ten and four more is 14."],
  ["Which makes 12: 6 groups of 2 or 6 groups of 1?", "6 groups of 2", ["6 groups of 1", "2 groups of 1"], "Six twos make 12.", true],
  ["2 groups of 10 and 5 singles is how many?", "25", ["7", "52"], "Twenty and five more is 25.", true],
  ["Which shows 30: 3 groups of 10 or 10 groups of 3?", "Both", ["Only 3 groups of 10", "Neither"], "Three tens and ten threes both make 30.", true],
  ["You count 8 groups of 2 stickers. How many stickers?", "16", ["10", "18"], "2, 4, 6, 8, 10, 12, 14, 16.", true],
  ["Which is a fast way to count 20 shoes in pairs?", "Count by 2s", ["Count by 20s", "Count by 7s"], "Shoes come in pairs, so count by 2s.", true],
  ["A number up to 30 can be made as groups of 10 and…", "singles", ["clouds", "colours"], "For example, 27 is 2 tens and 7 singles.", true],
];

export const quickCounting = bankUnit({
  id: "mb-g1-quick-counting",
  title: "Quick Counting",
  emoji: "🎲",
  blurb: "See a number at a glance and count on.",
  parentNote:
    "Practises seeing small amounts at a glance on dice and ten frames, and counting on from a starting number instead of counting everything again.",
  standards: ["1.N.2, 1.N.3", "naming familiar arrangements of 1 to 10 dots, and counting on"],
  items: QUICK,
});

export const estimateAndGroups = bankUnit({
  id: "mb-g1-estimate-groups",
  title: "Guess and Group",
  emoji: "🫘",
  blurb: "Smart guesses, and counting in equal groups.",
  parentNote:
    "Practises estimating a quantity to 20 using something known, such as ten, and making numbers up to 30 from equal groups of 2, 5 or 10, with or without singles.",
  standards: ["1.N.6, 1.N.7", "estimating quantities to 20 with referents, and numbers up to 30 as equal groups with and without singles"],
  items: GROUPS,
});
