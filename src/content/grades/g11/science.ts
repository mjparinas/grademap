import { chance, pick, randInt, sample, shuffle, textChoice } from "../../random";
import type { Course, GenerateOptions, InputQuestion, OrderQuestion, Question, Visual } from "../../types";
import { fromBank, sortQuestion, type BankItem, type SortSet } from "../../bank";

// Grade 11 science combines four BC electives: Chemistry 11, Physics 11,
// Life Sciences 11 and Earth Sciences 11 (two units each, plus one extra).

type Item = BankItem & { hard?: true };
type Level = 1 | 2 | 3;
const lv = (o?: GenerateOptions): Level => o?.difficulty ?? 2;

/** Bank items marked `hard` are stretch questions: difficulty 1 uses none, 3 mostly hard ones. */
function levelled(bank: Item[], count: number, difficulty: Level): Question[] {
  if (count <= 0) return [];
  const easy = bank.filter((b) => !b.hard);
  const hard = bank.filter((b) => b.hard);
  const want = difficulty === 1 ? 0 : difficulty === 2 ? Math.ceil(count / 3) : Math.ceil((count * 2) / 3);
  const nHard = Math.min(want, hard.length);
  return [...fromBank(easy, count - nHard), ...fromBank(hard, nHard)];
}

/** Draw `n` questions from a list of makers, using every maker once before repeating one. */
function run(makers: Array<(d: Level) => Question>, n: number, d: Level): Question[] {
  const out: Question[] = [];
  let pool: Array<(d: Level) => Question> = [];
  while (out.length < n) {
    if (pool.length === 0) pool = shuffle(makers);
    out.push(pool.pop()!(d));
  }
  return out;
}

function mix(d: Level, bank: Item[], nBank: number, makers: Array<(d: Level) => Question>, nGen: number, extra: Question[] = []): Question[] {
  return shuffle([...levelled(bank, nBank, d), ...extra, ...run(makers, nGen, d)]);
}

/** Two-basket sorts: 6 items at difficulty 1, 8 at 2 and 3. Three-basket sorts: 6 items. */
const perBin = (d: Level) => (d === 1 ? 3 : 4);

function ordered(prompt: string, hint: string, labels: string[], d: Level, keep?: number): OrderQuestion {
  let list = labels;
  if (keep !== undefined && keep < labels.length) {
    const idx = sample(
      labels.map((_, i) => i),
      keep,
    ).sort((a, b) => a - b);
    list = idx.map((i) => labels[i]);
  } else if (d === 1 && labels.length > 4) {
    const idx = sample(
      labels.map((_, i) => i),
      4,
    ).sort((a, b) => a - b);
    list = idx.map((i) => labels[i]);
  }
  return { kind: "order", prompt, hint, items: list.map((label, i) => ({ id: `o${i}`, label })) };
}

// ---------- number helpers ----------

const fmt = (n: number, dp = 2) => String(Number(n.toFixed(dp)));
const spaced = (n: number) => {
  const s = String(Math.round(n));
  return s.length >= 5 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : s;
};
const SUP: Record<string, string> = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻" };
const sup = (n: number) =>
  String(n)
    .split("")
    .map((c) => SUP[c])
    .join("");
const SUB = "₀₁₂₃₄₅₆₇₈₉";
const sub = (f: string) => f.replace(/(?<=[A-Za-z)])\d+/g, (m) => m.replace(/\d/g, (d) => SUB[Number(d)]));

interface NumOpts {
  f?: (n: number) => string;
  suffix?: string;
  visual?: Visual;
  positive?: boolean;
}

/** A multiple-choice question whose choices are numbers; wrong ones are the given misconception values. */
function numMC(prompt: string, ans: number, wrongs: number[], hint: string, o: NumOpts = {}): Question {
  const f = o.f ?? ((n: number) => fmt(n));
  const suffix = o.suffix ?? "";
  const lab = (n: number) => `${f(n)}${suffix}`;
  const right = lab(ans);
  const seen = new Set([right]);
  const out: string[] = [];
  const add = (n: number) => {
    if (!Number.isFinite(n)) return;
    if (o.positive !== false && n <= 0) return;
    const l = lab(n);
    if (seen.has(l)) return;
    seen.add(l);
    out.push(l);
  };
  wrongs.forEach(add);
  for (const k of [2, 0.5, 10, 0.1, 1.5, 3, 1.25, 0.25, 4]) {
    if (out.length >= 3) break;
    add(ans * k);
  }
  return textChoice(prompt, right, out.slice(0, 4), hint, o.visual);
}

function inputQ(
  prompt: string,
  ans: number,
  hint: string,
  o: { keypad?: "number" | "decimal" | "integer"; suffix?: string; visual?: Visual; dp?: number } = {},
): InputQuestion {
  const a = fmt(ans, o.dp ?? 2);
  const whole = Number.isInteger(Number(a));
  const keypad = o.keypad ?? (Number(a) < 0 ? "integer" : whole ? "number" : "decimal");
  const accept = keypad === "decimal" && whole ? [`${a}.0`] : undefined;
  return { kind: "input", prompt, hint, answer: a, accept, keypad, suffix: o.suffix, visual: o.visual };
}

/** Scientific notation label for a coefficient given in units of 10²³. */
function sci(raw: number): string {
  let mant = raw;
  let exp = 23;
  while (mant >= 10) {
    mant /= 10;
    exp++;
  }
  while (mant < 1) {
    mant *= 10;
    exp--;
  }
  return `${mant.toPrecision(3)} × 10${sup(exp)}`;
}

// ---------- Chemistry data ----------

const ATOMIC: Record<string, number> = {
  H: 1.0,
  He: 4.0,
  C: 12.0,
  N: 14.0,
  O: 16.0,
  Na: 23.0,
  Mg: 24.3,
  Al: 27.0,
  S: 32.1,
  Cl: 35.5,
  K: 39.1,
  Ca: 40.1,
  Fe: 55.8,
};

function parseFormula(f: string): Record<string, number> {
  const stack: Record<string, number>[] = [{}];
  let i = 0;
  while (i < f.length) {
    const c = f[i];
    if (c === "(") {
      stack.push({});
      i++;
    } else if (c === ")") {
      i++;
      let num = "";
      while (/\d/.test(f[i] ?? "")) num += f[i++];
      const m = num ? Number(num) : 1;
      const top = stack.pop()!;
      const parent = stack[stack.length - 1];
      for (const [k, v] of Object.entries(top)) parent[k] = (parent[k] ?? 0) + v * m;
    } else {
      let el = c;
      i++;
      while (/[a-z]/.test(f[i] ?? "")) el += f[i++];
      let num = "";
      while (/\d/.test(f[i] ?? "")) num += f[i++];
      const top = stack[stack.length - 1];
      top[el] = (top[el] ?? 0) + (num ? Number(num) : 1);
    }
  }
  return stack[0];
}

const molarMass = (f: string) => {
  const els = parseFormula(f);
  return Math.round(Object.entries(els).reduce((s, [el, n]) => s + ATOMIC[el] * n, 0) * 10) / 10;
};
const atomsPerUnit = (f: string) => Object.values(parseFormula(f)).reduce((a, b) => a + b, 0);
const gmol = (n: number) => `${n.toFixed(1)} g/mol`;

const COMPOUNDS: { f: string; lv: Level }[] = [
  { f: "H2O", lv: 1 },
  { f: "CO2", lv: 1 },
  { f: "NaCl", lv: 1 },
  { f: "HCl", lv: 1 },
  { f: "CH4", lv: 1 },
  { f: "NH3", lv: 1 },
  { f: "NaOH", lv: 1 },
  { f: "KCl", lv: 1 },
  { f: "MgCl2", lv: 2 },
  { f: "CaCO3", lv: 2 },
  { f: "H2SO4", lv: 2 },
  { f: "C6H12O6", lv: 3 },
  { f: "Ca(OH)2", lv: 3 },
  { f: "Al2O3", lv: 3 },
  { f: "Fe2O3", lv: 3 },
];
const compoundFor = (d: Level) => pick(COMPOUNDS.filter((c) => c.lv <= d)).f;

/** A mole amount that gives a mass with at most one decimal place. */
function cleanMoles(M: number, d: Level): number {
  const options = d === 1 ? [1, 2, 3, 4, 5] : [0.5, 1, 1.5, 2, 2.5, 3, 4, 5];
  for (const n of shuffle(options)) {
    const x = n * M * 10;
    if (Math.abs(x - Math.round(x)) < 1e-9) return n;
  }
  return 1;
}

function molarMassQ(d: Level): Question {
  const f = compoundFor(d);
  const els = parseFormula(f);
  const M = molarMass(f);
  const entries = Object.entries(els);
  const noSubs = entries.reduce((s, [el]) => s + ATOMIC[el], 0);
  const lightest = entries.reduce((a, b) => (ATOMIC[a[0]] <= ATOMIC[b[0]] ? a : b));
  const missing = M - ATOMIC[lightest[0]] * lightest[1];
  const parts = entries.map(([el, n]) => `${el} ${ATOMIC[el].toFixed(1)}×${n}`).join(" + ");
  return numMC(
    `What is the molar mass of ${sub(f)}? (Use H 1.0, C 12.0, N 14.0, O 16.0, Na 23.0, Mg 24.3, Al 27.0, S 32.1, Cl 35.5, K 39.1, Ca 40.1, Fe 55.8.)`,
    M,
    [noSubs, missing, M + ATOMIC[lightest[0]]],
    `Multiply each element's molar mass by its subscript (count the atoms inside brackets too), then add: ${parts}.`,
    { f: (n) => n.toFixed(1), suffix: " g/mol" },
  );
}

const CONTEXTS = ["A lab technician", "A chemistry student", "A water-quality analyst", "A baker", "A pharmacist"];

function massToMolesQ(d: Level): Question {
  const f = compoundFor(d);
  const M = molarMass(f);
  const n = cleanMoles(M, d);
  const m = Math.round(n * M * 10) / 10;
  return inputQ(
    `${pick(CONTEXTS)} has ${fmt(m, 1)} g of ${sub(f)} (molar mass ${gmol(M)}). How many moles is that?`,
    n,
    `n = m ÷ M = ${fmt(m, 1)} g ÷ ${M.toFixed(1)} g/mol.`,
    { suffix: "mol" },
  );
}

function molesToMassQ(d: Level): Question {
  const f = compoundFor(d);
  const M = molarMass(f);
  const n = cleanMoles(M, d);
  const m = Math.round(n * M * 10) / 10;
  return inputQ(
    `What is the mass of ${fmt(n)} mol of ${sub(f)}? (Molar mass ${gmol(M)}.) Give your answer in grams.`,
    m,
    `m = n × M = ${fmt(n)} mol × ${M.toFixed(1)} g/mol.`,
    { suffix: "g", keypad: "decimal", dp: 1 },
  );
}

function molesToParticlesQ(d: Level): Question {
  const f = compoundFor(d);
  const n = pick(d === 1 ? [0.5, 2, 3] : [0.5, 1.5, 2, 3, 4, 5]);
  const raw = n * 6.02;
  const right = sci(raw);
  const labels = new Set([right]);
  const wrong: string[] = [];
  for (const w of [raw * 10, raw / 10, 6.02 / n, raw * 2]) {
    const l = sci(w);
    if (!labels.has(l)) {
      labels.add(l);
      wrong.push(l);
    }
  }
  return textChoice(
    `How many formula units (or molecules) of ${sub(f)} are in ${fmt(n)} mol? (Avogadro's constant: 6.02 × 10²³ per mole.)`,
    right,
    wrong.slice(0, 4),
    `Multiply the moles by Avogadro's constant: ${fmt(n)} × 6.02 × 10²³. If the front number reaches 10 or more, move the decimal and adjust the exponent.`,
  );
}

function particlesToMolesQ(d: Level): Question {
  const n = pick(d === 1 ? [0.5, 2, 3] : [0.5, 1.5, 2, 3, 4, 5]);
  const thing = pick(["atoms of helium", "molecules of water", "atoms of copper", "molecules of oxygen gas"]);
  return inputQ(
    `A sample contains ${sci(n * 6.02)} ${thing}. How many moles is that?`,
    n,
    `n = N ÷ N(A). Divide the particle count by 6.02 × 10²³ particles/mol.`,
    { suffix: "mol", keypad: "decimal" },
  );
}

function atomsInCompoundQ(d: Level): Question {
  const pool = COMPOUNDS.filter((c) => c.lv <= d && atomsPerUnit(c.f) >= 2 && atomsPerUnit(c.f) <= 9).map((c) => c.f);
  const f = pick(pool);
  const n = pick([1, 2]);
  const per = atomsPerUnit(f);
  const raw = n * per * 6.02;
  const wrongs = [n * 6.02, raw * 10, raw / 10, per * 6.02 * 2 * n];
  const right = sci(raw);
  const seen = new Set([right]);
  const wrong: string[] = [];
  for (const w of wrongs) {
    const l = sci(w);
    if (!seen.has(l)) {
      seen.add(l);
      wrong.push(l);
    }
  }
  return textChoice(
    `How many atoms (of all elements together) are in ${n} mol of ${sub(f)}?`,
    right,
    wrong.slice(0, 4),
    `One formula unit of ${sub(f)} has ${per} atoms. So atoms = ${n} mol × 6.02 × 10²³ × ${per}.`,
  );
}

function heavySortQ(d: Level): Question {
  const pool = COMPOUNDS.filter((c) => c.lv <= Math.max(d, 2)).map((c) => ({ f: c.f, M: molarMass(c.f) }));
  const heavy = pool.filter((c) => c.M >= 55);
  const light = pool.filter((c) => c.M <= 45);
  const k = d === 1 ? 3 : 4;
  const items = shuffle([
    ...sample(heavy, Math.min(k, heavy.length)).map((c) => ({ ...c, bin: "heavy" })),
    ...sample(light, Math.min(k, light.length)).map((c) => ({ ...c, bin: "light" })),
  ]);
  return {
    kind: "sort",
    prompt: "Work out each molar mass. Which are greater than 50 g/mol and which are less?",
    hint: "Add up the atomic masses using the subscripts. For example H₂O is 2×1.0 + 16.0 = 18.0 g/mol.",
    bins: [
      { id: "heavy", label: "more than 50 g/mol", emoji: "⚖️" },
      { id: "light", label: "less than 50 g/mol", emoji: "🪶" },
    ],
    items: items.map((c, i) => ({ id: `s${i}`, label: sub(c.f), emoji: "🧪", bin: c.bin })),
  };
}

