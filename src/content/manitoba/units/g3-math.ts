import { bankUnit, type Q } from "../own";

// Grade 3 math, shape and space: sorting regular and irregular polygons (3.SS.7).

const POLY: Q[] = [
  ["A polygon is a closed shape with…", "straight sides", ["only curved sides", "no sides"], "Polygons have straight sides and are closed."],
  ["How many sides does a triangle have?", "3", ["4", "5"], "Tri means three."],
  ["How many sides does a quadrilateral have?", "4", ["3", "5"], "Quad means four."],
  ["How many sides does a pentagon have?", "5", ["6", "8"], "Penta means five."],
  ["How many sides does a hexagon have?", "6", ["5", "8"], "Hexa means six."],
  ["How many sides does an octagon have?", "8", ["6", "10"], "A stop sign is an octagon."],
  ["A stop sign has the shape of an…", "octagon", ["hexagon", "pentagon"], "It has 8 sides."],
  ["Which shape is a polygon?", "A square", ["A circle", "An oval"], "A circle has no straight sides."],
  ["A regular polygon has…", "all sides and all angles equal", ["only one side", "no angles"], "Regular means all sides are the same length and all angles match."],
  ["An irregular polygon has…", "sides or angles that are not all equal", ["only equal sides", "no sides"], "Not every side is the same."],
  ["Which is a regular polygon?", "A square", ["A rectangle that is 2 by 5", "A triangle with sides 3, 4, 5"], "A square has 4 equal sides and equal angles."],
  ["A rectangle that is 3 cm wide and 6 cm long is…", "irregular", ["regular", "not a quadrilateral"], "Its sides are not all equal."],
  ["A triangle with three equal sides is…", "regular", ["irregular", "a quadrilateral"], "All three sides match."],
  ["A triangle with sides 3 cm, 4 cm and 5 cm is…", "irregular", ["regular", "a pentagon"], "Its sides are different lengths."],
  ["Which has 6 equal sides?", "A regular hexagon", ["A regular pentagon", "A square"], "Hexa means six."],
  ["A square is a type of…", "quadrilateral", ["triangle", "pentagon"], "It has 4 sides."],
  ["A rhombus has four…", "equal sides", ["curved sides", "right angles only"], "A rhombus is a quadrilateral with 4 equal sides."],
  ["How many corners (vertices) does a pentagon have?", "5", ["4", "6"], "The number of corners equals the number of sides."],
  ["How many corners does a hexagon have?", "6", ["5", "8"], "6 sides, 6 corners."],
  ["A shape with 3 corners is a…", "triangle", ["rectangle", "hexagon"], "Three corners, three sides."],
  ["Sort: a polygon with 4 sides is a…", "quadrilateral", ["triangle", "hexagon"], "Four sides: quadrilateral."],
  ["A honeycomb cell is usually shaped like a…", "hexagon", ["triangle", "circle"], "Honeycomb cells have six sides."],
  ["Which shape is NOT a polygon?", "A circle", ["A triangle", "A pentagon"], "Circles have no straight sides."],
  ["A shape has 5 sides, all different lengths. It is an…", "irregular pentagon", ["regular hexagon", "regular pentagon"], "Five sides: pentagon; unequal sides: irregular."],
  ["A shape has 8 equal sides and 8 equal angles. It is a…", "regular octagon", ["irregular octagon", "regular hexagon"], "Eight equal sides and angles.", true],
  ["Which statement is true?", "Every square is a quadrilateral", ["Every quadrilateral is a square", "A circle is a polygon"], "Squares have four sides, but other quadrilaterals exist.", true],
  ["A shape has 7 sides. It is a…", "heptagon", ["hexagon", "octagon"], "Hepta means seven.", true],
];

export const polygons = bankUnit({
  id: "mb-polygons",
  title: "Sorting Polygons",
  emoji: "🔷",
  blurb: "Triangles, quadrilaterals, pentagons, hexagons and octagons, regular and irregular.",
  parentNote:
    "Practises naming polygons by their number of sides and sorting them as regular (all sides and angles equal) or irregular.",
  standards: ["3.SS.7", "sorting regular and irregular polygons by the number of sides"],
  items: POLY,
});
