import { pick, randInt, shuffle, textChoice } from "../random";
import type { GenerateOptions, Question, Unit } from "../types";
import { ab, buildSet, levelOf, typeIn, type Maker } from "./kit";

// Alberta Grade 9 mathematics (Mathematics K-9, 2007). Powers, rational numbers, polynomials, equations,
// linear relations, similarity and statistics are shared with the BC units. These three are written for
// the Alberta outcomes the shared units do not reach: square roots (N5, N6), circle properties (SS1) and the
// surface area of composite objects (SS2).

// ---------- Square roots ----------

const FRACTION_ROOTS: [number, number][] = [[1, 2], [2, 3], [3, 4], [3, 5], [2, 5], [4, 5], [5, 6], [3, 7], [5, 8], [4, 9], [7, 10], [5, 12]];

function squareRoots(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const maxRoot = d === 1 ? 12 : d === 2 ? 20 : 30;

  const perfect: Maker = () => {
    const r = randInt(3, maxRoot);
    return typeIn(`What is √${r * r}?`, r, `${r} × ${r} = ${r * r}, so the square root of ${r * r} is ${r}.`);
  };
  const side: Maker = () => {
    const r = randInt(4, maxRoot);
    return typeIn(`A square garden has an area of ${r * r} m². How long is one side, in metres?`, r, `The area of a square is side × side. Find the number that multiplies by itself to give ${r * r}: ${r} × ${r}.`, undefined, { suffix: "m" });
  };
  const decimal: Maker = () => {
    const t = randInt(2, d === 1 ? 9 : 15);
    const root = t / 10;
    const sq = (t * t) / 100;
    return typeIn(`What is √${sq}?`, root, `${root} × ${root} = ${sq}. A decimal with 2 places has a square root with 1 place.`, undefined, { keypad: "decimal" });
  };
  const fraction: Maker = () => {
    const [a, b] = pick(FRACTION_ROOTS);
    return typeIn(`What is √(${a * a}/${b * b})?`, `${a}/${b}`, `Take the square root of the top and the bottom: √${a * a} = ${a} and √${b * b} = ${b}.`, undefined, { keypad: "fraction" });
  };
  const between: Maker = () => {
    const k = randInt(3, maxRoot);
    const n = randInt(k * k + 2, (k + 1) * (k + 1) - 2);
    const right = `${k} and ${k + 1}`;
    return textChoice(
      `√${n} is between which two whole numbers?`,
      right,
      [`${k - 1} and ${k}`, `${k + 1} and ${k + 2}`, `${k - 2} and ${k - 1}`],
      `${k}² = ${k * k} and ${k + 1}² = ${(k + 1) * (k + 1)}. Since ${n} is between ${k * k} and ${(k + 1) * (k + 1)}, its square root is between ${k} and ${k + 1}.`,
    );
  };
  const closest: Maker = () => {
    for (let tries = 0; tries < 60; tries++) {
      const n = randInt(10, maxRoot * maxRoot);
      const r = Math.sqrt(n);
      const frac = r - Math.floor(r);
      if (frac < 0.3 || (frac > 0.7 && frac < 0.97)) {
        const near = Math.round(r);
        if (near * near === n) continue;
        return textChoice(
          `Which whole number is closest to √${n}?`,
          String(near),
          [near - 1, near + 1, near + 2].map(String),
          `Find the perfect squares on each side of ${n}. ${near}² = ${near * near}, which is the closest to ${n}.`,
        );
      }
    }
    return typeIn("What is √81?", 9, "9 × 9 = 81.");
  };
  const isPerfect: Maker = () => {
    const r = randInt(5, maxRoot);
    const bad = shuffle([r * r + 1, r * r + 3, r * r - 2, r * r + 6, r * r - 5]).slice(0, 3);
    return textChoice("Which number is a perfect square?", String(r * r), bad.map(String), `A perfect square is a whole number times itself. ${r} × ${r} = ${r * r}.`);
  };
  const compare: Maker = () => {
    const k = randInt(4, maxRoot);
    const n = k * k + randInt(2, 2 * k - 1) * (randInt(0, 1) === 0 ? 1 : -1);
    const more = n > k * k;
    return textChoice(
      `Which is greater, √${n} or ${k}?`,
      more ? `√${n}` : String(k),
      [more ? String(k) : `√${n}`, "They are equal"],
      `${k}² = ${k * k}. ${n} is ${more ? "greater" : "less"} than ${k * k}, so √${n} is ${more ? "greater" : "less"} than ${k}.`,
    );
  };
  const hardEstimate: Maker = () => {
    const k = randInt(3, maxRoot);
    const n = k * k + 1;
    return textChoice(
      `Which is the best estimate of √${n}?`,
      `a little more than ${k}`,
      [`a little less than ${k}`, `about ${k + 1}`, `about ${Math.floor(n / 2)}`],
      `${n} is just 1 more than the perfect square ${k * k}, so its square root is just a little more than ${k}.`,
    );
  };
  const makers: Maker[] = d === 1
    ? [perfect, perfect, side, decimal, between, closest, isPerfect, compare]
    : [perfect, side, decimal, fraction, between, closest, compare, d === 3 ? hardEstimate : isPerfect];
  return buildSet(makers);
}