const MOLE_BANK: Item[] = [
  {
    prompt: "What is Avogadro's constant?",
    right: "6.02 × 10²³ particles in one mole",
    wrong: ["6.02 × 10⁻²³ particles in one mole", "3.00 × 10⁸ particles in one mole", "6.02 × 10²³ grams in one mole"],
    hint: "One mole is a counting unit, like a dozen, but much bigger: 6.02 × 10²³ particles.",
    emoji: "🧪",
  },
  {
    prompt: "Which unit is used for molar mass?",
    right: "g/mol",
    wrong: ["mol/g", "mol/L", "g/L"],
    hint: "Molar mass is the mass of one mole, so grams per mole.",
  },
  {
    prompt: "Why do chemists use the mole?",
    right: "To count huge numbers of tiny particles by measuring mass",
    wrong: ["Because every atom has the same mass", "Because moles are easier to see than atoms", "To measure the volume of a gas only"],
    hint: "We can't count atoms one by one. The mole links a mass we can weigh to a number of particles.",
  },
  {
    prompt: "One mole of water molecules and one mole of carbon dioxide molecules are compared. Which statement is correct?",
    right: "They contain the same number of molecules but have different masses",
    wrong: [
      "Carbon dioxide has more molecules because it is heavier",
      "They have the same mass but different numbers of molecules",
      "Water has more molecules because it is a liquid",
    ],
    hint: "A mole is always 6.02 × 10²³ particles. The masses differ because the molecules differ.",
  },
  {
    prompt: "Which sample has the greater mass: 1 mol of sodium atoms or 1 mol of chlorine atoms?",
    right: "Chlorine (35.5 g)",
    wrong: ["Sodium (23.0 g)", "They have the same mass", "They both weigh 1 g"],
    hint: "Equal numbers of atoms, but chlorine atoms are heavier. Compare molar masses on the periodic table.",
  },
  {
    prompt: "What is the molar mass of oxygen gas, O₂? (Use O = 16.0 g/mol.)",
    right: "32.0 g/mol",
    wrong: ["16.0 g/mol", "8.0 g/mol", "48.0 g/mol"],
    hint: "Oxygen gas is made of molecules with two atoms each, so double the atomic molar mass.",
    emoji: "💨",
  },
  {
    prompt: "What happens to the number of moles if you double the mass of a pure sample?",
    right: "It doubles",
    wrong: ["It stays the same", "It is cut in half", "It is multiplied by 6.02 × 10²³"],
    hint: "n = m ÷ M. With M fixed, moles are directly proportional to mass.",
  },
  {
    prompt: "Which symbol is usually used for 'amount of substance' in moles?",
    right: "n",
    wrong: ["m", "M", "V"],
    hint: "Lower-case m is mass, capital M is molar mass, V is volume and n is amount in moles.",
  },
  {
    prompt: "How many oxygen atoms are in 1 mol of CO₂ molecules?",
    right: "1.20 × 10²⁴",
    wrong: ["6.02 × 10²³", "3.01 × 10²³", "1.81 × 10²⁴"],
    hint: "Each CO₂ molecule has 2 oxygen atoms, so multiply 6.02 × 10²³ by 2.",
    hard: true,
  },
  {
    prompt: "Which sample contains the most atoms?",
    right: "10 g of helium (He, 4.0 g/mol)",
    wrong: ["10 g of carbon (C, 12.0 g/mol)", "10 g of iron (Fe, 55.8 g/mol)", "10 g of copper (Cu, 63.5 g/mol)"],
    hint: "Equal masses, so the lightest atoms give the most moles: n = m ÷ M. Compare 10 ÷ 4.0 with the others.",
    hard: true,
  },
  {
    prompt: "A flask holds 1.0 mol of hydrogen gas, H₂. Which statement is true?",
    right: "It has 6.02 × 10²³ molecules and 1.20 × 10²⁴ atoms",
    wrong: [
      "It has 6.02 × 10²³ atoms and 3.01 × 10²³ molecules",
      "It has 1.20 × 10²⁴ molecules and 6.02 × 10²³ atoms",
      "It has 6.02 × 10²³ molecules and 6.02 × 10²³ atoms",
    ],
    hint: "A mole of molecules is 6.02 × 10²³ molecules. Each H₂ molecule holds two atoms.",
    hard: true,
  },
  {
    prompt: "Is the mass of one mole the same for every substance?",
    right: "No. The mass of one mole depends on the substance's molar mass",
    wrong: ["Yes. One mole is always 12 g", "Yes. One mole is always 1 g", "No. It depends only on the temperature"],
    hint: "One mole of iron is 55.8 g; one mole of water is 18.0 g. The count is the same, the particles are not.",
    hard: true,
  },
];

function moleUnit(opts?: GenerateOptions): Question[] {
  const d = lv(opts);
  return mix(d, MOLE_BANK, 2, [molarMassQ, massToMolesQ, molesToMassQ, molesToParticlesQ, particlesToMolesQ, atomsInCompoundQ, heavySortQ], 6);
}

// ---------- Solutions and reactions ----------

interface Reaction {
  reactants: { f: string; c: number }[];
  products: { f: string; c: number }[];
  lv: Level;
}
const REACTIONS: Reaction[] = [
  { reactants: [{ f: "H2", c: 2 }, { f: "O2", c: 1 }], products: [{ f: "H2O", c: 2 }], lv: 1 },
  { reactants: [{ f: "N2", c: 1 }, { f: "H2", c: 3 }], products: [{ f: "NH3", c: 2 }], lv: 1 },
  { reactants: [{ f: "Na", c: 2 }, { f: "Cl2", c: 1 }], products: [{ f: "NaCl", c: 2 }], lv: 1 },
  { reactants: [{ f: "Mg", c: 2 }, { f: "O2", c: 1 }], products: [{ f: "MgO", c: 2 }], lv: 1 },
  { reactants: [{ f: "CH4", c: 1 }, { f: "O2", c: 2 }], products: [{ f: "CO2", c: 1 }, { f: "H2O", c: 2 }], lv: 2 },
  { reactants: [{ f: "C3H8", c: 1 }, { f: "O2", c: 5 }], products: [{ f: "CO2", c: 3 }, { f: "H2O", c: 4 }], lv: 3 },
  { reactants: [{ f: "Al", c: 4 }, { f: "O2", c: 3 }], products: [{ f: "Al2O3", c: 2 }], lv: 3 },
  { reactants: [{ f: "KClO3", c: 2 }], products: [{ f: "KCl", c: 2 }, { f: "O2", c: 3 }], lv: 3 },
];

const eqText = (r: Reaction, coefs?: number[]) => {
  let i = 0;
  const side = (xs: { f: string; c: number }[]) =>
    xs
      .map((x) => {
        const c = coefs ? coefs[i++] : x.c;
        return `${c === 1 ? "" : c}${sub(x.f)}`;
      })
      .join(" + ");
  const left = side(r.reactants);
  const right = side(r.products);
  return `${left} → ${right}`;
};
const bareEq = (r: Reaction) => {
  const l = r.reactants.map((x) => sub(x.f)).join(" + ");
  const rr = r.products.map((x) => sub(x.f)).join(" + ");
  return `${l} → ${rr}`;
};

function balanced(r: Reaction, coefs: number[]): boolean {
  const nR = r.reactants.length;
  const tally: Record<string, number> = {};
  [...r.reactants, ...r.products].forEach((x, i) => {
    const sign = i < nR ? 1 : -1;
    for (const [el, n] of Object.entries(parseFormula(x.f))) tally[el] = (tally[el] ?? 0) + sign * n * coefs[i];
  });
  return Object.values(tally).every((v) => v === 0);
}

function balanceQ(d: Level): Question {
  const r = pick(REACTIONS.filter((x) => x.lv <= d));
  const right = [...r.reactants, ...r.products].map((x) => x.c);
  const label = (cs: number[]) => cs.join(", ");
  const seen = new Set([label(right)]);
  const wrong: string[] = [];
  const total = right.length;
  for (let tries = 0; tries < 80 && wrong.length < 3; tries++) {
    const cs = Array.from({ length: total }, (_, i) => Math.max(1, right[i] + pick([-1, 0, 0, 1, 2])));
    const l = label(cs);
    if (seen.has(l) || balanced(r, cs)) continue;
    seen.add(l);
    wrong.push(l);
  }
  const order = [...r.reactants, ...r.products].map((x) => sub(x.f)).join(", ");
  return textChoice(
    `Which set of coefficients balances ${bareEq(r)}? (Listed in the order ${order}.)`,
    label(right),
    wrong,
    "Count each element on both sides. Change coefficients (never subscripts) until every element matches.",
  );
}

const molarMass1 = (f: string) => molarMass(f);

/** All mole-ratio situations that give tidy answers. */
function stoichOptions(massMode: boolean, d: Level) {
  const opts: { r: Reaction; a: { f: string; c: number }; b: { f: string; c: number }; n: number; molesB: number }[] = [];
  for (const r of REACTIONS.filter((x) => x.lv <= d)) {
    for (const a of r.reactants) {
      for (const b of [...r.reactants, ...r.products]) {
        if (a === b) continue;
        for (const n of massMode ? [1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5, 6, 8, 10]) {
          const molesB = (n * b.c) / a.c;
          if (Math.abs(molesB * 2 - Math.round(molesB * 2)) > 1e-9) continue;
          if (massMode) {
            const mA = n * molarMass1(a.f);
            const mB = molesB * molarMass1(b.f);
            if (Math.abs(mA * 10 - Math.round(mA * 10)) > 1e-9 || Math.abs(mB * 10 - Math.round(mB * 10)) > 1e-9) continue;
          }
          opts.push({ r, a, b, n, molesB });
        }
      }
    }
  }
  return opts;
}

function moleRatioQ(d: Level): Question {
  const o = pick(stoichOptions(false, d));
  const verb = o.r.reactants.includes(o.b) ? "react" : "form";
  return inputQ(
    `Given ${eqText(o.r)}, how many moles of ${sub(o.b.f)} ${verb === "react" ? "react with" : "form from"} ${o.n} mol of ${sub(o.a.f)}?`,
    o.molesB,
    `Use the coefficients as a ratio: ${o.b.c} mol ${sub(o.b.f)} for every ${o.a.c} mol ${sub(o.a.f)}. So ${o.n} × ${o.b.c} ÷ ${o.a.c}.`,
    { suffix: "mol", keypad: "decimal" },
  );
}

function stoichMassQ(d: Level): Question {
  const o = pick(stoichOptions(true, Math.max(d, 2) as Level));
  const Ma = molarMass1(o.a.f);
  const Mb = molarMass1(o.b.f);
  const mA = Math.round(o.n * Ma * 10) / 10;
  const mB = Math.round(o.molesB * Mb * 10) / 10;
  return inputQ(
    `${eqText(o.r)}. What mass of ${sub(o.b.f)} (${gmol(Mb)}) is linked to ${fmt(mA, 1)} g of ${sub(o.a.f)} (${gmol(Ma)})? Answer in grams.`,
    mB,
    `Three steps: grams → moles (÷ ${Ma.toFixed(1)}), moles → moles with the ratio ${o.b.c}:${o.a.c}, then moles → grams (× ${Mb.toFixed(1)}).`,
    { suffix: "g", keypad: "decimal", dp: 1 },
  );
}

function molarityQ(d: Level): Question {
  const c = pick(d === 1 ? [0.5, 1, 2] : [0.1, 0.25, 0.5, 1.5, 2, 3]);
  const V = pick(d === 1 ? [1, 2] : [0.25, 0.5, 2, 4]);
  const n = c * V;
  const ask = pick(["c", "n", "V"] as const);
  const solute = pick(["sodium chloride", "glucose", "potassium chloride"]);
  if (ask === "c")
    return inputQ(
      `${fmt(n)} mol of ${solute} is dissolved to make ${fmt(V)} L of solution. What is its concentration in mol/L?`,
      c,
      `c = n ÷ V = ${fmt(n)} mol ÷ ${fmt(V)} L.`,
      { suffix: "mol/L", keypad: "decimal" },
    );
  if (ask === "n")
    return inputQ(
      `How many moles of solute are in ${fmt(V)} L of a ${fmt(c)} mol/L ${solute} solution?`,
      n,
      `n = c × V = ${fmt(c)} mol/L × ${fmt(V)} L.`,
      { suffix: "mol", keypad: "decimal" },
    );
  return inputQ(
    `A ${fmt(c)} mol/L ${solute} solution contains ${fmt(n)} mol of solute. What is the volume of the solution in litres?`,
    V,
    `V = n ÷ c = ${fmt(n)} mol ÷ ${fmt(c)} mol/L.`,
    { suffix: "L", keypad: "decimal" },
  );
}

function molarityMassQ(d: Level): Question {
  const f = pick(["NaCl", "KCl", "NaOH", ...(d >= 2 ? ["CaCO3"] : [])]);
  const M = molarMass(f);
  const c = pick([0.5, 1, 2]);
  const V = pick([0.5, 1, 2]);
  const n = c * V;
  const m = Math.round(n * M * 10) / 10;
  if (chance(0.5)) {
    return numMC(
      `What mass of ${sub(f)} (${gmol(M)}) is needed to make ${fmt(V)} L of a ${fmt(c)} mol/L solution?`,
      m,
      [M * c, n * M * 1000, M * V, M / n],
      `Find moles first: n = c × V = ${fmt(c)} × ${fmt(V)} = ${fmt(n)} mol. Then m = n × M = ${fmt(n)} × ${M.toFixed(1)}.`,
      { f: (x) => fmt(x, 1), suffix: " g" },
    );
  }
  return inputQ(
    `${fmt(m, 1)} g of ${sub(f)} (${gmol(M)}) is dissolved to make ${fmt(V)} L of solution. What is the concentration in mol/L?`,
    c,
    `Convert to moles first: n = ${fmt(m, 1)} ÷ ${M.toFixed(1)} = ${fmt(n)} mol. Then c = n ÷ V.`,
    { suffix: "mol/L", keypad: "decimal" },
  );
}

function dilutionQ(d: Level): Question {
  const c2 = pick(d === 1 ? [1, 2] : [0.1, 0.2, 0.5, 1]);
  const k = pick(d === 1 ? [2, 4, 5] : [2, 4, 5, 10, 20]);
  const c1 = Math.round(c2 * k * 1000) / 1000;
  const V2 = pick([100, 200, 250, 500, 1000].filter((v) => v % k === 0));
  const V1 = V2 / k;
  if (chance(0.5)) {
    return inputQ(
      `A stock solution is ${fmt(c1)} mol/L. What volume of it is needed to prepare ${V2} mL of ${fmt(c2)} mol/L solution? Answer in mL.`,
      V1,
      `Use c₁V₁ = c₂V₂, so V₁ = c₂V₂ ÷ c₁ = (${fmt(c2)} × ${V2}) ÷ ${fmt(c1)}.`,
      { suffix: "mL", keypad: "decimal" },
    );
  }
  return numMC(
    `${V1} mL of ${fmt(c1)} mol/L stock solution is diluted with water to a total volume of ${V2} mL. What is the new concentration?`,
    c2,
    [c1 * V1 / (V2 - V1), c1 * k, c1 / (k * k), c1 / 2],
    `c₂ = c₁V₁ ÷ V₂ = (${fmt(c1)} × ${V1}) ÷ ${V2}. Adding water does not change the moles of solute, only the volume.`,
    { suffix: " mol/L", f: (x) => fmt(x, 3) },
  );
}

