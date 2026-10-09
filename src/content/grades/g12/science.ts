import { chance, pick, randInt, sample, shuffle, textChoice } from "../../random";
import type { Course, GenerateOptions, InputQuestion, OrderQuestion, Question, Visual } from "../../types";
import { fromBank, sortQuestion, type BankItem, type SortSet } from "../../bank";

// Grade 12 science electives in one course: Chemistry 12, Physics 12, Anatomy and Physiology 12
// and Environmental Science 12. Bank items marked `hard` are stretch questions.
type Item = BankItem & { hard?: true };
type Level = 1 | 2 | 3;
type Gen = (d: Level) => Question;

function levelled(bank: Item[], count: number, difficulty: Level): Question[] {
  if (count <= 0) return [];
  const easy = bank.filter((b) => !b.hard);
  const hard = bank.filter((b) => b.hard);
  const want = difficulty === 1 ? 0 : difficulty === 2 ? Math.ceil(count / 3) : Math.ceil((count * 2) / 3);
  const nHard = Math.min(want, hard.length);
  return [...fromBank(easy, count - nHard), ...fromBank(hard, nHard)];
}

/** Generated questions, a few activities (sorts / orders) and bank questions, shuffled. */
function assemble(
  d: Level,
  o: { gens?: Gen[]; nGen?: number; extras?: Gen[]; nExtra?: number; bank: Item[]; total?: number },
): Question[] {
  const total = o.total ?? 8;
  const out: Question[] = [];
  const gens = o.gens ?? [];
  if (gens.length) {
    const pool = shuffle(gens);
    for (let i = 0; i < (o.nGen ?? 3); i++) out.push((pool[i] ?? pick(gens))(d));
  }
  const extras = o.extras ?? [];
  if (extras.length) {
    for (const g of shuffle(extras).slice(0, o.nExtra ?? 1)) out.push(g(d));
  }
  out.push(...levelled(o.bank, total - out.length, d));
  return shuffle(out);
}

/** Keep `n` of the events (listed in the correct order), still in order. */
function keepInOrder<T>(events: T[], n: number): T[] {
  const idx = sample(
    events.map((_, i) => i),
    n,
  ).sort((a, b) => a - b);
  return idx.map((i) => events[i]);
}

function orderQuestion(prompt: string, hint: string, events: string[], n: number): OrderQuestion {
  return {
    kind: "order",
    prompt,
    hint,
    items: keepInOrder(events, Math.min(n, events.length)).map((label, i) => ({ id: `o${i}`, label })),
  };
}

/** A multiple-choice question whose choices are numbers (the first argument after the prompt is correct). */
function nums(
  prompt: string,
  answer: number,
  wrong: number[],
  hint: string,
  fmt: (n: number) => string = String,
  visual?: Visual,
): Question {
  const right = fmt(answer);
  const seen = new Set([right]);
  const w: string[] = [];
  for (const x of wrong) {
    const l = fmt(x);
    if (!seen.has(l)) {
      seen.add(l);
      w.push(l);
    }
  }
  return textChoice(prompt, right, w.slice(0, 4), hint, visual);
}

function intInput(
  prompt: string,
  value: number,
  hint: string,
  o: { suffix?: string; visual?: Visual; keypad?: "number" | "integer" } = {},
): InputQuestion {
  return {
    kind: "input",
    prompt,
    hint,
    answer: String(value),
    keypad: o.keypad ?? (value < 0 ? "integer" : "number"),
    suffix: o.suffix,
    visual: o.visual,
  };
}

function decInput(
  prompt: string,
  value: number,
  places: number,
  hint: string,
  o: { suffix?: string; visual?: Visual } = {},
): InputQuestion {
  const fixed = value.toFixed(places);
  const trimmed = String(Number(fixed));
  return {
    kind: "input",
    prompt,
    hint,
    answer: trimmed,
    accept: fixed !== trimmed ? [fixed] : undefined,
    keypad: "decimal",
    suffix: o.suffix,
    visual: o.visual,
  };
}

const SUPMAP: Record<string, string> = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
  "-": "⁻",
};
const sup = (n: number | string) =>
  String(n)
    .split("")
    .map((c) => SUPMAP[c] ?? c)
    .join("");

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const DIRECTIONS = ["Shifts right (toward the products)", "Shifts left (toward the reactants)", "No shift"];

// =====================================================================
// CHEM: REACTION RATES
// =====================================================================

function avgRate(d: Level): Question {
  const t = pick(d === 1 ? [10, 20] : [10, 20, 40, 50]);
  const milli = randInt(1, 9);
  const drop = (milli * t) / 10; // hundredths of mol/L
  const c1 = randInt(60, 150);
  const c2 = c1 - drop;
  const f = (h: number) => (h / 100).toFixed(2);
  const sp = pick(["N₂O₅", "H₂O₂", "SO₂Cl₂"]);
  return {
    kind: "input",
    prompt: `During a decomposition, the concentration of ${sp} falls from ${f(c1)} mol/L to ${f(c2)} mol/L in ${t} s. What is the average rate of reaction?`,
    hint: `Average rate = change in concentration ÷ time. Subtract the concentrations (${f(c1)} − ${f(c2)} = ${f(drop)} mol/L), then divide by ${t} s.`,
    answer: (milli / 1000).toFixed(3),
    keypad: "decimal",
    suffix: "mol/(L·s)",
    visual: {
      type: "table",
      headers: ["Time (s)", `[${sp}] (mol/L)`],
      rows: [
        [0, f(c1)],
        [t, f(c2)],
      ],
    },
  };
}

function rateOrder(d: Level): Question {
  const m = pick([0, 1, 2]);
  const f = d === 1 ? 2 : pick([2, 3]);
  const base = pick([2, 3, 4, 5]);
  const fmtRate = (x: number) => (x / 1000).toFixed(3);
  const a2 = (f / 10).toFixed(2);
  const r2 = base * f ** m;
  const rows: (string | number)[][] = [
    [1, "0.10", fmtRate(base)],
    [2, a2, fmtRate(r2)],
  ];
  const headers = ["Trial", "[A] (mol/L)", "Initial rate (mol/(L·s))"];
  const setup = "A reaction A + B → products was run with [B] held constant. Only [A] changed.";
  const names = ["zero order", "first order", "second order"];
  if (d === 3) {
    const r3 = base * 4 ** m;
    rows.push([3, "0.40", "?"]);
    return decInput(
      `${setup} Use trials 1 and 2 to find the order in A, then predict the initial rate in trial 3.`,
      r3 / 1000,
      3,
      `Compare trials 1 and 2: [A] is ×${f} and the rate is ×${f ** m}, so the order is ${m} (${f}^${m} = ${f ** m}). In trial 3, [A] is 4 times trial 1, so the rate is 4^${m} = ${4 ** m} times ${fmtRate(base)}.`,
      { suffix: "mol/(L·s)", visual: { type: "table", headers, rows } },
    );
  }
  return textChoice(
    `${setup} What is the order of the reaction with respect to A?`,
    names[m],
    names.filter((_, i) => i !== m),
    `Compare trials 1 and 2. [A] was multiplied by ${f}. The rate was multiplied by ${f ** m}. Order x satisfies ${f}^x = ${f ** m}.`,
    { type: "table", headers, rows },
  );
}

function energyPlot(Er: number, Ep: number, Epr: number): Visual {
  const pts: { x: number; y: number }[] = [];
  for (let x = 0; x <= 100; x += 2.5) {
    let y: number;
    if (x <= 10) y = Er;
    else if (x <= 50) y = Er + ((Ep - Er) * (1 - Math.cos((Math.PI * (x - 10)) / 40))) / 2;
    else if (x <= 90) y = Ep + ((Epr - Ep) * (1 - Math.cos((Math.PI * (x - 50)) / 40))) / 2;
    else y = Epr;
    pts.push({ x, y });
  }
  return {
    type: "plot",
    xMin: 0,
    xMax: 100,
    yMin: 0,
    yMax: Math.ceil((Ep + 20) / 10) * 10,
    step: 10,
    curves: [{ points: pts }],
    points: [
      { x: 5, y: Er, label: `Reactants ${Er} kJ` },
      { x: 50, y: Ep, label: `Peak ${Ep} kJ` },
      { x: 95, y: Epr, label: `Products ${Epr} kJ` },
    ],
  };
}

function energyDiagram(d: Level): Question {
  const Er = pick([30, 40, 50, 60]);
  const Ea = pick([30, 40, 50, 60, 70]);
  const dh = pick([-30, -20, -10, 10, 20, 30].filter((x) => x <= Ea - 10));
  const Ep = Er + Ea;
  const Epr = Er + dh;
  const visual = energyPlot(Er, Ep, Epr);
  const setup = "The graph shows the potential energy (kJ) of a reaction as it progresses.";
  const kinds = d === 1 ? ["ea", "type"] : d === 2 ? ["ea", "dh", "rev"] : ["dh", "rev", "cat"];
  const kind = pick(kinds);
  if (kind === "ea")
    return intInput(`${setup} What is the activation energy of the forward reaction?`, Ea, `Activation energy = energy of the peak − energy of the reactants = ${Ep} − ${Er}.`, { suffix: "kJ", visual });
  if (kind === "dh")
    return intInput(
      `${setup} What is ΔH for the forward reaction? (Use a minus sign if energy is released.)`,
      dh,
      `ΔH = energy of the products − energy of the reactants = ${Epr} − ${Er}.`,
      { suffix: "kJ", visual, keypad: "integer" },
    );
  if (kind === "rev")
    return intInput(`${setup} What is the activation energy of the reverse reaction?`, Ep - Epr, `The reverse reaction starts at the products. Activation energy = peak − products = ${Ep} − ${Epr}.`, { suffix: "kJ", visual });
  if (kind === "cat") {
    const cut = pick([10, 20].filter((c) => c <= Ea - 10));
    return intInput(
      `${setup} A catalyst lowers the peak by ${cut} kJ. What is the new activation energy of the forward reaction?`,
      Ea - cut,
      `A catalyst lowers the peak, so Ea falls by ${cut}. Start from Ea = ${Ep} − ${Er} = ${Ea}. The reactant and product levels (and ΔH) stay the same.`,
      { suffix: "kJ", visual },
    );
  }
  return textChoice(
    `${setup} Is the forward reaction exothermic or endothermic?`,
    dh < 0 ? "Exothermic: the products have less energy than the reactants" : "Endothermic: the products have more energy than the reactants",
    [dh < 0 ? "Endothermic: the products have less energy than the reactants" : "Exothermic: the products have more energy than the reactants", "It cannot be told without a catalyst"],
    "Compare the starting level (reactants) with the ending level (products). If the end is lower, energy was released.",
    visual,
  );
}

const RATE_BANK: Item[] = [
  {
    prompt: "According to collision theory, which conditions must be met for two particles to react?",
    right: "They collide with at least the activation energy and in a suitable orientation",
    wrong: ["They only need to be in the same container", "They must collide with a catalyst particle", "They must have exactly the same mass", "They must collide at the slowest possible speed"],
    hint: "Most collisions do not lead to a reaction. Only those with enough energy and the right orientation do.",
  },
  {
    prompt: "Why does raising the temperature increase the rate of a reaction?",
    right: "A larger fraction of collisions have energy at or above the activation energy",
    wrong: ["It lowers the activation energy", "It makes the reactant particles larger", "It adds more reactant particles to the mixture", "It changes the products that form"],
    hint: "Temperature does not change Ea. It gives more particles enough energy to get over it (and collisions become more frequent).",
  },
  {
    prompt: "How does a catalyst speed up a reaction?",
    right: "It provides a different pathway with a lower activation energy",
    wrong: ["It raises the temperature of the mixture", "It is used up and becomes part of the product", "It changes ΔH so more energy is released", "It increases the concentration of reactants"],
    hint: "A catalyst is not used up. It lowers the energy hill, so a larger fraction of collisions succeed.",
  },
  {
    prompt: "Why does powdered zinc react faster with acid than a single lump of zinc of the same mass?",
    right: "The powder has more surface area, so more particles can collide with the acid",
    wrong: ["Powdered zinc has a lower activation energy", "Powdered zinc is a different element", "The lump has more mass than the powder", "Acid cannot touch a solid lump at all"],
    hint: "Reactions between a solid and a solution happen at the surface of the solid.",
  },
  {
    prompt: "Increasing the concentration of a reactant usually speeds up a reaction because…",
    right: "there are more particles in a given volume, so collisions are more frequent",
    wrong: ["each particle has more energy", "the activation energy becomes smaller", "the products become more stable", "the reaction becomes exothermic"],
    hint: "More particles per litre means more collisions per second. Energy per particle is unchanged.",
  },
  {
    prompt: "Which change would NOT be expected to speed up a reaction?",
    right: "Cooling the mixture",
    wrong: ["Crushing a solid reactant", "Adding a suitable catalyst", "Increasing the concentration of a reactant", "Stirring a solid into a solution"],
    hint: "Cooling slows particles down, so fewer collisions reach the activation energy.",
  },
  {
    prompt: "Which unit is most commonly used for the rate of a reaction in solution?",
    right: "mol/(L·s)",
    wrong: ["kJ/mol", "mol/L", "L/mol", "J/(kg·K)"],
    hint: "Rate is a change in concentration (mol/L) per unit of time (s).",
  },
  {
    prompt: "As a reaction proceeds in a closed container, its rate usually…",
    right: "decreases, because reactant concentrations fall",
    wrong: ["increases, because products accumulate", "stays constant forever", "increases, because the activation energy drops", "drops to zero immediately"],
    hint: "Fewer reactant particles means fewer collisions, so the rate falls over time.",
  },
  {
    prompt: "On an energy diagram, which feature is the same with and without a catalyst?",
    right: "The energy difference between reactants and products (ΔH)",
    wrong: ["The height of the peak", "The activation energy", "The speed of the reaction", "The pathway of the reaction"],
    hint: "A catalyst lowers the peak but leaves the starting and ending energy levels where they were.",
  },
  {
    prompt: "In a rate law, rate = k[A]²[B]. What is the overall order of the reaction?",
    right: "third order",
    wrong: ["second order", "first order", "fourth order"],
    hint: "Add the exponents in the rate law: 2 + 1 = 3.",
  },
  {
    prompt: "A reaction is zero order in reactant A. What does this mean?",
    right: "The rate does not depend on the concentration of A",
    wrong: ["A is not involved in the reaction", "The reaction never happens", "The rate doubles when [A] doubles", "The rate quadruples when [A] doubles"],
    hint: "Order zero means [A]⁰ = 1, so changing [A] does not change the rate (while some A remains).",
    hard: true,
  },
  {
    prompt: "In a reaction mechanism with several steps, the rate-determining step is…",
    right: "the slowest step",
    wrong: ["the fastest step", "always the first step", "always the last step", "the step that releases the most energy"],
    hint: "Like the narrowest part of a pipe, the slowest step limits how fast the overall reaction can go.",
    hard: true,
  },
  {
    prompt: "In a mechanism, a species that is formed in one step and used up in a later step is called…",
    right: "an intermediate",
    wrong: ["a catalyst", "a reactant", "a product", "a spectator ion"],
    hint: "Intermediates appear in the mechanism but cancel out of the overall equation. A catalyst is used and then regenerated.",
    hard: true,
  },
  {
    prompt: "How does the rate constant k of a reaction change when the temperature is raised?",
    right: "k increases",
    wrong: ["k decreases", "k stays the same", "k becomes zero"],
    hint: "Rate = k[A]ᵐ. Raising the temperature speeds up the reaction at the same concentrations, so k gets larger.",
    hard: true,
  },
  {
    prompt: "A student says: 'A catalyst makes the reaction release more energy.' What is wrong with this?",
    right: "A catalyst lowers Ea but does not change ΔH, so the energy released is the same",
    wrong: ["Nothing: catalysts always increase energy released", "Catalysts make reactions release less energy", "Catalysts stop reactions from releasing energy", "Catalysts convert the energy into light"],
    hint: "Think of the energy diagram: the catalyst only changes the height of the peak.",
    hard: true,
  },
];

