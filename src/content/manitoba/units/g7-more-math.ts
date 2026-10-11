import { bankUnit, type Q } from "../own";

// Grade 7 geometric constructions (7.SS.3): perpendicular and parallel lines, perpendicular bisectors and angle bisectors.

const ITEMS: Q[] = [
  ["Perpendicular lines meet at…", "a right angle (90°)", ["a straight angle (180°)", "an acute angle (45°)", "no angle"], "Perpendicular means at 90° to each other."],
  ["Parallel lines are lines that…", "stay the same distance apart and never meet", ["cross at a right angle", "cross at one point", "curve toward each other"], "Think of railway tracks."],
  ["Which pair of lines is perpendicular?", "the sides of a square that meet at a corner", ["two opposite sides of a square", "the rails of a straight track", "two lines that never cross"], "A square's neighbouring sides form 90° corners."],
  ["Which pair of lines is parallel?", "the opposite sides of a rectangle", ["two sides that meet at a corner", "the hands of a clock at 3:00", "a vertical and a horizontal line"], "Opposite sides stay the same distance apart."],
  ["Which two tools are used for classic constructions?", "a compass and a straightedge", ["a thermometer and a clock", "a scale and a stopwatch", "a calculator and a pencil only"], "A compass draws arcs, and a straightedge draws lines."],
  ["What does a compass draw in a construction?", "arcs and circles", ["straight lines", "angles of 90° only", "parallel lines only"], "The needle point is fixed, and the pencil swings around."],
  ["The compass width is not changed while you draw two arcs of the same size. Why?", "So the arcs have equal radii", ["So the pencil lasts longer", "So the line is straight", "So the angle becomes 90°"], "A fixed width means a fixed radius."],
  ["A perpendicular bisector of a line segment…", "cuts it in half at a right angle", ["cuts it in thirds", "is parallel to it", "is the same as the segment"], "It is both a bisector and perpendicular."],
  ["A line segment is 12 cm long. Its perpendicular bisector meets it at a point how far from each end?", "6 cm", ["12 cm", "3 cm", "4 cm"], "A bisector splits the segment into two equal parts."],
  ["A segment is 9 cm long. Its midpoint is how far from each endpoint?", "4.5 cm", ["9 cm", "3 cm", "5 cm"], "9 ÷ 2 = 4.5."],
  ["What angle does a perpendicular bisector make with the segment it bisects?", "90°", ["45°", "60°", "180°"], "Perpendicular means at a right angle."],
  ["To construct a perpendicular bisector of segment AB, you draw arcs from A and B with…", "the same compass width, more than half of AB", ["different widths", "a width less than half of AB", "no arcs at all"], "Equal arcs from both ends cross above and below the segment."],
  ["After drawing the arcs from A and B, you join…", "the two points where the arcs cross", ["A and B only", "the arcs' centres", "the page's corners"], "Those two points are on the perpendicular bisector."],
  ["An angle bisector…", "divides an angle into two equal angles", ["doubles the angle", "makes the angle 90°", "removes the angle"], "Bi- means two."],
  ["If a 70° angle is bisected, each part measures…", "35°", ["70°", "140°", "20°"], "70 ÷ 2 = 35."],
  ["If a 90° angle is bisected, each part measures…", "45°", ["30°", "90°", "180°"], "90 ÷ 2 = 45."],
  ["If a 120° angle is bisected, each part measures…", "60°", ["30°", "120°", "240°"], "120 ÷ 2 = 60."],
  ["Each of the two parts of a bisected angle measures 25°. The original angle measures…", "50°", ["25°", "12.5°", "100°"], "25 + 25 = 50."],
  ["To bisect angle ABC, you first draw an arc from B that crosses…", "both arms of the angle", ["only one arm", "neither arm", "the page edge"], "The arc marks equal distances on both arms."],
  ["In the angle bisector construction, you then draw two arcs of equal radius from…", "the points where the first arc crossed the arms", ["the vertex only", "the edge of the page", "any random point"], "Their crossing point is on the bisector."],
  ["The bisector ray passes through the vertex and…", "the point where the two arcs cross", ["the end of the page", "the midpoint of the arc", "the centre of the compass"], "Draw the ray with a straightedge."],
  ["A line is drawn to separate an angle into 30° and 30°. This line is called the…", "angle bisector", ["perpendicular bisector", "parallel line", "diagonal"], "It cuts the angle in half."],
  ["To construct a line perpendicular to a given line through a point on the line, you can use…", "arcs from the point on both sides, then arcs from those marks", ["only a ruler", "a thermometer", "no tools"], "Arcs create equal distances to build a perpendicular."],
  ["A set square can be used to draw…", "perpendicular and parallel lines", ["circles", "arcs of any size", "only curved lines"], "Its right angle makes a 90° line.", true],
  ["To draw a line parallel to a given line using a ruler and a set square, you…", "slide the set square along the ruler", ["rotate the paper", "use the compass only", "draw a curve"], "Sliding keeps the direction the same.", true],
  ["Opposite sides of a parallelogram are…", "parallel", ["perpendicular", "different lengths", "curved"], "That is its defining property."],
  ["The diagonals of a square are…", "perpendicular bisectors of each other", ["parallel", "unequal in length", "equal to the sides"], "They cross at 90° and cut each other in half.", true],
  ["The diagonals of a rectangle that is not a square…", "bisect each other but are not perpendicular", ["are perpendicular", "are parallel", "do not cross"], "They cross at the midpoint but not at 90°.", true],
  ["A construction means a drawing made using…", "only a compass and a straightedge", ["a calculator", "a protractor only", "a scale only"], "Constructions use no measurements from a ruler."],
  ["Why is a construction exact, even though we may not use a number?", "The steps guarantee equal lengths or angles", ["The pencil is sharp", "The paper is flat", "The ruler is long"], "The method itself makes the result accurate.", true],
  ["An isosceles triangle has two equal sides. The line from the top vertex to the base that bisects the base is…", "perpendicular to the base", ["parallel to the base", "equal to the base", "outside the triangle"], "In an isosceles triangle, the bisector from the apex is also perpendicular to the base.", true],
];

export const constructions = bankUnit({
  id: "mb-7-constructions",
  title: "Constructions",
  emoji: "📐",
  blurb: "Perpendicular lines, parallel lines and bisectors",
  parentNote: "Children practise the ideas behind geometric constructions: perpendicular and parallel lines, perpendicular bisectors and angle bisectors made with a compass and straightedge.",
  standards: ["7.SS.3", "geometric constructions: perpendicular and parallel lines, perpendicular bisectors and angle bisectors"],
  items: ITEMS,
});