const SOLUTION_BANK: Item[] = [
  {
    prompt: "In a salt-water solution, which part is the solute?",
    right: "The salt",
    wrong: ["The water", "The mixture as a whole", "The container"],
    hint: "The solute is what dissolves; the solvent (here water) does the dissolving.",
    emoji: "🧂",
  },
  {
    prompt: "A solution is made more dilute by adding water. What stays the same?",
    right: "The number of moles of solute",
    wrong: ["The concentration", "The total volume", "The mass of the solvent"],
    hint: "Water adds volume, so concentration drops, but no solute is added or removed.",
  },
  {
    prompt: "What does a concentration of 2.0 mol/L mean?",
    right: "2.0 mol of solute in each litre of solution",
    wrong: ["2.0 g of solute in each litre of water", "2.0 L of solute in 1 mol of solution", "2.0 mol of solute in 1 L of solvent"],
    hint: "Molarity is moles of solute per litre of the whole solution.",
  },
  {
    prompt: "Which type of substance conducts electricity when dissolved in water?",
    right: "An electrolyte, such as sodium chloride",
    wrong: ["Sugar", "Any liquid", "Oil"],
    hint: "Electrolytes form ions in water. The free-moving ions carry the charge.",
  },
  {
    prompt: "Which is balanced correctly: 2H₂ + O₂ → 2H₂O?",
    right: "Yes. There are 4 H and 2 O on each side",
    wrong: ["No. There are 4 H on the left and 2 H on the right", "No. The coefficients should be changed to subscripts", "Yes, because there are 2 molecules on each side"],
    hint: "Multiply the coefficient by the subscript for each element and compare both sides.",
  },
  {
    prompt: "A balanced equation shows that mass is conserved. Which law is this?",
    right: "The law of conservation of mass",
    wrong: ["Avogadro's law", "Newton's first law", "The law of definite proportions only"],
    hint: "Atoms are rearranged, not created or destroyed, so the mass of reactants equals the mass of products.",
  },
  {
    prompt: "In the reaction N₂ + 3H₂ → 2NH₃, what is the mole ratio of H₂ to NH₃?",
    right: "3 : 2",
    wrong: ["2 : 3", "1 : 2", "3 : 1"],
    hint: "Read the coefficients in order: H₂ is 3 and NH₃ is 2, so the ratio is 3 : 2.",
  },
  {
    prompt: "Which change would make the same amount of solute give a higher concentration?",
    right: "Using less solvent to make a smaller total volume",
    wrong: ["Adding more water", "Using a larger beaker", "Stirring for longer"],
    hint: "c = n ÷ V. A smaller volume with the same n gives a larger c.",
  },
  {
    prompt: "When preparing a dilution safely, what is usually done with a concentrated acid?",
    right: "Add the acid slowly to the water",
    wrong: ["Add water quickly to the acid", "Heat the acid first", "Pour both together at once"],
    hint: "Adding acid to water spreads the heat released. Adding water to concentrated acid can spatter.",
    emoji: "🥽",
  },
  {
    prompt: "CH₄ + 2O₂ → CO₂ + 2H₂O. If 3 mol of CH₄ reacts completely, how many moles of O₂ are needed?",
    right: "6 mol",
    wrong: ["3 mol", "2 mol", "1.5 mol"],
    hint: "The ratio O₂ : CH₄ is 2 : 1, so double the moles of CH₄.",
    hard: true,
  },
  {
    prompt: "A 500 mL sample of 1.0 mol/L solution is poured out into a 250 mL beaker (250 mL transferred). What is the concentration of the sample in the beaker?",
    right: "1.0 mol/L",
    wrong: ["0.5 mol/L", "2.0 mol/L", "0.25 mol/L"],
    hint: "Concentration is a ratio. Taking part of a uniform solution leaves the concentration unchanged.",
    hard: true,
  },
  {
    prompt: "Which error leads to a concentration that is too low when making a solution?",
    right: "Adding the water to a total volume bigger than the target",
    wrong: ["Weighing the solute exactly", "Dissolving all the solute", "Using a clean volumetric flask"],
    hint: "More volume with the same moles means a smaller c = n ÷ V.",
    hard: true,
  },
];

function solutionUnit(opts?: GenerateOptions): Question[] {
  const d = lv(opts);
  return mix(d, SOLUTION_BANK, 2, [molarityQ, molarityQ, molarityMassQ, dilutionQ, dilutionQ, balanceQ, moleRatioQ, stoichMassQ], 6);
}

// ---------- Physics: kinematics ----------

const MOVERS = ["A cyclist", "A runner", "A train", "A skateboarder", "A delivery drone", "A kayaker"];

function uniformQ(d: Level): Question {
  const v = randInt(2, d === 1 ? 12 : 30);
  const t = randInt(2, d === 1 ? 10 : 20);
  const dist = v * t;
  const who = pick(MOVERS);
  const ask = pick(["v", "d", "t"] as const);
  if (ask === "v")
    return inputQ(`${who} travels ${dist} m in ${t} s at constant speed. What is the speed in m/s?`, v, `v = d ÷ t = ${dist} ÷ ${t}.`, { suffix: "m/s" });
  if (ask === "d")
    return inputQ(`${who} moves at a steady ${v} m/s for ${t} s. How far does it travel, in metres?`, dist, `d = v × t = ${v} × ${t}.`, { suffix: "m" });
  return inputQ(`${who} moves at a steady ${v} m/s. How long does it take to travel ${dist} m, in seconds?`, t, `t = d ÷ v = ${dist} ÷ ${v}.`, { suffix: "s" });
}

function averageSpeedQ(d: Level): Question {
  const t1 = randInt(2, 8);
  const t2 = randInt(2, 8);
  const vavg = randInt(3, d === 3 ? 25 : 15);
  const total = vavg * (t1 + t2);
  const d1 = randInt(Math.ceil(total / 4), Math.floor((total * 3) / 4));
  const d2 = total - d1;
  return inputQ(
    `A hiker walks ${d1} m in ${t1} min, then ${d2} m in ${t2} min. What is the average speed for the whole trip, in m/min?`,
    vavg,
    `Average speed is total distance ÷ total time: (${d1} + ${d2}) ÷ (${t1} + ${t2}). It is not the average of the two leg speeds.`,
    { suffix: "m/min" },
  );
}

function convertSpeedQ(d: Level): Question {
  const ms = randInt(2, d === 1 ? 15 : 40);
  const kmh = ms * 3.6;
  if (chance(0.5))
    return numMC(`Convert ${ms} m/s to km/h.`, kmh, [ms * 3.6 * 3.6, ms / 3.6, ms * 60, ms * 1000], `Multiply by 3.6 (1 m/s = 3600 m per hour ÷ 1000 = 3.6 km/h).`, {
      f: (x) => fmt(x, 1),
      suffix: " km/h",
    });
  const k = ms * 3.6;
  return numMC(`Convert ${fmt(k, 1)} km/h to m/s.`, ms, [k * 3.6, k / 3.6 / 3.6, k / 60, k * 1000], `Divide by 3.6 to go from km/h to m/s.`, {
    suffix: " m/s",
    f: (x) => fmt(x, 1),
  });
}

function accelQ(d: Level): Question {
  const vi = randInt(0, d === 1 ? 10 : 20);
  const a = randInt(1, d === 1 ? 4 : 6) * (d >= 2 && chance(0.4) ? -1 : 1);
  const t = randInt(2, 8);
  let vf = vi + a * t;
  let aa = a;
  if (vf < 0) {
    vf = vi + Math.abs(a) * t;
    aa = Math.abs(a);
  }
  const what = pick(["a car", "a scooter", "a sprinter", "a bus"]);
  if (chance(0.6))
    return inputQ(
      `${what[0].toUpperCase()}${what.slice(1)} changes its velocity from ${vi} m/s to ${vf} m/s in ${t} s along a straight road. What is its acceleration in m/s²? (Use a minus sign for slowing down.)`,
      aa,
      `a = (v_f − v_i) ÷ t = (${vf} − ${vi}) ÷ ${t}. A negative answer means it is slowing down.`,
      { suffix: "m/s²", keypad: aa < 0 ? "integer" : "number" },
    );
  const vf2 = vi + Math.abs(aa) * t;
  return inputQ(
    `${what[0].toUpperCase()}${what.slice(1)} starts at ${vi} m/s and accelerates uniformly at ${Math.abs(aa)} m/s² for ${t} s. What is its final velocity in m/s?`,
    vf2,
    `v_f = v_i + at = ${vi} + ${Math.abs(aa)} × ${t}.`,
    { suffix: "m/s" },
  );
}

function distanceQ(d: Level): Question {
  const vi = randInt(0, d === 1 ? 6 : 12);
  const a = randInt(1, d === 1 ? 3 : 5);
  const t = randInt(2, d === 1 ? 6 : 9);
  const dist = vi * t + 0.5 * a * t * t;
  return inputQ(
    `A motorbike starts at ${vi} m/s and accelerates at ${a} m/s² for ${t} s. How far does it travel in that time, in metres?`,
    dist,
    `d = v_i·t + ½at² = ${vi}×${t} + ½×${a}×${t}².`,
    { suffix: "m", keypad: "decimal" },
  );
}

/** vi, a, d, vf combinations where vf² = vi² + 2ad gives a whole-number vf. */
const V2_SETS: { vi: number; a: number; d: number; vf: number }[] = [];
for (let vi = 0; vi <= 10; vi += 2)
  for (let a = 1; a <= 5; a++)
    for (let dd = 5; dd <= 120; dd += 5) {
      const vf2 = vi * vi + 2 * a * dd;
      const vf = Math.sqrt(vf2);
      if (Number.isInteger(vf) && vf <= 40) V2_SETS.push({ vi, a, d: dd, vf });
    }

function timelessQ(d: Level): Question {
  const s = pick(V2_SETS.filter((x) => (d === 1 ? x.vi === 0 : true)));
  if (chance(0.5))
    return inputQ(
      `A car starts at ${s.vi} m/s and accelerates at ${s.a} m/s² over ${s.d} m. What is its final speed in m/s?`,
      s.vf,
      `Use v_f² = v_i² + 2ad = ${s.vi}² + 2×${s.a}×${s.d}, then take the square root.`,
      { suffix: "m/s" },
    );
  return inputQ(
    `A car speeds up from ${s.vi} m/s to ${s.vf} m/s with a constant acceleration of ${s.a} m/s². How far does it travel, in metres?`,
    s.d,
    `Rearrange v_f² = v_i² + 2ad to get d = (v_f² − v_i²) ÷ (2a) = (${s.vf}² − ${s.vi}²) ÷ ${2 * s.a}.`,
    { suffix: "m" },
  );
}

function freeFallQ(d: Level): Question {
  const t = randInt(1, d === 1 ? 3 : 5);
  const v = 9.8 * t;
  const h = 4.9 * t * t;
  const kind = pick(["v", "h", "t"] as const);
  const note = "Ignore air resistance and use g = 9.8 m/s².";
  if (kind === "v")
    return inputQ(`A stone is dropped from rest and falls for ${t} s. What is its speed just before it ends, in m/s? ${note}`, v, `v = g·t = 9.8 × ${t}.`, {
      suffix: "m/s",
      keypad: "decimal",
      dp: 1,
    });
  if (kind === "h")
    return inputQ(`A ball is dropped from rest and falls for ${t} s. How far does it fall, in metres? ${note}`, h, `d = ½gt² = 4.9 × ${t}².`, {
      suffix: "m",
      keypad: "decimal",
      dp: 1,
    });
  return numMC(
    `A coin is dropped from rest and falls ${fmt(h, 1)} m. How long does it take to land? ${note}`,
    t,
    [t * 2, t + 1, Math.max(1, t - 1) + 0.5, Math.sqrt(h)],
    `d = ½gt², so t = √(2d ÷ g) = √(2 × ${fmt(h, 1)} ÷ 9.8).`,
    { suffix: " s", f: (x) => fmt(x, 1) },
  );
}

/** A velocity–time graph with a speed-up, a steady stretch and a slow-down. */
function vtGraphQ(d: Level): Question {
  const T1 = pick([2, 3, 4, 5]);
  const a = randInt(1, 4);
  const v0 = pick([0, 2, 4]);
  const v1 = v0 + a * T1;
  const T2 = T1 + randInt(2, 5);
  const divisors = [2, 3, 4, 5, 6].filter((x) => v1 % x === 0);
  const dt3 = divisors.length ? pick(divisors) : 1;
  const T3 = T2 + dt3;
  const step = Math.max(T3, v1 + 2) > 20 ? 2 : 1;
  const visual: Visual = {
    type: "plot",
    xMin: 0,
    xMax: T3 + 1,
    yMin: 0,
    yMax: v1 + 2,
    step,
    curves: [
      {
        points: [
          { x: 0, y: v0 },
          { x: T1, y: v1 },
          { x: T2, y: v1 },
          { x: T3, y: 0 },
        ],
      },
    ],
    points: [
      { x: 0, y: v0, label: "A" },
      { x: T1, y: v1, label: "B" },
      { x: T2, y: v1, label: "C" },
      { x: T3, y: 0, label: "D" },
    ],
  };
  const intro = "The graph shows velocity (m/s) against time (s) for a skater on a straight path.";
  const kind = pick(d === 1 ? (["a", "state"] as const) : (["a", "state", "area", "decel", "total"] as const));
  if (kind === "a")
    return inputQ(`${intro} What is the acceleration from A to B, in m/s²?`, a, `Acceleration is the slope: rise ÷ run = (${v1} − ${v0}) ÷ ${T1}.`, { suffix: "m/s²", visual });
  if (kind === "state")
    return textChoice(
      `${intro} What is the skater doing between B and C?`,
      "Moving at constant velocity",
      ["Standing still", "Speeding up steadily", "Slowing down steadily", "Moving backward"],
      "A flat line on a velocity–time graph means velocity is not changing. It is at a steady, non-zero velocity, not at rest.",
      visual,
    );
  if (kind === "area")
    return inputQ(
      `${intro} How far does the skater travel from B to C, in metres?`,
      v1 * (T2 - T1),
      `Displacement is the area under the graph. From B to C it is a rectangle: ${v1} × ${T2 - T1}.`,
      { suffix: "m", visual },
    );
  if (kind === "decel")
    return inputQ(
      `${intro} What is the acceleration from C to D, in m/s²? Use a minus sign for slowing down.`,
      -v1 / dt3,
      `Slope = (0 − ${v1}) ÷ (${T3} − ${T2}). The line goes down, so the acceleration is negative.`,
      { suffix: "m/s²", visual, keypad: "integer" },
    );
  const total = ((v0 + v1) / 2) * T1 + v1 * (T2 - T1) + (v1 * dt3) / 2;
  return inputQ(
    `${intro} What is the total distance travelled from A to D, in metres?`,
    total,
    `Add the areas under the graph: a trapezoid (A–B), a rectangle (B–C) and a triangle (C–D).`,
    { suffix: "m", visual, keypad: "decimal" },
  );
}