// ---------- Circle properties ----------

const TRIPLES: [number, number, number][] = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [12, 16, 20], [7, 24, 25]];

function circles(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const inscribedToCentral: Maker = () => {
    const x = randInt(15, 80);
    return typeIn(`An inscribed angle on an arc measures ${x}°. What is the central angle on the same arc, in degrees?`, 2 * x, `The central angle is twice the inscribed angle: 2 × ${x} = ${2 * x}.`, undefined, { suffix: "°" });
  };
  const centralToInscribed: Maker = () => {
    const x = randInt(15, 85);
    return typeIn(`A central angle on an arc measures ${2 * x}°. What is an inscribed angle on the same arc, in degrees?`, x, `An inscribed angle is half the central angle: ${2 * x} ÷ 2 = ${x}.`, undefined, { suffix: "°" });
  };
  const sameArc: Maker = () => {
    const x = randInt(20, 75);
    return typeIn(`Two inscribed angles stand on the same arc. One measures ${x}°. How big is the other, in degrees?`, x, "Inscribed angles on the same arc are equal.", undefined, { suffix: "°" });
  };
  const semicircle: Maker = () => {
    const r = randInt(2, 9);
    return typeIn(`AB is a diameter of a circle of radius ${r} cm. Point C is on the circle. What is angle ACB, in degrees?`, 90, "The diameter's central angle is 180°. The inscribed angle on the same arc is half of that: 90°.", undefined, { suffix: "°" });
  };
  const tangent: Maker = () => {
    const x = randInt(20, 70);
    return typeIn(
      `A tangent touches a circle at T. O is the centre and P is a point on the tangent. Angle OPT is ${x}°. What is angle TOP, in degrees?`,
      90 - x,
      `A tangent is perpendicular to the radius at the point of contact, so angle OTP is 90°. The angles in triangle OTP add to 180°: 180 − 90 − ${x} = ${90 - x}.`,
      undefined,
      { suffix: "°" },
    );
  };
  const tangentRight: Maker = () =>
    textChoice(
      "A tangent touches a circle at a point T. What angle does it make with the radius drawn to T?",
      "90°",
      ["45°", "60°", "180°"],
      "A tangent is perpendicular to the radius at the point where it touches the circle.",
    );
  const bisect: Maker = () => {
    const half = randInt(3, 15);
    return typeIn(`A line from the centre of a circle is perpendicular to a chord and meets it at M. The chord is ${2 * half} cm long. How long is the part from one end to M?`, half, `A perpendicular from the centre bisects the chord, so each half is ${2 * half} ÷ 2 = ${half} cm.`, undefined, { suffix: "cm" });
  };
  const chordDistance: Maker = () => {
    const [a, b, c] = pick(TRIPLES);
    const flip = randInt(0, 1) === 0;
    const half = flip ? a : b;
    const dist = flip ? b : a;
    return typeIn(
      `A circle has radius ${c} cm. A chord is ${2 * half} cm long. How far is the chord from the centre, in cm?`,
      dist,
      `The perpendicular from the centre meets the chord at its midpoint, ${half} cm from each end. Use a right triangle with hypotenuse ${c} and one leg ${half}: ${c}² − ${half}² = ${c * c - half * half}, and √${c * c - half * half} = ${dist}.`,
      undefined,
      { suffix: "cm" },
    );
  };
  const radiusFromChord: Maker = () => {
    const [a, b, c] = pick(TRIPLES);
    return typeIn(
      `A chord is ${2 * a} cm long and is ${b} cm from the centre of the circle. What is the radius, in cm?`,
      c,
      `Half the chord is ${a} cm. The radius is the hypotenuse of a right triangle with legs ${a} and ${b}: ${a}² + ${b}² = ${a * a + b * b}, and √${a * a + b * b} = ${c}.`,
      undefined,
      { suffix: "cm" },
    );
  };
  const makers: Maker[] = d === 1
    ? [inscribedToCentral, centralToInscribed, sameArc, tangentRight, bisect, semicircle, tangent, inscribedToCentral]
    : [inscribedToCentral, centralToInscribed, sameArc, semicircle, tangent, bisect, chordDistance, d === 3 ? radiusFromChord : chordDistance];
  return buildSet(makers);
}

// ---------- Surface area of composite objects ----------

