import { bankUnit, type Q } from "../own";

// Kindergarten math, outcomes not covered elsewhere: seeing small amounts at a glance (K.N.2) and building and describing 3-D objects (K.SS.3).

const WORDS = ["", "one", "two", "three", "four", "five", "six"];
const near = (n: number): string[] => {
  const all = [1, 2, 3, 4, 5, 6].filter((x) => x !== n);
  const pick = [n - 1, n + 1].filter((x) => x >= 1 && x <= 6);
  for (const x of all) if (pick.length < 3 && !pick.includes(x)) pick.push(x);
  return pick.slice(0, 3).map(String);
};
const DICE = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
const DOTS: string[] = ["", "●", "● ●", "● ● ●", "●●  ●●", "●●●  ●●", "●●●  ●●●"];

const quick: Q[] = [];
for (let n = 1; n <= 6; n++) {
  quick.push([`How many? ${DOTS[n]}`, String(n), near(n), `Look at the dots without counting each one. Count in small groups: ${WORDS[n]} in all.`]);
  quick.push([`How many stars? ${"★".repeat(n)}`, String(n), near(n), `Look quickly, then check. There are ${WORDS[n]}.`]);
  quick.push([`How many dots on the die? ${DICE[n]}`, String(n), near(n), `A die shows its dots in a pattern. This one has ${WORDS[n]}.`, n > 3 ? true : undefined] as unknown as Q);
}
quick.push(
  ["Which shows 3? ●●●  or  ●●●●", "●●●", ["●●●●"], "Three is one fewer than four."],
  ["Which shows 5? ●●●●●  or  ●●●", "●●●●●", ["●●●"], "Five dots is more than three dots."],
  ["Which shows 2? ● ●  or  ● ● ● ●", "● ●", ["● ● ● ●"], "Two is a small group. Four is a bigger group."],
  ["Which is 6? ●●●  ●●●  or  ●●  ●●", "●●●  ●●●", ["●●  ●●"], "Two groups of three make six.", true],
  ["Two dots and one more dot make…", "3", ["2", "4", "5"], "2 and 1 more is 3.", true],
  ["A die shows ⚃. Another die shows ⚀. Which has more dots?", "⚃", ["⚀"], "Four is more than one.", true],
);

const build: Q[] = [
  ["Which 3-D object is a ball?", "sphere", ["cube", "cone", "cylinder"], "A sphere is round all over, like a ball."],
  ["Which 3-D object is like a box?", "cube", ["sphere", "cone", "cylinder"], "A cube has flat sides like a box."],
  ["Which 3-D object is like a can of soup?", "cylinder", ["sphere", "cube", "cone"], "A cylinder has two flat circles and a curved side."],
  ["Which 3-D object is like an ice cream cone?", "cone", ["sphere", "cube", "cylinder"], "A cone has a point at the top and a circle on the bottom."],
  ["Which object can roll like a ball?", "sphere", ["cube", "pyramid"], "A sphere is round, so it rolls every way."],
  ["Which object will slide but not roll?", "cube", ["sphere", "cylinder"], "Flat sides slide and do not roll."],
  ["A cube has flat sides called…", "faces", ["wheels", "wings"], "The flat sides of a 3-D object are called faces."],
  ["Which object has a point on top?", "cone", ["cube", "sphere"], "A cone comes to a point."],
  ["Which object has no flat sides?", "sphere", ["cube", "cylinder"], "A sphere is curved everywhere."],
  ["Which object can stack tall, like blocks?", "cube", ["sphere", "cone"], "Flat faces sit neatly on top of each other."],
  ["What 3-D object is a tent shaped like?", "triangular prism", ["sphere", "cylinder", "cone"], "A tent has triangle ends and flat sides.", true],
  ["You build a tower with blocks. Which block goes on the bottom?", "a flat, wide block", ["a ball", "a pointy cone"], "A flat base keeps a tower from falling over."],
  ["Which block do you use to build a round pillar?", "cylinder", ["cube", "sphere"], "A cylinder is shaped like a pillar."],
  ["A can of juice is a…", "cylinder", ["cube", "sphere", "cone"], "A can has a curved side and flat circles on the ends."],
  ["A basketball is a…", "sphere", ["cube", "cylinder", "cone"], "A basketball is round all over."],
  ["A game die is a…", "cube", ["sphere", "cone", "cylinder"], "A die has six flat square faces."],
  ["A party hat is a…", "cone", ["cube", "sphere", "cylinder"], "A party hat has a point and a round bottom."],
  ["Which two objects both roll?", "sphere and cylinder", ["cube and sphere", "cube and cone"], "Round things roll. Two of these are round."],
  ["How many flat faces does a cube have?", "6", ["2", "4", "8"], "A cube has six square faces, like a die.", true],
  ["Which describes a ball?", "It is round and has no corners.", ["It has six flat sides.", "It has a point on top."], "A sphere is curved and smooth."],
  ["Which describes a box?", "It has flat sides and corners.", ["It is round everywhere.", "It has no corners."], "A box has faces, edges and corners."],
  ["I have two flat circles and a curved side. What am I?", "cylinder", ["cube", "sphere", "cone"], "Think of a can.", true],
  ["I have one point and one flat circle. What am I?", "cone", ["cylinder", "sphere", "cube"], "Think of an ice cream cone.", true],
  ["Which blocks could you use to build a small house?", "cubes and a triangular prism", ["only balls", "only cones"], "Flat blocks stack for walls. A prism makes a roof.", true],
  ["You describe your block. It has corners and flat faces. It is a…", "cube", ["sphere", "ball"], "Only the cube has corners and flat faces here."],
];

export const mathUnits = [
  bankUnit({
    id: "mb-k-quick-look",
    title: "Quick Look Counting",
    emoji: "👀",
    blurb: "How many? See it in a flash!",
    parentNote:
      "Practises seeing small amounts, 1 to 6, at a glance in familiar arrangements such as dice and dot patterns, without counting one by one. Ask your child to tell you how they saw it: “I saw 2 and 2.”",
    standards: ["K.N.2", "subitizing and naming familiar arrangements of 1 to 6 dots or objects"],
    items: quick,
  }),
  bankUnit({
    id: "mb-k-build-3d",
    title: "Build with Blocks",
    emoji: "🧱",
    blurb: "Balls, boxes, cans and cones.",
    parentNote:
      "Practises naming and describing 3-D objects (sphere, cube, cylinder, cone) by how they look and move, and choosing blocks to build with. At home, build a tower and talk about which block goes where and why.",
    standards: ["K.SS.3", "building and describing 3-D objects"],
    items: build,
  }),
];