function dtGraphQ(d: Level): Question {
  const v = randInt(2, 8);
  const t1 = randInt(2, 5);
  const d0 = randInt(0, 4);
  const d1 = d0 + v * t1;
  const t2 = t1 + randInt(2, 4);
  const t3 = t2 + randInt(2, 4);
  const vBack = d1 % (t3 - t2) === 0 ? d1 / (t3 - t2) : null;
  const visual: Visual = {
    type: "plot",
    xMin: 0,
    xMax: t3 + 1,
    yMin: 0,
    yMax: d1 + 3,
    step: Math.max(t3, d1 + 3) > 24 ? 2 : 1,
    curves: [
      {
        points: [
          { x: 0, y: d0 },
          { x: t1, y: d1 },
          { x: t2, y: d1 },
          { x: t3, y: vBack !== null ? 0 : d1 },
        ],
      },
    ],
    points: [
      { x: 0, y: d0, label: "A" },
      { x: t1, y: d1, label: "B" },
      { x: t2, y: d1, label: "C" },
      ...(vBack !== null ? [{ x: t3, y: 0, label: "D" }] : []),
    ],
  };
  const intro = "The graph shows position (m) against time (s) for a runner on a straight track.";
  if (d === 1 || chance(0.4))
    return textChoice(
      `${intro} What is the runner doing between B and C?`,
      "Standing still",
      ["Running at constant speed", "Speeding up", "Running back toward the start"],
      "On a position–time graph a flat line means the position is not changing, so the runner is at rest.",
      visual,
    );
  if (vBack !== null && chance(0.4))
    return inputQ(
      `${intro} What is the velocity from C to D, in m/s? (Minus means moving back toward the start.)`,
      -vBack,
      `Slope = (0 − ${d1}) ÷ (${t3} − ${t2}). The line goes down, so the velocity is negative.`,
      { suffix: "m/s", visual, keypad: "integer" },
    );
  return inputQ(`${intro} What is the runner's velocity from A to B, in m/s?`, v, `On a position–time graph, velocity is the slope: (${d1} − ${d0}) ÷ ${t1}.`, { suffix: "m/s", visual });
}

const VECTOR_SORT: SortSet = {
  prompt: "Scalar or vector? Sort each quantity.",
  hint: "Vectors have a direction as well as a size (velocity, displacement, acceleration, force). Scalars only have a size (speed, distance, time, mass, energy).",
  bins: [
    { id: "scalar", label: "scalar (size only)", emoji: "📏" },
    { id: "vector", label: "vector (size and direction)", emoji: "🧭" },
  ],
  items: [
    { label: "distance", emoji: "📏", bin: "scalar" },
    { label: "speed", emoji: "⏱️", bin: "scalar" },
    { label: "time", emoji: "⏳", bin: "scalar" },
    { label: "mass", emoji: "⚖️", bin: "scalar" },
    { label: "energy", emoji: "⚡", bin: "scalar" },
    { label: "displacement", emoji: "➡️", bin: "vector" },
    { label: "velocity", emoji: "🧭", bin: "vector" },
    { label: "acceleration", emoji: "🚀", bin: "vector" },
    { label: "force", emoji: "💪", bin: "vector" },
  ],
};

const KIN_BANK: Item[] = [
  {
    prompt: "What is the difference between speed and velocity?",
    right: "Velocity includes direction; speed does not",
    wrong: ["Speed includes direction; velocity does not", "They are always numerically different", "Velocity is measured in m/s² and speed in m/s"],
    hint: "Velocity is a vector (size and direction). Speed is only the size.",
  },
  {
    prompt: "A car travels around a circular track at a constant 20 m/s. Which statement is true?",
    right: "Its speed is constant but its velocity is changing",
    wrong: ["Its velocity is constant", "Its acceleration is zero", "Its speed is changing"],
    hint: "Velocity changes when the direction changes, even if the speed stays the same.",
    hard: true,
  },
  {
    prompt: "An object has a velocity of +8 m/s and an acceleration of −2 m/s². What is happening to it?",
    right: "It is slowing down",
    wrong: ["It is speeding up", "It is moving at constant velocity", "It has stopped"],
    hint: "When velocity and acceleration point in opposite directions, the object slows down.",
    hard: true,
  },
  {
    prompt: "At the very top of its path, a ball thrown straight up has…",
    right: "zero velocity and an acceleration of 9.8 m/s² downward",
    wrong: ["zero velocity and zero acceleration", "upward velocity and zero acceleration", "zero velocity and 9.8 m/s² upward acceleration"],
    hint: "Gravity keeps pulling the entire time. The ball only stops for an instant before falling.",
    hard: true,
  },
  {
    prompt: "Ignoring air resistance, a heavy bowling ball and a small marble are dropped from the same height. Which lands first?",
    right: "They land together",
    wrong: ["The bowling ball", "The marble", "It depends on the colour"],
    hint: "Near Earth's surface, all objects accelerate at the same 9.8 m/s² when air resistance is ignored.",
    emoji: "🎳",
  },
  {
    prompt: "What does the slope of a velocity–time graph represent?",
    right: "Acceleration",
    wrong: ["Position", "Distance travelled", "Speed"],
    hint: "Rise ÷ run on a v–t graph is change in velocity ÷ change in time, which is acceleration.",
  },
  {
    prompt: "What does the area under a velocity–time graph represent?",
    right: "Displacement",
    wrong: ["Acceleration", "Time", "Force"],
    hint: "Velocity × time gives displacement, and that is exactly area on the graph.",
  },
  {
    prompt: "Which unit is correct for acceleration?",
    right: "m/s²",
    wrong: ["m/s", "m²/s", "s/m"],
    hint: "Acceleration is a change in speed (m/s) every second, so (m/s) ÷ s = m/s².",
  },
];

function kinematicsUnit(opts?: GenerateOptions): Question[] {
  const d = lv(opts);
  return mix(
    d,
    KIN_BANK,
    2,
    [uniformQ, averageSpeedQ, convertSpeedQ, accelQ, distanceQ, timelessQ, freeFallQ, vtGraphQ, vtGraphQ, dtGraphQ],
    5,
    [sortQuestion(VECTOR_SORT, 3)].filter(() => d !== 3 || chance(0.5)),
  );
}

// ---------- Physics: forces and energy ----------

function newtonSecondQ(d: Level): Question {
  const m = pick(d === 1 ? [2, 4, 5, 10] : [2, 5, 8, 12, 20, 50, 1200]);
  const a = pick(d === 1 ? [1, 2, 3] : [2, 3, 4, 5, 2.5]);
  const F = m * a;
  const ask = pick(["F", "a", "m"] as const);
  const obj = m === 1200 ? "A 1200 kg car" : `A ${m} kg cart`;
  if (ask === "F") return inputQ(`${obj} accelerates at ${a} m/s². What net force acts on it, in newtons?`, F, `F = ma = ${m} × ${a}.`, { suffix: "N", keypad: "decimal" });
  if (ask === "a") return inputQ(`A net force of ${F} N acts on a ${m} kg object. What is its acceleration in m/s²?`, a, `a = F ÷ m = ${F} ÷ ${m}.`, { suffix: "m/s²", keypad: "decimal" });
  return inputQ(`A net force of ${F} N gives an object an acceleration of ${a} m/s². What is its mass in kilograms?`, m, `m = F ÷ a = ${F} ÷ ${a}.`, { suffix: "kg", keypad: "decimal" });
}

function weightQ(d: Level): Question {
  const m = pick([5, 10, 20, 40, 50, 60, 70]);
  const moon = d >= 2 && chance(0.4);
  const g = moon ? 1.6 : 9.8;
  const W = m * g;
  return inputQ(
    `What is the weight of a ${m} kg object ${moon ? "on the Moon, where g = 1.6 N/kg" : "on Earth (g = 9.8 N/kg)"}? Answer in newtons.`,
    W,
    `Weight is the force of gravity: W = mg = ${m} × ${g}. Mass stays ${m} kg anywhere; weight changes with g.`,
    { suffix: "N", keypad: "decimal", dp: 1 },
  );
}

function netForceQ(d: Level): Question {
  const m = pick([2, 4, 5, 10]);
  const a = randInt(1, d === 1 ? 3 : 5);
  const f = randInt(4, 20);
  const Fa = m * a + f;
  return inputQ(
    `A ${m} kg crate is pushed along a floor with ${Fa} N to the right. Friction pulls with ${f} N to the left. What is the crate's acceleration in m/s²?`,
    a,
    `Net force = ${Fa} − ${f} = ${m * a} N. Then a = F_net ÷ m = ${m * a} ÷ ${m}.`,
    { suffix: "m/s²" },
  );
}

function frictionQ(d: Level): Question {
  const m = pick([10, 20, 30, 50]);
  const mu = pick(d === 1 ? [0.2, 0.5] : [0.1, 0.2, 0.25, 0.3, 0.4, 0.5]);
  const N = m * 9.8;
  const f = mu * N;
  return inputQ(
    `A ${m} kg box rests on a level floor. The coefficient of kinetic friction is ${mu}. What is the friction force when it slides, in newtons? (g = 9.8 N/kg)`,
    f,
    `On a level floor N = mg = ${m} × 9.8 = ${fmt(N, 1)} N. Then f = μN = ${mu} × ${fmt(N, 1)}.`,
    { suffix: "N", keypad: "decimal", dp: 2 },
  );
}

function workQ(d: Level): Question {
  const F = randInt(5, d === 1 ? 40 : 90);
  const dist = randInt(2, d === 1 ? 10 : 25);
  const t = pick([2, 4, 5, 10]);
  const W = F * dist;
  if (d >= 2 && chance(0.5)) {
    return inputQ(
      `A motor does ${W * t} J of work in ${t} s. What is its power in watts?`,
      W,
      `P = W ÷ t = ${W * t} ÷ ${t}. One watt is one joule per second.`,
      { suffix: "W" },
    );
  }
  return inputQ(
    `A person pushes a cart with a ${F} N force in the direction of motion for ${dist} m. How much work do they do, in joules?`,
    W,
    `W = F × d = ${F} × ${dist}. Force and displacement are in the same direction.`,
    { suffix: "J" },
  );
}

function kineticQ(d: Level): Question {
  const m = pick([2, 4, 6, 8, 10, 50, 70]);
  const v = randInt(2, d === 1 ? 8 : 20);
  const KE = 0.5 * m * v * v;
  if (d === 3 && chance(0.4)) {
    return numMC(
      `A car's speed doubles from ${v} m/s to ${2 * v} m/s. By what factor does its kinetic energy increase?`,
      4,
      [2, 8, 3],
      "KE = ½mv². Doubling v multiplies v² by 4, so KE is 4 times as big.",
      { suffix: "×", f: (x) => fmt(x, 0) },
    );
  }
  return inputQ(
    `What is the kinetic energy of a ${m} kg object moving at ${v} m/s, in joules?`,
    KE,
    `KE = ½mv² = ½ × ${m} × ${v}². Square the speed first.`,
    { suffix: "J", keypad: "decimal" },
  );
}

function potentialQ(d: Level): Question {
  const m = pick([2, 5, 10, 20, 50]);
  const h = randInt(2, d === 1 ? 10 : 30);
  const PE = m * 9.8 * h;
  if (d >= 2 && chance(0.5)) {
    return inputQ(
      `A ${m} kg ball falls from a height of ${h} m with no air resistance. How much kinetic energy does it have just before it lands, in joules? (g = 9.8 N/kg)`,
      PE,
      `Energy is conserved: the gravitational potential energy lost becomes kinetic energy. KE = mgh = ${m} × 9.8 × ${h}.`,
      { suffix: "J", keypad: "decimal", dp: 1 },
    );
  }
  return inputQ(
    `How much gravitational potential energy does a ${m} kg object gain when it is lifted ${h} m? (g = 9.8 N/kg) Answer in joules.`,
    PE,
    `E_p = mgh = ${m} × 9.8 × ${h}.`,
    { suffix: "J", keypad: "decimal", dp: 1 },
  );
}

const CONTACT_SORT: SortSet = {
  prompt: "Contact force or non-contact force? Sort each force.",
  hint: "Contact forces need the objects to touch. Gravity, magnetism and electric forces act across a gap.",
  bins: [
    { id: "contact", label: "contact force", emoji: "🤝" },
    { id: "field", label: "acts at a distance", emoji: "🧲" },
  ],
  items: [
    { label: "friction", emoji: "🛷", bin: "contact" },
    { label: "tension in a rope", emoji: "🪢", bin: "contact" },
    { label: "normal force from a table", emoji: "🍽️", bin: "contact" },
    { label: "an applied push", emoji: "🤲", bin: "contact" },
    { label: "air resistance", emoji: "🪂", bin: "contact" },
    { label: "gravity", emoji: "🌍", bin: "field" },
    { label: "magnetic force", emoji: "🧲", bin: "field" },
    { label: "electric force between charges", emoji: "⚡", bin: "field" },
  ],
};

const ENERGY_SORT: SortSet = {
  prompt: "Mostly potential energy or kinetic energy right now? Sort each situation.",
  hint: "Potential energy is stored (height, stretch, chemical). Kinetic energy is energy of motion.",
  bins: [
    { id: "pe", label: "potential energy", emoji: "🔋" },
    { id: "ke", label: "kinetic energy", emoji: "🏃" },
  ],
  items: [
    { label: "a book on a high shelf", emoji: "📚", bin: "pe" },
    { label: "a stretched elastic band", emoji: "🪀", bin: "pe" },
    { label: "a roller coaster at the top of a hill", emoji: "🎢", bin: "pe" },
    { label: "water behind a dam", emoji: "🌊", bin: "pe" },
    { label: "a rolling soccer ball", emoji: "⚽", bin: "ke" },
    { label: "a moving bus", emoji: "🚌", bin: "ke" },
    { label: "a falling apple", emoji: "🍎", bin: "ke" },
    { label: "wind turning a turbine", emoji: "💨", bin: "ke" },
  ],
};

