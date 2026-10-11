import { bankUnit, type Q } from "../own";

// Grade 2 mathematics: turning an object does not change its measurements (2.SS.5).

const ORIENT: Q[] = [
  ["A pencil is 15 cm long. You turn it to stand up. How long is it now?", "15 cm", ["10 cm", "20 cm"], "Turning does not change its length."],
  ["A book is 20 cm tall. You lay it flat. How tall is the book from top to bottom now?", "It is still 20 cm long.", ["It gets smaller.", "It disappears."], "Length stays the same however the book lies."],
  ["You turn a block upside down. Does its length change?", "no", ["yes, it gets longer", "yes, it gets shorter"], "Flipping does not change size."],
  ["You spin a ruler on the table. Does the ruler get longer?", "no", ["yes", "only when it faces north"], "Spinning does not change its size."],
  ["A rectangle is 4 squares long and 2 squares wide. You turn it to the side. How many squares long is it along the long side?", "4", ["2", "8"], "The long side is still 4 squares."],
  ["A rectangle has a long side of 6 and a short side of 3. You turn it. What is the short side now?", "3", ["6", "9"], "Turning does not change the sides."],
  ["A toy car is 10 cm long. You turn it around in a circle. How long is it?", "10 cm", ["5 cm", "20 cm"], "It stays 10 cm."],
  ["A stick is 8 cubes long. You put it standing up. How many cubes tall is it?", "8", ["4", "16"], "It is the same length either way."],
  ["You move a shape to the other side of the table. Does it change size?", "no", ["yes, it gets bigger", "yes, it gets smaller"], "Moving does not change size."],
  ["A triangle has 3 sides. You turn it. How many sides does it have?", "3", ["2", "4"], "Turning does not change the number of sides."],
  ["A square has 4 equal sides. You turn it to a diamond. How many equal sides now?", "4", ["2", "8"], "Orientation does not change attributes."],
  ["A cube has 6 faces. You tip it over. How many faces does it have?", "6", ["3", "12"], "Tipping does not change faces."],
  ["A box has 8 corners. You flip it. How many corners now?", "8", ["4", "16"], "Corners stay the same."],
  ["Maya's shoe is 18 cm long. She puts it on its side. How long is it?", "18 cm", ["9 cm", "36 cm"], "Turning does not change length."],
  ["A pencil is 12 paper clips long. You turn it around. How many clips long is it?", "12", ["6", "24"], "It stays 12."],
  ["A table is 5 hand spans wide. You spin your body to face the other way. How wide is the table?", "5 hand spans", ["10 hand spans", "2 hand spans"], "Your view changes, but not the table."],
  ["A ribbon is 30 cm long. You curl it around your finger, then stretch it out straight. Is it still 30 cm long?", "yes", ["no, it grew", "no, it shrank"], "The ribbon is the same length when straight."],
  ["Which is true about turning a shape?", "its measurements stay the same", ["its length gets bigger", "its sides disappear"], "Only the direction changes."],
  ["A leaf is 7 cm long. You hold it up. How long is it now?", "7 cm", ["14 cm", "3 cm"], "Holding it a different way does not change length.", true],
  ["A rectangle is 3 cubes wide and 5 cubes long. You turn it. What are the two measurements now?", "3 and 5", ["5 and 5", "3 and 3"], "The sides stay 3 and 5, just in a different direction.", true],
  ["A banner is 2 m long. You hang it from the ceiling top to bottom. How long is it?", "2 m", ["1 m", "4 m"], "Hanging does not change length.", true],
  ["Two pencils are lined up side by side. You turn one around. Do they stay the same length?", "yes", ["no, one grows", "no, one shrinks"], "Turning does not change the length.", true],
  ["A hexagon has 6 sides. You flip it over. How many sides does it have?", "6", ["3", "12"], "Flipping does not change the number of sides.", true],
  ["You measure a book 14 cubes long. You turn the book 90 degrees and measure again. What do you expect?", "14 cubes again", ["7 cubes", "28 cubes"], "Orientation does not change measurements.", true],
  ["A sled is 1 m long. You flip it upside down. How long is it?", "1 m", ["half a metre", "2 m"], "Same sled, same length.", true],
];

export const turnAndMeasure = bankUnit({
  id: "mb-turn-and-measure",
  title: "Turn It, Flip It, Same Size",
  emoji: "🔄",
  blurb: "Does turning a shape change how big it is?",
  parentNote: "Showing that changing the orientation of an object does not change its measurements or attributes.",
  standards: ["2.SS.5", "changing an object's orientation does not change its measurements"],
  items: ORIENT,
});