function surfaceArea(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const prism: Maker = () => {
    const l = randInt(2, d === 1 ? 6 : 10);
    const w = randInt(2, 6);
    const h = randInt(2, 6);
    return typeIn(`What is the surface area of a rectangular prism that is ${l} cm long, ${w} cm wide and ${h} cm high, in cm²?`, 2 * (l * w + l * h + w * h), `Add the area of all 6 faces: 2 × (${l * w} + ${l * h} + ${w * h}) = ${2 * (l * w + l * h + w * h)}.`, undefined, { suffix: "cm²" });
  };
  const stackedCubes: Maker = () => {
    const small = randInt(1, 4);
    const big = small + randInt(1, 3);
    return typeIn(
      `A cube with edges of ${small} cm sits on top of a cube with edges of ${big} cm, glued face to face. What is the surface area of the whole object, in cm²?`,
      6 * big * big + 4 * small * small,
      `Separately the cubes have 6 × ${big}² + 6 × ${small}² = ${6 * big * big + 6 * small * small} cm². Two faces of ${small}² = ${small * small} cm² each are hidden where they touch: subtract ${2 * small * small}.`,
      undefined,
      { suffix: "cm²" },
    );
  };
  const joined: Maker = () => {
    const l1 = randInt(2, 6);
    const l2 = randInt(2, 6);
    const w = randInt(2, 5);
    const h = randInt(2, 5);
    const sa = (l: number) => 2 * (l * w + l * h + w * h);
    return typeIn(
      `Two rectangular prisms, ${l1} cm by ${w} cm by ${h} cm and ${l2} cm by ${w} cm by ${h} cm, are joined along their ${w} cm by ${h} cm faces. What is the surface area of the new object, in cm²?`,
      sa(l1) + sa(l2) - 2 * w * h,
      `Add the two surface areas (${sa(l1)} + ${sa(l2)}) and subtract the two hidden faces, 2 × ${w * h} = ${2 * w * h}.`,
      undefined,
      { suffix: "cm²" },
    );
  };
  const cornerCut: Maker = () =>
    textChoice(
      "A small cube is cut out of one corner of a larger cube. Compared with the original cube, the surface area is…",
      "the same",
      ["smaller", "larger", "impossible to tell"],
      "Three faces of the small cube are removed, but three new faces of the same size appear inside the notch. The surface area stays the same.",
    );
  const cylinderLateral: Maker = () => {
    const r = randInt(2, 8);
    const h = randInt(3, 12);
    return textChoice(
      `A cylinder has radius ${r} cm and height ${h} cm. What is the area of its curved side, in terms of π?`,
      `${2 * r * h}π cm²`,
      [`${r * h}π cm²`, `${2 * r * (r + h)}π cm²`, `${r * r + 2 * r * h}π cm²`],
      `Unroll the curved side into a rectangle: its width is the circumference (2π × ${r}) and its height is ${h}. Area = 2π × ${r} × ${h} = ${2 * r * h}π.`,
    );
  };
  const cylinderTotal: Maker = () => {
    const r = randInt(2, 6);
    const h = randInt(3, 10);
    return textChoice(
      `A closed cylinder has radius ${r} cm and height ${h} cm. What is its total surface area, in terms of π?`,
      `${2 * r * r + 2 * r * h}π cm²`,
      [`${2 * r * h}π cm²`, `${r * r + 2 * r * h}π cm²`, `${2 * r * r * h}π cm²`],
      `Two circular ends: 2 × π × ${r}² = ${2 * r * r}π. Curved side: 2π × ${r} × ${h} = ${2 * r * h}π. Add them.`,
    );
  };
  const faces: Maker = () => {
    const n = randInt(2, 5);
    const visible = 6 * n - 2 * (n - 1);
    return textChoice(
      `${n} identical cubes are glued face to face in a straight row. How many cube faces can you see on the outside?`,
      String(visible),
      [6 * n, visible + 1, visible - 1].map(String),
      `${n} separate cubes have ${6 * n} faces. Each of the ${n - 1} glued joins hides 2 faces, so ${6 * n} − ${2 * (n - 1)} = ${visible}.`,
    );
  };
  const makers: Maker[] = d === 1
    ? [prism, prism, stackedCubes, cornerCut, faces, joined, cylinderLateral, prism]
    : [prism, stackedCubes, joined, cornerCut, cylinderLateral, cylinderTotal, d === 3 ? joined : faces, stackedCubes];
  return buildSet(makers);
}

export const units: Unit[] = [
  {
    id: "square-roots-ab",
    title: "Square Roots",
    emoji: "🧮",
    blurb: "Perfect squares and good estimates",
    standards: ab("N5, N6", "square roots of perfect squares, and estimating square roots that are not perfect squares"),
    parentNote: "Finding the square root of whole numbers, decimals and fractions that are perfect squares, and estimating the square root of other numbers by placing them between two perfect squares.",
    generate: squareRoots,
  },
  {
    id: "circles-ab",
    title: "Circle Properties",
    emoji: "⭕",
    blurb: "Chords, tangents and angles",
    standards: ab("SS1", "chords, central and inscribed angles, and tangents"),
    parentNote: "Using the rules of circle geometry: a perpendicular from the centre bisects a chord, a central angle is twice an inscribed angle on the same arc, inscribed angles on the same arc are equal, and a tangent meets the radius at 90°.",
    generate: circles,
  },
  {
    id: "surface-area-ab",
    title: "Surface Area of Objects",
    emoji: "📦",
    blurb: "Prisms, cylinders and joined shapes",
    standards: ab("SS2", "surface area of composite 3-D objects made from prisms and cylinders"),
    parentNote: "Finding the surface area of a rectangular prism, of two solids joined together (taking away the faces that are hidden), and of a cylinder written in terms of π.",
    generate: surfaceArea,
  },
];