const FORCE_BANK: Item[] = [
  {
    prompt: "Why do passengers lurch forward when a bus brakes suddenly?",
    right: "Their bodies tend to keep moving at the same velocity (inertia)",
    wrong: ["A force pushes them forward", "Gravity increases", "The seat pulls them forward"],
    hint: "Newton's first law: an object keeps its velocity unless a net force acts. The bus slows, but the passengers' bodies don't, until a seatbelt acts.",
    emoji: "🚌",
  },
  {
    prompt: "A truck collides with a small car. During the collision, which statement is true?",
    right: "The forces on the truck and the car are equal in size and opposite in direction",
    wrong: ["The truck pushes harder on the car", "The car pushes harder on the truck", "Only the truck exerts a force"],
    hint: "Newton's third law: forces come in equal and opposite pairs, on different objects. The car just has a larger acceleration because its mass is smaller.",
    hard: true,
  },
  {
    prompt: "What is the difference between mass and weight?",
    right: "Mass is the amount of matter; weight is the force of gravity on that mass",
    wrong: ["They are the same thing in different units", "Mass changes with location; weight does not", "Weight is measured in kilograms"],
    hint: "Mass (kg) stays the same everywhere. Weight (N) = mg changes with the strength of gravity.",
  },
  {
    prompt: "An object moves at a steady speed in a straight line. What can you say about the net force on it?",
    right: "It is zero",
    wrong: ["It points in the direction of motion", "It equals the object's weight", "It must be increasing"],
    hint: "Constant velocity means zero acceleration, and by F = ma the net force is zero.",
    hard: true,
  },
  {
    prompt: "Which unit is a newton equal to?",
    right: "kg·m/s²",
    wrong: ["kg·m/s", "kg/m·s²", "J/s"],
    hint: "F = ma, so the units are kg × m/s².",
  },
  {
    prompt: "A student carries a heavy box horizontally across a room at constant speed. How much work does the upward force of their arms do on the box?",
    right: "Zero, because the force is perpendicular to the motion",
    wrong: ["A lot, because the box is heavy", "Equal to the box's weight", "It depends only on how long they walk"],
    hint: "Work needs a force component along the displacement. Lifting up while moving sideways does no work on the box.",
    hard: true,
  },
  {
    prompt: "A 1 W light bulb and a 100 W light bulb each run for 10 s. Which transfers more energy?",
    right: "The 100 W bulb",
    wrong: ["The 1 W bulb", "They transfer the same energy", "Neither: power is not energy"],
    hint: "Energy = power × time. With equal times, the larger power transfers more energy.",
  },
  {
    prompt: "A skier slides down a hill. As she gets lower, what happens to her energy (ignoring friction)?",
    right: "Gravitational potential energy decreases and kinetic energy increases",
    wrong: ["Both decrease", "Both increase", "Kinetic energy decreases and potential energy increases"],
    hint: "Energy is transformed, not lost. The height she loses becomes speed.",
    emoji: "⛷️",
  },
  {
    prompt: "What does the law of conservation of energy say?",
    right: "Energy cannot be created or destroyed, only transformed or transferred",
    wrong: ["Energy is used up when work is done", "Kinetic energy is always conserved", "Energy can be created by machines"],
    hint: "In a closed system the total energy stays constant, even though it changes form.",
  },
  {
    prompt: "A car's brakes bring it to a stop. Where does most of its kinetic energy go?",
    right: "Thermal energy in the brakes, tires and road",
    wrong: ["It is destroyed", "It becomes gravitational potential energy", "It is stored in the speedometer"],
    hint: "Friction transforms motion into heat. The total energy is conserved.",
    hard: true,
  },
  {
    prompt: "Why is a heavier object harder to accelerate?",
    right: "A larger mass needs a bigger net force for the same acceleration (a = F ÷ m)",
    wrong: ["Gravity pushes it back", "Heavy objects have no inertia", "The friction force always equals the push"],
    hint: "For the same force, a larger mass gives a smaller acceleration.",
  },
];

function forcesUnit(opts?: GenerateOptions): Question[] {
  const d = lv(opts);
  const sortSet = chance(0.5) ? CONTACT_SORT : ENERGY_SORT;
  return mix(d, FORCE_BANK, 2, [newtonSecondQ, weightQ, netForceQ, frictionQ, workQ, kineticQ, potentialQ], 5, [sortQuestion(sortSet, perBin(d))]);
}

// ---------- Life sciences: evolution ----------

interface MothScenario {
  organism: string;
  setting: string;
  predator: string;
  favoured: string;
  other: string;
}
const MOTHS: MothScenario[] = [
  { organism: "beetles", setting: "dark soil", predator: "birds", favoured: "dark", other: "green" },
  { organism: "mice", setting: "pale sand dunes", predator: "owls", favoured: "light", other: "dark" },
  { organism: "lizards", setting: "black volcanic rock", predator: "hawks", favoured: "dark", other: "pale" },
  { organism: "grasshoppers", setting: "green meadow grass", predator: "birds", favoured: "green", other: "brown" },
];

function selectionDataQ(d: Level): Question {
  const s = pick(MOTHS);
  const total = pick([100, 200]);
  const gens = 4;
  const start = pick([10, 15, 20, 25]);
  const counts: number[] = [(start * total) / 100];
  for (let g = 1; g < gens; g++) counts.push(counts[g - 1] + (pick([10, 15, 20]) * total) / 100);
  const visual: Visual = {
    type: "table",
    title: `A sample of ${total} ${s.organism} in each generation`,
    headers: ["Generation", `${s.favoured} ${s.organism}`, `${s.other} ${s.organism}`],
    rows: counts.map((c, g) => [g + 1, c, total - c]),
  };
  const setup = `${s.predator[0].toUpperCase()}${s.predator.slice(1)} hunt ${s.organism} living on ${s.setting} by sight.`;
  if (d === 1) {
    return textChoice(
      `${setup} What does the table show is being favoured by natural selection?`,
      `${s.favoured} ${s.organism}`,
      [`${s.other} ${s.organism}`, "neither colour"],
      "Look for the column that rises each generation: those individuals survive and reproduce more.",
      visual,
    );
  }
  if (d === 2) {
    return textChoice(
      `${setup} Which best explains the change in the table?`,
      `${s.favoured[0].toUpperCase()}${s.favoured.slice(1)} ${s.organism} blend in better, so more of them survive and reproduce`,
      [
        `Individual ${s.other} ${s.organism} change colour as they grow`,
        `${s.predator[0].toUpperCase()}${s.predator.slice(1)} cannot see any of the ${s.organism}`,
        `The ${s.organism} choose to have ${s.favoured} offspring`,
      ],
      "Colour is inherited and cannot be changed by choice. Individuals that blend in are eaten less and pass on their genes more often.",
      visual,
    );
  }
  const pct = Math.round((counts[gens - 1] / total) * 100);
  return inputQ(
    `${setup} What percentage of the sample is ${s.favoured} in generation ${gens}?`,
    pct,
    `Percentage = ${counts[gens - 1]} ÷ ${total} × 100.`,
    { suffix: "%", visual },
  );
}

const SELECTION_STEPS = [
  "Individuals in a population vary in their inherited traits",
  "More offspring are born than can survive",
  "Individuals compete for limited resources",
  "Those with helpful traits survive and reproduce more",
  "They pass those traits on to their offspring",
  "The trait becomes more common in the population over generations",
];

function stepsOrder(d: Level): OrderQuestion {
  return ordered(
    "Put the steps of natural selection in a logical order.",
    "Start with variation, then competition for limited resources, then differences in survival and reproduction, then inheritance, and finally change in the population.",
    SELECTION_STEPS,
    d,
    d === 1 ? 4 : d === 2 ? 5 : 6,
  );
}

const EVIDENCE_SORT: SortSet = {
  prompt: "Which type of evidence for evolution does each example show?",
  hint: "Fossils record past life. Homologous structures are similar bones with different jobs. DNA comparisons show how closely species are related.",
  bins: [
    { id: "fossil", label: "fossil record", emoji: "🦴" },
    { id: "anatomy", label: "comparative anatomy", emoji: "🦇" },
    { id: "dna", label: "DNA and proteins", emoji: "🧬" },
  ],
  items: [
    { label: "Tiktaalik, a fish with limb-like fins", emoji: "🐟", bin: "fossil" },
    { label: "layers showing older, simpler species deeper down", emoji: "🪨", bin: "fossil" },
    { label: "whale fossils with small hind limbs", emoji: "🐋", bin: "fossil" },
    { label: "bat wing, whale flipper and human arm share the same bones", emoji: "🦇", bin: "anatomy" },
    { label: "a snake's tiny leftover pelvis bones", emoji: "🐍", bin: "anatomy" },
    { label: "similar early embryos in fish and mammals", emoji: "🥚", bin: "anatomy" },
    { label: "humans and chimpanzees share about 98–99% of their DNA", emoji: "🐒", bin: "dna" },
    { label: "all life uses the same genetic code", emoji: "🧬", bin: "dna" },
    { label: "similar protein sequences in related species", emoji: "🔬", bin: "dna" },
  ],
};

const EVOLUTION_BANK: Item[] = [
  {
    prompt: "In biology, what is evolution?",
    right: "A change in the inherited traits of a population over generations",
    wrong: ["A change in one individual during its lifetime", "An organism trying harder to survive", "Animals becoming more perfect"],
    hint: "Evolution happens to populations, not individuals, and only inherited traits count.",
    emoji: "🦎",
  },
  {
    prompt: "What is the ultimate source of new variation in a population?",
    right: "Mutations in DNA",
    wrong: ["Exercise", "Natural selection", "Need or desire"],
    hint: "Mutations create new alleles. Natural selection then sorts the variation; it doesn't create it.",
    emoji: "🧬",
  },
  {
    prompt: "Which statement about mutations is correct?",
    right: "Mutations are random with respect to what the organism needs",
    wrong: ["Mutations happen because the organism needs them", "Mutations are always harmful", "Mutations only happen in bacteria"],
    hint: "Mutations are chance changes. Some are harmful, many are neutral and a few are helpful in a particular environment.",
    hard: true,
  },
  {
    prompt: "A species of fish is split into two populations by a new river channel. After many generations they can no longer interbreed. This is…",
    right: "speciation through geographic isolation",
    wrong: ["extinction", "artificial selection", "adaptation within one individual"],
    hint: "When populations are separated, they evolve independently. Eventually reproductive barriers can form.",
    emoji: "🐟",
  },
  {
    prompt: "What is the most common definition of a species used in biology?",
    right: "A group of organisms that can interbreed and produce fertile offspring",
    wrong: ["Any group that looks alike", "Any group living in the same place", "Organisms that eat the same food"],
    hint: "The biological species concept focuses on reproduction. A mule is infertile, so horses and donkeys are separate species.",
  },
  {
    prompt: "Hawaiian honeycreepers descended from one ancestral finch and now have many beak shapes. This is an example of…",
    right: "adaptive radiation",
    wrong: ["convergent evolution", "extinction", "artificial selection"],
    hint: "Adaptive radiation: one ancestor spreads into many niches and diversifies into many species.",
    emoji: "🐦",
    hard: true,
  },
  {
    prompt: "Sharks and dolphins have similar streamlined bodies though they are not closely related. This is…",
    right: "convergent evolution",
    wrong: ["divergent evolution within one species", "homologous inheritance", "artificial selection"],
    hint: "Similar environments favour similar solutions, even in unrelated lineages.",
    emoji: "🐬",
    hard: true,
  },
  {
    prompt: "Bacteria exposed to an antibiotic become resistant over time. Why?",
    right: "Resistant individuals survive and reproduce, so resistance becomes common",
    wrong: ["Each bacterium learns to resist", "The antibiotic causes helpful mutations on purpose", "Resistance is passed on only if the antibiotic is stopped"],
    hint: "The antibiotic is a selection pressure. Chance resistant bacteria survive and pass on resistance.",
    emoji: "🧫",
  },
  {
    prompt: "Why is genetic variation important when conditions change?",
    right: "Some individuals may already have traits that help them survive the change",
    wrong: ["It lets individuals choose new traits", "It guarantees the species will survive", "It makes all offspring identical"],
    hint: "A varied population is more likely to contain survivors. A population with little variation can be wiped out.",
  },
  {
    prompt: "Which is a homologous structure pair?",
    right: "A human arm and a bat wing",
    wrong: ["A bat wing and an insect wing", "A shark fin and a dolphin flipper's function", "A bird wing and a butterfly wing"],
    hint: "Homologous structures share the same underlying bones from a common ancestor, even when used differently. Insect wings are built differently.",
    hard: true,
  },
  {
    prompt: "Which statement shows a common misunderstanding of 'survival of the fittest'?",
    right: "The fittest are always the strongest and biggest",
    wrong: ["Fitness is how well traits suit an environment", "Fitness includes how many offspring survive to reproduce", "Fitness can change when the environment changes"],
    hint: "'Fit' means well matched to the environment and successful at reproducing, not necessarily strongest.",
  },
  {
    prompt: "Two species share a more recent common ancestor than either shares with a third. What does that predict?",
    right: "They will usually have more similar DNA to each other than to the third species",
    wrong: ["They will look identical", "They will live in the same habitat", "They will have exactly the same DNA"],
    hint: "The more recently two species diverged, the less time their DNA has had to accumulate differences.",
    hard: true,
  },
  {
    prompt: "A scientist says 'evolution is just a theory.' What is the best response?",
    right: "In science, a theory is a well-tested explanation supported by many lines of evidence",
    wrong: ["A theory is a guess with no evidence", "A theory becomes a law once it is proven", "A theory is an opinion"],
    hint: "Scientific theories (like cell theory or germ theory) explain large bodies of evidence and make testable predictions.",
    hard: true,
  },
  {
    prompt: "Peppered moths in a soot-darkened city became mostly dark over generations. What was the selection pressure?",
    right: "Birds eating the moths that were easier to see",
    wrong: ["The moths painting themselves", "A lack of food", "The moths' choice"],
    hint: "Dark moths blended into the dark trees, so they were eaten less and left more offspring.",
    emoji: "🦋",
  },
];

function evolutionUnit(opts?: GenerateOptions): Question[] {
  const d = lv(opts);
  return mix(d, EVOLUTION_BANK, 4, [selectionDataQ, stepsOrder, selectionDataQ], 3, [sortQuestion(EVIDENCE_SORT, 2)]);
}

// ---------- Life sciences: classification and microbes ----------

const RANKS = ["Domain", "Kingdom", "Phylum", "Class", "Order", "Family", "Genus", "Species"];

function ranksOrder(d: Level): OrderQuestion {
  return ordered(
    "Put the taxonomic ranks in order from the broadest group to the most specific.",
    "Remember: Domain, Kingdom, Phylum, Class, Order, Family, Genus, Species. Each rank is nested inside the one before it.",
    RANKS,
    d,
    d === 1 ? 4 : d === 2 ? 6 : 6,
  );
}