const RATE_ORDER: Gen = () =>
  orderQuestion(
    "Put the steps of collision theory in order.",
    "Particles must first meet, then the collision needs enough energy and the right orientation before bonds can rearrange.",
    [
      "Reactant particles move and collide",
      "The collision has at least the activation energy",
      "The particles are in a suitable orientation",
      "Old bonds break and new bonds form",
      "Product particles separate",
    ],
    4,
  );

function chemRates({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return assemble(difficulty, { gens: [avgRate, rateOrder, energyDiagram], nGen: 3, extras: [RATE_ORDER], nExtra: 1, bank: RATE_BANK });
}

// =====================================================================
// CHEM: EQUILIBRIUM
// =====================================================================

interface Rxn {
  r: [number, string][];
  p: [number, string][];
  heat: "exo" | "endo";
}

const RXNS: Rxn[] = [
  { r: [[1, "N₂"], [3, "H₂"]], p: [[2, "NH₃"]], heat: "exo" },
  { r: [[2, "SO₂"], [1, "O₂"]], p: [[2, "SO₃"]], heat: "exo" },
  { r: [[1, "H₂"], [1, "I₂"]], p: [[2, "HI"]], heat: "exo" },
  { r: [[2, "NO₂"]], p: [[1, "N₂O₄"]], heat: "exo" },
  { r: [[1, "N₂O₄"]], p: [[2, "NO₂"]], heat: "endo" },
  { r: [[1, "PCl₅"]], p: [[1, "PCl₃"], [1, "Cl₂"]], heat: "endo" },
];

const side = (terms: [number, string][], gas = true) =>
  terms.map(([c, s]) => `${c > 1 ? c : ""}${s}${gas ? "(g)" : ""}`).join(" + ");
const equation = (x: Rxn) => `${side(x.r)} ⇌ ${side(x.p)}`;
const moles = (terms: [number, string][]) => terms.reduce((n, [c]) => n + c, 0);
const term = (c: number, s: string) => `[${s}]${c > 1 ? sup(c) : ""}`;
const prod = (terms: [number, string][]) => terms.map(([c, s]) => term(c, s)).join("");
const wrap = (text: string, n: number) => (n > 1 ? `(${text})` : text);

function keqExpression(d: Level): Question {
  const x = pick(d === 1 ? RXNS.slice(0, 3) : RXNS);
  const num = prod(x.p);
  const den = prod(x.r);
  const right = `Keq = ${wrap(num, x.p.length)}/${wrap(den, x.r.length)}`;
  const flat = (terms: [number, string][]) => terms.map(([, s]) => `[${s}]`).join("");
  const sumSide = (terms: [number, string][]) => terms.map(([c, s]) => term(c, s)).join(" + ");
  const wrongs = [
    `Keq = ${wrap(den, x.r.length)}/${wrap(num, x.p.length)}`,
    `Keq = ${wrap(num, x.p.length)}`,
    `Keq = ${wrap(flat(x.p), x.p.length)}/${wrap(flat(x.r), x.r.length)}`,
    `Keq = ${wrap(sumSide(x.p), x.p.length)}/${wrap(sumSide(x.r), x.r.length)}`,
  ];
  const seen = new Set([right]);
  const wrong = wrongs.filter((w) => !seen.has(w) && (seen.add(w), true));
  return textChoice(
    `Which is the equilibrium expression for this gas-phase reaction?  ${equation(x)}`,
    right,
    wrong.slice(0, 4),
    "Keq = [products] ÷ [reactants], each concentration raised to the power of its coefficient. Terms are multiplied, not added.",
  );
}

function keqCalc(d: Level): Question {
  const useHI = d === 1 || chance(0.5);
  for (let tries = 0; tries < 80; tries++) {
    const c = randInt(2, 10);
    const a = pick([1, 2, 4, 5]);
    const b = useHI ? pick([1, 2, 4, 5]) : 1;
    const k = (c * c) / (a * b);
    if (!Number.isInteger(k) || k > 99 || k < 1) continue;
    if (useHI) {
      return intInput(
        `At equilibrium, H₂(g) + I₂(g) ⇌ 2HI(g) has [H₂] = ${a} mol/L, [I₂] = ${b} mol/L and [HI] = ${c} mol/L. Calculate Keq.`,
        k,
        `Keq = [HI]² ÷ ([H₂][I₂]) = ${c}² ÷ (${a} × ${b}).`,
      );
    }
    return intInput(
      `At equilibrium, N₂O₄(g) ⇌ 2NO₂(g) has [N₂O₄] = ${a} mol/L and [NO₂] = ${c} mol/L. Calculate Keq.`,
      k,
      `Keq = [NO₂]² ÷ [N₂O₄] = ${c}² ÷ ${a}.`,
    );
  }
  return intInput("At equilibrium, H₂(g) + I₂(g) ⇌ 2HI(g) has [H₂] = 1 mol/L, [I₂] = 1 mol/L and [HI] = 4 mol/L. Calculate Keq.", 16, "Keq = [HI]² ÷ ([H₂][I₂]) = 4² ÷ (1 × 1).");
}

function reactionQuotient(d: Level): Question {
  const K = pick([4, 10, 25, 50]);
  const rel = pick(["lt", "gt", ...(d > 1 ? ["eq"] : [])]);
  const Q = rel === "eq" ? K : rel === "lt" ? pick([K / 2, K / 4, 1]) : pick([K * 2, K * 5, K * 10]);
  const answer = rel === "lt" ? DIRECTIONS[0] : rel === "gt" ? DIRECTIONS[1] : "The system is already at equilibrium";
  const wrong = rel === "eq" ? DIRECTIONS.slice(0, 2) : [DIRECTIONS[rel === "lt" ? 1 : 0], "The system is already at equilibrium"];
  return textChoice(
    `A reaction has Keq = ${K}. A mixture is prepared with a reaction quotient Q = ${Q}. What happens next?`,
    answer,
    wrong,
    "Compare Q with Keq. If Q < Keq there are too many reactants, so the reaction goes forward. If Q > Keq it goes in reverse. If Q = Keq the system is at equilibrium.",
  );
}

function shiftPressure(d: Level): Question {
  const pool = d === 1 ? RXNS.filter((x) => moles(x.r) !== moles(x.p)) : RXNS;
  const x = pick(pool);
  const squeeze = chance(0.5);
  const l = moles(x.r);
  const r = moles(x.p);
  let answer = DIRECTIONS[2];
  if (l !== r) {
    const fewerRight = r < l;
    answer = squeeze === fewerRight ? DIRECTIONS[0] : DIRECTIONS[1];
  }
  return textChoice(
    `${equation(x)}\nAt equilibrium, the volume of the container is ${squeeze ? "decreased" : "increased"} at constant temperature. How does the equilibrium respond?`,
    answer,
    DIRECTIONS.filter((s) => s !== answer),
    `Count moles of gas: ${l} on the left, ${r} on the right. Higher pressure (smaller volume) favours the side with fewer moles of gas; lower pressure favours the side with more. If the counts are equal, nothing shifts.`,
  );
}

function shiftTemperature(d: Level): Question {
  const x = pick(RXNS);
  const heat = chance(0.5);
  const forwardFavoured = (x.heat === "endo") === heat;
  const answer = forwardFavoured ? DIRECTIONS[0] : DIRECTIONS[1];
  const word = x.heat === "exo" ? "exothermic" : "endothermic";
  if (d === 3 && chance(0.5)) {
    const up = forwardFavoured;
    const opts = ["Keq increases", "Keq decreases", "Keq stays the same"];
    const right = up ? opts[0] : opts[1];
    return textChoice(
      `The forward reaction is ${word}: ${equation(x)}\nThe system at equilibrium is ${heat ? "heated" : "cooled"}. What happens to the value of Keq?`,
      right,
      opts.filter((o) => o !== right),
      "Temperature is the only change that alters Keq. It rises if the system shifts toward the products and falls if it shifts toward the reactants.",
    );
  }
  return textChoice(
    `The forward reaction is ${word}: ${equation(x)}\nThe system at equilibrium is ${heat ? "heated" : "cooled"}. How does the equilibrium respond?`,
    answer,
    DIRECTIONS.filter((s) => s !== answer),
    `Treat heat like a reactant or product: it is on the reactant side of an endothermic reaction and on the product side of an exothermic one. Heating shifts the equilibrium to use up heat (the endothermic direction); cooling shifts it to release heat.`,
  );
}

function shiftConcentration(): Question {
  const x = pick(RXNS);
  const useReactant = chance(0.5);
  const species = pick(useReactant ? x.r : x.p)[1];
  const add = chance(0.5);
  const toRight = useReactant === add; // add reactant or remove product -> right
  const answer = toRight ? DIRECTIONS[0] : DIRECTIONS[1];
  return textChoice(
    `${equation(x)}\nSome ${species} is ${add ? "added to" : "removed from"} the container at equilibrium. How does the equilibrium respond?`,
    answer,
    DIRECTIONS.filter((s) => s !== answer),
    `The system opposes the change. Adding a substance shifts the reaction away from it; removing a substance shifts the reaction toward it (to make more).`,
  );
}

const EQ_BANK: Item[] = [
  {
    prompt: "What is true of a chemical system at equilibrium?",
    right: "The forward and reverse reaction rates are equal, so concentrations stay constant",
    wrong: ["All reactions have stopped", "The reactant and product concentrations are always equal", "All of the reactants have been used up", "Only the forward reaction is still happening"],
    hint: "Equilibrium is dynamic: both reactions keep going at the same rate, so nothing changes overall.",
  },
  {
    prompt: "A closed flask holds a reversible reaction at equilibrium. Which statement is correct?",
    right: "Reactants are still forming products and products are still forming reactants",
    wrong: ["Nothing at the particle level is happening", "The concentrations of reactants and products must be equal", "The reaction has used up its limiting reactant", "The reaction is complete"],
    hint: "Think 'dynamic': constant concentrations do not mean the particles stopped reacting.",
  },
  {
    prompt: "Which change affects the VALUE of Keq for a reaction?",
    right: "Changing the temperature",
    wrong: ["Adding more reactant", "Changing the volume of the container", "Adding a catalyst", "Removing a product"],
    hint: "Concentration, pressure and volume changes shift the position of equilibrium, but only temperature changes the value of Keq.",
  },
  {
    prompt: "What does a catalyst do to a system at equilibrium?",
    right: "Nothing to the position: it helps the system reach equilibrium faster",
    wrong: ["Shifts the equilibrium toward the products", "Shifts the equilibrium toward the reactants", "Increases the value of Keq", "Makes the reaction stop"],
    hint: "A catalyst speeds up the forward and the reverse reactions equally.",
  },
  {
    prompt: "A reaction has Keq = 5 × 10⁸ at room temperature. What does this tell you?",
    right: "Products are strongly favoured at equilibrium",
    wrong: ["Reactants are strongly favoured at equilibrium", "The reaction is very fast", "The reaction is very slow", "The reaction is endothermic"],
    hint: "A very large Keq means the numerator (products) is much bigger than the denominator. Keq says nothing about speed.",
  },
  {
    prompt: "A reaction has Keq = 2 × 10⁻⁹. Which statement is best?",
    right: "At equilibrium the mixture is mostly reactants",
    wrong: ["At equilibrium the mixture is mostly products", "The reaction can never be catalyzed", "The reaction is instant", "The equilibrium contains equal amounts of each"],
    hint: "A very small Keq means very little product is present at equilibrium.",
  },
  {
    prompt: "Why are pure solids and pure liquids left out of an equilibrium expression?",
    right: "Their concentrations are effectively constant, so they are built into the value of Keq",
    wrong: ["They never react", "They have no concentration at all", "They are always in excess of the gases", "They are catalysts"],
    hint: "The 'concentration' of a pure solid or liquid (its density) does not change as the reaction proceeds.",
    hard: true,
  },
  {
    prompt: "For CaCO₃(s) ⇌ CaO(s) + CO₂(g), the equilibrium expression is…",
    right: "Keq = [CO₂]",
    wrong: ["Keq = [CaO][CO₂]/[CaCO₃]", "Keq = [CaCO₃]/[CO₂]", "Keq = [CaO]/[CaCO₃]", "Keq = [CO₂]²"],
    hint: "Only gases and dissolved substances appear in Keq. The two solids are omitted.",
    hard: true,
  },
  {
    prompt: "An inert gas is added to a sealed rigid container at equilibrium (the volume stays the same). What happens to the position of equilibrium?",
    right: "It does not shift, because the concentrations of the reacting gases are unchanged",
    wrong: ["It shifts toward the side with more moles of gas", "It shifts toward the side with fewer moles of gas", "It shifts toward the reactants", "Keq increases"],
    hint: "The reacting gases have the same concentrations as before, so Q still equals Keq.",
    hard: true,
  },
  {
    prompt: "In making ammonia (N₂ + 3H₂ ⇌ 2NH₃, exothermic), why is a moderate temperature of about 450 °C used?",
    right: "Lower temperatures favour more ammonia but are too slow, so it is a compromise between yield and rate",
    wrong: ["Higher temperatures always give a bigger yield", "The catalyst only works below 100 °C", "Temperature has no effect on this reaction", "It is the temperature at which Keq is largest"],
    hint: "For an exothermic reaction, heating shifts the equilibrium left (smaller yield) but speeds up the rate. Industry balances both.",
    hard: true,
  },
  {
    prompt: "AgCl(s) ⇌ Ag⁺(aq) + Cl⁻(aq). What happens to the solubility of AgCl if NaCl is added to the solution?",
    right: "It decreases (the common-ion effect)",
    wrong: ["It increases", "It stays exactly the same", "Ksp increases", "All of the AgCl dissolves"],
    hint: "Adding Cl⁻ pushes the equilibrium toward solid AgCl, so less dissolves.",
    hard: true,
  },
  {
    prompt: "The solubility product expression for PbI₂(s) ⇌ Pb²⁺(aq) + 2I⁻(aq) is…",
    right: "Ksp = [Pb²⁺][I⁻]²",
    wrong: ["Ksp = [Pb²⁺][I⁻]", "Ksp = [Pb²⁺]²[I⁻]", "Ksp = [PbI₂]/([Pb²⁺][I⁻]²)", "Ksp = [Pb²⁺] + 2[I⁻]"],
    hint: "Leave out the solid. Raise each ion's concentration to the power of its coefficient: iodide has a coefficient of 2.",
    hard: true,
  },
  {
    prompt: "A student heats an equilibrium mixture and the amount of products drops. The forward reaction must be…",
    right: "exothermic",
    wrong: ["endothermic", "zero order", "catalyzed"],
    hint: "Heating shifts an equilibrium in the endothermic direction. If it moved toward the reactants, the forward reaction gives off heat.",
  },
];

const EQ_ORDER: Gen = () =>
  orderQuestion(
    "A reactant is added to a system at equilibrium. Put the response in order.",
    "The system is disturbed, then Q no longer equals Keq, so the reaction shifts until Q = Keq again.",
    [
      "The system is at equilibrium (Q = Keq)",
      "More reactant is added, so Q becomes smaller than Keq",
      "The forward reaction is temporarily faster",
      "Product concentrations increase",
      "A new equilibrium is reached (Q = Keq again)",
    ],
    4,
  );

function chemEquilibrium({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return assemble(difficulty, {
    gens: [keqExpression, keqCalc, reactionQuotient, shiftPressure, shiftTemperature, shiftConcentration],
    nGen: 4,
    extras: [EQ_ORDER],
    nExtra: 1,
    bank: EQ_BANK,
  });
}

// =====================================================================
// CHEM: ACIDS AND BASES
// =====================================================================

const concString = (n: number) => (10 ** -n).toFixed(n);

function phStrongAcid(d: Level): Question {
  const n = randInt(1, d === 1 ? 4 : 4);
  const acid = pick(["HCl", "HNO₃", "HBr"]);
  return intInput(
    `A ${concString(n)} mol/L solution of ${acid}, a strong acid, is at 25 °C. What is its pH?`,
    n,
    `A strong acid ionizes completely, so [H⁺] = ${concString(n)} = 1 × 10${sup(-n)} mol/L. pH = −log[H⁺] = ${n}.`,
  );
}

function phH(d: Level): Question {
  const n = d === 1 ? randInt(2, 6) : randInt(2, 12);
  return intInput(
    `A solution has [H⁺] = 1 × 10${sup(-n)} mol/L. What is its pH?`,
    n,
    `pH = −log[H⁺]. For 1 × 10${sup(-n)}, the exponent gives the pH directly: ${n}.`,
  );
}

function phStrongBase(d: Level): Question {
  const n = randInt(1, 4);
  const useBa = d === 3 && n <= 3 && chance(0.6);
  if (useBa) {
    // c(Ba(OH)2) = 5 x 10^-(n+1) gives [OH-] = 10^-n
    const conc = (5 * 10 ** -(n + 1)).toFixed(n + 1);
    return intInput(
      `Calculate the pH of a ${conc} mol/L solution of Ba(OH)₂, a strong base, at 25 °C.`,
      14 - n,
      `Each Ba(OH)₂ releases 2 OH⁻, so [OH⁻] = 2 × ${conc} = ${concString(n)} mol/L. pOH = ${n}, so pH = 14 − ${n}.`,
    );
  }
  const base = pick(["NaOH", "KOH"]);
  return intInput(
    `A ${concString(n)} mol/L solution of ${base}, a strong base, is at 25 °C. What is its pH?`,
    14 - n,
    `[OH⁻] = ${concString(n)} mol/L, so pOH = ${n}. At 25 °C, pH + pOH = 14, so pH = 14 − ${n}.`,
  );
}

function hFromPh(): Question {
  const p = randInt(2, 11);
  return nums(
    `A solution has a pH of ${p}. What is its [H⁺]?`,
    p,
    [p + 1, p - 1, 14 - p, p + 2],
    `[H⁺] = 10${sup("-pH")} mol/L. With pH ${p}, [H⁺] = 1 × 10${sup(-p)} mol/L.`,
    (x) => `1 × 10${sup(-x)} mol/L`,
  );
}

function foldDifference(d: Level): Question {
  const lo = randInt(1, 6);
  const k = pick(d === 1 ? [1, 2] : [1, 2, 3]);
  const hi = lo + k;
  return nums(
    `Solution X has a pH of ${lo} and solution Y has a pH of ${hi}. How many times greater is [H⁺] in X than in Y?`,
    10 ** k,
    [10 ** (k + 1), k + 1, 20 * k, 10 ** (k + 2)],
    "The pH scale is logarithmic: each pH unit is a factor of 10 in [H⁺]. Use 10 to the power of the pH difference.",
    (x) => `${x} times`,
  );
}

function phNonInteger(): Question {
  const a = pick([2, 5]);
  const n = randInt(2, 9);
  const L = a === 2 ? 0.3 : 0.7;
  const ans = n - L;
  return nums(
    `Calculate the pH of a solution with [H⁺] = ${a} × 10${sup(-n)} mol/L. (log 2 = 0.30 and log 5 = 0.70)`,
    ans,
    [n, n + L, n - 1, 14 - ans],
    `pH = −log(${a} × 10${sup(-n)}) = −(log ${a} + (−${n})) = ${n} − ${L.toFixed(2)}.`,
    (x) => x.toFixed(2),
  );
}

function titration(d: Level): Question {
  const twoToOne = d === 3;
  for (let tries = 0; tries < 80; tries++) {
    const c1 = pick([10, 20, 25, 50]); // hundredths of mol/L, acid
    const c2 = pick([10, 20, 25, 50]);
    const v1 = pick([20, 25, 40, 50]);
    const factor = twoToOne ? 2 : 1;
    const v2 = (factor * v1 * c1) / c2;
    if (!Number.isInteger(v2) || v2 > 200 || v2 === v1) continue;
    const f = (h: number) => (h / 100).toFixed(2);
    const acid = twoToOne ? "H₂SO₄" : "HCl";
    const eq = twoToOne ? "H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O" : "HCl + NaOH → NaCl + H₂O";
    return intInput(
      `${v1} mL of ${f(c1)} mol/L ${acid} is neutralized by ${f(c2)} mol/L NaOH. (${eq}) What volume of NaOH is needed?`,
      v2,
      twoToOne
        ? `Moles of acid = ${f(c1)} × ${v1} mL. The ratio is 1 acid : 2 base, so moles of NaOH = 2 × that. Divide by ${f(c2)} mol/L.`
        : `At the equivalence point, moles of acid = moles of base (1:1). So ${f(c1)} × ${v1} = ${f(c2)} × V.`,
      { suffix: "mL" },
    );
  }
  return intInput("25 mL of 0.20 mol/L HCl is neutralized by 0.10 mol/L NaOH. What volume of NaOH is needed?", 50, "Moles of acid = moles of base (1:1): 0.20 × 25 = 0.10 × V.", { suffix: "mL" });
}

const ACIDS_CONJ: [string, string][] = [
  ["HCl", "Cl⁻"],
  ["HNO₃", "NO₃⁻"],
  ["CH₃COOH", "CH₃COO⁻"],
  ["NH₄⁺", "NH₃"],
  ["H₂O", "OH⁻"],
  ["HCO₃⁻", "CO₃²⁻"],
  ["H₂SO₄", "HSO₄⁻"],
  ["H₂PO₄⁻", "HPO₄²⁻"],
  ["HF", "F⁻"],
];

function conjugate(d: Level): Question {
  const [acid, base] = pick(ACIDS_CONJ);
  if (d >= 2 && chance(0.5)) {
    return textChoice(
      `What is the conjugate acid of ${base}?`,
      acid,
      ACIDS_CONJ.filter(([a]) => a !== acid)
        .map(([, b]) => b)
        .filter((b) => b !== base)
        .slice(0, 3)
        .concat([base])
        .filter((x) => x !== acid),
      "A base gains an H⁺ to become its conjugate acid. Add one H and increase the charge by one.",
    );
  }
  return textChoice(
    `What is the conjugate base of ${acid}?`,
    base,
    shuffle(ACIDS_CONJ.filter(([a]) => a !== acid).map(([, b]) => b).filter((b) => b !== base)).slice(0, 3),
    "An acid donates an H⁺ to become its conjugate base. Remove one H and lower the charge by one.",
  );
}

const STRONG_WEAK: SortSet = {
  prompt: "Strong or weak? Sort each acid or base (all at 25 °C in water).",
  hint: "The strong acids to know are HCl, HBr, HI, HNO₃ and H₂SO₄ (first H⁺). Strong bases are the hydroxides of Group 1 and the heavier Group 2 metals. Most other acids and bases, such as ethanoic acid, HF and ammonia, are weak.",
  bins: [
    { id: "strong", label: "strong (ionizes almost completely)", emoji: "💥" },
    { id: "weak", label: "weak (ionizes only slightly)", emoji: "🌫️" },
  ],
  items: [
    { label: "HCl", emoji: "🧪", bin: "strong" },
    { label: "HNO₃", emoji: "🧪", bin: "strong" },
    { label: "HBr", emoji: "🧪", bin: "strong" },
    { label: "NaOH", emoji: "🧼", bin: "strong" },
    { label: "KOH", emoji: "🧼", bin: "strong" },
    { label: "CH₃COOH (ethanoic acid)", emoji: "🥗", bin: "weak" },
    { label: "HF", emoji: "🧪", bin: "weak" },
    { label: "NH₃ (ammonia)", emoji: "🧴", bin: "weak" },
    { label: "H₂CO₃ (carbonic acid)", emoji: "🥤", bin: "weak" },
  ],
};

const ACID_BANK: Item[] = [
  {
    prompt: "What does it mean for an acid to be 'strong'?",
    right: "It ionizes almost completely in water",
    wrong: ["It is very concentrated", "It has a high pH", "It always burns skin", "It contains many hydrogen atoms"],
    hint: "Strength is about how completely an acid ionizes, not how much of it is dissolved (concentration).",
  },
  {
    prompt: "0.10 mol/L HCl and 0.10 mol/L ethanoic acid are compared. Which has the lower pH, and why?",
    right: "HCl, because it ionizes completely and produces more H⁺",
    wrong: ["Ethanoic acid, because it is more concentrated", "Ethanoic acid, because it is weak", "They have the same pH because the concentrations match", "HCl, because it is a weak acid"],
    hint: "Same concentration, but only HCl ionizes fully. More H⁺ means a lower pH.",
  },
  {
    prompt: "In the Brønsted–Lowry model, an acid is a substance that…",
    right: "donates a proton (H⁺)",
    wrong: ["accepts a proton (H⁺)", "donates an electron", "produces OH⁻ only", "has a pH above 7"],
    hint: "Brønsted–Lowry: acids are proton donors; bases are proton acceptors.",
  },
  {
    prompt: "Which pair are the products of a neutralization reaction between an acid and a hydroxide base?",
    right: "a salt and water",
    wrong: ["a salt and hydrogen gas", "two acids", "a metal and an acid", "only water"],
    hint: "For example, HCl + NaOH → NaCl + H₂O.",
  },
  {
    prompt: "At 25 °C, a solution has a pH of 9. It is…",
    right: "basic",
    wrong: ["acidic", "neutral", "a strong acid"],
    hint: "pH 7 is neutral at 25 °C. Below 7 is acidic; above 7 is basic.",
  },
  {
    prompt: "A buffer solution is made to…",
    right: "resist changes in pH when small amounts of acid or base are added",
    wrong: ["raise the pH as high as possible", "neutralize every acid", "stop all reactions", "keep the pH at exactly 0"],
    hint: "Buffers keep pH nearly steady. Blood is a buffered solution.",
  },
  {
    prompt: "A typical buffer is a mixture of…",
    right: "a weak acid and its conjugate base",
    wrong: ["a strong acid and a strong base", "two strong acids", "water and a catalyst", "a weak acid and a strong acid"],
    hint: "The weak acid neutralizes added base and the conjugate base neutralizes added acid.",
    hard: true,
  },
  {
    prompt: "Which equation is true for aqueous solutions at 25 °C?",
    right: "pH + pOH = 14",
    wrong: ["pH − pOH = 14", "pH × pOH = 14", "pH + pOH = 7", "pH = pOH = 14"],
    hint: "Kw = [H⁺][OH⁻] = 1.0 × 10⁻¹⁴, so pH + pOH = 14.",
  },
  {
    prompt: "Which expression gives Ka for the weak acid HA, HA + H₂O ⇌ H₃O⁺ + A⁻?",
    right: "Ka = [H₃O⁺][A⁻] / [HA]",
    wrong: ["Ka = [HA] / ([H₃O⁺][A⁻])", "Ka = [H₃O⁺] / [HA]", "Ka = [H₃O⁺][A⁻][HA]", "Ka = [H₃O⁺][A⁻] / [H₂O]"],
    hint: "Products over reactants. Water is the solvent (a pure liquid) so it is left out.",
    hard: true,
  },
  {
    prompt: "Two weak acids have Ka values of 1.8 × 10⁻⁵ and 6.8 × 10⁻⁴. Which is stronger?",
    right: "The one with Ka = 6.8 × 10⁻⁴",
    wrong: ["The one with Ka = 1.8 × 10⁻⁵", "They are equal in strength", "Ka cannot be used to compare strengths"],
    hint: "A larger Ka means more ionization. Compare exponents: 10⁻⁴ is larger than 10⁻⁵.",
    hard: true,
  },
  {
    prompt: "Why is the chloride ion (Cl⁻) a very weak base?",
    right: "It is the conjugate base of a strong acid, HCl",
    wrong: ["It has a negative charge", "It is a halogen", "It dissolves in water", "It is the conjugate base of a weak acid"],
    hint: "The stronger an acid, the weaker its conjugate base.",
    hard: true,
  },
  {
    prompt: "Water can act as an acid or as a base, depending on what it reacts with. Such a substance is called…",
    right: "amphiprotic (amphoteric)",
    wrong: ["a buffer", "an indicator", "a strong electrolyte"],
    hint: "Water can donate a proton (becoming OH⁻) or accept one (becoming H₃O⁺).",
    hard: true,
  },
  {
    prompt: "Carbon dioxide dissolving in the ocean forms carbonic acid. What is the effect on seawater?",
    right: "Its pH decreases (ocean acidification)",
    wrong: ["Its pH increases", "Its pH is unchanged", "It becomes a strong base", "It stops absorbing CO₂"],
    hint: "CO₂ + H₂O ⇌ H₂CO₃ releases H⁺, so the solution becomes more acidic.",
  },
  {
    prompt: "The equivalence point of a titration is when…",
    right: "the moles of acid and base have exactly reacted according to the balanced equation",
    wrong: ["the indicator first changes colour for any reason", "the pH is always exactly 7", "the burette is empty", "the solution is boiling"],
    hint: "The endpoint (indicator colour change) is chosen to be close to the equivalence point. Only for a strong acid and strong base is the pH 7 there.",
    hard: true,
  },
];

function chemAcids({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const gens: Gen[] = [phStrongAcid, phH, phStrongBase, hFromPh, foldDifference, conjugate, titration];
  if (difficulty === 3) gens.push(phNonInteger, phNonInteger);
  return assemble(difficulty, {
    gens,
    nGen: 4,
    extras: [() => sortQuestion(STRONG_WEAK, difficulty === 1 ? 3 : 4)],
    nExtra: difficulty === 2 ? 1 : 0,
    bank: ACID_BANK,
  });
}

// =====================================================================
// PHYSICS: MOMENTUM
// =====================================================================

const MOVERS = [
  { what: "car", m: [800, 1000, 1200, 1500], v: [10, 15, 20, 25] },
  { what: "cyclist (with bike)", m: [60, 70, 80, 90], v: [4, 6, 8, 10, 12] },
  { what: "skater", m: [50, 60, 70], v: [2, 3, 4, 5] },
  { what: "shopping cart", m: [20, 30, 40], v: [1, 2, 3] },
  { what: "freight cart", m: [2000, 3000, 5000], v: [2, 4, 5] },
];

function momentumValue(d: Level): Question {
  const x = pick(MOVERS);
  const m = pick(x.m);
  const v = pick(x.v);
  if (d === 3 && chance(0.5)) {
    return intInput(
      `Taking east as positive, what is the momentum of a ${m} kg ${x.what} moving west at ${v} m/s?`,
      -m * v,
      "Momentum p = mv is a vector. West is the negative direction here, so p = m × (−v).",
      { suffix: "kg·m/s", keypad: "integer" },
    );
  }
  return intInput(
    `A ${m} kg ${x.what} travels at ${v} m/s. What is its momentum?`,
    m * v,
    `p = mv = ${m} × ${v}.`,
    { suffix: "kg·m/s" },
  );
}

function impulseValue(d: Level): Question {
  if (d === 1) {
    const F = pick([50, 100, 200, 500, 800]);
    const t = randInt(2, 9);
    return intInput(`A constant force of ${F} N acts on a cart for ${t} s. What is the impulse?`, F * t, `Impulse J = FΔt = ${F} × ${t}.`, { suffix: "N·s" });
  }
  if (d === 2) {
    const m = pick([2, 5, 10, 60, 80]);
    const vi = randInt(1, 6);
    const vf = vi + randInt(2, 8);
    return intInput(
      `A ${m} kg object speeds up from ${vi} m/s to ${vf} m/s along a straight line. What impulse acted on it?`,
      m * (vf - vi),
      `Impulse = change in momentum = m(v_f − v_i) = ${m} × (${vf} − ${vi}).`,
      { suffix: "N·s" },
    );
  }
  for (let tries = 0; tries < 80; tries++) {
    const m = pick([50, 60, 80, 1000, 1200, 1500]);
    const v = pick([10, 15, 20, 25]);
    const t = pick([2, 4, 5, 10]);
    if ((m * v) % t !== 0) continue;
    return intInput(
      `A ${m} kg object moving at ${v} m/s is brought to rest in ${t} s. What is the magnitude of the average force needed?`,
      (m * v) / t,
      `Impulse = Δp, so FΔt = mv. F = mv ÷ Δt = ${m} × ${v} ÷ ${t}.`,
      { suffix: "N" },
    );
  }
  return intInput("A 1000 kg car moving at 20 m/s is brought to rest in 4 s. What is the magnitude of the average force needed?", 5000, "F = Δp ÷ Δt = 1000 × 20 ÷ 4.", { suffix: "N" });
}

function stickTogether(d: Level): Question {
  const [a, b] = pick([
    [1, 2],
    [1, 3],
    [2, 3],
    [1, 4],
    [3, 4],
    [2, 5],
  ]);
  const u = pick([10, 20, 50, 100]);
  const t = randInt(1, d === 1 ? 2 : 4);
  const m1 = a * u;
  const m2 = (b - a) * u;
  const v1 = b * t;
  const vf = a * t;
  if (d === 3 && chance(0.5)) {
    // kinetic energy lost (u is even or multiples work out): use half-integers carefully
    const lost = (m1 * v1 * v1) / 2 - ((m1 + m2) * vf * vf) / 2;
    if (Number.isInteger(lost)) {
      return intInput(
        `A ${m1} kg cart moving at ${v1} m/s hits a stationary ${m2} kg cart. They stick together. How much kinetic energy is lost in the collision?`,
        lost,
        `Find v_f from conservation of momentum (${m1 * v1} ÷ ${m1 + m2} = ${vf} m/s). Then KE lost = ½m₁v₁² − ½(m₁ + m₂)v_f².`,
        { suffix: "J" },
      );
    }
  }
  return intInput(
    `A ${m1} kg cart moving at ${v1} m/s hits a stationary ${m2} kg cart and they stick together. What is their speed afterwards?`,
    vf,
    `Momentum is conserved: ${m1} × ${v1} = (${m1} + ${m2}) × v_f. Divide ${m1 * v1} by ${m1 + m2}.`,
    { suffix: "m/s" },
  );
}

function recoil(): Question {
  const [p, q] = pick([
    [1, 2],
    [2, 3],
    [1, 3],
    [3, 4],
    [2, 5],
  ]);
  const c = pick([10, 20]);
  const t = randInt(1, 3);
  const m1 = p * c;
  const m2 = q * c;
  const v1 = q * t;
  const v2 = p * t;
  return intInput(
    `Two skaters on frictionless ice stand together at rest, then push apart. The ${m1} kg skater moves off at ${v1} m/s. At what speed does the ${m2} kg skater move in the opposite direction?`,
    v2,
    `The total momentum stays zero: ${m1} × ${v1} = ${m2} × v. Solve for v.`,
    { suffix: "m/s" },
  );
}

const MOMENTUM_SORT: SortSet = {
  prompt: "Does it make the stopping time longer or shorter? Sort each situation.",
  hint: "The same change in momentum over a longer time means a smaller average force (F = Δp/Δt). Cushions and soft landings lengthen the time; hard, rigid stops shorten it.",
  bins: [
    { id: "long", label: "longer time, smaller force", emoji: "🛟" },
    { id: "short", label: "shorter time, larger force", emoji: "💥" },
  ],
  items: [
    { label: "an airbag inflating in a crash", emoji: "🚗", bin: "long" },
    { label: "a crumple zone on a car", emoji: "🧱", bin: "long" },
    { label: "bending your knees when landing", emoji: "🤸", bin: "long" },
    { label: "pulling your hand back while catching a ball", emoji: "🧤", bin: "long" },
    { label: "a car hitting a rigid concrete wall", emoji: "🧱", bin: "short" },
    { label: "landing stiff-legged on pavement", emoji: "🦵", bin: "short" },
    { label: "a hammer striking a nail", emoji: "🔨", bin: "short" },
    { label: "a karate chop breaking a board", emoji: "🥋", bin: "short" },
  ],
};

const AIRBAG_ORDER: Gen = () =>
  orderQuestion(
    "Put the steps of how an airbag protects a passenger in order.",
    "Sensors detect the crash first, the bag inflates, and then the passenger slows down over a longer time, which lowers the force.",
    [
      "The car hits an obstacle and slows suddenly",
      "Sensors detect the rapid deceleration",
      "The airbag inflates in a fraction of a second",
      "The passenger presses into the bag and stops over a longer time",
      "The average force on the passenger is smaller",
    ],
    4,
  );

const MOMENTUM_BANK: Item[] = [
  {
    prompt: "What is the definition of momentum?",
    right: "mass × velocity",
    wrong: ["mass × acceleration", "force × distance", "½ × mass × velocity²", "mass × time"],
    hint: "p = mv. It depends on both how much matter is moving and how fast, and it has a direction.",
  },
  {
    prompt: "Which pair of units is equivalent to the unit of momentum, kg·m/s?",
    right: "N·s",
    wrong: ["N·m", "J", "N/s", "W"],
    hint: "Impulse = FΔt has units N·s and equals change in momentum, so N·s = kg·m/s.",
  },
  {
    prompt: "In an isolated system (no outside net force), the total momentum…",
    right: "stays constant",
    wrong: ["always increases", "always decreases", "must be zero", "is converted to heat"],
    hint: "This is the law of conservation of momentum. It holds for every kind of collision.",
  },
  {
    prompt: "Impulse is equal to…",
    right: "the change in an object's momentum",
    wrong: ["the object's final velocity", "the object's kinetic energy", "the force divided by time", "the work done on the object"],
    hint: "J = FΔt = Δp. This is Newton's second law written in terms of momentum.",
  },
  {
    prompt: "A small car and a large truck collide head-on. Compared with the force on the truck, the force on the car is…",
    right: "equal in size and opposite in direction",
    wrong: ["larger", "smaller", "zero", "equal and in the same direction"],
    hint: "Newton's third law: the two forces are an action–reaction pair. The car is changed more because it has less mass, not because the force is bigger.",
  },
  {
    prompt: "A cyclist falls off and lands on grass instead of concrete. Why is the landing less painful?",
    right: "The grass makes the stopping time longer, so the average force is smaller",
    wrong: ["The grass reduces the cyclist's mass", "The grass reduces the momentum change to zero", "The grass makes the impulse larger", "The grass makes the cyclist's speed higher"],
    hint: "The momentum change is the same, but F = Δp/Δt. Longer time means smaller force.",
  },
  {
    prompt: "On a graph of force versus time, what does the area under the curve represent?",
    right: "impulse",
    wrong: ["work", "power", "acceleration", "kinetic energy"],
    hint: "Impulse is force multiplied by time: that is the area under an F–t graph.",
  },
  {
    prompt: "A balloon flies across a room as air escapes backward. This is best explained by…",
    right: "conservation of momentum: the air moves one way and the balloon the other",
    wrong: ["the air pushing against the wall", "the balloon losing mass so gravity is weaker", "static electricity", "the balloon's colour"],
    hint: "Starting from rest, the total momentum is zero. If air gains backward momentum, the balloon gains equal forward momentum.",
  },
  {
    prompt: "Which statement describes an elastic collision?",
    right: "Both momentum and kinetic energy are conserved",
    wrong: ["Momentum is conserved but kinetic energy is not", "Kinetic energy is conserved but momentum is not", "Neither is conserved", "The objects always stick together"],
    hint: "Momentum is conserved in all collisions in an isolated system. Elastic collisions also conserve kinetic energy.",
  },
  {
    prompt: "Two carts collide and stick together, and some kinetic energy becomes thermal energy and sound. This is a(n)…",
    right: "perfectly inelastic collision",
    wrong: ["elastic collision", "collision that violates conservation of momentum", "collision with no impulse"],
    hint: "Objects that stick together lose the most kinetic energy possible, but momentum is still conserved.",
    hard: true,
  },
  {
    prompt: "A ball hits a wall at speed v. In one case it sticks. In another it bounces straight back at speed v. In which case is the impulse on the ball larger?",
    right: "When it bounces back, because its momentum changes from mv to −mv (a change of 2mv)",
    wrong: ["When it sticks, because it stops", "The impulses are the same", "Neither: the wall does no impulse", "It depends only on the colour of the ball"],
    hint: "Compare Δp: stopping gives a change of mv, reversing direction gives a change of 2mv.",
    hard: true,
  },
  {
    prompt: "Two objects have the same momentum, but object A has twice the mass of object B. Which has more kinetic energy?",
    right: "Object B (the less massive one)",
    wrong: ["Object A (the more massive one)", "They have equal kinetic energy", "Neither has any kinetic energy"],
    hint: "KE = p² / 2m. With the same p, a smaller mass means a larger KE.",
    hard: true,
  },
  {
    prompt: "A rocket in deep space fires its engine. What is the best explanation for why it speeds up?",
    right: "Exhaust gas gains momentum backward, so the rocket gains an equal momentum forward",
    wrong: ["The exhaust pushes against the empty space around it", "The rocket loses mass so it has no momentum", "Gravity pulls it forward", "Momentum is not conserved in space"],
    hint: "No outside medium is needed. The system of rocket plus exhaust conserves its total momentum.",
    hard: true,
  },
  {
    prompt: "Why are momentum and velocity both described as vectors?",
    right: "They have both a size and a direction",
    wrong: ["They are always positive", "They are measured in the same units", "They have no direction", "They only apply in a straight line"],
    hint: "Opposite directions have opposite signs, which matters when adding momenta in a collision.",
  },
];

function physMomentum({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return assemble(difficulty, {
    gens: [momentumValue, impulseValue, stickTogether, recoil],
    nGen: 4,
    extras: [() => sortQuestion(MOMENTUM_SORT, difficulty === 1 ? 3 : 4), AIRBAG_ORDER],
    nExtra: 1,
    bank: MOMENTUM_BANK,
  });
}

// =====================================================================
// PHYSICS: FORCES AND FIELDS
// =====================================================================

interface Fr {
  n: number;
  d: number;
}
const fr = (n: number, d: number): Fr => {
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
};
const fmtFactor = (f: Fr) => (f.d === 1 ? `multiplied by ${f.n}` : f.n === 1 ? `divided by ${f.d}` : `multiplied by ${f.n}/${f.d}`);

function scaling(law: "gravity" | "electric"): Gen {
  return (d) => {
    const g = law === "gravity";
    const qty = g ? "mass" : "charge";
    const things = g ? "objects" : "charges";
    const force = g ? "gravitational force" : "electric force";
    const dk = pick(d === 1 ? [2, 3] : [2, 3, 4]);
    let qk = pick([2, 3, 4]);
    while (qk === dk * dk) qk = pick([2, 3, 4]);
    const kind = d === 1 ? pick(["dist", "qty"]) : d === 2 ? pick(["dist", "qty", "both"]) : "combo";
    let desc: string;
    let right: Fr;
    let wrong: Fr[];
    if (kind === "dist") {
      desc = `The distance between the two ${things} is multiplied by ${dk}.`;
      right = fr(1, dk * dk);
      wrong = [fr(1, dk), fr(dk, 1), fr(dk * dk, 1)];
    } else if (kind === "qty") {
      desc = `One ${qty} is multiplied by ${qk}. The other ${qty} and the distance do not change.`;
      right = fr(qk, 1);
      wrong = [fr(qk * qk, 1), fr(1, qk), fr(1, qk * qk)];
    } else if (kind === "both") {
      desc = `Both ${qty}s are multiplied by ${qk}. The distance does not change.`;
      right = fr(qk * qk, 1);
      wrong = [fr(qk, 1), fr(2 * qk, 1), fr(1, qk * qk)];
    } else {
      desc = `One ${qty} is multiplied by ${qk} and the distance between the ${things} is multiplied by ${dk}.`;
      right = fr(qk, dk * dk);
      wrong = [fr(qk, dk), fr(qk * dk * dk, 1), fr(dk * dk, qk), fr(qk * dk, 1)];
    }
    const hint = g
      ? "F = Gm₁m₂/r². The force is proportional to each mass and inversely proportional to the square of the distance."
      : "F = kq₁q₂/r². The force is proportional to each charge and inversely proportional to the square of the distance.";
    return textChoice(
      `${desc} How does the ${force} between them change?`,
      fmtFactor(right),
      [...new Set(wrong.map(fmtFactor))].filter((w) => w !== fmtFactor(right)).slice(0, 4),
      hint,
    );
  };
}

function coulombNumber(d: Level): Question {
  const q1 = randInt(1, d === 1 ? 3 : 5);
  const q2 = randInt(1, d === 1 ? 3 : 5);
  const near = d === 1 ? true : chance(0.5);
  const r = near ? "0.10" : "0.30";
  const tenths = (near ? 9 : 1) * q1 * q2; // F in tenths of a newton
  const value = tenths / 10;
  const text = String(value);
  const answerText = Number.isInteger(value) ? String(value) : value.toFixed(1);
  const base = `Two point charges of +${q1}.0 µC and +${q2}.0 µC are ${r} m apart. Use k = 9.0 × 10⁹ N·m²/C². What is the magnitude of the electric force between them?`;
  return {
    kind: "input",
    prompt: base,
    hint: `F = kq₁q₂/r². Convert µC to C (× 10⁻⁶): F = (9.0 × 10⁹)(${q1} × 10⁻⁶)(${q2} × 10⁻⁶) ÷ ${r}². The micro prefixes cancel nine of the powers of ten.`,
    answer: answerText,
    accept: text !== answerText ? [text] : Number.isInteger(value) ? [value.toFixed(1)] : undefined,
    keypad: "decimal",
    suffix: "N",
  };
}

function centripetal(d: Level): Question {
  const v = pick([4, 6, 8, 10, 12, 15, 20]);
  const rs: number[] = [];
  for (let r = 2; r <= 60; r++) if ((v * v) % r === 0) rs.push(r);
  const r = pick(rs);
  const a = (v * v) / r;
  if (d === 1) {
    return intInput(
      `An object moves around a circle of radius ${r} m at a steady ${v} m/s. What is its centripetal acceleration?`,
      a,
      `a = v² ÷ r = ${v}² ÷ ${r}.`,
      { suffix: "m/s²" },
    );
  }
  const m = d === 2 ? pick([2, 5, 10, 50]) : pick([60, 80, 1000, 1200]);
  return intInput(
    `A ${m} kg ${m >= 1000 ? "car" : "object"} travels around a circular path of radius ${r} m at ${v} m/s. What net centripetal force acts on it?`,
    m * a,
    `F = mv²/r. First a = v²/r = ${v}² ÷ ${r} = ${a} m/s², then F = ma = ${m} × ${a}.`,
    { suffix: "N" },
  );
}

function transformer(d: Level): Question {
  const [num, den] = pick([
    [2, 1],
    [1, 2],
    [5, 1],
    [1, 4],
    [10, 1],
    [1, 5],
    [3, 1],
  ]);
  const vp = pick([60, 120, 240]);
  const k = pick([50, 100, 200]);
  const np = k * den;
  const ns = k * num;
  const vs = (vp * num) / den;
  if (d === 3 && chance(0.5)) {
    return intInput(
      `An ideal transformer has ${np} turns on the primary coil and ${vp} V across it. The secondary output is ${vs} V. How many turns does the secondary coil have?`,
      ns,
      "For an ideal transformer V_s/V_p = N_s/N_p. Rearrange: N_s = N_p × V_s ÷ V_p.",
    );
  }
  return intInput(
    `An ideal transformer has ${np} turns on the primary and ${ns} turns on the secondary. The primary is connected to ${vp} V AC. What is the secondary voltage?`,
    vs,
    `V_s/V_p = N_s/N_p, so V_s = ${vp} × ${ns} ÷ ${np}.`,
    { suffix: "V" },
  );
}

const FIELD_SORT: SortSet = {
  prompt: "Gravity, electric force, or both? Sort each description.",
  hint: "Gravity is always attractive and depends on mass. The electric force depends on charge and can attract or repel. Both act at a distance and both follow an inverse-square law.",
  bins: [
    { id: "grav", label: "gravity only", emoji: "🍎" },
    { id: "elec", label: "electric force only", emoji: "⚡" },
    { id: "both", label: "both", emoji: "🤝" },
  ],
  items: [
    { label: "always attractive", emoji: "🧲", bin: "grav" },
    { label: "depends on mass", emoji: "⚖️", bin: "grav" },
    { label: "can be repulsive", emoji: "↔️", bin: "elec" },
    { label: "depends on charge", emoji: "🔋", bin: "elec" },
    { label: "follows an inverse-square law", emoji: "📉", bin: "both" },
    { label: "acts across empty space", emoji: "🌌", bin: "both" },
  ],
};

const INDUCTION_ORDER: Gen = () =>
  orderQuestion(
    "Put the steps of how a generator makes electricity in order.",
    "Motion first, then a changing magnetic flux, which induces an emf, which can drive a current.",
    [
      "A turbine spins a coil in a magnetic field",
      "The magnetic flux through the coil keeps changing",
      "An emf is induced in the coil (Faraday's law)",
      "A current flows through the connected circuit",
    ],
    4,
  );

const FIELD_BANK: Item[] = [
  {
    prompt: "According to Newton's law of universal gravitation, the force between two masses depends on…",
    right: "the product of the masses and the inverse square of the distance between their centres",
    wrong: ["the sum of the masses and the distance", "only the larger mass", "the masses and the inverse of the distance", "the speed of the masses"],
    hint: "F = Gm₁m₂/r². Doubling a mass doubles the force. Doubling the distance cuts it to a quarter.",
  },
  {
    prompt: "Astronauts on the International Space Station float because…",
    right: "they and the station are in continuous free fall around Earth",
    wrong: ["there is no gravity at that height", "Earth's gravity is cancelled by the Moon", "space has no air, so nothing weighs anything", "the station is too far to feel any force"],
    hint: "Gravity at that height is still about 90% as strong as at the surface. Everything is falling together, so nothing pushes on the astronauts.",
  },
  {
    prompt: "A satellite moves from a low orbit to a higher orbit around Earth. Its orbital period…",
    right: "increases",
    wrong: ["decreases", "stays the same", "becomes zero"],
    hint: "Higher orbits have a longer path and a lower speed, so the period is longer.",
    hard: true,
  },
  {
    prompt: "A ball is swung in a horizontal circle on a string. The string breaks. Which way does the ball move?",
    right: "In a straight line along the tangent to the circle",
    wrong: ["Straight outward from the centre", "Straight toward the centre", "It keeps moving in a circle", "Straight down only"],
    hint: "With no net force, the ball continues in the direction it was moving at that instant: tangent to the circle.",
  },
  {
    prompt: "The net force on an object moving in uniform circular motion points…",
    right: "toward the centre of the circle",
    wrong: ["away from the centre", "in the direction of the velocity", "opposite the velocity", "there is no net force"],
    hint: "The force changes the direction of motion, not the speed. It points inward.",
  },
  {
    prompt: "A geostationary satellite stays above the same point on Earth's equator. Its orbital period is…",
    right: "about 24 hours",
    wrong: ["about 90 minutes", "about 12 hours", "about 365 days", "about 27 days"],
    hint: "To stay above one spot it must complete one orbit in the time Earth takes to rotate once.",
    hard: true,
  },
  {
    prompt: "Two protons are placed near each other. The electric force between them is…",
    right: "repulsive",
    wrong: ["attractive", "zero", "the same as gravity only"],
    hint: "Like charges repel; unlike charges attract.",
  },
  {
    prompt: "By definition, the direction of an electric field at a point is the direction of the force on…",
    right: "a small positive test charge placed there",
    wrong: ["a small negative test charge placed there", "a neutral object", "the source charge itself", "a magnet"],
    hint: "Field lines point away from positive charges and toward negative charges.",
  },
  {
    prompt: "Where electric field lines are drawn closer together, the field is…",
    right: "stronger",
    wrong: ["weaker", "zero", "directed the opposite way"],
    hint: "The density of the lines shows the strength of the field.",
  },
  {
    prompt: "A long straight wire carries a current. What is found around the wire?",
    right: "A magnetic field in circles around the wire",
    wrong: ["A magnetic field pointing along the wire", "An electric field only", "Nothing: only magnets make magnetic fields", "A gravitational field only"],
    hint: "Electric current creates a magnetic field. Use the right-hand rule: thumb along the current, fingers curl in the direction of the field.",
  },
  {
    prompt: "A magnet is pushed into a coil of wire connected to a meter. The meter deflects. Why?",
    right: "The changing magnetic flux through the coil induces an emf",
    wrong: ["The magnet adds charge to the wire", "The wire becomes a magnet permanently", "The magnet heats the wire", "Static electricity jumps from the magnet"],
    hint: "Faraday's law: a changing magnetic flux through a loop induces an emf. A stationary magnet gives no reading.",
  },
  {
    prompt: "Lenz's law says the induced current in a coil flows in the direction that…",
    right: "opposes the change in magnetic flux that caused it",
    wrong: ["adds to the change in flux", "has no relation to the flux change", "always flows clockwise", "makes the flux as large as possible"],
    hint: "Nature resists the change. This is a consequence of conservation of energy.",
    hard: true,
  },
  {
    prompt: "Why does a transformer work only with alternating current (AC)?",
    right: "AC makes the magnetic flux change continuously, which induces a voltage in the secondary coil",
    wrong: ["DC has too little energy", "AC has no direction so flux cannot form", "Transformers contain only AC batteries", "DC cannot flow in a coil"],
    hint: "A steady DC current gives a constant flux. Constant flux induces no emf.",
    hard: true,
  },
  {
    prompt: "What is the main energy conversion in an electric generator?",
    right: "Mechanical energy to electrical energy",
    wrong: ["Electrical energy to mechanical energy", "Chemical energy to light", "Thermal energy to sound", "Nuclear energy to gravitational energy"],
    hint: "A motor does the reverse: electrical energy to mechanical energy.",
  },
  {
    prompt: "In the photoelectric effect, no electrons are emitted below a certain frequency, however bright the light is. What does this support?",
    right: "Light comes in packets (photons) with energy E = hf",
    wrong: ["Light is only a wave", "Bright light has no energy", "Electrons cannot be removed from metals", "Light travels instantly"],
    hint: "Each photon must carry at least enough energy to free an electron. Brightness changes the number of photons, not the energy of each.",
    hard: true,
  },
  {
    prompt: "Einstein's special relativity says that the speed of light in a vacuum is…",
    right: "the same for all observers in uniform motion",
    wrong: ["larger for a moving light source", "smaller when the observer moves toward the source", "different for different colours in a vacuum", "infinite"],
    hint: "This surprising postulate leads to time dilation and length contraction.",
    hard: true,
  },
  {
    prompt: "What does E = mc² tell us about mass and energy?",
    right: "Mass is a form of energy, and a small mass corresponds to a very large amount of energy",
    wrong: ["Only light has mass", "Energy and mass are unrelated", "Mass can only be created from nothing", "The equation only applies to heat"],
    hint: "c² is about 9 × 10¹⁶ (m/s)², so even a gram of mass equals an enormous amount of energy.",
    hard: true,
  },
  {
    prompt: "Electrons can produce a diffraction pattern, just as waves do. This is evidence for…",
    right: "wave–particle duality",
    wrong: ["the photoelectric effect only", "time dilation", "Newton's third law", "electric shielding"],
    hint: "Matter such as electrons can behave as both particles and waves.",
    hard: true,
  },
];

function physFields({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return assemble(difficulty, {
    gens: [scaling("gravity"), scaling("electric"), coulombNumber, centripetal, transformer],
    nGen: 4,
    extras: [() => sortQuestion(FIELD_SORT, 2), INDUCTION_ORDER],
    nExtra: 1,
    bank: FIELD_BANK,
  });
}

// =====================================================================
// ANATOMY AND PHYSIOLOGY: CONTROL SYSTEMS
// =====================================================================

const NERVOUS_ENDOCRINE: SortSet = {
  prompt: "Nervous system or endocrine system? Sort each feature.",
  hint: "The nervous system uses fast electrical impulses and chemical signals across synapses. The endocrine system releases hormones into the blood, which act more slowly and often last longer.",
  bins: [
    { id: "nerve", label: "nervous system", emoji: "⚡" },
    { id: "endo", label: "endocrine system", emoji: "🧪" },
  ],
  items: [
    { label: "uses electrical impulses along neurons", emoji: "⚡", bin: "nerve" },
    { label: "responses in milliseconds", emoji: "⏱️", bin: "nerve" },
    { label: "signals cross synapses", emoji: "🔗", bin: "nerve" },
    { label: "includes the brain and spinal cord", emoji: "🧠", bin: "nerve" },
    { label: "uses hormones carried in the blood", emoji: "🩸", bin: "endo" },
    { label: "effects can last minutes to days", emoji: "📆", bin: "endo" },
    { label: "includes the thyroid and pancreas", emoji: "🦋", bin: "endo" },
    { label: "insulin and adrenaline are examples", emoji: "💉", bin: "endo" },
  ],
};

const AUTONOMIC_SORT: SortSet = {
  prompt: "Sympathetic or parasympathetic? Sort each response.",
  hint: "Sympathetic means 'fight or flight': heart rate up, pupils wide, digestion slowed. Parasympathetic means 'rest and digest': heart rate down, digestion active.",
  bins: [
    { id: "symp", label: "sympathetic (fight or flight)", emoji: "🏃" },
    { id: "para", label: "parasympathetic (rest and digest)", emoji: "😌" },
  ],
  items: [
    { label: "heart rate increases", emoji: "💓", bin: "symp" },
    { label: "pupils dilate", emoji: "👁️", bin: "symp" },
    { label: "airways widen", emoji: "🫁", bin: "symp" },
    { label: "digestion slows", emoji: "⏸️", bin: "symp" },
    { label: "heart rate decreases", emoji: "🐢", bin: "para" },
    { label: "digestion is stimulated", emoji: "🍽️", bin: "para" },
    { label: "pupils constrict", emoji: "🔅", bin: "para" },
    { label: "saliva production increases", emoji: "💧", bin: "para" },
  ],
};

const REFLEX_ORDER: Gen = () =>
  orderQuestion(
    "Put the parts of a reflex arc in order, starting with the stimulus.",
    "Signals travel in: receptor, sensory neuron, then the spinal cord (interneuron), then out: motor neuron to the effector.",
    [
      "A stimulus (like a hot surface) is detected by a receptor",
      "A sensory neuron carries the signal to the spinal cord",
      "An interneuron in the spinal cord passes the signal on",
      "A motor neuron carries the signal to a muscle",
      "The muscle (effector) contracts and pulls away",
    ],
    5,
  );

const NEURON_ORDER: Gen = () =>
  orderQuestion(
    "Trace a nerve impulse through one neuron, in order.",
    "Dendrites receive the signal, the cell body integrates it, the axon carries it, and the axon terminals pass it on.",
    ["Dendrites receive a signal", "The cell body (soma) processes it", "The impulse travels along the axon", "Neurotransmitters are released at the axon terminal", "The next cell receives the signal across the synapse"],
    4,
  );

const FEEDBACK_ORDER: Gen = () =>
  orderQuestion(
    "Put the steps of a negative feedback loop in order (body temperature rises).",
    "A loop runs: change, receptor, control centre, effector, return toward the set point.",
    [
      "Body temperature rises above the set point",
      "Temperature receptors detect the change",
      "The hypothalamus (control centre) compares it with the set point",
      "Sweat glands and skin blood vessels respond (effectors)",
      "Body temperature falls back toward the set point",
    ],
    4,
  );

function nerveTime(d: Level): Question {
  const v = pick([10, 20, 25, 40, 50, 100]);
  const dist = pick(d === 1 ? [1] : [1, 2]);
  const t = (1000 * dist) / v;
  return intInput(
    `A nerve impulse travels ${dist} m along an axon at ${v} m/s. How long does it take?`,
    t,
    `time = distance ÷ speed = ${dist} m ÷ ${v} m/s. Multiply by 1000 to convert seconds to milliseconds.`,
    { suffix: "ms" },
  );
}

const CONTROL_BANK: Item[] = [
  {
    prompt: "What is homeostasis?",
    right: "Keeping the body's internal conditions within a stable, narrow range",
    wrong: ["Making the body's conditions change as much as possible", "Fighting off infection", "Growing new tissue", "Moving blood around the body"],
    hint: "Examples include body temperature, blood glucose and fluid balance.",
  },
  {
    prompt: "Which is an example of negative feedback?",
    right: "Sweating when body temperature rises, which cools you down",
    wrong: ["Contractions during childbirth that cause more contractions", "A scab forming", "Blood clotting that attracts more platelets", "A fever that keeps climbing without limit"],
    hint: "Negative feedback reverses a change and brings the variable back toward its set point.",
  },
  {
    prompt: "Which is an example of positive feedback in the body?",
    right: "Oxytocin strengthening labour contractions, which release more oxytocin",
    wrong: ["Insulin lowering blood glucose", "Sweating to cool the body", "Shivering to warm the body", "Breathing faster when CO₂ rises"],
    hint: "Positive feedback amplifies a change until something ends the loop (here, birth).",
    hard: true,
  },
  {
    prompt: "Which part of the brain acts as the control centre for body temperature?",
    right: "the hypothalamus",
    wrong: ["the cerebellum", "the medulla only", "the frontal lobe", "the pituitary only"],
    hint: "The hypothalamus links the nervous and endocrine systems and monitors things like temperature and thirst.",
  },
  {
    prompt: "Which part of a neuron usually receives incoming signals?",
    right: "the dendrites",
    wrong: ["the axon terminals", "the myelin sheath", "the node of Ranvier", "the synaptic gap"],
    hint: "Dendrites are the branching 'receivers'. The axon carries the signal away.",
  },
  {
    prompt: "What is the main job of the myelin sheath?",
    right: "To insulate the axon and speed up the conduction of impulses",
    wrong: ["To store neurotransmitters", "To receive signals", "To make hormones", "To digest waste"],
    hint: "Impulses jump between the gaps in the myelin, making conduction much faster.",
  },
  {
    prompt: "How does a signal cross a synapse between two neurons?",
    right: "Neurotransmitter molecules are released and bind to receptors on the next cell",
    wrong: ["An electrical impulse jumps across the gap", "Hormones travel through the bloodstream", "The axons physically fuse", "White blood cells carry it"],
    hint: "At most synapses the signal changes from electrical to chemical and back again.",
  },
  {
    prompt: "The central nervous system (CNS) is made up of…",
    right: "the brain and the spinal cord",
    wrong: ["all the nerves in the body", "the brain only", "the spinal cord and the muscles", "the brain, heart and lungs"],
    hint: "Everything outside the CNS (nerves running to the body) is the peripheral nervous system.",
  },
  {
    prompt: "A reflex like pulling your hand from a hot object is fast because…",
    right: "the signal is processed in the spinal cord without waiting for the brain",
    wrong: ["the hand makes the decision itself", "the signal travels in the blood", "the brain is not part of the nervous system", "hormones carry it"],
    hint: "A short pathway through the spinal cord means a very fast response. The brain finds out afterward.",
  },
  {
    prompt: "Which part of the brain is mainly responsible for balance and coordination of movement?",
    right: "the cerebellum",
    wrong: ["the cerebrum", "the hypothalamus", "the pituitary", "the spinal cord"],
    hint: "The cerebellum sits at the back and under the cerebrum. The cerebrum handles thought and voluntary action.",
  },
  {
    prompt: "After a meal, blood glucose rises. Which hormone from the pancreas helps lower it?",
    right: "insulin",
    wrong: ["glucagon", "adrenaline", "thyroxine", "oxytocin"],
    hint: "Insulin helps cells take up glucose and the liver store it. Glucagon does the opposite when glucose is low.",
  },
  {
    prompt: "Between meals, blood glucose falls. Which hormone causes the liver to release stored glucose?",
    right: "glucagon",
    wrong: ["insulin", "oxytocin", "melatonin", "thyroxine"],
    hint: "Insulin and glucagon form a negative-feedback pair that holds blood glucose steady.",
  },
  {
    prompt: "How do hormones reach their target cells?",
    right: "They are released into the blood and bind to receptors on target cells",
    wrong: ["They travel along neurons", "They are released directly onto every cell", "They are swallowed", "They are carried by white blood cells"],
    hint: "Only cells with the right receptor respond, even though the hormone reaches the whole body.",
  },
  {
    prompt: "Which hormone from the adrenal glands prepares the body for a stressful situation by raising heart rate?",
    right: "adrenaline (epinephrine)",
    wrong: ["insulin", "melatonin", "growth hormone", "thyroxine"],
    hint: "Adrenaline works with the sympathetic nervous system for 'fight or flight'.",
  },
  {
    prompt: "In type 1 diabetes, why is blood glucose hard to control?",
    right: "The body makes little or no insulin because insulin-producing cells are destroyed",
    wrong: ["The body makes too much glucagon only", "The stomach cannot digest sugar", "The kidneys make too much insulin", "The brain cannot sense hunger"],
    hint: "People with type 1 diabetes replace the missing insulin by injection or pump.",
    hard: true,
  },
  {
    prompt: "Stronger stimuli produce stronger sensations. How does a neuron signal a stronger stimulus?",
    right: "By firing impulses more frequently (each impulse is the same size)",
    wrong: ["By firing larger impulses", "By slowing its impulses down", "By changing into a muscle cell", "By releasing hormones into the blood"],
    hint: "A neuron fires fully or not at all, the 'all-or-none' principle. Intensity is coded by how often it fires.",
    hard: true,
  },
  {
    prompt: "The pituitary gland is sometimes called the 'master gland'. Why?",
    right: "It releases hormones that control other endocrine glands",
    wrong: ["It is the largest gland", "It controls all muscles directly", "It makes all digestive juices", "It stores blood"],
    hint: "The hypothalamus controls the pituitary, and the pituitary signals glands such as the thyroid and adrenals.",
    hard: true,
  },
  {
    prompt: "Thyroid hormones (such as thyroxine) mainly regulate…",
    right: "the body's metabolic rate",
    wrong: ["blood clotting", "the sleep–wake cycle only", "the rate of nerve impulses", "digestive enzymes"],
    hint: "Thyroid hormones set how quickly cells use energy.",
    hard: true,
  },
];

function anatomyControl({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return assemble(difficulty, {
    gens: [nerveTime],
    nGen: 1,
    extras: [() => sortQuestion(NERVOUS_ENDOCRINE, difficulty === 1 ? 3 : 4), () => sortQuestion(AUTONOMIC_SORT, difficulty === 1 ? 3 : 4), REFLEX_ORDER, NEURON_ORDER, FEEDBACK_ORDER],
    nExtra: 2,
    bank: CONTROL_BANK,
  });
}

// =====================================================================
// ANATOMY AND PHYSIOLOGY: TRANSPORT AND DEFENCE
// =====================================================================

function cardiacOutput(d: Level): Question {
  const hr = randInt(6, 10) * 10;
  const sv = pick([50, 60, 70, 80, 90]);
  if (d === 3) {
    return decInput(
      `A resting adult has a heart rate of ${hr} beats per minute and a stroke volume of ${sv} mL. What is the cardiac output in litres per minute?`,
      (hr * sv) / 1000,
      2,
      `Cardiac output = heart rate × stroke volume = ${hr} × ${sv} = ${hr * sv} mL/min. Divide by 1000 to convert mL to L.`,
      { suffix: "L/min" },
    );
  }
  return intInput(
    `A resting adult has a heart rate of ${hr} beats per minute and a stroke volume of ${sv} mL per beat. What is the cardiac output?`,
    hr * sv,
    `Cardiac output = heart rate × stroke volume = ${hr} × ${sv}.`,
    { suffix: "mL/min" },
  );
}

function ventilation(d: Level): Question {
  const rate = randInt(10, 16);
  const tv = pick([400, 450, 500, 550]);
  if (d === 3 || (d === 2 && chance(0.4))) {
    return intInput(
      `A person breathes ${rate} times per minute with a tidal volume of ${tv} mL. About 150 mL of each breath stays in the airways (dead space) and never reaches the alveoli. What is the volume of air reaching the alveoli per minute?`,
      rate * (tv - 150),
      `Each breath delivers ${tv} − 150 = ${tv - 150} mL to the alveoli. Multiply by ${rate} breaths per minute.`,
      { suffix: "mL/min" },
    );
  }
  return intInput(
    `A person breathes ${rate} times per minute, moving ${tv} mL of air with each breath. What is the minute ventilation?`,
    rate * tv,
    `Minute ventilation = breathing rate × tidal volume = ${rate} × ${tv}.`,
    { suffix: "mL/min" },
  );
}

const BLOOD_PATH: Gen = () =>
  orderQuestion(
    "Follow a drop of blood through the heart and lungs, in order.",
    "Body blood enters the right side, goes to the lungs, returns to the left side, then leaves to the body.",
    [
      "Right atrium",
      "Right ventricle",
      "Pulmonary artery (to the lungs)",
      "Pulmonary vein (from the lungs)",
      "Left atrium",
      "Left ventricle",
    ],
    5,
  );

const AIR_PATH: Gen = () =>
  orderQuestion(
    "Put the path of inhaled air in order.",
    "Air passes the nose, throat, windpipe and bronchi, then smaller and smaller tubes, and finally reaches the alveoli.",
    ["Nasal cavity", "Pharynx (throat)", "Trachea (windpipe)", "Bronchi", "Bronchioles", "Alveoli"],
    5,
  );

const VESSEL_SORT: Gen = () =>
  sortQuestion(
    {
      prompt: "Artery, vein or capillary? Sort each description.",
      hint: "Arteries carry blood away from the heart at high pressure with thick, elastic walls. Veins return blood at low pressure and have valves. Capillaries have walls one cell thick, where exchange happens.",
      bins: [
        { id: "artery", label: "artery", emoji: "🔴" },
        { id: "vein", label: "vein", emoji: "🔵" },
        { id: "cap", label: "capillary", emoji: "🕸️" },
      ],
      items: [
        { label: "thick, elastic walls", emoji: "💪", bin: "artery" },
        { label: "carries blood away from the heart", emoji: "➡️", bin: "artery" },
        { label: "the pulse can be felt here", emoji: "🤚", bin: "artery" },
        { label: "has valves that prevent backflow", emoji: "🚪", bin: "vein" },
        { label: "carries blood back toward the heart", emoji: "⬅️", bin: "vein" },
        { label: "lowest blood pressure of the three", emoji: "⬇️", bin: "vein" },
        { label: "walls only one cell thick", emoji: "📏", bin: "cap" },
        { label: "where gases and nutrients are exchanged", emoji: "🔄", bin: "cap" },
      ],
    },
    2,
  );

const TRANSPORT_BANK: Item[] = [
  {
    prompt: "Which chamber of the heart pumps blood to the whole body?",
    right: "the left ventricle",
    wrong: ["the right ventricle", "the left atrium", "the right atrium"],
    hint: "The left ventricle has the thickest wall because it pumps blood to the whole body, not just the lungs.",
  },
  {
    prompt: "What is the main job of the heart's valves?",
    right: "To keep blood flowing in one direction",
    wrong: ["To make red blood cells", "To filter the blood", "To store oxygen", "To control breathing"],
    hint: "The 'lub-dub' sound of the heart is valves closing.",
  },
  {
    prompt: "Which vessel carries oxygen-poor blood away from the heart?",
    right: "the pulmonary artery",
    wrong: ["the pulmonary vein", "the aorta", "the coronary vein only", "the carotid artery"],
    hint: "Arteries carry blood away from the heart. The pulmonary artery takes blood to the lungs to pick up oxygen.",
    hard: true,
  },
  {
    prompt: "Which blood component carries oxygen?",
    right: "red blood cells (haemoglobin)",
    wrong: ["white blood cells", "platelets", "plasma proteins only"],
    hint: "Haemoglobin in red blood cells binds oxygen in the lungs.",
  },
  {
    prompt: "What do platelets do?",
    right: "Help blood clot to seal a wound",
    wrong: ["Carry oxygen", "Make antibodies", "Digest food", "Carry hormones only"],
    hint: "Platelets are cell fragments that stick together at a cut and trigger clotting.",
  },
  {
    prompt: "A blood pressure reading is 120/80. What does the top number (120) measure?",
    right: "The pressure when the ventricles contract (systolic)",
    wrong: ["The pressure when the ventricles relax (diastolic)", "The heart rate", "The oxygen level", "The volume of blood"],
    hint: "Systolic is the peak pressure when the heart beats. Diastolic is the lower pressure between beats.",
  },
  {
    prompt: "During inhalation, the diaphragm…",
    right: "contracts and moves down, increasing the volume of the chest cavity",
    wrong: ["relaxes and moves up, increasing the volume", "contracts and moves up", "stops moving", "pushes air in directly"],
    hint: "Greater volume means lower pressure inside the lungs, so air flows in from higher pressure outside.",
  },
  {
    prompt: "How does oxygen move from the alveoli into the blood?",
    right: "By diffusion, from high concentration to low concentration across thin walls",
    wrong: ["By active transport using ATP only", "By being pumped by the heart", "By osmosis of water", "By the diaphragm pushing it"],
    hint: "Oxygen is at a higher concentration in the alveoli than in the blood arriving from the body.",
  },
  {
    prompt: "What triggers the urge to breathe more deeply and quickly during exercise?",
    right: "A rise in carbon dioxide (and fall in pH) in the blood, detected by the brain",
    wrong: ["A fall in nitrogen in the blood", "A drop in blood sugar only", "A signal from the stomach", "The lungs running out of air"],
    hint: "CO₂ makes the blood slightly more acidic. Chemoreceptors tell the breathing centre in the brainstem to speed up.",
    hard: true,
  },
  {
    prompt: "What do cilia and mucus in the airways do?",
    right: "Trap particles and microbes and sweep them out of the airways",
    wrong: ["Exchange oxygen with the blood", "Make the voice louder", "Warm the blood", "Pump air into the lungs"],
    hint: "Mucus catches dust and microbes; cilia move it upward to be swallowed or coughed out.",
  },
  {
    prompt: "Which of these is part of the body's nonspecific (innate) defences?",
    right: "Skin and mucous membranes",
    wrong: ["Antibodies made against one particular microbe", "Memory T cells", "A vaccine", "B cells making a custom antibody"],
    hint: "Nonspecific defences act against all invaders in the same way. Antibodies and memory cells are specific.",
  },
  {
    prompt: "How does a vaccine help protect you?",
    right: "It trains the immune system to recognize a pathogen so it can respond faster later",
    wrong: ["It kills all the microbes in the body", "It makes the skin thicker", "It removes the need for an immune system", "It gives you the pathogen's antibodies from another person permanently"],
    hint: "A vaccine shows the immune system a harmless piece or weakened form, creating memory cells.",
  },
  {
    prompt: "Why are antibiotics not used to treat colds and flu?",
    right: "Colds and flu are caused by viruses, and antibiotics work against bacteria",
    wrong: ["Antibiotics only work on fungi", "Viruses are too big", "Antibiotics make viruses stronger in all cases", "Colds are not infections"],
    hint: "Antibiotics target features of bacterial cells. Viruses are not cells.",
  },
  {
    prompt: "Which cells make antibodies?",
    right: "B lymphocytes (plasma cells)",
    wrong: ["Red blood cells", "Platelets", "Neurons", "Epithelial cells"],
    hint: "B cells that recognize an antigen become plasma cells that release antibodies.",
    hard: true,
  },
  {
    prompt: "An allergy is best described as…",
    right: "an immune response to a normally harmless substance",
    wrong: ["a bacterial infection", "a failure of the nervous system", "a lack of white blood cells", "a viral infection of the skin"],
    hint: "The immune system overreacts to a harmless trigger such as pollen or peanuts.",
    hard: true,
  },
  {
    prompt: "What is one role of the lymphatic system?",
    right: "Return extra tissue fluid to the blood and house immune cells",
    wrong: ["Pump blood around the body", "Exchange oxygen in the lungs", "Make bile", "Send nerve impulses"],
    hint: "Lymph nodes filter lymph and contain lymphocytes.",
    hard: true,
  },
];

function anatomyTransport({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return assemble(difficulty, {
    gens: [cardiacOutput, ventilation],
    nGen: 2,
    extras: [BLOOD_PATH, AIR_PATH, VESSEL_SORT],
    nExtra: 1,
    bank: TRANSPORT_BANK,
  });
}

// =====================================================================
// ENVIRONMENTAL SCIENCE: ECOSYSTEMS
// =====================================================================

function tenPercent(d: Level): Question {
  const tier = d === 1 ? 2 : pick([3, 4]);
  const names = ["producers", "primary consumers", "secondary consumers", "tertiary consumers"];
  const start = pick([20000, 50000, 100000, 200000]);
  const answer = start / 10 ** (tier - 1);
  return intInput(
    `A food chain contains ${Math.round(start).toLocaleString("en-CA").replace(/,/g, " ")} kJ of energy at the producer level. Assuming about 10% of energy passes to each next trophic level, how much energy reaches the ${names[tier - 1]}?`,
    answer,
    `Each step up keeps about 10%, so divide by 10 for every level above the producers. The ${names[tier - 1]} are ${tier - 1} step${tier - 1 === 1 ? "" : "s"} up.`,
    { suffix: "kJ" },
  );
}

function markRecapture(): Question {
  const M = pick([20, 30, 40, 50, 60]);
  const R = randInt(2, 10);
  const j = randInt(2, 9);
  const C = R * j;
  const N = M * j;
  return intInput(
    `Researchers tag ${M} fish in a lake and release them. Later they catch ${C} fish, and ${R} of them are tagged. Estimate the lake's population using N = (M × C) ÷ R.`,
    N,
    `N = (${M} × ${C}) ÷ ${R}. The tagged fraction of the second catch (${R}/${C}) is assumed to match the tagged fraction of the whole population (${M}/N).`,
  );
}

function densityQuestion(): Question {
  const area = pick([2, 4, 5, 10, 20, 25]);
  const per = randInt(3, 30);
  const n = area * per;
  return intInput(
    `A biologist counts ${n} deer in a ${area} km² study area. What is the population density?`,
    per,
    `Density = number ÷ area = ${n} ÷ ${area}.`,
    { suffix: "per km²" },
  );
}

const LIMITING_SORT: SortSet = {
  prompt: "Density-dependent or density-independent limiting factor? Sort each.",
  hint: "Density-dependent factors have a stronger effect when a population is crowded: competition, predation, disease. Density-independent factors act no matter the population size: wildfire, floods, severe storms.",
  bins: [
    { id: "dep", label: "density-dependent", emoji: "👥" },
    { id: "indep", label: "density-independent", emoji: "🌪️" },
  ],
  items: [
    { label: "competition for food", emoji: "🍽️", bin: "dep" },
    { label: "spread of disease in a crowded herd", emoji: "🤧", bin: "dep" },
    { label: "predation", emoji: "🦅", bin: "dep" },
    { label: "competition for nesting sites", emoji: "🪺", bin: "dep" },
    { label: "a wildfire", emoji: "🔥", bin: "indep" },
    { label: "a flood", emoji: "🌊", bin: "indep" },
    { label: "a severe winter storm", emoji: "🌨️", bin: "indep" },
    { label: "a volcanic eruption", emoji: "🌋", bin: "indep" },
  ],
};

const SUCCESSION_ORDER: Gen = () =>
  orderQuestion(
    "Put the stages of primary succession on bare rock in order.",
    "Pioneer species such as lichens come first and build soil. Grasses and shrubs follow, and then trees.",
    ["Bare rock exposed", "Lichens and mosses colonize (pioneer species)", "Soil slowly builds up", "Grasses and shrubs take hold", "A mature forest develops"],
    4,
  );

const EUTROPH_ORDER: Gen = () =>
  orderQuestion(
    "Put the steps of eutrophication in order.",
    "It starts with nutrient runoff and ends with the death of oxygen-dependent organisms.",
    [
      "Fertilizer and sewage nutrients run into a lake",
      "Algae grow rapidly (an algal bloom)",
      "The algae die and bacteria decompose them",
      "Decomposers use up the dissolved oxygen",
      "Fish and other organisms die from low oxygen",
    ],
    4,
  );

const ECO_BANK: Item[] = [
  {
    prompt: "Which list names the three levels of biodiversity?",
    right: "genetic diversity, species diversity, ecosystem diversity",
    wrong: ["plant diversity, animal diversity, fungi diversity", "land diversity, water diversity, air diversity", "producer diversity, consumer diversity, decomposer diversity"],
    hint: "Biodiversity can be measured within a species (genes), among species, and among ecosystems.",
  },
  {
    prompt: "Sea otters eat sea urchins, which graze on kelp. If otters are removed from a coastal ecosystem, what is the likely result?",
    right: "Urchins increase and kelp forests decline",
    wrong: ["Kelp forests expand", "Nothing changes, since otters are one species", "The urchins die out", "Fish populations all grow equally"],
    hint: "Sea otters are a keystone species: their effect is much larger than their numbers. Follow the chain: fewer otters, more urchins, less kelp.",
  },
  {
    prompt: "Why are invasive species often a serious threat to native species?",
    right: "They can spread rapidly because they may lack natural predators, and they outcompete natives",
    wrong: ["They are always larger than native species", "They never reproduce", "They only live in cities", "They are always predators"],
    hint: "In a new region, the controls (predators, diseases) that limited the species at home may be missing.",
  },
  {
    prompt: "Which is currently considered the leading cause of biodiversity loss on land?",
    right: "Habitat loss and fragmentation, for example from converting land to farms and cities",
    wrong: ["Meteorite impacts", "Too many predators", "Natural volcano eruptions", "Overgrowth of native forests"],
    hint: "When habitat is cleared or broken into small pieces, species have less space and fewer links with others.",
  },
  {
    prompt: "After a forest fire leaves the soil intact, regrowth begins with grasses and shrubs. This is…",
    right: "secondary succession",
    wrong: ["primary succession", "biomagnification", "eutrophication"],
    hint: "Secondary succession starts where soil is already present. Primary succession starts on bare rock or new land with no soil.",
  },
  {
    prompt: "Why are there far fewer top predators than herbivores in an ecosystem?",
    right: "Much of the energy is lost as heat and used in life processes at each trophic level",
    wrong: ["Predators are born less often by chance only", "Herbivores eat predators", "Energy increases at each level", "Top predators do not need energy"],
    hint: "Only roughly 10% of the energy passes to the next level, so higher levels can support fewer individuals.",
  },
  {
    prompt: "What is the role of decomposers in an ecosystem?",
    right: "They break down dead organisms and return nutrients to the soil and water",
    wrong: ["They produce food by photosynthesis", "They hunt living prey", "They convert nitrogen gas into energy", "They store energy as fat for predators"],
    hint: "Fungi and bacteria recycle matter so producers can use it again.",
  },
  {
    prompt: "Which process removes carbon dioxide from the atmosphere and stores carbon in living tissue?",
    right: "photosynthesis",
    wrong: ["cellular respiration", "combustion of fossil fuels", "decomposition", "evaporation"],
    hint: "Plants, algae and some bacteria use CO₂, water and light energy to make sugars.",
  },
  {
    prompt: "Why can plants not use nitrogen gas (N₂) from the air directly?",
    right: "They need nitrogen in forms like ammonium and nitrate, which nitrogen-fixing bacteria help to make",
    wrong: ["Plants do not need nitrogen", "N₂ is toxic to plants", "N₂ is too heavy to enter leaves", "Plants only absorb nitrogen from rain"],
    hint: "The strong triple bond in N₂ is hard to break. Certain bacteria do it, and so does lightning and industrial fertilizer manufacture.",
    hard: true,
  },
  {
    prompt: "Mercury becomes more concentrated in each higher level of a food chain, so large predatory fish carry the most. This is called…",
    right: "biomagnification",
    wrong: ["eutrophication", "succession", "carrying capacity"],
    hint: "Persistent substances build up in tissues and are passed up when predators eat many prey.",
    hard: true,
  },
  {
    prompt: "What is the carrying capacity of an environment?",
    right: "The largest population of a species that the environment can sustain over time",
    wrong: ["The number of species in an area", "The weight an animal can carry", "The population at the moment of birth", "The area covered by a habitat"],
    hint: "It is set by limiting factors such as food, water, shelter and disease.",
  },
  {
    prompt: "Which of these is an example of an ecosystem service?",
    right: "Wetlands filtering water and absorbing floodwater",
    wrong: ["A factory producing electricity", "A road connecting two towns", "A bank loan", "A mine producing metals"],
    hint: "Ecosystem services are benefits people get from healthy ecosystems: clean water, pollination, climate regulation and more.",
  },
  {
    prompt: "Pacific salmon return from the ocean to spawn and die in streams, where bears and other animals carry their bodies into the forest. What does this show?",
    right: "Marine nutrients are moved into forest ecosystems, linking ocean and land",
    wrong: ["Salmon are producers", "Forests have no link to rivers", "Nutrients only flow from land to the sea", "Salmon cause eutrophication in every river"],
    hint: "Nitrogen from the ocean ends up in forest soil and trees. Ecosystems are connected.",
  },
  {
    prompt: "Many Indigenous communities hold knowledge about local plants, animals and seasons built up over many generations. Why can this knowledge be valuable in environmental management?",
    right: "It is based on long-term, place-based observation and can complement scientific monitoring",
    wrong: ["It can replace all scientific study", "It is the same in every community and region", "It only has historical interest", "It cannot be combined with other methods"],
    hint: "Each community's knowledge is specific to its own territory. Working together can give a fuller picture than either approach alone.",
  },
  {
    prompt: "Indigenous Protected and Conserved Areas (IPCAs) are best described as…",
    right: "lands and waters where an Indigenous government has the primary role in protecting and conserving ecosystems",
    wrong: ["areas where all human activity is banned by law", "areas managed only by the federal government", "private parks run for profit", "areas that are protected only on paper"],
    hint: "IPCAs are led by Indigenous governments, guided by their own laws, knowledge and systems.",
    hard: true,
  },
  {
    prompt: "Excess nitrogen and phosphorus from fertilizer run into a lake. What is the most likely long-term effect?",
    right: "Algal blooms followed by low oxygen that harms fish",
    wrong: ["Clearer water with more oxygen", "An increase in water temperature only", "More sunlight reaching the lake bottom", "No effect, since nutrients are harmless"],
    hint: "More nutrients grow more algae. When the algae die, decomposers use up the oxygen.",
  },
  {
    prompt: "Which is a typical feature of a species with an r-selected life strategy (such as many insects)?",
    right: "Many offspring, little parental care, short lifespan",
    wrong: ["Few offspring, much parental care, long lifespan", "No reproduction", "Only one offspring per lifetime", "Very large body size"],
    hint: "K-selected species (like elephants) invest in a few young. r-selected species produce many.",
    hard: true,
  },
  {
    prompt: "A wildlife corridor connects two forest patches separated by a highway. What is its main purpose?",
    right: "To let animals move between habitats, which keeps populations connected and genetically diverse",
    wrong: ["To make animals feel more crowded", "To keep all animals in one patch", "To increase noise for animals", "To prevent plants from growing"],
    hint: "Isolated small populations lose genetic diversity. Corridors reduce the effects of fragmentation.",
    hard: true,
  },
];

function envEcosystems({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return assemble(difficulty, {
    gens: [tenPercent, markRecapture, densityQuestion],
    nGen: 2,
    extras: [() => sortQuestion(LIMITING_SORT, difficulty === 1 ? 3 : 4), SUCCESSION_ORDER, EUTROPH_ORDER],
    nExtra: 1,
    bank: ECO_BANK,
  });
}

// =====================================================================
// ENVIRONMENTAL SCIENCE: CLIMATE AND SUSTAINABILITY
// =====================================================================

function ruleOf70(d: Level): Question {
  const rate = pick(d === 1 ? [1, 2, 5, 7] : [1, 2, 5, 7, 10, 14]);
  const years = 70 / rate;
  if (d === 3 && chance(0.5)) {
    const start = pick([200, 500, 1000]);
    const doublings = pick([2, 3]);
    return intInput(
      `A population of ${start} grows at ${rate}% per year, so it doubles about every ${years} years (rule of 70). About how large will it be after ${years * doublings} years?`,
      start * 2 ** doublings,
      `${years * doublings} years is ${doublings} doubling times. Double the population ${doublings} times: ${start} × 2^${doublings}.`,
    );
  }
  return intInput(
    `A population grows at a steady ${rate}% per year. Using the rule of 70 (doubling time ≈ 70 ÷ growth rate in %), about how many years does it take to double?`,
    years,
    `Doubling time ≈ 70 ÷ ${rate}.`,
    { suffix: "years" },
  );
}

function carFootprint(d: Level): Question {
  const dist = pick(d === 1 ? [100, 200] : [100, 200, 500, 1000]);
  const lPer100 = randInt(5, 12);
  const litres = (dist / 100) * lPer100;
  const kg = (litres * 23) / 10;
  return decInput(
    `Burning 1 L of gasoline releases about 2.3 kg of CO₂. A car uses ${lPer100} L per 100 km. How many kilograms of CO₂ does it release over ${dist} km?`,
    kg,
    1,
    `First find the fuel used: ${dist} ÷ 100 × ${lPer100} = ${litres} L. Then multiply by 2.3 kg of CO₂ per litre.`,
    { suffix: "kg" },
  );
}

function emissionsTarget(): Question {
  const base = pick([20, 40, 60, 80, 100, 200]);
  const pct = pick([20, 25, 30, 40, 50]);
  const target = (base * (100 - pct)) / 100;
  return intInput(
    `A city emits ${base} megatonnes of CO₂e per year. Its goal is to cut emissions by ${pct}%. What is the target level?`,
    target,
    `A ${pct}% cut leaves ${100 - pct}% of ${base}. Calculate ${base} × ${100 - pct} ÷ 100.`,
    { suffix: "Mt" },
  );
}

function populationGrowthTable(): Question {
  const start = pick([100, 200, 500]);
  const doubleEvery = pick([10, 20, 25]);
  const k = pick([2, 3, 4]);
  return intInput(
    `A bacterial colony starts with ${start} cells and doubles every ${doubleEvery} minutes. How many cells are there after ${k * doubleEvery} minutes?`,
    start * 2 ** k,
    `${k * doubleEvery} minutes is ${k} doubling periods. Multiply ${start} by 2 a total of ${k} times.`,
  );
}

const MITIGATION_SORT: SortSet = {
  prompt: "Mitigation or adaptation? Sort each climate action.",
  hint: "Mitigation reduces greenhouse gas emissions or removes them from the air (the cause). Adaptation prepares communities for the effects of climate change that cannot be avoided.",
  bins: [
    { id: "mitigate", label: "mitigation (cut emissions)", emoji: "📉" },
    { id: "adapt", label: "adaptation (prepare for effects)", emoji: "🛡️" },
  ],
  items: [
    { label: "building wind and solar farms", emoji: "🌬️", bin: "mitigate" },
    { label: "improving building insulation", emoji: "🏠", bin: "mitigate" },
    { label: "switching buses to electric", emoji: "🚌", bin: "mitigate" },
    { label: "capturing methane at landfills", emoji: "🗑️", bin: "mitigate" },
    { label: "building sea walls", emoji: "🧱", bin: "adapt" },
    { label: "breeding drought-tolerant crops", emoji: "🌾", bin: "adapt" },
    { label: "creating heat warning systems", emoji: "🌡️", bin: "adapt" },
    { label: "moving buildings out of floodplains", emoji: "🏘️", bin: "adapt" },
  ],
};

const RENEWABLE_SORT: SortSet = {
  prompt: "Renewable or non-renewable energy source? Sort each.",
  hint: "Renewable sources are replenished on human timescales (sun, wind, flowing water, Earth's heat). Fossil fuels and uranium are limited.",
  bins: [
    { id: "ren", label: "renewable", emoji: "♻️" },
    { id: "non", label: "non-renewable", emoji: "⛽" },
  ],
  items: [
    { label: "solar", emoji: "☀️", bin: "ren" },
    { label: "wind", emoji: "🌬️", bin: "ren" },
    { label: "hydroelectric", emoji: "💧", bin: "ren" },
    { label: "geothermal", emoji: "🌋", bin: "ren" },
    { label: "coal", emoji: "⚫", bin: "non" },
    { label: "oil", emoji: "🛢️", bin: "non" },
    { label: "natural gas", emoji: "🔥", bin: "non" },
    { label: "uranium (nuclear fission)", emoji: "⚛️", bin: "non" },
  ],
};

const WASTE_ORDER: Gen = () =>
  orderQuestion(
    "Put the waste hierarchy in order, from the most preferred option to the least.",
    "The best waste is the waste never created: reduce first, then reuse, recycle, recover energy, and landfill as a last resort.",
    ["Reduce", "Reuse", "Recycle", "Recover energy", "Landfill"],
    4,
  );

const GREENHOUSE_ORDER: Gen = () =>
  orderQuestion(
    "Put the steps of the greenhouse effect in order.",
    "Sunlight warms the surface, the surface radiates infrared, greenhouse gases absorb and re-radiate it, and some returns to Earth.",
    [
      "Sunlight reaches and warms Earth's surface",
      "The surface gives off infrared (heat) radiation",
      "Greenhouse gases absorb some of that radiation",
      "They re-radiate it in all directions, including back down",
      "The lower atmosphere and surface are warmer than they would be otherwise",
    ],
    4,
  );

const CLIMATE_BANK: Item[] = [
  {
    prompt: "Which of these is NOT a greenhouse gas?",
    right: "Nitrogen (N₂)",
    wrong: ["Carbon dioxide (CO₂)", "Methane (CH₄)", "Water vapour (H₂O)", "Nitrous oxide (N₂O)"],
    hint: "Greenhouse gases absorb infrared radiation. N₂ and O₂, the main gases in air, do not.",
  },
  {
    prompt: "How do greenhouse gases warm the lower atmosphere?",
    right: "They absorb infrared radiation from Earth's surface and re-radiate some of it back downward",
    wrong: ["They block sunlight from reaching Earth", "They create heat by reacting with ozone", "They reflect all sunlight back to space", "They trap air like the glass of a greenhouse"],
    hint: "The surface radiates heat as infrared. Greenhouse gases absorb it and radiate it in all directions, including down.",
  },
  {
    prompt: "The natural greenhouse effect is…",
    right: "important, since without it Earth would be far too cold for most life",
    wrong: ["a human invention", "the cause of the ozone hole", "harmful at any level", "only a problem in cities"],
    hint: "The problem is the enhanced greenhouse effect: adding extra greenhouse gases strengthens it.",
  },
  {
    prompt: "What is the largest source of the extra CO₂ added to the atmosphere by humans over the past century?",
    right: "Burning fossil fuels",
    wrong: ["Volcanoes", "Ocean waves", "Plant respiration", "The Sun"],
    hint: "Burning coal, oil and natural gas releases carbon stored underground for millions of years. Deforestation is the second largest.",
  },
  {
    prompt: "Which is a significant source of atmospheric methane?",
    right: "Livestock, landfills and leaks from natural gas systems",
    wrong: ["Solar panels", "Wind turbines", "Trees growing in forests", "Electric cars"],
    hint: "Methane forms where organic matter breaks down without oxygen, and it leaks from fossil fuel infrastructure.",
  },
  {
    prompt: "What is the difference between weather and climate?",
    right: "Weather is short-term conditions; climate is the long-term pattern, typically averaged over about 30 years",
    wrong: ["They are two words for the same thing", "Climate changes hourly, weather changes yearly", "Weather only applies to storms", "Climate only applies to the tropics"],
    hint: "A cold week does not disprove warming, because climate is measured over decades.",
  },
  {
    prompt: "As Arctic sea ice melts, darker ocean is exposed. The ocean absorbs more sunlight, causing more warming and more melting. This is…",
    right: "a positive feedback",
    wrong: ["a negative feedback", "a carbon sink", "a mitigation strategy", "an example of weather"],
    hint: "A positive feedback amplifies the original change. The ice-albedo feedback is a classic example.",
    hard: true,
  },
  {
    prompt: "Thawing permafrost may release stored carbon as CO₂ and methane. Why is this a concern?",
    right: "It adds greenhouse gases and could cause further warming (a positive feedback)",
    wrong: ["It removes greenhouse gases", "It cools the planet", "It has no effect on climate", "It only affects the ocean"],
    hint: "Warming thaws permafrost, thawing releases gases, and the gases cause more warming.",
    hard: true,
  },
  {
    prompt: "Which two processes mainly cause global sea level to rise as the planet warms?",
    right: "Thermal expansion of seawater and melting of land-based ice such as glaciers and ice sheets",
    wrong: ["More rain falling on the oceans only", "Melting of floating sea ice only", "Stronger tides", "Evaporation of the oceans"],
    hint: "Warmer water takes up more space, and meltwater from ice on land adds new water to the ocean. Floating ice already displaces its own mass of water.",
    hard: true,
  },
  {
    prompt: "As the ocean absorbs more CO₂ from the atmosphere, what happens to its chemistry?",
    right: "It becomes more acidic (its pH decreases), making it harder for shell-building organisms to form shells",
    wrong: ["It becomes more basic", "Its pH does not change", "It releases all of its CO₂ at once", "It becomes saltier only"],
    hint: "CO₂ reacts with water to form carbonic acid, which lowers carbonate ion concentrations that shell-builders need.",
  },
  {
    prompt: "Which of these is a carbon sink?",
    right: "Growing forests and the oceans",
    wrong: ["Coal-fired power plants", "Cars", "Cement factories", "Landfill methane"],
    hint: "A sink absorbs more carbon than it releases over time.",
  },
  {
    prompt: "A carbon tax or fee puts a price on…",
    right: "greenhouse gas emissions, usually per tonne of CO₂e",
    wrong: ["the amount of water used", "the number of trees in a city", "the speed of a vehicle", "solar panels"],
    hint: "The idea is to make polluting more costly and cleaner choices more attractive.",
  },
  {
    prompt: "What is the usual definition of sustainable development?",
    right: "Meeting the needs of the present without compromising the ability of future generations to meet their own needs",
    wrong: ["Using up resources as fast as possible", "Stopping all economic activity", "Protecting nature at any human cost", "Growing the economy regardless of the environment"],
    hint: "This is the definition from the 1987 Brundtland report, 'Our Common Future'.",
  },
  {
    prompt: "An ecological footprint measures…",
    right: "the area of land and water needed to supply the resources a person or population uses and absorb its waste",
    wrong: ["the number of footprints left on trails", "the number of species in an area", "the width of a river", "the weight of a person's possessions"],
    hint: "If the footprint is bigger than the land available, resources are being used faster than they renew.",
  },
  {
    prompt: "What is the main environmental problem caused by landfills?",
    right: "They emit methane as waste decays, and leachate can contaminate water",
    wrong: ["They produce too much oxygen", "They cool the local climate", "They stop methane forming", "They are the best way to reduce waste"],
    hint: "Buried organic waste decays without oxygen and makes methane. Liquid that drains through waste can carry pollutants.",
  },
  {
    prompt: "About what fraction of Earth's water is fresh water?",
    right: "About 3%",
    wrong: ["About 30%", "About 50%", "About 75%", "About 97%"],
    hint: "Most water is salty ocean water. Most fresh water is frozen in glaciers and ice sheets or underground.",
  },
  {
    prompt: "Hydroelectric dams provide low-emission electricity. Which is a common environmental concern?",
    right: "They can flood land and change river habitats, affecting fish migration",
    wrong: ["They burn coal", "They release large amounts of CO₂ every second", "They need no land at all", "They stop rivers from flowing in every case"],
    hint: "Every energy source has trade-offs. Dams alter flow, flood valleys and can block migrating fish.",
    hard: true,
  },
  {
    prompt: "Many Indigenous peoples describe a responsibility to care for the land and water for future generations. How does this relate to sustainability?",
    right: "It shares the long-term, intergenerational thinking at the centre of sustainability",
    wrong: ["It means no resources may ever be used", "It is identical in every Nation", "It only applies to the past", "It is unrelated to environmental science"],
    hint: "Each Nation has its own teachings and laws, but long-term responsibility is a theme in many places.",
  },
  {
    prompt: "Why do wind and solar power need energy storage or flexible backup?",
    right: "Their output varies with weather and time of day",
    wrong: ["They produce too much CO₂", "They run out of fuel", "They do not generate electricity", "They only work in winter"],
    hint: "The wind does not always blow and the Sun sets, so grids use batteries, hydro reservoirs and other sources to balance supply and demand.",
    hard: true,
  },
  {
    prompt: "Which action reduces your carbon footprint the most over a lifetime?",
    right: "Long-term changes such as how you travel, heat your home and what energy you use",
    wrong: ["Replacing one light bulb", "Washing one load of laundry cold", "Recycling a single can", "Turning off a phone for one night"],
    hint: "Large, repeated activities (transport, heating, electricity) dominate a footprint.",
    hard: true,
  },
];

function envClimate({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return assemble(difficulty, {
    gens: [ruleOf70, carFootprint, emissionsTarget, populationGrowthTable],
    nGen: 3,
    extras: [() => sortQuestion(MITIGATION_SORT, difficulty === 1 ? 3 : 4), () => sortQuestion(RENEWABLE_SORT, difficulty === 1 ? 3 : 4), WASTE_ORDER, GREENHOUSE_ORDER],
    nExtra: 1,
    bank: CLIMATE_BANK,
  });
}

// =====================================================================

export const course: Course = {
  grade: "12",
  subject: "science",
  bigIdeas: {
    "ca-bc": [
      "Chemistry 12: Reaction rates can be explained by collision theory, and they can be changed by temperature, concentration, surface area and catalysts.",
      "Chemistry 12: Chemical equilibrium is dynamic, and Le Châtelier's principle predicts how a system responds to a stress.",
      "Chemistry 12: Acids and bases can be described and compared using the Brønsted–Lowry model, pH, strength and equilibrium.",
      "Physics 12: Momentum and impulse are conserved or exchanged in interactions, and are linked through Newton's laws.",
      "Physics 12: Gravitational, electric and magnetic fields explain forces at a distance, and changing fields produce electromagnetic induction.",
      "Anatomy and Physiology 12: The body's systems work together to maintain homeostasis through feedback and communication.",
      "Anatomy and Physiology 12: The circulatory, respiratory and immune systems transport materials and protect the body.",
      "Environmental Science 12: Ecosystems are interconnected, and human activities can change their structure and biodiversity.",
      "Environmental Science 12: Understanding climate science, resources and sustainability helps communities make informed decisions, and Indigenous knowledge systems offer important perspectives on caring for the land.",
    ],
  },
  units: [
    {
      id: "chem-rates",
      title: "Chem: Reaction Rates",
      emoji: "🧪",
      blurb: "Chemistry 12: how fast reactions go",
      parentNote:
        "Chemistry 12. Collision theory, factors that change reaction rate, energy diagrams and activation energy, average rate calculations, and simple rate laws.",
      standards: { "ca-bc": "Chemistry 12: collision theory; factors affecting reaction rate; activation energy and energy diagrams; rate laws and reaction mechanisms" },
      generate: chemRates,
    },
    {
      id: "chem-equilibrium",
      title: "Chem: Equilibrium",
      emoji: "⚖️",
      blurb: "Chemistry 12: reactions that go both ways",
      parentNote:
        "Chemistry 12. Dynamic equilibrium, equilibrium expressions and constants, the reaction quotient, Le Châtelier's principle, and an introduction to solubility equilibria.",
      standards: { "ca-bc": "Chemistry 12: dynamic equilibrium; Keq expressions and calculations; Le Châtelier's principle; solubility equilibria (Ksp)" },
      generate: chemEquilibrium,
    },
    {
      id: "chem-acids-bases",
      title: "Chem: Acids & Bases",
      emoji: "🧫",
      blurb: "Chemistry 12: pH and proton transfer",
      parentNote:
        "Chemistry 12. Brønsted–Lowry acids and bases, conjugate pairs, strong and weak acids, pH and pOH calculations, neutralization and titration, and buffers.",
      standards: { "ca-bc": "Chemistry 12: Brønsted–Lowry acids and bases; strong and weak acids and bases; pH, pOH, Ka and Kw; titrations; buffers" },
      generate: chemAcids,
    },
    {
      id: "phys-momentum",
      title: "Physics: Momentum",
      emoji: "🎱",
      blurb: "Physics 12: collisions and impulse",
      parentNote:
        "Physics 12. Momentum, impulse, conservation of momentum in collisions and explosions, elastic and inelastic collisions, and everyday safety applications such as airbags.",
      standards: { "ca-bc": "Physics 12: momentum and impulse; conservation of momentum in one dimension; elastic and inelastic collisions" },
      generate: physMomentum,
    },
    {
      id: "phys-fields",
      title: "Physics: Forces & Fields",
      emoji: "🧲",
      blurb: "Physics 12: gravity, charge and induction",
      parentNote:
        "Physics 12. Newton's law of universal gravitation, circular motion, Coulomb's law, electric and magnetic fields, electromagnetic induction, and a conceptual look at relativity and quantum ideas.",
      standards: { "ca-bc": "Physics 12: gravitational, electric and magnetic fields; circular motion; electromagnetic induction; introduction to special relativity and quantum physics" },
      generate: physFields,
    },
    {
      id: "anatomy-control",
      title: "A&P: Control Systems",
      emoji: "🧠",
      blurb: "Anatomy: nerves, hormones, feedback",
      parentNote:
        "Anatomy and Physiology 12. Homeostasis and feedback loops, the structure and function of neurons and reflexes, the nervous system's divisions, and how the endocrine system uses hormones.",
      standards: { "ca-bc": "Anatomy and Physiology 12: homeostasis and feedback; nervous system structure and function; endocrine system and hormones" },
      generate: anatomyControl,
    },
    {
      id: "anatomy-transport",
      title: "A&P: Transport & Defence",
      emoji: "🫀",
      blurb: "Anatomy: blood, lungs, immunity",
      parentNote:
        "Anatomy and Physiology 12. Heart structure and blood flow, blood vessels and components, breathing and gas exchange, cardiac output and ventilation calculations, and the basics of the immune system.",
      standards: { "ca-bc": "Anatomy and Physiology 12: circulatory system; respiratory system and gas exchange; lymphatic and immune systems" },
      generate: anatomyTransport,
    },
    {
      id: "env-ecosystems",
      title: "Env: Ecosystems",
      emoji: "🌲",
      blurb: "Environmental science: life's web",
      parentNote:
        "Environmental Science 12. Biodiversity, energy flow and nutrient cycles, population ecology and sampling, succession, threats to ecosystems, and the role of Indigenous knowledge in caring for ecosystems.",
      standards: { "ca-bc": "Environmental Science 12: ecosystem structure and function; biodiversity; population dynamics; human impacts on ecosystems; Indigenous knowledge and stewardship" },
      generate: envEcosystems,
    },
    {
      id: "env-climate",
      title: "Env: Climate & Sustainability",
      emoji: "🌍",
      blurb: "Environmental science: climate and choices",
      parentNote:
        "Environmental Science 12. The greenhouse effect and climate change, feedbacks, mitigation and adaptation, energy sources, population growth, waste and water, and ways communities work toward sustainability.",
      standards: { "ca-bc": "Environmental Science 12: climate change science and mitigation; energy and resources; human population; waste and water; sustainability" },
      generate: envClimate,
    },
  ],
};