const BACTVIRUS_SORT: SortSet = {
  prompt: "Bacteria or virus? Sort each description.",
  hint: "Bacteria are living single cells that can reproduce on their own and are treated with antibiotics. Viruses are not cells; they need a host cell to reproduce and antibiotics don't work on them.",
  bins: [
    { id: "bacteria", label: "bacteria", emoji: "🦠" },
    { id: "virus", label: "viruses", emoji: "🧫" },
  ],
  items: [
    { label: "single-celled organisms", emoji: "🔬", bin: "bacteria" },
    { label: "reproduce by binary fission", emoji: "➗", bin: "bacteria" },
    { label: "can be treated with antibiotics", emoji: "💊", bin: "bacteria" },
    { label: "cause strep throat", emoji: "🤒", bin: "bacteria" },
    { label: "have their own ribosomes", emoji: "🧬", bin: "bacteria" },
    { label: "need a host cell to reproduce", emoji: "🔑", bin: "virus" },
    { label: "genetic material inside a protein coat", emoji: "📦", bin: "virus" },
    { label: "cause influenza (the flu)", emoji: "🤧", bin: "virus" },
    { label: "not made of cells", emoji: "🚫", bin: "virus" },
    { label: "prevented by many vaccines", emoji: "💉", bin: "virus" },
  ],
};

const DOMAIN_SORT: SortSet = {
  prompt: "Which domain does each organism belong to?",
  hint: "Bacteria and Archaea are prokaryotes (no nucleus). Eukarya includes animals, plants, fungi and protists, whose cells have a nucleus.",
  bins: [
    { id: "bacteria", label: "Bacteria", emoji: "🦠" },
    { id: "archaea", label: "Archaea", emoji: "🔥" },
    { id: "eukarya", label: "Eukarya", emoji: "🌳" },
  ],
  items: [
    { label: "E. coli in your gut", emoji: "🦠", bin: "bacteria" },
    { label: "cyanobacteria in a pond", emoji: "🟢", bin: "bacteria" },
    { label: "microbes in a hot spring that thrive at extreme heat", emoji: "♨️", bin: "archaea" },
    { label: "methane-producing microbes in wetlands", emoji: "🌫️", bin: "archaea" },
    { label: "a mushroom", emoji: "🍄", bin: "eukarya" },
    { label: "a salmon", emoji: "🐟", bin: "eukarya" },
    { label: "a Douglas-fir tree", emoji: "🌲", bin: "eukarya" },
    { label: "an amoeba", emoji: "🔵", bin: "eukarya" },
  ],
};

function doublingQ(d: Level): Question {
  const mins = pick(d === 1 ? [30, 60] : [20, 30, 60]);
  const hours = pick(d === 1 ? [2, 3] : [2, 3, 4]);
  const gens = (hours * 60) / mins;
  const n0 = pick(d === 3 ? [1, 2, 5] : [1]);
  const total = n0 * 2 ** gens;
  return inputQ(
    `A culture starts with ${n0} bacterial cell${n0 === 1 ? "" : "s"}. Each cell divides every ${mins} minutes (binary fission), with no cell dying. How many cells are there after ${hours} hours?`,
    total,
    `Number of divisions = ${hours * 60} ÷ ${mins} = ${gens}. Each division doubles the count: ${n0} × 2^${gens}.`,
    { suffix: "cells" },
  );
}

function scaleQ(): Question {
  const um = pick([2, 3, 4, 5]);
  const nm = um * 1000;
  if (chance(0.5))
    return inputQ(
      `A bacterium is ${um} micrometres (µm) long. How many nanometres (nm) is that? (1 µm = 1000 nm)`,
      nm,
      `Multiply by 1000: ${um} × 1000.`,
      { suffix: "nm" },
    );
  const virus = pick([100, 50, 200]);
  const ratio = (um * 1000) / virus;
  return numMC(
    `A virus is ${virus} nm across. A bacterium is ${um} µm long (1 µm = 1000 nm). About how many times longer is the bacterium than the virus?`,
    ratio,
    [ratio * 1000, ratio * 100, ratio * 10, ratio / 10],
    `Convert to the same unit first: ${um} µm = ${um * 1000} nm, then divide by ${virus} nm.`,
    { suffix: " times", f: (x) => fmt(x, 1) },
  );
}

const MICRO_BANK: Item[] = [
  {
    prompt: "In the name Canis lupus, what is 'Canis'?",
    right: "The genus",
    wrong: ["The species", "The family", "The kingdom"],
    hint: "In binomial nomenclature the first word (capitalized) is the genus and the second (lower case) is the species.",
    emoji: "🐺",
  },
  {
    prompt: "Which is written correctly as a scientific name?",
    right: "Homo sapiens",
    wrong: ["homo Sapiens", "Homo Sapiens", "HOMO sapiens"],
    hint: "Genus starts with a capital letter, species is all lower case, and both are italicized or underlined.",
  },
  {
    prompt: "Why do scientists use scientific names rather than common names?",
    right: "Each organism has one name that is the same in every language",
    wrong: ["Common names are always wrong", "Scientific names are shorter", "Common names are banned"],
    hint: "'Robin' means different birds in different countries. A scientific name avoids that confusion.",
  },
  {
    prompt: "What do all prokaryotes have in common?",
    right: "They lack a nucleus enclosed by a membrane",
    wrong: ["They are all pathogens", "They are all visible without a microscope", "They are all plants"],
    hint: "Prokaryotic cells (bacteria and archaea) keep their DNA in the cytoplasm, not in a nucleus.",
  },
  {
    prompt: "A doctor says antibiotics won't help your cold. Why?",
    right: "Colds are caused by viruses, and antibiotics target bacteria",
    wrong: ["Colds are caused by bacteria that resist all drugs", "Antibiotics are only for children", "Antibiotics are taken only once a year"],
    hint: "Antibiotics disrupt bacterial structures such as cell walls. Viruses don't have those.",
    emoji: "💊",
  },
  {
    prompt: "Are viruses usually classified as living things?",
    right: "Most biologists say no, because they aren't cells and can't reproduce without a host",
    wrong: ["Yes, they are plants", "Yes, they have a nucleus", "Yes, they metabolize food on their own"],
    hint: "Viruses show some features of life only inside a host cell, so they sit on the border of 'living'.",
    hard: true,
  },
  {
    prompt: "How does a vaccine help prevent disease?",
    right: "It trains the immune system to recognize a pathogen before infection",
    wrong: ["It kills all germs in the body", "It makes a person's blood thicker", "It replaces antibiotics"],
    hint: "A vaccine shows the immune system a harmless piece or weakened form of a germ, so it can respond fast later.",
    emoji: "💉",
  },
  {
    prompt: "Some bacteria in your intestines help digest food and make vitamins. This is an example of…",
    right: "a beneficial (mutualistic) relationship",
    wrong: ["a parasitic relationship", "an infection that always makes you sick", "a virus"],
    hint: "You provide a home and food; they provide services. Both benefit.",
    emoji: "🦠",
  },
  {
    prompt: "Which domain contains organisms whose cells have a nucleus?",
    right: "Eukarya",
    wrong: ["Bacteria", "Archaea", "All three"],
    hint: "Eukaryotes have a membrane-bound nucleus. Bacteria and archaea are prokaryotes.",
  },
  {
    prompt: "Which of these is NOT a kingdom within domain Eukarya?",
    right: "Bacteria",
    wrong: ["Fungi", "Animalia", "Plantae"],
    hint: "Bacteria is its own domain. Eukarya includes animals, plants, fungi and protists.",
  },
  {
    prompt: "Why do doctors worry about antibiotic overuse?",
    right: "It selects for resistant bacteria, making infections harder to treat",
    wrong: ["Antibiotics make viruses stronger", "Bacteria become extinct", "Antibiotics change human DNA"],
    hint: "Overuse kills susceptible bacteria and leaves resistant ones to multiply. That's natural selection.",
    hard: true,
  },
  {
    prompt: "A lytic virus infects a bacterial cell. What happens?",
    right: "The virus makes copies of itself, and the host cell bursts open",
    wrong: ["The virus divides by binary fission", "The host cell makes antibodies", "The virus eats the cell's nucleus"],
    hint: "A virus takes over the host's machinery to make new viruses. In the lytic cycle the new viruses burst out of the cell.",
    hard: true,
  },
  {
    prompt: "A group of animals share the same genus but different species. How closely related are they compared with animals sharing only the same family?",
    right: "More closely related",
    wrong: ["Less closely related", "Not related at all", "Exactly the same species"],
    hint: "Smaller groups (genus) are nested inside larger groups (family), so organisms in the same genus share a more recent ancestor.",
    hard: true,
  },
];

function classificationUnit(opts?: GenerateOptions): Question[] {
  const d = lv(opts);
  const sortSet = chance(0.5) ? BACTVIRUS_SORT : DOMAIN_SORT;
  const sq = sortSet === DOMAIN_SORT ? sortQuestion(DOMAIN_SORT, 2) : sortQuestion(BACTVIRUS_SORT, perBin(d));
  return mix(d, MICRO_BANK, 4, [ranksOrder, doublingQ, scaleQ], 3, [sq]);
}

// ---------- Life sciences: ecology ----------

const SYMBIOSIS_SORT: SortSet = {
  prompt: "Mutualism, commensalism or parasitism? Sort each relationship.",
  hint: "Mutualism: both benefit. Commensalism: one benefits and the other is unaffected. Parasitism: one benefits and the other is harmed.",
  bins: [
    { id: "mutualism", label: "mutualism (+/+)", emoji: "🤝" },
    { id: "commensalism", label: "commensalism (+/0)", emoji: "😌" },
    { id: "parasitism", label: "parasitism (+/−)", emoji: "🪱" },
  ],
  items: [
    { label: "bees feeding on flowers and pollinating them", emoji: "🐝", bin: "mutualism" },
    { label: "fungi and tree roots exchanging nutrients", emoji: "🍄", bin: "mutualism" },
    { label: "barnacles riding on a whale", emoji: "🐋", bin: "commensalism" },
    { label: "an orchid growing on a tree trunk", emoji: "🌺", bin: "commensalism" },
    { label: "a tapeworm in an animal's gut", emoji: "🪱", bin: "parasitism" },
    { label: "a tick feeding on a deer", emoji: "🦌", bin: "parasitism" },
  ],
};

const DENSITY_SORT: SortSet = {
  prompt: "Density-dependent or density-independent? Sort each limiting factor.",
  hint: "Density-dependent factors get stronger as a population gets crowded (disease, competition, predation). Density-independent factors hit regardless of population size (wildfire, drought, storm).",
  bins: [
    { id: "dep", label: "depends on crowding", emoji: "👥" },
    { id: "indep", label: "does not depend on crowding", emoji: "🌪️" },
  ],
  items: [
    { label: "competition for food", emoji: "🍽️", bin: "dep" },
    { label: "disease spreading", emoji: "🤒", bin: "dep" },
    { label: "predators hunting an abundant prey", emoji: "🦉", bin: "dep" },
    { label: "parasites", emoji: "🪱", bin: "dep" },
    { label: "a wildfire", emoji: "🔥", bin: "indep" },
    { label: "a severe drought", emoji: "🏜️", bin: "indep" },
    { label: "a hurricane", emoji: "🌀", bin: "indep" },
    { label: "a volcanic eruption", emoji: "🌋", bin: "indep" },
  ],
};

function popChangeQ(d: Level): Question {
  const N = pick([200, 400, 500, 800, 1000]);
  const B = randInt(1, 4) * N / 20;
  const D = randInt(1, 3) * N / 20;
  const I = d === 1 ? 0 : randInt(0, 3) * N / 50;
  const E = d === 1 ? 0 : randInt(0, 3) * N / 50;
  const change = B + I - D - E;
  const end = N + change;
  const parts = d === 1 ? `${B} births and ${D} deaths` : `${B} births, ${D} deaths, ${I} immigrants and ${E} emigrants`;
  return inputQ(
    `A population of ${N} deer has ${parts} in one year. What is the population size at the end of the year?`,
    end,
    `Change = births + immigration − deaths − emigration = ${B} + ${I} − ${D} − ${E} = ${change}. Add that to ${N}.`,
    { suffix: "deer", keypad: end < 0 ? "integer" : "number" },
  );
}

function densityQ(d: Level): Question {
  const area = pick([2, 4, 5, 10, 20, 25]);
  const per = randInt(2, d === 1 ? 10 : 40);
  const N = area * per;
  return inputQ(
    `A survey counts ${N} sea stars in a ${area} km² study area. What is the population density in sea stars per km²?`,
    per,
    `Density = number of individuals ÷ area = ${N} ÷ ${area}.`,
    { suffix: "per km²" },
  );
}

function carryingQ(d: Level): Question {
  const K = pick([4, 5, 6, 8, 10]);
  const r = pick([0.5, 0.6, 0.8]);
  const pts: { x: number; y: number }[] = [];
  const N0 = 0.2;
  for (let x = 0; x <= 20; x += 0.5) {
    const y = K / (1 + ((K - N0) / N0) * Math.exp(-r * x));
    pts.push({ x, y: Math.round(y * 1000) / 1000 });
  }
  const visual: Visual = { type: "plot", xMin: 0, xMax: 20, yMin: 0, yMax: K + 2, step: 1, curves: [{ points: pts }] };
  const intro = "The graph shows a population (in hundreds of fish) in a lake over 20 years.";
  if (d === 1 || chance(0.5))
    return inputQ(`${intro} Approximately what is the carrying capacity of the lake, in fish?`, K * 100, `Carrying capacity is the level where the curve levels off: about ${K} hundred.`, {
      suffix: "fish",
      visual,
    });
  return textChoice(
    `${intro} Which factor most likely causes the population to level off?`,
    "Limited resources such as food and space",
    ["The fish stop being able to reproduce", "Every fish moves away", "Carrying capacity keeps rising"],
    "The curve flattens when births equal deaths because the environment can't support more individuals.",
    visual,
  );
}

function energyPyramidQ(d: Level): Question {
  const start = pick([10000, 20000, 50000]);
  const steps = d === 1 ? 1 : pick([2, 3]);
  const names = ["primary consumers", "secondary consumers", "tertiary consumers"];
  const val = start / 10 ** steps;
  return inputQ(
    `Producers in a food chain capture ${spaced(start)} kJ of energy. Using the 10% rule, how much energy reaches the ${names[steps - 1]}? Answer in kJ.`,
    val,
    `About 10% of the energy passes up at each level. Multiply by 0.1 ${steps} time${steps > 1 ? "s" : ""}: ${spaced(start)} ÷ ${10 ** steps}.`,
    { suffix: "kJ" },
  );
}

const ECOLOGY_BANK: Item[] = [
  {
    prompt: "What does 'carrying capacity' mean?",
    right: "The largest population an environment can support over time",
    wrong: ["The number of animals one adult can carry", "The fastest growth rate possible", "The number of species in an area"],
    hint: "Resources like food, water and space set a limit on how many individuals a habitat can sustain.",
  },
  {
    prompt: "Which of these is a biotic factor in a forest ecosystem?",
    right: "Fungi decomposing a log",
    wrong: ["Soil pH", "Sunlight", "Rainfall"],
    hint: "Biotic means living or once living. Abiotic factors are non-living, such as temperature, light and water.",
  },
  {
    prompt: "What is biodiversity?",
    right: "The variety of life at the level of genes, species and ecosystems",
    wrong: ["The number of individuals of one species", "The total mass of living things", "The size of a protected area"],
    hint: "Biodiversity includes genetic diversity, species diversity and ecosystem diversity.",
  },
  {
    prompt: "Sea otters eat sea urchins that graze on kelp. Removing the otters lets urchins destroy kelp forests. Sea otters are an example of a…",
    right: "keystone species",
    wrong: ["producer", "decomposer", "invasive species"],
    hint: "A keystone species has an effect on its ecosystem far larger than its numbers suggest.",
    emoji: "🦦",
  },
  {
    prompt: "What is an invasive species?",
    right: "A non-native species that spreads and harms the ecosystem it enters",
    wrong: ["Any large predator", "A species that has been endangered", "A native species with many members"],
    hint: "Without natural predators or competitors, invasive species can crowd out native species.",
  },
  {
    prompt: "Why does a food chain rarely have more than four or five levels?",
    right: "Only about 10% of the energy is passed up each level, so little remains at the top",
    wrong: ["Top predators eat too much", "Plants make too much energy", "Energy is created at each level"],
    hint: "Most energy at each level is used for life processes or lost as heat, leaving little for the next level.",
  },
  {
    prompt: "Wildfire clears a forest. Over the next decades grasses, shrubs and then trees return. This is…",
    right: "secondary succession",
    wrong: ["primary succession", "extinction", "adaptive radiation"],
    hint: "Secondary succession happens where soil remains. Primary succession starts on bare rock with no soil.",
    emoji: "🌱",
  },
  {
    prompt: "Why are decomposers important in an ecosystem?",
    right: "They break down dead material and return nutrients to the soil",
    wrong: ["They make food by photosynthesis", "They are always predators", "They add energy to the ecosystem"],
    hint: "Fungi and bacteria recycle nutrients so producers can use them again.",
    emoji: "🍄",
  },
  {
    prompt: "Along the Pacific coast, bears and other animals move salmon into the forest where they feed. How does this affect the forest?",
    right: "Nutrients from the ocean are added to forest soil, helping trees grow",
    wrong: ["It removes all nutrients from the forest", "It has no effect on plants", "It reduces biodiversity"],
    hint: "Salmon carry marine nutrients upstream, connecting ocean, river and forest ecosystems.",
    emoji: "🐟",
  },
  {
    prompt: "Many Indigenous communities have cared for the same lands and waters for thousands of years. How can scientists work respectfully with this knowledge?",
    right: "In partnership, recognizing Indigenous knowledge as a valid way of knowing alongside Western science",
    wrong: ["By collecting it without permission", "By treating it as only stories with no value", "By assuming all Nations hold the same knowledge"],
    hint: "Each Nation has its own knowledge, rooted in a specific place. Respectful research involves consent, credit and shared benefits.",
    emoji: "🤝",
  },
  {
    prompt: "A First Nation and a provincial agency jointly manage a salmon stream, combining community knowledge with fish counts. This is an example of…",
    right: "co-management",
    wrong: ["extinction", "monoculture", "abiotic control"],
    hint: "Co-management shares decision-making between governments and Indigenous communities who hold knowledge and responsibility for a place.",
    hard: true,
  },
  {
    prompt: "Pesticide concentration increases in each higher level of a food chain, harming top predators the most. This is called…",
    right: "biomagnification",
    wrong: ["photosynthesis", "carrying capacity", "succession"],
    hint: "Some toxins aren't broken down, so they build up in tissues. Predators eat many prey, collecting more toxin each time.",
    hard: true,
  },
  {
    prompt: "Which change would most likely raise the carrying capacity for deer in a forest?",
    right: "More food plants becoming available",
    wrong: ["A new road splitting the habitat", "More predators arriving", "A longer drought"],
    hint: "Carrying capacity rises when limiting resources, such as food, increase.",
    hard: true,
  },
  {
    prompt: "Which best describes the carbon cycle's link to climate?",
    right: "Burning fossil fuels moves carbon from long-term storage into the atmosphere as CO₂",
    wrong: ["Burning fossil fuels removes CO₂ from the air", "Carbon exists only in living things", "Photosynthesis releases CO₂"],
    hint: "Fossil fuels hold carbon stored for millions of years. Burning releases it, adding greenhouse gas.",
    hard: true,
  },
];

function ecologyUnit(opts?: GenerateOptions): Question[] {
  const d = lv(opts);
  const sortSet = chance(0.5) ? SYMBIOSIS_SORT : DENSITY_SORT;
  const sq = sortSet === SYMBIOSIS_SORT ? sortQuestion(SYMBIOSIS_SORT, 2) : sortQuestion(DENSITY_SORT, perBin(d));
  return mix(d, ECOLOGY_BANK, 4, [popChangeQ, densityQ, carryingQ, energyPyramidQ], 3, [sq]);
}

// ---------- Earth sciences: rocks and deep time ----------

const ROCK_SORT: SortSet = {
  prompt: "Igneous, sedimentary or metamorphic? Sort each rock.",
  hint: "Igneous rocks form from cooled magma or lava. Sedimentary rocks form from compacted sediments. Metamorphic rocks are changed by heat and pressure.",
  bins: [
    { id: "igneous", label: "igneous", emoji: "🌋" },
    { id: "sedimentary", label: "sedimentary", emoji: "🏖️" },
    { id: "metamorphic", label: "metamorphic", emoji: "♨️" },
  ],
  items: [
    { label: "granite", emoji: "🪨", bin: "igneous" },
    { label: "basalt", emoji: "🪨", bin: "igneous" },
    { label: "obsidian", emoji: "⚫", bin: "igneous" },
    { label: "pumice", emoji: "🪨", bin: "igneous" },
    { label: "sandstone", emoji: "🏜️", bin: "sedimentary" },
    { label: "limestone", emoji: "🐚", bin: "sedimentary" },
    { label: "shale", emoji: "🪨", bin: "sedimentary" },
    { label: "conglomerate", emoji: "🪨", bin: "sedimentary" },
    { label: "marble", emoji: "🏛️", bin: "metamorphic" },
    { label: "slate", emoji: "🪨", bin: "metamorphic" },
    { label: "gneiss", emoji: "🪨", bin: "metamorphic" },
    { label: "quartzite", emoji: "🪨", bin: "metamorphic" },
  ],
};

const DEEP_TIME: { label: string; ma: number }[] = [
  { label: "Earth forms (about 4.5 billion years ago)", ma: 4540 },
  { label: "Earliest known life appears (more than 3.5 billion years ago)", ma: 3500 },
  { label: "Oxygen builds up in the atmosphere (about 2.4 billion years ago)", ma: 2400 },
  { label: "Animals with hard shells appear in the Cambrian (about 540 million years ago)", ma: 540 },
  { label: "Dinosaurs first appear (about 230 million years ago)", ma: 230 },
  { label: "Non-avian dinosaurs go extinct (about 66 million years ago)", ma: 66 },
  { label: "Modern humans appear (about 300 000 years ago)", ma: 0.3 },
];

function deepTimeOrder(d: Level): OrderQuestion {
  return ordered(
    "Put these events in Earth's history in order, earliest first.",
    "Earth is about 4.5 billion years old. Life was single-celled for most of that time; animals with shells and dinosaurs come much later, and modern humans very recently.",
    DEEP_TIME.map((x) => x.label),
    d,
    d === 1 ? 4 : d === 2 ? 5 : 6,
  );
}

function layersAgeOrder(d: Level): OrderQuestion {
  const letters = shuffle(["A", "B", "C", "D"]).slice(0, d === 1 ? 3 : 4);
  return ordered(
    `A cliff has undisturbed sedimentary layers. From the top down they are ${letters.map((l) => `Layer ${l}`).join(", ")}. Put them in order from OLDEST to YOUNGEST.`,
    "Law of superposition: in undisturbed layers, the oldest rock is at the bottom and the youngest is at the top. So start from the bottom of the list.",
    [...letters].reverse().map((l) => `Layer ${l}`),
    d,
  );
}

const C14 = { years: 5730, max: 4 };

function halfLifeQ(d: Level): Question {
  if (d === 1 || chance(0.5)) {
    // Count half-lives from the fraction remaining.
    const n = randInt(1, d === 1 ? 3 : 4);
    const fraction = `1/${2 ** n}`;
    return inputQ(
      `A sample has ${fraction} of its original radioactive atoms left. How many half-lives have passed?`,
      n,
      `Each half-life halves the amount: 1/2, 1/4, 1/8, 1/16… Count how many halvings give ${fraction}.`,
      { suffix: n === 1 ? "half-life" : "half-lives" },
    );
  }
  const iso = C14;
  const n = randInt(1, iso.max);
  const age = n * iso.years;
  return numMC(
    `A piece of wood has 1/${2 ** n} of its original carbon-14 (half-life 5730 years). About how old is it?`,
    age,
    [(n + 1) * iso.years, Math.max(1, n - 1) * iso.years, 2 ** n * iso.years, iso.years / n],
    `Find the number of half-lives (1/${2 ** n} means ${n}), then multiply by 5730 years: ${n} × 5730.`,
    { f: spaced, suffix: " years" },
  );
}

function massLeftQ(d: Level): Question {
  const m = pick([80, 160, 240, 400, 800]);
  const n = pick(d === 1 ? [1, 2] : [2, 3, 4]);
  const left = m / 2 ** n;
  if (!Number.isInteger(left)) return massLeftQ(d);
  return inputQ(
    `A sample starts with ${m} g of a radioactive isotope. After ${n} half-${n === 1 ? "life" : "lives"}, how many grams of that isotope remain?`,
    left,
    `Halve ${n} time${n > 1 ? "s" : ""}: ${m} ÷ 2^${n}.`,
    { suffix: "g" },
  );
}

const ROCK_BANK: Item[] = [
  {
    prompt: "Which best defines a mineral?",
    right: "A naturally occurring, inorganic solid with a definite chemical composition and crystal structure",
    wrong: ["Any hard material found underground", "A mixture of rocks", "A solid made by living things"],
    hint: "Minerals are the building blocks of rocks: natural, solid, inorganic, with an ordered crystal structure.",
  },
  {
    prompt: "A mineral scratches glass but calcite does not scratch it. Which property is the mineral being tested for?",
    right: "Hardness",
    wrong: ["Streak", "Cleavage", "Density"],
    hint: "Scratch tests compare hardness, ranked on the Mohs scale from 1 (talc) to 10 (diamond).",
  },
  {
    prompt: "Granite has large visible crystals, but basalt has tiny crystals. What best explains the difference?",
    right: "Granite cooled slowly underground; basalt cooled quickly at the surface",
    wrong: ["Granite is heavier", "Basalt is sedimentary", "Granite cooled faster"],
    hint: "Slow cooling gives crystals time to grow large. Rapid cooling gives small crystals.",
    emoji: "🪨",
  },
  {
    prompt: "Which process turns loose sediment into sedimentary rock?",
    right: "Compaction and cementation",
    wrong: ["Melting and cooling", "Heating without melting", "Volcanic eruption"],
    hint: "Layers press down and minerals glue the grains together. This is called lithification.",
  },
  {
    prompt: "Limestone is changed by heat and pressure into…",
    right: "marble",
    wrong: ["granite", "sandstone", "obsidian"],
    hint: "Marble is the metamorphic form of limestone. Slate comes from shale; quartzite from sandstone.",
  },
  {
    prompt: "What is the difference between weathering and erosion?",
    right: "Weathering breaks down rock; erosion moves the pieces away",
    wrong: ["They mean the same thing", "Erosion breaks down rock; weathering moves the pieces", "Weathering only happens in deserts"],
    hint: "Weathering is in-place breakdown (ice, water, chemical). Erosion carries material away with wind, water or ice.",
  },
  {
    prompt: "In the rock cycle, which can happen to ANY type of rock?",
    right: "It can melt and become igneous rock",
    wrong: ["It can only become sedimentary", "It stays the same forever", "It can never be weathered"],
    hint: "The rock cycle has no fixed start or end. Any rock can be weathered, buried, heated or melted.",
    hard: true,
  },
  {
    prompt: "A geologist finds a fault (a crack) that cuts across several rock layers. Which is younger?",
    right: "The fault",
    wrong: ["The layers", "They are the same age", "It cannot be determined"],
    hint: "Principle of cross-cutting relationships: a feature that cuts through rock must be younger than the rock it cuts.",
    hard: true,
  },
  {
    prompt: "What is an index fossil?",
    right: "A fossil of a species that lived a short time but over a wide area, used to date rock layers",
    wrong: ["A fossil that is the largest in a layer", "Any fossil found in a museum", "A fossil of a living species"],
    hint: "Short-lived, widespread species act as time markers, so finding one dates the layer.",
    hard: true,
  },
  {
    prompt: "The Earth is approximately how old?",
    right: "4.5 billion years",
    wrong: ["4.5 million years", "450 million years", "10 000 years"],
    hint: "Radiometric dating of Earth's oldest rocks and meteorites gives about 4.54 billion years.",
  },
  {
    prompt: "Oral histories of some Indigenous peoples along the Pacific coast describe a great earthquake and flood long ago. Scientists matched these with geological evidence and written tsunami records from Japan to date the Cascadia earthquake to January 1700. What does this show?",
    right: "Oral histories can preserve accurate information about real events",
    wrong: ["Oral histories can never be trusted", "Only written records count as evidence", "All Indigenous peoples tell the same story"],
    hint: "Different lines of evidence can support each other. Oral histories, geology and written records all pointed to the same event.",
    emoji: "🌊",
  },
  {
    prompt: "Why is the Pacific coast of North America prone to earthquakes and volcanoes?",
    right: "It lies along plate boundaries where tectonic plates collide or slide past each other",
    wrong: ["It is far from any plates", "Because of ocean tides", "Because of the Moon's gravity only"],
    hint: "Plates move a few centimetres a year. Where they meet, stress builds up and is released as earthquakes and magma rises.",
    hard: true,
  },
];

function rocksUnit(opts?: GenerateOptions): Question[] {
  const d = lv(opts);
  return mix(d, ROCK_BANK, 4, [deepTimeOrder, layersAgeOrder, halfLifeQ, massLeftQ], 3, [sortQuestion(ROCK_SORT, 2)]);
}

// ---------- Earth sciences: atmosphere and oceans ----------

const ATMOS_LAYERS = ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"];

function layersOrder(d: Level): OrderQuestion {
  return ordered(
    "Put the layers of the atmosphere in order from the ground up.",
    "From the surface: troposphere (weather happens here), stratosphere (ozone layer), mesosphere, thermosphere.",
    ATMOS_LAYERS,
    d,
    d === 1 ? 3 : 4,
  );
}

function lapseQ(): Question {
  const T0 = randInt(10, 28);
  const h = pick([1, 2, 3, 4, 5, 6]);
  const drop = 6.5 * h;
  const T = T0 - drop;
  return inputQ(
    `Ground-level air is ${T0}°C. In the troposphere the air cools by about 6.5°C per kilometre of altitude. What is the temperature at ${h} km?`,
    T,
    `Cooling = 6.5 × ${h} = ${fmt(drop, 1)}°C. Subtract from ${T0}°C.`,
    { suffix: "°C", keypad: "decimal", dp: 1 },
  );
}

function climateTableQ(d: Level): Question {
  const months = ["Jan", "Mar", "May", "Jul", "Sep", "Nov"];
  const base = randInt(-5, 8);
  const amp = randInt(12, 22);
  const temps = months.map((_, i) => Math.round(base + amp * (0.5 - 0.5 * Math.cos((i * 2 * Math.PI) / 6 + (Math.PI * 0)))) + randInt(-1, 1));
  // temps peak in the middle of the list (July): keep it simple and unique.
  const maxT = Math.max(...temps);
  const minT = Math.min(...temps);
  if (temps.filter((t) => t === maxT).length > 1 || temps.filter((t) => t === minT).length > 1) return climateTableQ(d);
  const visual: Visual = {
    type: "table",
    title: "Average monthly temperature (°C) for a city",
    headers: ["Month", ...months],
    rows: [["Temp (°C)", ...temps]],
  };
  if (d === 1) {
    const warmest = months[temps.indexOf(maxT)];
    return textChoice(
      "According to the table, which month is the warmest?",
      warmest,
      months.filter((m) => m !== warmest).slice(0, 3),
      "Look along the row for the highest temperature.",
      visual,
    );
  }
  return inputQ(
    "What is the temperature range (warmest value minus coldest value) shown in the table, in °C?",
    maxT - minT,
    `Range = highest − lowest = ${maxT} − (${minT}).`,
    { suffix: "°C", visual },
  );
}

function salinityQ(d: Level): Question {
  const kg = pick([2, 4, 5, 10, 20]);
  const salt = 35 * kg;
  if (d === 1)
    return inputQ(`Seawater averages about 35 g of dissolved salts in each kilogram. How many grams of salts are in ${kg} kg of seawater?`, salt, `Multiply: 35 × ${kg}.`, { suffix: "g" });
  const ppt = 35;
  return numMC(
    `A sample of ${kg} kg of seawater is evaporated, leaving ${salt} g of salts. What is the salinity in grams of salt per kilogram of seawater?`,
    ppt,
    [salt, ppt / 10, ppt * 10, salt * kg],
    `Salinity = mass of salts ÷ mass of water: ${salt} ÷ ${kg}.`,
    { suffix: " g/kg", f: (x) => fmt(x, 1) },
  );
}

const WEATHER_SORT: SortSet = {
  prompt: "Weather or climate? Sort each statement.",
  hint: "Weather is what the atmosphere is doing at a particular time and place. Climate is the average pattern over 30 or more years.",
  bins: [
    { id: "weather", label: "weather", emoji: "🌦️" },
    { id: "climate", label: "climate", emoji: "🗺️" },
  ],
  items: [
    { label: "It is raining right now", emoji: "🌧️", bin: "weather" },
    { label: "Tomorrow's high will be 14°C", emoji: "🌡️", bin: "weather" },
    { label: "A windstorm hit last night", emoji: "💨", bin: "weather" },
    { label: "Fog covered the harbour this morning", emoji: "🌫️", bin: "weather" },
    { label: "Winters here are mild and wet", emoji: "🗺️", bin: "climate" },
    { label: "The average July temperature is 22°C", emoji: "📊", bin: "climate" },
    { label: "This region gets 300 mm of rain a year on average", emoji: "📈", bin: "climate" },
    { label: "Deserts are dry and hot over decades", emoji: "🏜️", bin: "climate" },
  ],
};

const ATMOS_BANK: Item[] = [
  {
    prompt: "What are the two most abundant gases in dry air, by volume?",
    right: "Nitrogen (about 78%) and oxygen (about 21%)",
    wrong: ["Oxygen and carbon dioxide", "Nitrogen and carbon dioxide", "Hydrogen and helium"],
    hint: "Carbon dioxide makes up only about 0.04% of the air, even though it matters a lot for climate.",
  },
  {
    prompt: "Which layer of the atmosphere contains most of the weather?",
    right: "Troposphere",
    wrong: ["Stratosphere", "Mesosphere", "Thermosphere"],
    hint: "The troposphere is the lowest layer and holds most of the air and water vapour.",
  },
  {
    prompt: "The ozone layer is mostly found in which layer, and what does it do?",
    right: "The stratosphere; it absorbs much of the Sun's harmful ultraviolet radiation",
    wrong: ["The troposphere; it traps heat", "The mesosphere; it makes rain", "The thermosphere; it produces oxygen"],
    hint: "Ozone absorbs UV radiation, protecting living things from damage.",
  },
  {
    prompt: "How do greenhouse gases warm Earth?",
    right: "They absorb and re-emit heat radiated from Earth's surface, slowing heat loss to space",
    wrong: ["They create heat from nothing", "They block all sunlight", "They make the Sun hotter"],
    hint: "Sunlight warms the surface; the surface radiates heat; greenhouse gases like CO₂ and methane trap part of it.",
  },
  {
    prompt: "Air generally moves from where to where?",
    right: "From high pressure to low pressure",
    wrong: ["From low pressure to high pressure", "From cold to cold", "In a straight line from the equator to the pole"],
    hint: "Wind is air moving to balance a pressure difference.",
    emoji: "💨",
  },
  {
    prompt: "A low-pressure system usually brings…",
    right: "clouds and precipitation",
    wrong: ["clear skies and calm weather", "no weather at all", "only high temperatures"],
    hint: "Air rises in a low, cools, and its water vapour condenses into clouds.",
  },
  {
    prompt: "Why do Earth's winds curve instead of travelling straight?",
    right: "Earth's rotation deflects them (the Coriolis effect)",
    wrong: ["The Moon pulls on them", "They bounce off mountains only", "The Sun heats them unevenly in a spiral"],
    hint: "Because Earth spins, moving air is deflected to the right in the Northern Hemisphere and to the left in the Southern.",
  },
  {
    prompt: "At a cold front, cold dense air moves under warm air. What weather often follows?",
    right: "Showers or thunderstorms, then cooler, clearer air",
    wrong: ["Warm, steady rain for days", "No change at all", "Fog and no wind"],
    hint: "The warm air is forced up quickly, forming tall clouds. Behind the front, temperatures drop.",
    hard: true,
  },
  {
    prompt: "Ocean currents like the Gulf Stream move warm water toward higher latitudes. How does this affect climate?",
    right: "It makes coastal regions warmer than other places at the same latitude",
    wrong: ["It makes them colder", "It has no effect", "It causes earthquakes"],
    hint: "Oceans store and transport heat, moderating the climate of nearby land.",
  },
  {
    prompt: "What causes the ocean's tides?",
    right: "The gravitational pull of the Moon and, to a lesser degree, the Sun",
    wrong: ["Wind only", "Earth's magnetic field", "The ocean's salt"],
    hint: "Gravity pulls water toward the Moon, creating bulges. As Earth rotates, coasts pass through them.",
  },
  {
    prompt: "As the ocean absorbs more CO₂ from the atmosphere, what happens to the water?",
    right: "It becomes more acidic, making it harder for shell-building animals",
    wrong: ["It becomes more basic", "It gets saltier", "Nothing changes"],
    hint: "CO₂ dissolves to form carbonic acid, lowering pH and reducing the carbonate shells need.",
    hard: true,
  },
  {
    prompt: "Which two processes contribute most to current sea-level rise?",
    right: "Melting land ice and thermal expansion of warming seawater",
    wrong: ["Melting sea ice and more rainfall", "Stronger tides and more fish", "Underwater volcanoes only"],
    hint: "Warm water expands. Melting glaciers and ice sheets add water. Floating sea ice doesn't raise sea level when it melts.",
    hard: true,
  },
  {
    prompt: "Along some coasts, cold deep water rises to the surface (upwelling). Why does this support rich fisheries?",
    right: "The deep water brings nutrients that feed plankton",
    wrong: ["It brings warm water", "It adds fish from deep trenches", "It lowers salinity to zero"],
    hint: "Nutrients sink with dead material. Upwelling returns them to sunlit water where plankton grow, feeding the food web.",
    hard: true,
  },
  {
    prompt: "Which is the best example of how climate differs from weather?",
    right: "A single cold day does not show that the climate has stopped warming",
    wrong: ["Weather is the average of climate", "Climate changes every hour", "A cold day proves nothing about anything"],
    hint: "Climate is a long-term pattern (30 years or more). One day is weather.",
    hard: true,
  },
];

function atmosphereUnit(opts?: GenerateOptions): Question[] {
  const d = lv(opts);
  return mix(d, ATMOS_BANK, 4, [layersOrder, lapseQ, climateTableQ, salinityQ], 3, [sortQuestion(WEATHER_SORT, perBin(d))]);
}

// ---------- Course ----------

export const course: Course = {
  grade: "11",
  subject: "science",
  bigIdeas: {
    "ca-bc": [
      "Chemistry 11: The mole is a quantity used to count particles that are too small to see, so we can relate mass, particles and amount.",
      "Chemistry 11: Solutions are homogeneous mixtures, and their concentration describes how much solute is in a given amount of solution.",
      "Chemistry 11: Chemical reactions follow predictable ratios that can be used to calculate the amounts of reactants and products.",
      "Physics 11: Motion can be described and predicted with quantities such as displacement, velocity and acceleration.",
      "Physics 11: Forces cause changes in motion, and energy is transformed and conserved when work is done.",
      "Life Sciences 11: Evolution occurs over generations as natural selection acts on genetic variation in populations.",
      "Life Sciences 11: Organisms are classified by shared characteristics and evolutionary relationships, and microbes play important roles in ecosystems and health.",
      "Life Sciences 11: Ecosystems are shaped by interactions among organisms and their environment, and Indigenous knowledge of local places is a valuable way of understanding them.",
      "Earth Sciences 11: Earth's history is recorded in rocks and fossils and is measured in deep time.",
      "Earth Sciences 11: The atmosphere and oceans interact to produce weather and climate, and are changing due to human activity.",
    ],
  },
  units: [
    {
      id: "chem-mole",
      title: "Chem: The Mole",
      emoji: "🧪",
      blurb: "Count atoms by weighing them",
      parentNote:
        "Chemistry 11. Molar mass, converting between mass, moles and number of particles, and using Avogadro's constant.",
      standards: { "ca-bc": "Chemistry 11: the mole, molar mass and Avogadro's constant; conversions between mass, amount and number of particles" },
      generate: moleUnit,
    },
    {
      id: "chem-solutions",
      title: "Chem: Solutions & Reactions",
      emoji: "⚗️",
      blurb: "Molarity, dilution and mole ratios",
      parentNote:
        "Chemistry 11. Concentration in mol/L, dilution with c₁V₁ = c₂V₂, balancing equations, and using mole ratios in reactions.",
      standards: { "ca-bc": "Chemistry 11: solution chemistry and concentration; stoichiometry and balanced chemical equations" },
      generate: solutionUnit,
    },
    {
      id: "phys-kinematics",
      title: "Physics: Motion",
      emoji: "🚀",
      blurb: "Velocity, acceleration and graphs",
      parentNote:
        "Physics 11. Uniform motion, acceleration, the equations of motion, free fall with g = 9.8 m/s², and reading position–time and velocity–time graphs.",
      standards: { "ca-bc": "Physics 11: kinematics: displacement, velocity and acceleration; uniform and accelerated motion; graphical analysis" },
      generate: kinematicsUnit,
    },
    {
      id: "phys-forces-energy",
      title: "Physics: Forces & Energy",
      emoji: "⚡",
      blurb: "Newton's laws, work and power",
      parentNote:
        "Physics 11. Newton's three laws, weight and friction, work, power, and kinetic and potential energy with conservation of energy.",
      standards: { "ca-bc": "Physics 11: dynamics, forces and Newton's laws; work, energy and power; conservation of energy" },
      generate: forcesUnit,
    },
    {
      id: "life-evolution",
      title: "Life: Evolution",
      emoji: "🦎",
      blurb: "How populations change over time",
      parentNote:
        "Life Sciences 11. Natural selection, mutation and variation, evidence for evolution and how new species form.",
      standards: { "ca-bc": "Life Sciences 11: evolution by natural selection; evidence of evolution; speciation and adaptation" },
      generate: evolutionUnit,
    },
    {
      id: "life-classification",
      title: "Life: Taxonomy & Microbes",
      emoji: "🦠",
      blurb: "Naming life, bacteria and viruses",
      parentNote:
        "Life Sciences 11. The three domains and taxonomic ranks, scientific names, how bacteria and viruses differ, and antibiotic resistance.",
      standards: { "ca-bc": "Life Sciences 11: classification and taxonomy; microbiology: bacteria, archaea and viruses; antibiotic resistance" },
      generate: classificationUnit,
    },
    {
      id: "life-ecology",
      title: "Life: Ecology",
      emoji: "🌲",
      blurb: "Populations, ecosystems and stewardship",
      parentNote:
        "Life Sciences 11. Population growth and carrying capacity, symbiosis, energy flow, biodiversity and how Indigenous knowledge and stewardship contribute to caring for ecosystems.",
      standards: { "ca-bc": "Life Sciences 11: ecology: populations, carrying capacity, symbiosis, energy flow and biodiversity; Indigenous knowledge and stewardship" },
      generate: ecologyUnit,
    },
    {
      id: "earth-rocks-time",
      title: "Earth: Rocks & Deep Time",
      emoji: "🪨",
      blurb: "Minerals, fossils and Earth's age",
      parentNote:
        "Earth Sciences 11. Minerals and the rock cycle, relative and radiometric dating, geological time, and how oral histories and geology can support each other.",
      standards: { "ca-bc": "Earth Sciences 11: minerals and rocks; the rock cycle; geological time and dating methods; plate tectonics" },
      generate: rocksUnit,
    },
    {
      id: "earth-atmosphere-oceans",
      title: "Earth: Atmosphere & Oceans",
      emoji: "🌊",
      blurb: "Weather, climate and the sea",
      parentNote:
        "Earth Sciences 11. Layers and composition of the atmosphere, pressure and fronts, weather versus climate, ocean currents, tides, salinity and ocean change.",
      standards: { "ca-bc": "Earth Sciences 11: atmosphere and weather systems; climate; oceans and ocean-atmosphere interactions" },
      generate: atmosphereUnit,
    },
  ],
};
