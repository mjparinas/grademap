import { chance, pick, randInt, sample, shuffle, textChoice } from "../../random";
import type { Course, GenerateOptions, InputQuestion, OrderQuestion, Question, Visual } from "../../types";
import { fromBank, sortQuestion, type BankItem, type SortSet } from "../../bank";

// Bank items marked `hard` are stretch questions. Difficulty 1 uses only the
// easier items, 2 mixes in about a third, 3 is mostly stretch.
type Item = BankItem & { hard?: true };
type Level = 1 | 2 | 3;

function levelled(bank: Item[], count: number, difficulty: Level): Question[] {
  if (count <= 0) return [];
  const easy = bank.filter((b) => !b.hard);
  const hard = bank.filter((b) => b.hard);
  const want = difficulty === 1 ? 0 : difficulty === 2 ? Math.ceil(count / 3) : Math.ceil((count * 2) / 3);
  const nHard = Math.min(want, hard.length);
  return [...fromBank(easy, count - nHard), ...fromBank(hard, nHard)];
}

/** Two-basket sorts: 6 items at difficulty 1, 8 at 2 and 3. */
const perBin = (difficulty: Level) => (difficulty === 1 ? 3 : 4);

/** Keep `n` of the events (listed in the correct order), still in order. */
function keepInOrder<T>(events: T[], n: number): T[] {
  const idx = sample(
    events.map((_, i) => i),
    n,
  ).sort((a, b) => a - b);
  return idx.map((i) => events[i]);
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const SUPS = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const SUBS = "₀₁₂₃₄₅₆₇₈₉";
const sup = (n: number) =>
  (n < 0 ? "⁻" : "") +
  String(Math.abs(n))
    .split("")
    .map((d) => SUPS[Number(d)])
    .join("");
/** "C3H8" → "C₃H₈", "Ca(OH)2" → "Ca(OH)₂". */
const pretty = (f: string) => f.replace(/(?<=[A-Za-z)])(\d+)/g, (m) => m.replace(/\d/g, (d) => SUBS[Number(d)]));
/** Format a number without float noise or a trailing ".0". */
const fmt = (n: number, places = 2) => String(Number(n.toFixed(places)));
/** Group digits in threes with spaces (Canadian style) for numbers of five or more digits. */
function group(n: number): string {
  const s = String(n);
  return s.length >= 5 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : s;
}

/** A multiple-choice question from one right answer and a pool of wrong ones (deduplicated). */
function mcq(prompt: string, correct: string, wrongs: string[], hint: string, visual?: Visual, maxWrong = 3): Question {
  const w = [...new Set(wrongs)].filter((x) => x !== correct);
  return textChoice(prompt, correct, shuffle(w).slice(0, maxWrong), hint, visual);
}

function typed(
  prompt: string,
  answer: string,
  hint: string,
  keypad: InputQuestion["keypad"],
  extra: { suffix?: string; visual?: Visual; accept?: string[] } = {},
): InputQuestion {
  return { kind: "input", prompt, answer, hint, keypad, ...extra };
}

// ---------- Scientific Inquiry and Measurement ----------

const CONVERSIONS = [
  { big: "km", small: "m", f: 1000 },
  { big: "m", small: "cm", f: 100 },
  { big: "cm", small: "mm", f: 10 },
  { big: "m", small: "mm", f: 1000 },
  { big: "kg", small: "g", f: 1000 },
  { big: "g", small: "mg", f: 1000 },
  { big: "L", small: "mL", f: 1000 },
];

function unitConversion(d: Level): Question {
  if (d === 3 && chance(0.4)) {
    const v = pick([5, 10, 15, 20, 25, 30]);
    const kmh = (v * 36) / 10;
    return chance(0.5)
      ? typed(
          `A cyclist travels at ${kmh} km/h. What is that speed in m/s?`,
          String(v),
          "1 km = 1000 m and 1 h = 3600 s, so divide km/h by 3.6 to get m/s.",
          "number",
          { suffix: "m/s" },
        )
      : typed(
          `A runner moves at ${v} m/s. What is that speed in km/h?`,
          String(kmh),
          "Multiply m/s by 3.6 to get km/h (3600 s in an hour ÷ 1000 m in a km).",
          "number",
          { suffix: "km/h" },
        );
  }
  const c = pick(CONVERSIONS);
  const tenths = d === 1 ? randInt(2, 9) * 10 : randInt(12, 95);
  const whole = tenths % 10 === 0;
  const x = whole ? String(tenths / 10) : (tenths / 10).toFixed(1);
  const y = String((tenths * c.f) / 10);
  const toSmall = d === 1 ? true : chance(0.5);
  if (toSmall) {
    return typed(
      `Convert ${x} ${c.big} to ${c.small}.`,
      y,
      `1 ${c.big} = ${c.f} ${c.small}. Going to a smaller unit gives a bigger number, so multiply by ${c.f}.`,
      "decimal",
      { suffix: c.small },
    );
  }
  return typed(
    `Convert ${y} ${c.small} to ${c.big}.`,
    x,
    `1 ${c.big} = ${c.f} ${c.small}. Going to a bigger unit gives a smaller number, so divide by ${c.f}.`,
    "decimal",
    { suffix: c.big },
  );
}

function sciNotation(d: Level): Question {
  const small = d > 1 && chance(0.4);
  let t = randInt(11, 99);
  while (t % 10 === 0) t = randInt(11, 99);
  const e = small ? -randInt(2, 6) : randInt(3, d === 1 ? 6 : 8);
  const mant = (t / 10).toFixed(1);
  const standard = small ? "0." + String(t).padStart(1 - e, "0") : group(t * 10 ** (e - 1));
  const correct = `${mant} × 10${sup(e)}`;
  if (!small && d === 3 && chance(0.5)) {
    return typed(
      `Write ${correct} in standard form.`,
      String(t * 10 ** (e - 1)),
      `The exponent ${e} means move the decimal point ${e} places to the right, adding zeros as needed.`,
      "number",
    );
  }
  return mcq(
    `Write ${standard} in scientific notation.`,
    correct,
    [
      `${mant} × 10${sup(e + 1)}`,
      `${mant} × 10${sup(e - 1)}`,
      `${t} × 10${sup(e - 1)}`,
      `${mant} × 10${sup(-e)}`,
    ],
    `Move the decimal point until there is one non-zero digit in front of it (${mant}). Count the moves: that is the exponent, positive for large numbers and negative for numbers below 1.`,
  );
}

function trialsQuestion(d: Level): Question {
  const thing = pick([
    { what: "a pendulum's swing time", unit: "s" },
    { what: "the length of a lab bench", unit: "m" },
    { what: "the mass of a rock sample", unit: "g" },
    { what: "the time for a toy car to roll down a ramp", unit: "s" },
  ]);
  const m = randInt(100, 400);
  const o1 = randInt(1, 4);
  const o2 = randInt(-4, 3);
  const vals = shuffle([m + o1, m + o2, m - o1 - o2]);
  const strs = vals.map((v) => (v / 10).toFixed(1));
  const visual: Visual = {
    type: "table",
    title: `Three trials: ${thing.what}`,
    headers: ["Trial", `Result (${thing.unit})`],
    rows: strs.map((s, i) => [i + 1, s]),
  };
  if (d === 3) {
    const range = Math.max(...vals) - Math.min(...vals);
    const u = fmt(range / 20);
    return typed(
      `A scientist reports the mean ± half the range. What is the ± uncertainty for these trials?`,
      u,
      `Subtract the smallest result from the largest to get the range (${range / 10}), then divide by 2.`,
      "decimal",
      { suffix: thing.unit, visual },
    );
  }
  return typed(
    `What is the mean (average) of the three trials?`,
    fmt(m / 10),
    `Add the three results and divide by 3. Repeating trials and averaging reduces the effect of random errors.`,
    "decimal",
    { suffix: thing.unit, visual, accept: [(m / 10).toFixed(1)] },
  );
}

function slopeQuestion(d: Level): Question {
  const k = randInt(2, 6);
  if (d === 1) {
    return typed(
      "The cart moves at a steady speed. How many metres does it travel in each second?",
      String(k),
      "Pick two rows and find how much the distance changes ÷ how much the time changes. That rate is the slope of the graph.",
      "number",
      {
        visual: {
          type: "table",
          title: "Distance travelled by a battery-powered cart",
          headers: ["Time (s)", "Distance (m)"],
          rows: [1, 2, 3, 4, 5].map((x) => [x, x * k]),
        },
      },
    );
  }
  const b = d === 3 ? randInt(1, 4) : 0;
  const pts = [0, 1, 2, 3, 4, 5].map((x) => ({ x, y: k * x + b }));
  return typed(
    "What is the slope of the line (the rate of change in y per 1 unit of x)?",
    String(k),
    "Choose two points on the line. Slope = (change in y) ÷ (change in x). Count the rise over the run.",
    "number",
    {
      visual: {
        type: "plot",
        xMin: 0,
        xMax: 5,
        yMin: 0,
        yMax: 5 * k + b,
        curves: [{ points: pts.map((p) => ({ ...p })) }],
        points: [pts[1], pts[3]].map((p) => ({ ...p, label: `(${p.x}, ${p.y})` })),
      },
    },
  );
}

const INQUIRY_BANK: Item[] = [
  {
    prompt: "A student tests how water temperature affects how fast sugar dissolves. What is the independent variable?",
    right: "The temperature of the water",
    wrong: ["The time the sugar takes to dissolve", "The amount of sugar", "The type of cup"],
    hint: "The independent variable is the one you deliberately change. Here the student changes the water temperature.",
    emoji: "🧪",
  },
  {
    prompt: "A student tests how water temperature affects how fast sugar dissolves. What is the dependent variable?",
    right: "The time the sugar takes to dissolve",
    wrong: ["The temperature of the water", "The mass of sugar used", "The volume of water"],
    hint: "The dependent variable is what you measure to see the effect. It depends on what you changed.",
    emoji: "⏱️",
  },
  {
    prompt: "In the sugar and water experiment, which of these must be kept the same (a controlled variable)?",
    right: "The mass of sugar and the volume of water",
    wrong: ["The temperature of the water", "The time to dissolve", "The result the student expects"],
    hint: "Controlled variables are everything except the independent variable. Keeping them the same makes the test fair.",
  },
  {
    prompt: "A group tests how the amount of light affects the height of bean seedlings after 10 days. What is the dependent variable?",
    right: "The height of the seedlings",
    wrong: ["The amount of light", "The number of days", "The type of soil"],
    hint: "Ask what you measure at the end. Height is the result that responds to the change in light.",
    emoji: "🌱",
  },
  {
    prompt: "Which hypothesis is written in a testable 'If … then … because …' form?",
    right: "If the ramp is steeper, then the cart will be faster at the bottom, because more gravitational energy changes to motion",
    wrong: [
      "Steep ramps are better",
      "Carts are fun to roll down ramps",
      "The cart will go fast because I like it",
    ],
    hint: "A good hypothesis names what you will change, what you will measure, and gives a reason that can be tested.",
  },
  {
    prompt: "Why do scientists repeat their trials?",
    right: "To reduce the effect of random error and check results are reliable",
    wrong: ["To make sure they get exactly the same number every time", "To prove their hypothesis is right", "Because one trial is never allowed"],
    hint: "Repeating gives more data. Averaging smooths out random variation, and consistent results give more confidence.",
  },
  {
    prompt: "A ruler is marked in millimetres. A common way to state the reading uncertainty is:",
    right: "± 0.5 mm, half of the smallest division",
    wrong: ["± 0 mm, because rulers are exact", "± 10 mm", "± 5 cm"],
    hint: "You can usually estimate between the lines, so the uncertainty is about half of the smallest marked division.",
    emoji: "📏",
  },
  {
    prompt: "Which pair of results shows precise but not accurate measuring? (True mass is 50.0 g.)",
    right: "42.1 g, 42.0 g, 42.2 g",
    wrong: ["49.9 g, 50.1 g, 50.0 g", "46 g, 55 g, 51 g", "50.0 g, 50.0 g, 50.1 g"],
    hint: "Precise means the results are close to each other. Accurate means they are close to the true value. These are tightly grouped but far from 50.0 g.",
    hard: true,
  },
  {
    prompt: "Which type of graph is best for showing how a temperature changes over time?",
    right: "A line graph",
    wrong: ["A pie chart", "A bar graph of one single day", "A pictograph"],
    hint: "Time is continuous, and a line graph shows trends between points as time passes.",
    emoji: "📈",
  },
  {
    prompt: "On a graph of an experiment, which variable usually goes on the x-axis (horizontal)?",
    right: "The independent variable",
    wrong: ["The dependent variable", "The controlled variables", "The conclusion"],
    hint: "Convention: independent variable on x, dependent variable on y. The y value 'depends on' x.",
  },
  {
    prompt: "How many significant digits are in the measurement 0.0450 g?",
    right: "3",
    wrong: ["2", "4", "5"],
    hint: "Leading zeros are placeholders and do not count. The 4, 5 and the final 0 do count, because it shows the balance measured to that place.",
    hard: true,
  },
  {
    prompt: "What is the difference between a scientific law and a theory?",
    right: "A law describes a pattern; a theory explains why it happens",
    wrong: ["A theory is just a guess; a law is proven", "A law is always right and a theory is not tested", "Theories become laws after enough evidence"],
    hint: "Both are well-supported. Laws describe what happens (often in an equation); theories explain why, using many lines of evidence.",
    hard: true,
  },
  {
    prompt: "What does peer review do?",
    right: "Other experts check the methods and conclusions before research is published",
    wrong: ["Friends vote on whether the results are popular", "The scientist's own team repeats the study", "It guarantees the research is perfect"],
    hint: "Peer review adds quality control: independent experts look for errors and unsupported claims.",
  },
  {
    prompt: "The base SI unit of mass is the:",
    right: "kilogram (kg)",
    wrong: ["gram (g)", "newton (N)", "litre (L)"],
    hint: "Unusually, the kilogram, not the gram, is the base unit. Newtons measure force and litres measure volume.",
  },
  {
    prompt: "Two students measure the same table. One gets 120.4 cm and the other 119.8 cm. What is the best way to improve confidence in the measurement?",
    right: "Take more measurements and compare the mean and the spread",
    wrong: ["Choose the larger value", "Choose the value that looks neater", "Ignore the difference; both are exactly right"],
    hint: "Differences are expected. More measurements and a mean with its uncertainty give a better estimate.",
    hard: true,
  },
];

function inquiry(difficulty: Level): Question[] {
  return [
    unitConversion(difficulty),
    unitConversion(difficulty),
    sciNotation(difficulty),
    trialsQuestion(difficulty),
    slopeQuestion(difficulty),
    ...levelled(INQUIRY_BANK, 3, difficulty),
  ];
}

// ---------- DNA and Protein Synthesis ----------

const DNA_PAIR: Record<string, string> = { A: "T", T: "A", G: "C", C: "G" };
const RNA_PAIR: Record<string, string> = { A: "U", T: "A", G: "C", C: "G" };
const BASES = ["A", "T", "G", "C"];

function randomDna(n: number): string {
  let s = "";
  for (let i = 0; i < n; i++) s += pick(BASES);
  return s;
}

/** Wrong strands built from typical mistakes; the caller removes the correct one. */
function strandWrongs(seq: string, correct: string, rna: boolean): string[] {
  const alphabet = rna ? ["A", "U", "G", "C"] : BASES;
  const out: string[] = [];
  // Reversed original, or the original itself.
  out.push(seq.split("").reverse().join(""));
  out.push(seq);
  // Pairs A with G and C with T (mixing up purines and pyrimidines)
  out.push(
    seq
      .split("")
      .map((b) => ({ A: "G", G: "A", T: "C", C: "T" })[b] as string)
      .join(""),
  );
  // Correct strand with one or two bases wrong
  for (let k = 0; k < 6; k++) {
    const arr = correct.split("");
    const i = randInt(0, arr.length - 1);
    arr[i] = pick(alphabet.filter((b) => b !== arr[i]));
    out.push(arr.join(""));
  }
  // For RNA, the common slip is writing T instead of U.
  if (rna) out.push(correct.replace(/U/g, "T"));
  else out.push(correct.replace(/T/g, "U"));
  return out.filter((s) => s !== correct);
}

function complementQuestion(d: Level): Question {
  const n = d === 1 ? 5 : d === 2 ? 6 : 8;
  const seq = randomDna(n);
  const correct = seq
    .split("")
    .map((b) => DNA_PAIR[b])
    .join("");
  return mcq(
    `One strand of a DNA molecule reads ${seq}. What is the base sequence of the complementary strand?`,
    correct,
    strandWrongs(seq, correct, false),
    "Match each base using the pairing rule: A pairs with T, and C pairs with G. Go one base at a time.",
  );
}

function transcriptionQuestion(d: Level): Question {
  const n = d === 1 ? 6 : d === 2 ? 6 : 9;
  const seq = randomDna(n);
  const correct = seq
    .split("")
    .map((b) => RNA_PAIR[b])
    .join("");
  return mcq(
    `During transcription, mRNA is made from the DNA template strand ${seq}. What is the mRNA sequence?`,
    correct,
    strandWrongs(seq, correct, true),
    "RNA uses the same pairing as DNA except that it has uracil (U) in place of thymine (T): A→U, T→A, G→C, C→G.",
  );
}

const CODONS: Record<string, string> = {
  AUG: "Met",
  UUU: "Phe",
  UUC: "Phe",
  GGC: "Gly",
  GGU: "Gly",
  GCU: "Ala",
  GCC: "Ala",
  AAA: "Lys",
  AAG: "Lys",
  GAA: "Glu",
  GAC: "Asp",
  GAU: "Asp",
  UGG: "Trp",
  CCC: "Pro",
  CCU: "Pro",
  UAC: "Tyr",
  GUU: "Val",
  CUG: "Leu",
  CUU: "Leu",
  AGC: "Ser",
  CAU: "His",
  CAC: "His",
  UGU: "Cys",
  ACU: "Thr",
  AAU: "Asn",
  CAA: "Gln",
  AUU: "Ile",
  CGU: "Arg",
  UAA: "Stop",
  UAG: "Stop",
  UGA: "Stop",
};
const AMINO_NAME: Record<string, string> = {
  Met: "methionine",
  Phe: "phenylalanine",
  Gly: "glycine",
  Ala: "alanine",
  Lys: "lysine",
  Glu: "glutamic acid",
  Asp: "aspartic acid",
  Trp: "tryptophan",
  Pro: "proline",
  Tyr: "tyrosine",
  Val: "valine",
  Leu: "leucine",
  Ser: "serine",
  His: "histidine",
  Cys: "cysteine",
  Thr: "threonine",
  Asn: "asparagine",
  Gln: "glutamine",
  Ile: "isoleucine",
  Arg: "arginine",
  Stop: "stop signal",
};
const SENSE_CODONS = Object.keys(CODONS).filter((c) => CODONS[c] !== "Stop" && c !== "AUG");

function codonTable(codons: string[]): Visual {
  return {
    type: "table",
    title: "Part of the genetic code (mRNA codons)",
    headers: ["Codon", "Amino acid"],
    rows: [...new Set(codons)].sort().map((c) => [c, CODONS[c] === "Stop" ? "Stop" : `${CODONS[c]} (${AMINO_NAME[CODONS[c]]})`]),
  };
}

function translationQuestion(d: Level): Question {
  const n = d === 1 ? 2 : 3;
  // One codon per distinct amino acid so the chain is unambiguous.
  const chosen: string[] = [];
  const used = new Set<string>();
  for (const c of shuffle(SENSE_CODONS)) {
    if (!used.has(CODONS[c])) {
      used.add(CODONS[c]);
      chosen.push(c);
    }
    if (chosen.length === n) break;
  }
  const start = d === 3;
  const seq = start ? ["AUG", ...chosen.slice(0, 2)] : chosen;
  const aminos = seq.map((c) => CODONS[c]);
  const extra = sample(SENSE_CODONS, 2);
  const visual = codonTable([...seq, ...extra]);
  const fmtChain = (a: string[]) => a.join(" – ");
  const other = (a: string) => pick(Object.values(CODONS).filter((x) => x !== a && x !== "Stop"));
  const wrongs = [
    fmtChain([...aminos].reverse()),
    fmtChain([other(aminos[0]), ...aminos.slice(1)]),
    fmtChain([...aminos.slice(0, -1), other(aminos[aminos.length - 1])]),
    fmtChain(aminos.map((a, i) => (i === 1 ? other(a) : a))),
  ];
  return mcq(
    `A ribosome reads the mRNA ${seq.join(" ")}. Using the table, which chain of amino acids is built?`,
    fmtChain(aminos),
    wrongs,
    "Read the mRNA in groups of three bases (codons), left to right. Look up each codon in the table. Each codon codes for one amino acid.",
    visual,
  );
}

function mutationQuestion(d: Level): Question {
  const all = Object.keys(CODONS);
  for (let tries = 0; tries < 200; tries++) {
    const c1 = pick(all);
    const pos = randInt(0, 2);
    const c2 = c1.slice(0, pos) + pick(["A", "U", "G", "C"].filter((b) => b !== c1[pos])) + c1.slice(pos + 1);
    if (!(c2 in CODONS) || CODONS[c1] === "Stop") continue;
    const a1 = CODONS[c1];
    const a2 = CODONS[c2];
    const kind = a2 === "Stop" ? "nonsense" : a1 === a2 ? "silent" : "missense";
    if (d === 1 && kind === "nonsense") continue;
    const text: Record<string, string> = {
      silent: "Silent: the same amino acid is made, so the protein does not change",
      missense: "Missense: a different amino acid is placed in the protein",
      nonsense: "Nonsense: the codon becomes a stop signal and the protein ends early",
      frame: "Frameshift: every codon after this point is read differently",
    };
    const wrongs = Object.keys(text)
      .filter((k) => k !== kind)
      .map((k) => text[k]);
    return mcq(
      `A single-base substitution changes an mRNA codon from ${c1} to ${c2}. Using the table, what kind of mutation is this?`,
      text[kind],
      wrongs,
      "Look up both codons. Same amino acid → silent. A different amino acid → missense. A stop codon appearing early → nonsense. A substitution swaps one base, so the reading frame stays the same.",
      codonTable([c1, c2]),
    );
  }
  // Fallback that always works.
  return mcq(
    "A single-base substitution changes the codon UAC (tyrosine) to UAA (stop). What kind of mutation is this?",
    "Nonsense: the codon becomes a stop signal and the protein ends early",
    ["Silent: the same amino acid is made, so the protein does not change", "Missense: a different amino acid is placed in the protein"],
    "UAA is a stop codon, so the protein is cut short.",
  );
}

function chargaff(d: Level): Question {
  const a = pick([15, 20, 25, 30, 35]);
  const g = 50 - a;
  if (d === 1) {
    return typed(
      `In a DNA molecule, ${a}% of the bases are adenine (A). What percent are thymine (T)?`,
      String(a),
      "A always pairs with T, so there are equal amounts of A and T.",
      "number",
      { suffix: "%" },
    );
  }
  return typed(
    `In a sample of double-stranded DNA, ${a}% of the bases are adenine (A). What percent are guanine (G)?`,
    String(g),
    `A pairs with T, so T is also ${a}%. That leaves ${100 - 2 * a}% for G and C together, split equally: ${100 - 2 * a} ÷ 2 = ${g}.`,
    "number",
    { suffix: "%" },
  );
}

function proteinOrder(d: Level): OrderQuestion {
  const steps = [
    { id: "unzip", label: "The DNA double helix opens at one gene" },
    { id: "copy", label: "mRNA is built from the DNA template (transcription)" },
    { id: "leave", label: "The mRNA moves out of the nucleus" },
    { id: "ribo", label: "A ribosome attaches to the mRNA" },
    { id: "trna", label: "tRNA molecules deliver amino acids matching each codon" },
    { id: "fold", label: "The amino acid chain folds into a working protein" },
  ];
  const kept = d === 1 ? [steps[1], steps[2], steps[4], steps[5]] : d === 2 ? keepInOrder(steps, 5) : steps;
  return {
    kind: "order",
    prompt: "Put these steps of making a protein in order.",
    hint: "DNA stays in the nucleus, so a copy (mRNA) is made first. The copy travels to a ribosome, where amino acids are joined in the order the codons say.",
    items: kept,
  };
}

const DNA_RNA_SORT: SortSet = {
  prompt: "DNA or RNA? Sort each description.",
  hint: "DNA: double helix, deoxyribose sugar, bases A T G C, stores the instructions. RNA (mRNA): single strand, ribose sugar, uracil instead of thymine, carries a copy to the ribosome.",
  bins: [
    { id: "dna", label: "DNA", emoji: "🧬" },
    { id: "rna", label: "mRNA", emoji: "📨" },
  ],
  items: [
    { label: "double-stranded helix", emoji: "🧬", bin: "dna" },
    { label: "contains thymine (T)", emoji: "🅣", bin: "dna" },
    { label: "sugar is deoxyribose", emoji: "🍬", bin: "dna" },
    { label: "stores genes in the nucleus", emoji: "🏛️", bin: "dna" },
    { label: "a single strand", emoji: "🧵", bin: "rna" },
    { label: "contains uracil (U)", emoji: "🅤", bin: "rna" },
    { label: "sugar is ribose", emoji: "🍭", bin: "rna" },
    { label: "carries a gene's message to the ribosome", emoji: "📨", bin: "rna" },
  ],
};

const DNA_BANK: Item[] = [
  {
    prompt: "What are the three parts of a DNA nucleotide?",
    right: "A phosphate group, a sugar (deoxyribose) and a nitrogen base",
    wrong: ["An amino acid, a sugar and a lipid", "A protein, a phosphate group and water", "Two bases and a codon"],
    hint: "Nucleotides are the building blocks of DNA. Each has a phosphate, a sugar and one of four bases.",
    emoji: "🧬",
  },
  {
    prompt: "What holds the two strands of the DNA double helix together?",
    right: "Weak hydrogen bonds between paired bases",
    wrong: ["Strong bonds between the phosphate groups", "Ribosomes on each strand", "Amino acids linking the strands"],
    hint: "The bases in the middle of the 'ladder' pair up, and weak hydrogen bonds join A to T and C to G. Weak bonds let the strands separate to be copied.",
  },
  {
    prompt: "Which pairs of bases are correct in DNA?",
    right: "A with T, and C with G",
    wrong: ["A with G, and C with T", "A with C, and T with G", "A with U, and C with G"],
    hint: "Remember A-T and C-G. Uracil (U) is found in RNA, not DNA.",
  },
  {
    prompt: "The 1953 model of DNA as a double helix was built by Watson and Crick using evidence that included X-ray images by which scientist?",
    right: "Rosalind Franklin",
    wrong: ["Gregor Mendel", "Charles Darwin", "Louis Pasteur"],
    hint: "Rosalind Franklin's X-ray diffraction images (together with work by Maurice Wilkins) showed that DNA was a helix.",
    hard: true,
  },
  {
    prompt: "What is a gene?",
    right: "A section of DNA that carries the instructions for making a particular protein",
    wrong: ["A whole chromosome", "A single base such as A or T", "A protein that copies DNA"],
    hint: "A gene is a stretch of DNA, thousands of bases long, that codes for a product, usually a protein.",
  },
  {
    prompt: "What is a codon?",
    right: "A group of three bases in mRNA that codes for one amino acid (or a stop signal)",
    wrong: ["A group of three amino acids", "A single base in DNA", "A protein made by a ribosome"],
    hint: "The genetic code is read in triplets. Each triplet in the mRNA is a codon.",
  },
  {
    prompt: "Where in a cell are proteins assembled from amino acids?",
    right: "At ribosomes",
    wrong: ["In the nucleolus only", "Inside the DNA double helix", "In the cell wall"],
    hint: "Ribosomes read the mRNA and join amino acids in order. This step is called translation.",
  },
  {
    prompt: "What is the job of tRNA?",
    right: "To carry a specific amino acid to the ribosome and match it to a codon",
    wrong: ["To store the genes of the cell", "To copy DNA before cell division", "To break down proteins"],
    hint: "tRNA molecules are the 'delivery drivers' that match amino acids to the codons on the mRNA.",
    hard: true,
  },
  {
    prompt: "A person's skin cell and nerve cell look and work very differently. Why, if they contain the same DNA?",
    right: "Different genes are switched on in each type of cell",
    wrong: ["They contain completely different DNA", "Skin cells have extra chromosomes", "Nerve cells have no genes"],
    hint: "Almost every body cell holds the same set of genes. Each cell type uses (expresses) only the genes it needs.",
    hard: true,
  },
  {
    prompt: "How many chromosomes are in a typical human body cell?",
    right: "46 (23 pairs)",
    wrong: ["23 (11 pairs and one extra)", "92 (46 pairs)", "64 (32 pairs)"],
    hint: "We inherit 23 chromosomes from each parent, giving 23 pairs, or 46 in total.",
  },
  {
    prompt: "Which statement about mutations is most accurate?",
    right: "Mutations are changes in DNA; many have no effect, some are harmful, and a few may be helpful",
    wrong: ["All mutations are harmful", "Mutations only happen in plants", "Mutations are always inherited by children"],
    hint: "A change in a base may be silent, harmful or occasionally beneficial. Mutations are only inherited if they happen in sex cells (eggs or sperm).",
  },
  {
    prompt: "Which of these can cause a mutation?",
    right: "Ultraviolet radiation or certain chemicals, as well as copying errors",
    wrong: ["Eating a lot of protein", "Exercising", "Learning a new skill"],
    hint: "Mutagens such as UV light, X-rays and some chemicals can damage DNA. Mistakes can also happen when DNA is copied.",
  },
  {
    prompt: "In sickle cell disease, one base change in the gene for hemoglobin leads to one different amino acid. What does this show?",
    right: "A small change in DNA can change a protein's shape and function",
    wrong: ["Proteins do not depend on DNA", "Only large pieces of DNA matter", "Mutations always remove an entire gene"],
    hint: "A single changed amino acid can alter how the whole protein folds, which can change how the cell works.",
    hard: true,
  },
  {
    prompt: "Deleting one base from the middle of a gene usually has a bigger effect than swapping one base for another. Why?",
    right: "It shifts the reading frame, so every codon after the deletion is read differently",
    wrong: ["It removes the stop codon from every cell", "It turns DNA into RNA", "It adds new chromosomes"],
    hint: "Codons are read in threes. Removing one base slides all later groups of three, changing many amino acids (a frameshift).",
    hard: true,
  },
];

function dnaProteins(d: Level): Question[] {
  return [
    complementQuestion(d),
    transcriptionQuestion(d),
    translationQuestion(d),
    mutationQuestion(d),
    chargaff(d),
    proteinOrder(d),
    sortQuestion(DNA_RNA_SORT, perBin(d)),
    ...levelled(DNA_BANK, 2, d),
  ];
}

// ---------- Heredity and Genetic Technology ----------

interface Trait {
  letter: string;
  organism: string;
  trait: string;
  dom: string;
  rec: string;
}

const TRAITS: Trait[] = [
  { letter: "T", organism: "pea plant", trait: "height", dom: "tall", rec: "short" },
  { letter: "R", organism: "pea plant", trait: "seed shape", dom: "round", rec: "wrinkled" },
  { letter: "G", organism: "pea plant", trait: "pod colour", dom: "green", rec: "yellow" },
  { letter: "P", organism: "pea plant", trait: "flower colour", dom: "purple", rec: "white" },
  { letter: "L", organism: "fruit fly", trait: "wing length", dom: "long-winged", rec: "short-winged" },
];

const geno = (a: string, b: string) => [a, b].sort().join("");

interface Cross {
  p1: string;
  p2: string;
  cells: string[][];
}

function makeCross(t: Trait, g1: "HH" | "Hh" | "hh", g2: "HH" | "Hh" | "hh"): Cross {
  const L = t.letter;
  const l = L.toLowerCase();
  const conv = (g: string) => g.replace(/H/g, L).replace(/h/g, l);
  const p1 = conv(g1);
  const p2 = conv(g2);
  return { p1, p2, cells: [0, 1].map((i) => [0, 1].map((j) => geno(p1[i], p2[j]))) };
}

const isDominantPheno = (g: string) => g !== g.toLowerCase();

function squareVisual(c: Cross, blank?: [number, number]): Visual {
  return {
    type: "table",
    title: `Punnett square: ${c.p1} × ${c.p2}`,
    headers: ["", c.p2[0], c.p2[1]],
    rows: [0, 1].map((i) => [c.p1[i], ...[0, 1].map((j) => (blank && blank[0] === i && blank[1] === j ? "?" : c.cells[i][j]))]),
  };
}

type G = "HH" | "Hh" | "hh";
const SIMPLE_CROSSES: [G, G][] = [
  ["Hh", "Hh"],
  ["Hh", "hh"],
  ["HH", "hh"],
  ["HH", "Hh"],
  ["hh", "Hh"],
];
const ALL_CROSSES: [G, G][] = [...SIMPLE_CROSSES, ["hh", "hh"], ["HH", "HH"], ["Hh", "HH"]];

function crossFor(d: Level) {
  const t = pick(TRAITS);
  const [g1, g2] = pick(d === 1 ? SIMPLE_CROSSES : ALL_CROSSES);
  return { t, c: makeCross(t, g1, g2) };
}

function punnettPercent(d: Level): Question {
  const { t, c } = crossFor(d);
  const all = c.cells.flat();
  const dominant = chance(0.5);
  const n = all.filter((g) => isDominantPheno(g) === dominant).length;
  const word = dominant ? t.dom : t.rec;
  const L = t.letter;
  return typed(
    `A ${t.organism} with genotype ${c.p1} is crossed with one that is ${c.p2}. In this model, ${t.dom} (${L}) is dominant over ${t.rec} (${L.toLowerCase()}). What percent of offspring are expected to be ${word}?`,
    String(n * 25),
    `Fill in the Punnett square: each of the 4 boxes is 25%. ${dominant ? `Any box with at least one capital ${L} shows the dominant trait.` : `Only boxes with two small ${L.toLowerCase()} show the recessive trait.`}`,
    "number",
    { suffix: "%", visual: squareVisual(c) },
  );
}

function punnettGenotypePercent(d: Level): Question {
  const t = pick(TRAITS);
  const [g1, g2] = pick<[G, G]>(d === 1 ? SIMPLE_CROSSES : ALL_CROSSES);
  const c = makeCross(t, g1, g2);
  const L = t.letter;
  const choices: [string, string][] = [
    [`${L}${L}`, "homozygous dominant"],
    [`${L}${L.toLowerCase()}`, "heterozygous"],
    [`${L.toLowerCase()}${L.toLowerCase()}`, "homozygous recessive"],
  ];
  const [target, label] = pick(choices);
  const n = c.cells.flat().filter((g) => g === target).length;
  return typed(
    `Cross: ${c.p1} × ${c.p2}. What percent of the offspring are expected to be ${label} (${target})?`,
    String(n * 25),
    `Count how many of the 4 boxes in the Punnett square read ${target}, then multiply by 25%.`,
    "number",
    { suffix: "%", visual: squareVisual(c) },
  );
}

function expectedCount(d: Level): Question {
  const { t, c } = crossFor(Math.max(2, d) as Level);
  const N = pick([40, 80, 120, 200, 400]);
  const dominant = chance(0.5);
  const n = c.cells.flat().filter((g) => isDominantPheno(g) === dominant).length;
  return typed(
    `Two ${t.organism}s with genotypes ${c.p1} and ${c.p2} are crossed many times, producing ${N} offspring in total. About how many are expected to be ${dominant ? t.dom : t.rec}? (${t.letter} = ${t.dom}, ${t.letter.toLowerCase()} = ${t.rec})`,
    String((N * n) / 4),
    `Use the Punnett square to find the fraction (${n} out of 4), then multiply by ${N}. Predictions are probabilities, so real results usually differ a little.`,
    "number",
    { visual: squareVisual(c) },
  );
}

function punnettFill(d: Level): Question {
  const { t, c } = crossFor(d);
  const bi = randInt(0, 1);
  const bj = randInt(0, 1);
  const L = t.letter;
  const l = L.toLowerCase();
  const answer = c.cells[bi][bj];
  return mcq(
    `Complete the Punnett square for ${c.p1} × ${c.p2} (${t.trait} in a ${t.organism}). Which genotype belongs in the box marked ?`,
    answer,
    [`${L}${L}`, `${L}${l}`, `${l}${l}`],
    `Combine the allele at the top of the column with the allele at the left of the row. Write the capital letter first (${L}${l}, not ${l}${L}).`,
    squareVisual(c, [bi, bj]),
    2,
  );
}

function crossDeduce(d: Level): Question {
  const t = pick(TRAITS);
  const L = t.letter;
  const l = L.toLowerCase();
  const form = d === 1 ? 0 : randInt(0, 2);
  if (form === 0) {
    const hetero = chance(0.5);
    return mcq(
      `A ${t.dom} ${t.organism} of unknown genotype is crossed with a ${t.rec} one (${l}${l}). ${hetero ? `About half of the offspring are ${t.rec}.` : `All of the offspring are ${t.dom}.`} What is the unknown parent's genotype?`,
      hetero ? `${L}${l}` : `${L}${L}`,
      [hetero ? `${L}${L}` : `${L}${l}`, `${l}${l}`],
      hetero
        ? `Short (${l}${l}) offspring need a ${l} from each parent, so the ${t.dom} parent must carry a hidden ${l}: it is ${L}${l}.`
        : `If the parent had a ${l} allele, some offspring would be ${t.rec}. None are, so the parent is ${L}${L}.`,
      undefined,
      2,
    );
  }
  if (form === 1) {
    return mcq(
      `Two ${t.dom} ${t.organism}s are crossed and some of their offspring are ${t.rec}. What are the parents' genotypes?`,
      `${L}${l} × ${L}${l}`,
      [`${L}${L} × ${L}${L}`, `${L}${L} × ${L}${l}`, `${L}${l} × ${l}${l}`],
      `A ${t.rec} offspring is ${l}${l}, so each parent passed on a ${l}. Both parents show the dominant trait, so each must be ${L}${l}.`,
      undefined,
      3,
    );
  }
  return mcq(
    `A ${t.organism} that is ${L}${l} produces gametes (egg or pollen cells). Which gametes are possible?`,
    `${L} or ${l}, each equally likely`,
    [`${L}${l} only`, `${L} only`, `${l} only`],
    "Each gamete gets just one allele from each pair. A heterozygous parent makes two kinds of gametes, in equal numbers.",
    undefined,
    3,
  );
}

function genotypeTerms(d: Level): Question {
  const t = pick(TRAITS);
  const L = t.letter;
  const l = L.toLowerCase();
  const g = pick([`${L}${L}`, `${L}${l}`, `${l}${l}`]);
  if (d === 1 || chance(0.5)) {
    const right = g === `${L}${l}` ? "heterozygous" : g === `${L}${L}` ? "homozygous dominant" : "homozygous recessive";
    return mcq(
      `A ${t.organism} has the genotype ${g} for ${t.trait}. Which term describes it?`,
      right,
      ["heterozygous", "homozygous dominant", "homozygous recessive"],
      "Homozygous means two identical alleles; heterozygous means two different alleles. Capital letters are dominant alleles.",
      undefined,
      2,
    );
  }
  const pheno = isDominantPheno(g) ? t.dom : t.rec;
  return mcq(
    `A ${t.organism} has the genotype ${g}. Its ${t.trait} (the phenotype) is:`,
    pheno,
    [pheno === t.dom ? t.rec : t.dom, "a blend of both"],
    `The genotype is the pair of alleles; the phenotype is the trait you can see. A dominant allele (${L}) hides the recessive one when both are present.`,
    undefined,
    2,
  );
}

function incompleteDominance(d: Level): Question {
  const sets = [
    { who: "snapdragon", trait: "flower colour", a: "red", b: "white", mid: "pink" },
    { who: "four-o'clock plant", trait: "flower colour", a: "red", b: "white", mid: "pink" },
  ];
  const s = pick(sets);
  const parentsMixed = d >= 2 && chance(0.7);
  if (!parentsMixed) {
    return mcq(
      `In ${s.who}s, ${s.a} (RR) and ${s.b} (WW) flowers show incomplete dominance. What colour are the offspring of an RR × WW cross?`,
      `All ${s.mid} (RW)`,
      [`All ${s.a}`, `Half ${s.a}, half ${s.b}`, `All ${s.b}`],
      `With incomplete dominance neither allele fully hides the other, so heterozygous (RW) plants look like a blend: ${s.mid}.`,
      undefined,
      3,
    );
  }
  return typed(
    `In ${s.who}s, RR is ${s.a}, WW is ${s.b} and RW is ${s.mid} (incomplete dominance). Two ${s.mid} plants (RW × RW) are crossed. What percent of the offspring are expected to be ${s.mid}?`,
    "50",
    "Make the Punnett square: RR, RW, WR, WW. Two of the four boxes are RW (pink), so 2 ÷ 4 = 50%.",
    "number",
    { suffix: "%" },
  );
}

const TECH_SORT: SortSet = {
  prompt: "Benefit or concern? Sort each point about genetic technology.",
  hint: "Think about whether each statement describes a possible good outcome (benefit) or a risk, fairness issue or unanswered question (concern). Reasonable people weigh these differently.",
  bins: [
    { id: "benefit", label: "possible benefit", emoji: "✅" },
    { id: "concern", label: "possible concern", emoji: "⚠️" },
  ],
  items: [
    { label: "crops that resist a plant disease", emoji: "🌾", bin: "benefit" },
    { label: "medicine made cheaply by bacteria", emoji: "💉", bin: "benefit" },
    { label: "finding an inherited illness early", emoji: "🩺", bin: "benefit" },
    { label: "DNA evidence that helps free a wrongly convicted person", emoji: "⚖️", bin: "benefit" },
    { label: "a gene spreading to wild relatives of a crop", emoji: "🌿", bin: "concern" },
    { label: "genetic information being used unfairly by employers", emoji: "🔒", bin: "concern" },
    { label: "only wealthy people being able to afford a treatment", emoji: "💰", bin: "concern" },
    { label: "changes in embryos passing to future generations", emoji: "👶", bin: "concern" },
  ],
};

const BREEDING_SORT: SortSet = {
  prompt: "Selective breeding or genetic engineering?",
  hint: "Selective breeding picks parents with the traits you want and waits for offspring. Genetic engineering directly changes or adds specific genes in an organism's DNA.",
  bins: [
    { id: "breeding", label: "selective breeding", emoji: "🐄" },
    { id: "engineering", label: "genetic engineering", emoji: "🔬" },
  ],
  items: [
    { label: "crossing two wheat plants with high yields", emoji: "🌾", bin: "breeding" },
    { label: "choosing the best milk producers to be parents", emoji: "🥛", bin: "breeding" },
    { label: "breeding dogs for herding ability over many generations", emoji: "🐕", bin: "breeding" },
    { label: "choosing the sweetest apples for seeds", emoji: "🍎", bin: "breeding" },
    { label: "giving bacteria the human gene for insulin", emoji: "🧫", bin: "engineering" },
    { label: "using CRISPR to edit a gene in a plant", emoji: "✂️", bin: "engineering" },
    { label: "adding a gene from one species to another", emoji: "🧬", bin: "engineering" },
    { label: "inserting a gene to make a crop resist an insect pest", emoji: "🐛", bin: "engineering" },
  ],
};

const HEREDITY_BANK: Item[] = [
  {
    prompt: "What is an allele?",
    right: "One version of a gene",
    wrong: ["A whole chromosome", "A type of protein", "A mutation that always harms"],
    hint: "A gene (like the one for seed shape) can have different versions, called alleles, such as round and wrinkled.",
    emoji: "🧬",
  },
  {
    prompt: "A dominant allele is one that:",
    right: "shows its trait when at least one copy is present",
    wrong: ["is always more common in a population", "is always the healthiest allele", "shows its trait only when two copies are present"],
    hint: "Dominant describes how an allele is expressed, not how common or good it is.",
  },
  {
    prompt: "Two carriers of a recessive condition such as cystic fibrosis (Cc × Cc) have a child. What is the chance the child has the condition (cc)?",
    right: "1 in 4 (25%)",
    wrong: ["1 in 2 (50%)", "3 in 4 (75%)", "No chance, because carriers are healthy"],
    hint: "Draw the Punnett square for Cc × Cc: CC, Cc, Cc, cc. Only one of the four boxes is cc.",
    hard: true,
  },
  {
    prompt: "What is the chance that a baby is male, if the father is XY and the mother is XX?",
    right: "50%",
    wrong: ["25%", "75%", "100%"],
    hint: "The mother always passes an X. The father passes X or Y with equal chance, giving XX (female) or XY (male).",
  },
  {
    prompt: "A family has had four daughters. What is the chance their next child is a daughter?",
    right: "50%, because each birth is independent",
    wrong: ["More than 50%, since it is 'her turn'", "Less than 50%, since they have had enough daughters", "0%"],
    hint: "Probability has no memory. Each child has the same chance, whatever happened before.",
    hard: true,
  },
  {
    prompt: "Why do siblings from the same parents look different from each other?",
    right: "Each egg and sperm carries a different mix of alleles, so each child gets a unique combination",
    wrong: ["Mutations always change one child in a family", "Children only inherit from one parent", "Environment is the only cause"],
    hint: "Meiosis shuffles the parents' alleles into new combinations, so sexual reproduction creates variation.",
  },
  {
    prompt: "Human height depends on many genes plus nutrition and health. This is an example of:",
    right: "a trait influenced by several genes and the environment",
    wrong: ["a single-gene dominant trait", "a trait that is never inherited", "a sex-linked trait only"],
    hint: "Many human traits are not simple dominant/recessive; they are polygenic, and the environment also plays a part.",
    hard: true,
  },
  {
    prompt: "A person with blood type AB has both the A and the B alleles fully expressed. This is called:",
    right: "codominance",
    wrong: ["incomplete dominance", "a mutation", "recessive inheritance"],
    hint: "In codominance both alleles show up fully at the same time. In incomplete dominance you see a blend instead.",
    hard: true,
  },
  {
    prompt: "What is selective breeding?",
    right: "Choosing organisms with desirable traits to be parents of the next generation",
    wrong: ["Directly editing the DNA of an embryo", "Copying an organism exactly (cloning)", "Waiting for natural mutations only"],
    hint: "People have bred crops and animals for thousands of years, choosing which individuals reproduce.",
    emoji: "🌽",
  },
  {
    prompt: "What does CRISPR let scientists do?",
    right: "Cut DNA at a chosen sequence so a gene can be removed, repaired or changed",
    wrong: ["Copy a whole organism", "Create new elements", "See genes without a microscope"],
    hint: "CRISPR is a gene-editing tool adapted from a defence system that bacteria use against viruses.",
    hard: true,
  },
  {
    prompt: "Dolly the sheep (born 1996) was the first mammal cloned from an adult body cell. What is a clone?",
    right: "An organism with the same DNA as the one it was copied from",
    wrong: ["An organism with half the DNA of each parent", "An organism whose genes were mixed from two species", "A mutated copy"],
    hint: "A clone has (nearly) identical DNA to its single source organism, unlike offspring of two parents.",
  },
  {
    prompt: "DNA profiling (fingerprinting) can be used to:",
    right: "match DNA from a sample to a person, for example in a family or crime investigation",
    wrong: ["tell what someone will do tomorrow", "read someone's thoughts", "change someone's eye colour"],
    hint: "Each person (except identical twins) has a unique pattern in parts of their DNA, so samples can be compared.",
  },
  {
    prompt: "Why might some people worry about genetic testing results being shared?",
    right: "They could be used unfairly, such as by insurers or employers, so privacy matters",
    wrong: ["Genetic results are always wrong", "They change a person's DNA", "They show a person's exact future"],
    hint: "Genetic information is deeply personal. In Canada, a 2017 law (the Genetic Non-Discrimination Act) stops providers from requiring a genetic test or its results as a condition for services such as insurance.",
  },
  {
    prompt: "Which is an ethical question about editing genes in human embryos?",
    right: "The changes could be passed to future generations who did not agree to them",
    wrong: ["Embryos have too many chromosomes to edit", "It is impossible for DNA to change", "It would make all humans identical immediately"],
    hint: "Edits in embryos or sex cells are inherited. Societies are still debating when, if ever, this should be allowed.",
    hard: true,
  },
  {
    prompt: "Genetically modified (GM) crops can be controversial. Which approach best helps people decide fairly?",
    right: "Look at the evidence about safety and benefits, and also listen to concerns about the environment, farmers and fairness",
    wrong: ["Accept any claim shared on social media", "Ignore all research done by companies and governments", "Decide based on the name of the technology only"],
    hint: "Good decisions combine reliable evidence with ethical and social perspectives, including those of the people affected.",
    hard: true,
  },
];

function heredity(d: Level): Question[] {
  return [
    punnettPercent(d),
    d === 1 ? punnettGenotypePercent(d) : chance(0.5) ? punnettGenotypePercent(d) : expectedCount(d),
    punnettFill(d),
    crossDeduce(d),
    genotypeTerms(d),
    incompleteDominance(d),
    sortQuestion(pick([TECH_SORT, BREEDING_SORT]), perBin(d)),
    ...levelled(HEREDITY_BANK, 2, d),
  ];
}

// ---------- Ionic Compounds ----------

interface Cation {
  sym: string;
  name: string;
  charge: number;
  z: number;
}
interface Anion {
  sym: string;
  name: string;
  charge: number;
  z: number;
}

const CATIONS: Cation[] = [
  { sym: "Li", name: "lithium", charge: 1, z: 3 },
  { sym: "Na", name: "sodium", charge: 1, z: 11 },
  { sym: "K", name: "potassium", charge: 1, z: 19 },
  { sym: "Mg", name: "magnesium", charge: 2, z: 12 },
  { sym: "Ca", name: "calcium", charge: 2, z: 20 },
  { sym: "Ba", name: "barium", charge: 2, z: 56 },
  { sym: "Al", name: "aluminum", charge: 3, z: 13 },
  { sym: "Ag", name: "silver", charge: 1, z: 47 },
  { sym: "Zn", name: "zinc", charge: 2, z: 30 },
];
const ANIONS: Anion[] = [
  { sym: "F", name: "fluoride", charge: 1, z: 9 },
  { sym: "Cl", name: "chloride", charge: 1, z: 17 },
  { sym: "Br", name: "bromide", charge: 1, z: 35 },
  { sym: "I", name: "iodide", charge: 1, z: 53 },
  { sym: "O", name: "oxide", charge: 2, z: 8 },
  { sym: "S", name: "sulfide", charge: 2, z: 16 },
  { sym: "N", name: "nitride", charge: 3, z: 7 },
];

const ELEMENT_OF: Record<string, string> = {
  F: "fluorine",
  Cl: "chlorine",
  Br: "bromine",
  I: "iodine",
  O: "oxygen",
  S: "sulfur",
  N: "nitrogen",
};

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const count = (n: number) => (n > 1 ? String(n) : "");
function formulaOf(c: { sym: string; charge: number }, a: { sym: string; charge: number }): string {
  const g = gcd(c.charge, a.charge);
  return pretty(`${c.sym}${count(a.charge / g)}${a.sym}${count(c.charge / g)}`);
}
function formulaWith(c: { sym: string }, a: { sym: string }, nc: number, na: number): string {
  return pretty(`${c.sym}${count(nc)}${a.sym}${count(na)}`);
}
const ionStr = (sym: string, q: number) =>
  sym + (Math.abs(q) > 1 ? sup(Math.abs(q)) : "") + (q > 0 ? "⁺" : "⁻");

function pairFor(d: Level): [Cation, Anion] {
  const cats = d === 1 ? CATIONS.slice(0, 6) : CATIONS;
  return [pick(cats), pick(d === 1 ? ANIONS.slice(0, 5) : ANIONS)];
}

function formulaToName(d: Level): Question {
  const [c, a] = pairFor(d);
  const f = formulaOf(c, a);
  const others = CATIONS.filter((x) => x.sym !== c.sym);
  const otherAn = ANIONS.filter((x) => x.sym !== a.sym);
  const g = gcd(c.charge, a.charge);
  const prefix = ["", "di", "tri"][a.charge / g > 1 ? a.charge / g - 1 : 0];
  return mcq(
    `What is the name of the ionic compound ${f}?`,
    `${c.name} ${a.name}`,
    [
      `${pick(others).name} ${a.name}`,
      `${c.name} ${pick(otherAn).name}`,
      `${c.name} ${ELEMENT_OF[a.sym]}`,
      prefix ? `${c.name} ${prefix}${a.name}` : `mono${c.name} ${a.name}`,
      `${a.name} ${c.name}`,
    ],
    "Name the metal first, unchanged, then the non-metal with its ending changed to '-ide'. Ionic names never use prefixes like di- or tri-; the subscripts come from balancing charges.",
  );
}

function nameToFormula(d: Level): Question {
  const [c, a] = pairFor(d);
  const g = gcd(c.charge, a.charge);
  const nc = a.charge / g;
  const na = c.charge / g;
  const correct = formulaWith(c, a, nc, na);
  const pool: [number, number][] = [
    [1, 1],
    [2, 2],
    [1, 2],
    [2, 1],
    [3, 2],
    [2, 3],
    [1, 3],
    [3, 1],
    [na, nc],
  ];
  const wrongs = pool.filter(([x, y]) => !(x === nc && y === na)).map(([x, y]) => formulaWith(c, a, x, y));
  return mcq(
    `Which formula represents ${c.name} ${a.name}? (${ionStr(c.sym, c.charge)} and ${ionStr(a.sym, -a.charge)})`,
    correct,
    wrongs,
    `The total positive charge must equal the total negative charge. Cross the charges: the ${c.sym} charge (${c.charge}) becomes the subscript on ${a.sym}, and the ${a.sym} charge (${a.charge}) becomes the subscript on ${c.sym}. Then reduce to the simplest ratio.`,
  );
}

function ionCharge(d: Level): Question {
  const items = [
    { sym: "Na", where: "Group 1 (loses 1 electron)", q: 1 },
    { sym: "K", where: "Group 1 (loses 1 electron)", q: 1 },
    { sym: "Mg", where: "Group 2 (loses 2 electrons)", q: 2 },
    { sym: "Ca", where: "Group 2 (loses 2 electrons)", q: 2 },
    { sym: "Al", where: "Group 13 (loses 3 electrons)", q: 3 },
    { sym: "Cl", where: "Group 17 (gains 1 electron)", q: -1 },
    { sym: "F", where: "Group 17 (gains 1 electron)", q: -1 },
    { sym: "O", where: "Group 16 (gains 2 electrons)", q: -2 },
    { sym: "S", where: "Group 16 (gains 2 electrons)", q: -2 },
    { sym: "N", where: "Group 15 (gains 3 electrons)", q: -3 },
  ];
  const it = pick(d === 1 ? items.slice(0, 8) : items);
  const wrongs = [it.q, -it.q, it.q > 0 ? it.q + 1 : it.q - 1, it.q > 0 ? it.q - 1 || 1 : it.q + 1 || -1, 0]
    .filter((q) => q !== it.q && q !== 0)
    .map((q) => ionStr(it.sym, q));
  return mcq(
    `An atom of ${it.sym} is in ${it.where}. Which ion does it form?`,
    ionStr(it.sym, it.q),
    wrongs,
    "Metals lose electrons and become positive ions (cations). Non-metals gain electrons and become negative ions (anions). Atoms tend to end up with a full outer shell.",
  );
}

function electronCount(d: Level): Question {
  const pool = [
    ...CATIONS.slice(0, 7).map((c) => ({ sym: c.sym, z: c.z, q: c.charge })),
    ...ANIONS.map((a) => ({ sym: a.sym, z: a.z, q: -a.charge })),
  ].filter((x) => x.z < 40);
  const x = pick(pool);
  const q = x.q;
  const electrons = x.z - q;
  if (d === 1) {
    return typed(
      `A neutral ${x.sym} atom has ${x.z} protons. How many electrons does it have?`,
      String(x.z),
      "A neutral atom has equal numbers of protons (+) and electrons (−).",
      "number",
    );
  }
  return typed(
    `How many electrons does the ${ionStr(x.sym, q)} ion have? (Atomic number of ${x.sym} = ${x.z})`,
    String(electrons),
    `The atom has ${x.z} protons. ${q > 0 ? `A charge of +${q} means it lost ${q} electron${q > 1 ? "s" : ""}: ${x.z} − ${q}.` : `A charge of −${-q} means it gained ${-q} electron${-q > 1 ? "s" : ""}: ${x.z} + ${-q}.`}`,
    "number",
  );
}

const MULTI = [
  { sym: "Fe", name: "iron", charges: [2, 3] },
  { sym: "Cu", name: "copper", charges: [1, 2] },
  { sym: "Sn", name: "tin", charges: [2, 4] },
  { sym: "Pb", name: "lead", charges: [2, 4] },
];
const ROMAN: Record<number, string> = { 1: "I", 2: "II", 3: "III", 4: "IV" };

function multivalent(d: Level): Question {
  const m = pick(MULTI);
  const ch = pick(m.charges);
  const a = pick(ANIONS.slice(0, 6).filter((x) => x.charge <= 2));
  const f = formulaOf({ sym: m.sym, charge: ch }, a);
  if (d === 3 && chance(0.4)) {
    return typed(
      `Iron, copper, tin and lead can form more than one ion. What is the charge on the metal ion in ${f}?`,
      String(ch),
      `Total charges must cancel. Work out the total negative charge from the non-metal ion(s), then divide by the number of metal ions.`,
      "number",
    );
  }
  const other = m.charges.find((c) => c !== ch)!;
  return mcq(
    `What is the name of ${f}? (${m.name} can form ${m.charges.map((c) => ionStr(m.sym, c)).join(" or ")})`,
    `${m.name}(${ROMAN[ch]}) ${a.name}`,
    [`${m.name}(${ROMAN[other]}) ${a.name}`, `${m.name} ${a.name}`, `${m.name}(${ROMAN[ch]}) ${a.name.replace(/ide$/, "")}`],
    `Some metals can form more than one ion, so the Roman numeral tells you the charge. Use the anion's charge and the formula to find the metal's charge, then write it in brackets.`,
    undefined,
    3,
  );
}

const IONIC_SORT: SortSet = {
  prompt: "Ionic or molecular? Sort each compound.",
  hint: "Ionic compounds are usually a metal bonded to a non-metal (NaCl, MgO). Molecular compounds are made only of non-metals sharing electrons (H₂O, CO₂).",
  bins: [
    { id: "ionic", label: "ionic (metal + non-metal)", emoji: "🧂" },
    { id: "molecular", label: "molecular (non-metals only)", emoji: "💧" },
  ],
  items: [
    { label: "NaCl (table salt)", emoji: "🧂", bin: "ionic" },
    { label: "MgO", emoji: "⚪", bin: "ionic" },
    { label: "CaCl₂", emoji: "❄️", bin: "ionic" },
    { label: "KBr", emoji: "⚗️", bin: "ionic" },
    { label: "Al₂O₃", emoji: "💎", bin: "ionic" },
    { label: "H₂O", emoji: "💧", bin: "molecular" },
    { label: "CO₂", emoji: "💨", bin: "molecular" },
    { label: "CH₄", emoji: "🔥", bin: "molecular" },
    { label: "NH₃", emoji: "🧪", bin: "molecular" },
    { label: "C₆H₁₂O₆ (glucose)", emoji: "🍬", bin: "molecular" },
  ],
};

const IONIC_BANK: Item[] = [
  {
    prompt: "What is the name of NaOH?",
    right: "sodium hydroxide",
    wrong: ["sodium oxide", "sodium hydride", "sodium hydrogen oxide"],
    hint: "OH⁻ is a polyatomic ion called hydroxide. Polyatomic ions keep their own names (and the '-ide' is part of the name).",
    hard: true,
  },
  {
    prompt: "What is the name of CaCO₃, the main compound in limestone and seashells?",
    right: "calcium carbonate",
    wrong: ["calcium carbide", "calcium carbon oxide", "carbon calcium trioxide"],
    hint: "CO₃²⁻ is the polyatomic carbonate ion. Name the metal, then the polyatomic ion.",
    hard: true,
  },
  {
    prompt: "Which property is typical of ionic compounds such as table salt?",
    right: "High melting point and hard, brittle crystals",
    wrong: ["Low melting point and soft", "Conducts electricity as a solid", "Burns easily in air"],
    hint: "Ions are held in a rigid lattice by strong attractions between opposite charges, which takes a lot of heat to break and shatters when pushed out of line.",
  },
  {
    prompt: "When does an ionic compound such as salt conduct electricity?",
    right: "When it is dissolved in water or melted",
    wrong: ["Only when solid", "Never", "Only when it is cold"],
    hint: "Electricity needs charged particles that are free to move. The ions can move only when the lattice is broken apart, in solution or in a liquid.",
  },
  {
    prompt: "What holds an ionic compound together?",
    right: "The attraction between positive and negative ions",
    wrong: ["Shared pairs of electrons", "Attraction between neutrons", "Gravity"],
    hint: "Opposite charges attract. In an ionic bond, electrons are transferred, making oppositely charged ions that stick together.",
  },
  {
    prompt: "Why is the formula for table salt NaCl and not Na₂Cl?",
    right: "One Na⁺ ion balances one Cl⁻ ion, so the charges cancel",
    wrong: ["Chlorine is much bigger than sodium", "Sodium has two valence electrons", "Salt is a molecule with two atoms of sodium"],
    hint: "Na⁺ has a charge of +1 and Cl⁻ has −1, so a 1:1 ratio gives a total charge of zero.",
  },
  {
    prompt: "In the formula for ammonium sulfate, (NH₄)₂SO₄, what do the brackets and the subscript 2 show?",
    right: "There are two ammonium ions, each made of one N and four H atoms",
    wrong: ["There are two atoms of nitrogen only", "The compound is a gas", "There are two sulfate ions"],
    hint: "Brackets keep a polyatomic ion together, and the subscript outside multiplies everything inside.",
    hard: true,
  },
];

function ionicCompounds(d: Level): Question[] {
  return [
    formulaToName(d),
    nameToFormula(d),
    nameToFormula(d),
    ionCharge(d),
    electronCount(d),
    d === 1 ? formulaToName(d) : multivalent(d),
    sortQuestion(IONIC_SORT, perBin(d)),
    ...levelled(IONIC_BANK, 2, d),
  ];
}

// ---------- Chemical Reactions ----------

function parseFormula(f: string): Record<string, number> {
  let i = 0;
  const num = () => {
    const m = /^\d+/.exec(f.slice(i));
    if (m) {
      i += m[0].length;
      return Number(m[0]);
    }
    return 1;
  };
  const group = (): Record<string, number> => {
    const out: Record<string, number> = {};
    while (i < f.length && f[i] !== ")") {
      if (f[i] === "(") {
        i++;
        const inner = group();
        i++;
        const n = num();
        for (const k of Object.keys(inner)) out[k] = (out[k] ?? 0) + inner[k] * n;
      } else {
        const m = /^[A-Z][a-z]?/.exec(f.slice(i))!;
        i += m[0].length;
        out[m[0]] = (out[m[0]] ?? 0) + num();
      }
    }
    return out;
  };
  return group();
}

interface Reaction {
  left: string[];
  right: string[];
  coeffs: number[];
}

function atomTotals(species: string[], coeffs: number[]): Record<string, number> {
  const t: Record<string, number> = {};
  species.forEach((s, i) => {
    const a = parseFormula(s);
    for (const k of Object.keys(a)) t[k] = (t[k] ?? 0) + a[k] * coeffs[i];
  });
  return t;
}

function isBalanced(r: { left: string[]; right: string[] }, coeffs: number[]): boolean {
  const L = atomTotals(r.left, coeffs.slice(0, r.left.length));
  const R = atomTotals(r.right, coeffs.slice(r.left.length));
  const keys = new Set([...Object.keys(L), ...Object.keys(R)]);
  for (const k of keys) if ((L[k] ?? 0) !== (R[k] ?? 0)) return false;
  return true;
}

/** Smallest whole-number coefficients that balance the equation. */
function solve(left: string[], right: string[]): number[] {
  const n = left.length + right.length;
  let best: number[] | undefined;
  const cur: number[] = [];
  const go = (i: number, sum: number) => {
    if (best && sum >= best.reduce((a, b) => a + b, 0)) return;
    if (i === n) {
      if (isBalanced({ left, right }, cur)) best = [...cur];
      return;
    }
    for (let c = 1; c <= 14; c++) {
      cur[i] = c;
      go(i + 1, sum + c);
    }
  };
  go(0, 0);
  if (!best) throw new Error(`cannot balance ${left.join("+")}->${right.join("+")}`);
  return best;
}

function makeReaction(text: string): Reaction {
  const [l, r] = text.split("->").map((s) => s.trim().split(" + "));
  return { left: l, right: r, coeffs: solve(l, r) };
}

const EASY_REACTIONS = [
  "H2 + O2 -> H2O",
  "N2 + H2 -> NH3",
  "Mg + O2 -> MgO",
  "Na + Cl2 -> NaCl",
  "CH4 + O2 -> CO2 + H2O",
  "H2O2 -> H2O + O2",
  "Zn + HCl -> ZnCl2 + H2",
  "Al + Br2 -> AlBr3",
].map(makeReaction);
const HARD_REACTIONS = [
  "Fe + O2 -> Fe2O3",
  "Al + O2 -> Al2O3",
  "C3H8 + O2 -> CO2 + H2O",
  "C2H6 + O2 -> CO2 + H2O",
  "KClO3 -> KCl + O2",
  "Al + CuCl2 -> AlCl3 + Cu",
  "NaOH + H2SO4 -> Na2SO4 + H2O",
  "Ca(OH)2 + HCl -> CaCl2 + H2O",
  "Pb(NO3)2 + KI -> PbI2 + KNO3",
  "C2H5OH + O2 -> CO2 + H2O",
].map(makeReaction);

const side = (species: string[], coeffs: number[]) =>
  species.map((s, i) => `${coeffs[i] > 1 ? coeffs[i] + " " : ""}${pretty(s)}`).join(" + ");
const eqText = (r: Reaction, coeffs: number[]) =>
  `${side(r.left, coeffs.slice(0, r.left.length))} → ${side(r.right, coeffs.slice(r.left.length))}`;
const unbalancedText = (r: Reaction) => eqText(r, r.coeffs.map(() => 1));
const equation = (text: string): Visual => ({ type: "equation", text });

function reactionFor(d: Level): Reaction {
  return pick(d === 1 ? EASY_REACTIONS : d === 2 ? [...EASY_REACTIONS, ...HARD_REACTIONS.slice(0, 5)] : HARD_REACTIONS);
}

function balanceChoice(d: Level): Question {
  const r = reactionFor(d);
  const n = r.coeffs.length;
  const wrongs: number[][] = [];
  for (let t = 0; t < 40 && wrongs.length < 6; t++) {
    const w = [...r.coeffs];
    const i = randInt(0, n - 1);
    w[i] = Math.max(1, w[i] + pick([-1, 1, 2]));
    if (!isBalanced(r, w) && !wrongs.some((x) => x.join() === w.join())) wrongs.push(w);
  }
  const ones = r.coeffs.map(() => 1);
  if (!isBalanced(r, ones) && !wrongs.some((x) => x.join() === ones.join())) wrongs.push(ones);
  return mcq(
    "Which equation is correctly balanced? (smallest whole-number coefficients)",
    eqText(r, r.coeffs),
    wrongs.map((w) => eqText(r, w)),
    "Count the atoms of each element on both sides. A balanced equation has the same number of each kind of atom before and after the arrow. Change coefficients (the big numbers in front), never the subscripts.",
    equation(unbalancedText(r)),
  );
}

function coefficientQuestion(d: Level): Question {
  const r = reactionFor(d);
  const all = [...r.left, ...r.right];
  const i = randInt(0, all.length - 1);
  return typed(
    `Balance this equation using the smallest whole numbers. What is the coefficient of ${pretty(all[i])}? (Write 1 if there is no number.)`,
    String(r.coeffs[i]),
    `Balance one element at a time, leaving elements that appear in only one place on each side until last. Balanced: ${eqText(r, r.coeffs)}.`,
    "number",
    { visual: equation(unbalancedText(r)) },
  );
}

function sumCoefficients(d: Level): Question {
  const r = reactionFor(Math.max(2, d) as Level);
  return typed(
    "Balance this equation with the smallest whole numbers. What is the sum of all the coefficients?",
    String(r.coeffs.reduce((a, b) => a + b, 0)),
    `Balanced: ${eqText(r, r.coeffs)}. Add the numbers in front of each formula (count a missing number as 1).`,
    "number",
    { visual: equation(unbalancedText(r)) },
  );
}

function atomCount(d: Level): Question {
  const r = reactionFor(d);
  const sideRight = chance(0.5);
  const sp = sideRight ? r.right : r.left;
  const co = sideRight ? r.coeffs.slice(r.left.length) : r.coeffs.slice(0, r.left.length);
  const totals = atomTotals(sp, co);
  const el = pick(Object.keys(totals));
  return typed(
    `Here is the balanced equation: ${eqText(r, r.coeffs)}. How many ${el} atoms are on the ${sideRight ? "right (product)" : "left (reactant)"} side?`,
    String(totals[el]),
    `Multiply each coefficient by the subscript of ${el} in that formula, then add them up. A balanced equation has the same total on both sides.`,
    "number",
  );
}

const TYPE_ITEMS: { eq: string; type: "synthesis" | "decomposition" | "single" | "double" | "combustion" }[] = [
  { eq: "2 Na + Cl2 → 2 NaCl", type: "synthesis" },
  { eq: "N2 + 3 H2 → 2 NH3", type: "synthesis" },
  { eq: "2 Al + 3 Br2 → 2 AlBr3", type: "synthesis" },
  { eq: "2 H2O → 2 H2 + O2", type: "decomposition" },
  { eq: "CaCO3 → CaO + CO2", type: "decomposition" },
  { eq: "2 KClO3 → 2 KCl + 3 O2", type: "decomposition" },
  { eq: "Zn + 2 HCl → ZnCl2 + H2", type: "single" },
  { eq: "Fe + CuSO4 → FeSO4 + Cu", type: "single" },
  { eq: "2 Al + 3 CuCl2 → 2 AlCl3 + 3 Cu", type: "single" },
  { eq: "NaCl + AgNO3 → NaNO3 + AgCl", type: "double" },
  { eq: "BaCl2 + Na2SO4 → 2 NaCl + BaSO4", type: "double" },
  { eq: "Pb(NO3)2 + 2 KI → PbI2 + 2 KNO3", type: "double" },
  { eq: "CH4 + 2 O2 → CO2 + 2 H2O", type: "combustion" },
  { eq: "C3H8 + 5 O2 → 3 CO2 + 4 H2O", type: "combustion" },
  { eq: "C2H5OH + 3 O2 → 2 CO2 + 3 H2O", type: "combustion" },
];
const TYPE_LABEL = {
  synthesis: "Synthesis (A + B → AB)",
  decomposition: "Decomposition (AB → A + B)",
  single: "Single replacement (A + BC → AC + B)",
  double: "Double replacement (AB + CD → AD + CB)",
  combustion: "Combustion (a fuel burns in O₂)",
};

function reactionType(d: Level): Question {
  const pool = d === 1 ? TYPE_ITEMS.filter((t) => t.type !== "double") : TYPE_ITEMS;
  const it = pick(pool);
  const labels = (Object.keys(TYPE_LABEL) as (keyof typeof TYPE_LABEL)[]).filter((k) => d > 1 || k !== "double");
  return mcq(
    "What type of reaction is this?",
    TYPE_LABEL[it.type],
    labels.filter((k) => k !== it.type).map((k) => TYPE_LABEL[k]),
    "Look at the pattern: two things joining into one (synthesis), one thing splitting (decomposition), one element swapping with another in a compound (single), two compounds swapping partners (double), or a fuel reacting with oxygen to make CO₂ and H₂O (combustion).",
    equation(pretty(it.eq)),
    4,
  );
}

const TYPE_SORT: SortSet = {
  prompt: "Sort each reaction by its pattern.",
  hint: "Synthesis: many → one. Decomposition: one → many. Replacement: an element or ions swap places in a compound.",
  bins: [
    { id: "synthesis", label: "synthesis", emoji: "➕" },
    { id: "decomposition", label: "decomposition", emoji: "✂️" },
    { id: "replacement", label: "replacement", emoji: "🔄" },
  ],
  items: TYPE_ITEMS.filter((t) => t.type !== "combustion").map((t) => ({
    label: pretty(t.eq),
    emoji: t.type === "synthesis" ? "➕" : t.type === "decomposition" ? "✂️" : "🔄",
    bin: t.type === "single" || t.type === "double" ? "replacement" : t.type,
  })),
};

function massConservation(d: Level): Question {
  const sets = [
    { r1: "magnesium", r2: "oxygen", p: "magnesium oxide", a: 3, b: 2, ctx: "Magnesium ribbon burns in oxygen." },
    { r1: "hydrogen", r2: "oxygen", p: "water", a: 1, b: 8, ctx: "Hydrogen and oxygen react in a sealed container." },
    { r1: "carbon", r2: "oxygen", p: "carbon dioxide", a: 3, b: 8, ctx: "Carbon burns completely in oxygen in a sealed flask." },
  ];
  const s = pick(sets);
  const k = d === 1 ? randInt(1, 4) : randInt(2, 12);
  const m1 = s.a * k;
  const m2 = s.b * k;
  const mp = m1 + m2;
  const missing = d === 1 ? 2 : randInt(0, 2);
  const parts = [
    `${m1} g of ${s.r1}`,
    `${m2} g of ${s.r2}`,
    `${mp} g of ${s.p}`,
  ];
  const known = [parts[0], parts[1], parts[2]];
  const answer = [m1, m2, mp][missing];
  const names = [s.r1, s.r2, s.p];
  const text =
    missing === 2
      ? `${s.ctx} ${known[0]} reacts completely with ${known[1]}. What mass of ${s.p} is formed?`
      : `${s.ctx} The reaction forms ${known[2]}. If ${known[missing === 0 ? 1 : 0]} reacted, what mass of ${names[missing]} was used?`;
  return typed(
    text,
    String(answer),
    "In a closed system, the law of conservation of mass says the total mass of the reactants equals the total mass of the products. Mass is rearranged, not created or destroyed.",
    "number",
    { suffix: "g" },
  );
}

function rateCalc(d: Level): Question {
  const rate = randInt(2, 9);
  const t = pick([10, 20, 30, 40, 60]);
  if (d === 3 && chance(0.5)) {
    return typed(
      `A reaction releases gas at an average rate of ${rate} mL/s. How many mL of gas are released in ${t} s?`,
      String(rate * t),
      "Average rate = amount ÷ time, so amount = rate × time.",
      "number",
      { suffix: "mL" },
    );
  }
  return typed(
    `A reaction releases ${rate * t} mL of gas in ${t} s. What is the average reaction rate?`,
    String(rate),
    "Average rate = amount of product ÷ time taken.",
    "number",
    { suffix: "mL/s" },
  );
}

const REACTION_BANK: Item[] = [
  {
    prompt: "Which is a sign that a chemical change has occurred?",
    right: "Gas bubbles form when two clear liquids are mixed",
    wrong: ["Ice melts in a drink", "Sugar dissolves in water and can be recovered by evaporating the water", "A glass is broken into pieces"],
    hint: "Evidence of chemical change includes a new gas, a precipitate (new solid), an unexpected colour change, light, or a temperature change. Melting, dissolving and breaking are physical changes.",
    emoji: "🧪",
  },
  {
    prompt: "A student burns a piece of wood and the ash weighs much less than the wood. Is mass conserved?",
    right: "Yes. Some of the mass left as gases such as carbon dioxide and water vapour",
    wrong: ["No. Mass is destroyed when things burn", "No. Fire turns matter into energy only", "Yes, but only if the wood is wet"],
    hint: "Atoms are rearranged, not lost. In an open container the gases escape, so you can't see all the mass. Weigh everything and the total stays the same.",
    hard: true,
  },
  {
    prompt: "In a balanced equation, what do the coefficients (big numbers in front) tell you?",
    right: "How many of each particle (formula unit) take part in the reaction",
    wrong: ["How many atoms are in each molecule", "How fast the reaction goes", "The charge on each ion"],
    hint: "Coefficients count whole formulas. Subscripts are part of the formula and tell you how many atoms of each element are in it.",
  },
  {
    prompt: "Why can't we balance an equation by changing a subscript, for example turning H₂O into H₂O₂?",
    right: "It would change the substance into a different compound",
    wrong: ["Subscripts must always be even", "Coefficients are always bigger", "Subscripts do not matter in chemistry"],
    hint: "H₂O is water, but H₂O₂ is hydrogen peroxide, a different chemical. Only coefficients can be changed to balance an equation.",
  },
  {
    prompt: "Which change would make a reaction go faster?",
    right: "Crushing a solid reactant into a powder",
    wrong: ["Cooling the reactants", "Using less of each reactant", "Putting the reaction in a bigger container"],
    hint: "Powder has more surface area, so more particles can collide at once. Reactions also speed up with higher temperature, higher concentration, or a catalyst.",
  },
  {
    prompt: "Why do reactions usually go faster at a higher temperature?",
    right: "Particles move faster, collide more often and with more energy",
    wrong: ["There are more atoms present", "Particles become heavier", "The products become more stable"],
    hint: "Collision theory: particles must collide with enough energy to react. Warmer particles collide more often and harder.",
  },
  {
    prompt: "What is a catalyst?",
    right: "A substance that speeds up a reaction without being used up",
    wrong: ["A product that forms at the end", "A reactant that is fully consumed", "Any substance that cools a reaction"],
    hint: "Catalysts give the reaction an easier path. They can be used again. Enzymes in your body are biological catalysts.",
  },
  {
    prompt: "A reaction feels cold when held in the hand (the temperature falls). This is an:",
    right: "endothermic reaction",
    wrong: ["exothermic reaction", "decomposition reaction", "impossible reaction"],
    hint: "Endothermic reactions absorb energy from their surroundings. Exothermic reactions release energy (the container feels warm).",
    hard: true,
  },
  {
    prompt: "Burning natural gas (mostly methane) in a furnace is:",
    right: "an exothermic reaction that releases thermal energy",
    wrong: ["an endothermic reaction that absorbs thermal energy", "a physical change", "a reaction that creates energy from nothing"],
    hint: "Chemical energy stored in the bonds is released as heat and light, so the surroundings get warmer. Energy is changed from one form to another, not created.",
  },
  {
    prompt: "In photosynthesis, plants turn carbon dioxide and water into glucose and oxygen. Is this reaction endothermic or exothermic?",
    right: "Endothermic. It needs a steady supply of energy from light",
    wrong: ["Exothermic. It releases energy as heat", "Neither, because plants are alive", "Exothermic, since oxygen is released"],
    hint: "The plant takes in light energy and stores it as chemical energy in glucose.",
    hard: true,
  },
];

function reactions(d: Level): Question[] {
  return [
    balanceChoice(d),
    coefficientQuestion(d),
    d === 1 ? reactionType(d) : sumCoefficients(d),
    atomCount(d),
    reactionType(d),
    massConservation(d),
    sortQuestion(TYPE_SORT, 2),
    rateCalc(d),
    ...levelled(REACTION_BANK, 1, d),
  ];
}

// ---------- Acids, Bases and pH ----------

function phSort(d: Level): Question {
  const acids = sample([0, 1, 2, 3, 4, 5, 6], d === 1 ? 2 : 3);
  const bases = sample([8, 9, 10, 11, 12, 13, 14], d === 1 ? 2 : 3);
  const items = shuffle([...acids.map((p) => [p, "acid"]), ...bases.map((p) => [p, "base"]), [7, "neutral"]] as [number, string][]);
  return {
    kind: "sort",
    prompt: "Acidic, neutral or basic? Sort each solution by its pH.",
    hint: "pH below 7 is acidic, exactly 7 is neutral (pure water), and above 7 is basic (alkaline).",
    bins: [
      { id: "acid", label: "acidic (pH < 7)", emoji: "🍋" },
      { id: "neutral", label: "neutral (pH 7)", emoji: "💧" },
      { id: "base", label: "basic (pH > 7)", emoji: "🧼" },
    ],
    items: items.map(([p, bin], i) => ({ id: `s${i}`, label: `pH ${p}`, emoji: bin === "acid" ? "🍋" : bin === "base" ? "🧼" : "💧", bin })),
  };
}

const PH_VALUES: { name: string; ph: number }[] = [
  { name: "stomach acid", ph: 1 },
  { name: "lemon juice", ph: 2 },
  { name: "vinegar", ph: 3 },
  { name: "tomato juice", ph: 4 },
  { name: "black coffee", ph: 5 },
  { name: "milk", ph: 6 },
  { name: "pure water", ph: 7 },
  { name: "baking soda solution", ph: 9 },
  { name: "hand soap", ph: 10 },
  { name: "household ammonia", ph: 11 },
  { name: "bleach", ph: 12 },
  { name: "drain cleaner", ph: 14 },
];

function phTable(d: Level): Question {
  const rows = sample(PH_VALUES, d === 1 ? 4 : 5);
  const visual: Visual = {
    type: "table",
    title: "Approximate pH of common substances",
    headers: ["Substance", "pH"],
    rows: rows.map((r) => [r.name, r.ph]),
  };
  const mode = d === 1 ? pick(["acid", "base"]) : pick(["acid", "base", "neutral"]);
  let target: { name: string; ph: number };
  let prompt: string;
  let hint: string;
  if (mode === "acid") {
    target = rows.reduce((a, b) => (b.ph < a.ph ? b : a));
    prompt = "Which substance in the table is the most acidic?";
    hint = "The lower the pH, the more acidic the substance.";
  } else if (mode === "base") {
    target = rows.reduce((a, b) => (b.ph > a.ph ? b : a));
    prompt = "Which substance in the table is the most basic (alkaline)?";
    hint = "The higher the pH, the more basic the substance.";
  } else {
    target = rows.reduce((a, b) => (Math.abs(b.ph - 7) < Math.abs(a.ph - 7) ? b : a));
    prompt = "Which substance in the table is closest to neutral?";
    hint = "Neutral is pH 7. Find the pH value with the smallest distance from 7.";
  }
  // Skip exact ties for the "closest to neutral" question by checking uniqueness.
  const best = mode === "neutral" ? Math.abs(target.ph - 7) : 0;
  if (mode === "neutral" && rows.filter((r) => Math.abs(r.ph - 7) === best).length > 1) {
    return mcq(
      "Which substance in the table is the most acidic?",
      rows.reduce((a, b) => (b.ph < a.ph ? b : a)).name,
      rows.map((r) => r.name),
      "The lower the pH, the more acidic the substance.",
      visual,
      3,
    );
  }
  return mcq(prompt, target.name, rows.map((r) => r.name), hint, visual, 3);
}

function tenFold(d: Level): Question {
  const lo = randInt(1, 8);
  const diff = d === 1 ? randInt(1, 2) : randInt(1, 3);
  const hi = lo + diff;
  const hint = `The pH scale is logarithmic: each step of 1 in pH changes the acidity by a factor of 10. The difference is ${diff}, so ${Array(diff).fill("10").join(" × ")} = ${10 ** diff}.`;
  if (d === 3 && chance(0.4)) {
    return typed(
      `Solution A has a pH of ${lo} and solution B has a pH of ${hi}. How many times more acidic is solution A than solution B?`,
      String(10 ** diff),
      hint,
      "number",
      { suffix: "×" },
    );
  }
  return typed(
    `A solution with pH ${lo} is how many times more acidic than a solution with pH ${hi}?`,
    String(10 ** diff),
    hint,
    "number",
    { suffix: "×" },
  );
}

const NEUTRAL_PAIRS = [
  { acid: "HCl", acidName: "hydrochloric acid", an: "chloride", base: "NaOH", baseName: "sodium hydroxide", cat: "sodium" },
  { acid: "HCl", acidName: "hydrochloric acid", an: "chloride", base: "KOH", baseName: "potassium hydroxide", cat: "potassium" },
  { acid: "HNO3", acidName: "nitric acid", an: "nitrate", base: "NaOH", baseName: "sodium hydroxide", cat: "sodium" },
  { acid: "HNO3", acidName: "nitric acid", an: "nitrate", base: "KOH", baseName: "potassium hydroxide", cat: "potassium" },
  { acid: "H2SO4", acidName: "sulfuric acid", an: "sulfate", base: "NaOH", baseName: "sodium hydroxide", cat: "sodium" },
  { acid: "H2SO4", acidName: "sulfuric acid", an: "sulfate", base: "KOH", baseName: "potassium hydroxide", cat: "potassium" },
  { acid: "HCl", acidName: "hydrochloric acid", an: "chloride", base: "Mg(OH)2", baseName: "magnesium hydroxide", cat: "magnesium" },
  { acid: "HCl", acidName: "hydrochloric acid", an: "chloride", base: "Ca(OH)2", baseName: "calcium hydroxide", cat: "calcium" },
];

function neutralization(d: Level): Question {
  const p = pick(d === 1 ? NEUTRAL_PAIRS.slice(0, 4) : NEUTRAL_PAIRS);
  const salt = `${p.cat} ${p.an}`;
  const other = NEUTRAL_PAIRS.filter((x) => `${x.cat} ${x.an}` !== salt);
  const swapped = pick(other);
  return mcq(
    `${cap(p.acidName)} (${pretty(p.acid)}) is mixed with ${p.baseName} (${pretty(p.base)}) in a neutralization reaction. What are the products?`,
    `${salt} and water`,
    [`${swapped.cat} ${swapped.an} and water`, `${salt} and hydrogen gas`, `${salt} and carbon dioxide`, `${p.cat} ${p.an} only, with no water`],
    "Acid + base → salt + water. The salt is named from the base's metal and the acid's negative ion (HCl → chloride, HNO₃ → nitrate, H₂SO₄ → sulfate). Hydrogen gas forms when an acid reacts with a metal, and carbon dioxide when it reacts with a carbonate.",
  );
}

const ACID_SORT: SortSet = {
  prompt: "Acid or base? Sort each property or example.",
  hint: "Acids: pH below 7, turn blue litmus red, taste sour (never taste chemicals), react with some metals. Bases: pH above 7, turn red litmus blue, feel slippery or soapy, taste bitter.",
  bins: [
    { id: "acid", label: "acid", emoji: "🍋" },
    { id: "base", label: "base", emoji: "🧼" },
  ],
  items: [
    { label: "turns blue litmus paper red", emoji: "🔴", bin: "acid" },
    { label: "vinegar", emoji: "🍶", bin: "acid" },
    { label: "pH of 3", emoji: "3️⃣", bin: "acid" },
    { label: "produces hydrogen ions (H⁺) in water", emoji: "➕", bin: "acid" },
    { label: "turns red litmus paper blue", emoji: "🔵", bin: "base" },
    { label: "soapy solutions", emoji: "🧼", bin: "base" },
    { label: "pH of 11", emoji: "🔢", bin: "base" },
    { label: "produces hydroxide ions (OH⁻) in water", emoji: "➖", bin: "base" },
  ],
};

const ACID_BANK: Item[] = [
  {
    prompt: "Which ion do acids release in water?",
    right: "Hydrogen ions, H⁺",
    wrong: ["Hydroxide ions, OH⁻", "Chloride ions only", "Oxygen atoms"],
    hint: "Acids increase the concentration of H⁺ in water; bases increase the concentration of OH⁻.",
  },
  {
    prompt: "Universal indicator turns green. What does this tell you about the solution?",
    right: "It is close to neutral",
    wrong: ["It is a strong acid", "It is a strong base", "It contains no water"],
    hint: "Universal indicator goes red for strong acids, green for neutral, and purple for strong bases.",
  },
  {
    prompt: "Acid rain is caused mainly by:",
    right: "gases such as sulfur dioxide and nitrogen oxides from burning fossil fuels dissolving in rainwater",
    wrong: ["too much oxygen in the air", "salt from the ocean", "plants releasing acids"],
    hint: "Burning coal, oil and gas releases SO₂ and NOₓ, which react with water in the air to form acids. Even normal rain is slightly acidic.",
  },
  {
    prompt: "What is happening to the ocean as it absorbs more carbon dioxide from the air?",
    right: "It is becoming more acidic (its pH is dropping), which makes it harder for shell-building animals",
    wrong: ["It is becoming more basic", "Its pH stays exactly the same", "It is turning to fresh water"],
    hint: "CO₂ dissolves in seawater and forms carbonic acid. This is called ocean acidification and affects creatures such as oysters and corals.",
    hard: true,
  },
  {
    prompt: "Why might a gardener add lime (a base) to very acidic soil?",
    right: "To neutralize some of the acid so more plants can grow",
    wrong: ["To make the soil more acidic", "To add more water", "To remove all minerals"],
    hint: "Adding a base raises the pH toward neutral. Different plants prefer different pH ranges.",
  },
  {
    prompt: "An antacid tablet relieves heartburn because it:",
    right: "contains a base that neutralizes some stomach acid",
    wrong: ["adds more acid to the stomach", "removes all the water from the stomach", "turns acid into pure metal"],
    hint: "Antacids are weak bases such as calcium carbonate or magnesium hydroxide. They react with excess acid to form a salt and water (or carbon dioxide).",
  },
  {
    prompt: "A pH of 3 is how acidic compared with a pH of 6?",
    right: "1000 times more acidic",
    wrong: ["3 times more acidic", "30 times more acidic", "Half as acidic"],
    hint: "The difference is 3 pH units. Each unit is a factor of 10, so 10 × 10 × 10 = 1000.",
    hard: true,
  },
  {
    prompt: "What does 'neutralization' mean?",
    right: "An acid and a base react to form a salt and water, moving the pH toward 7",
    wrong: ["An acid is cooled until it freezes", "An acid is diluted to nothing", "A base is turned into a metal"],
    hint: "H⁺ from the acid combines with OH⁻ from the base to make water, leaving the salt's ions in solution.",
  },
  {
    prompt: "Which household chemical is a base?",
    right: "Baking soda dissolved in water",
    wrong: ["Lemon juice", "Vinegar", "Cola"],
    hint: "Lemon juice and vinegar contain acids (pH about 2–3). Baking soda solution has a pH around 8–9.",
  },
  {
    prompt: "Which chemical formula is a base?",
    right: "NaOH",
    wrong: ["HCl", "H₂SO₄", "HNO₃"],
    hint: "Bases usually contain the hydroxide ion, OH⁻. The others begin with H, which is typical of acids.",
  },
  {
    prompt: "Why is it unsafe to mix some household cleaners?",
    right: "They can react to release harmful gases",
    wrong: ["They always become safer when mixed", "They turn into water", "Only the colour changes"],
    hint: "Mixing chemicals can cause dangerous reactions. Read labels and never combine cleaners.",
  },
];

function acidsBases(d: Level): Question[] {
  return [
    phSort(d),
    phTable(d),
    phTable(d),
    tenFold(d),
    neutralization(d),
    sortQuestion(ACID_SORT, perBin(d)),
    ...levelled(ACID_BANK, 3, d),
  ];
}

// ---------- Kinetic and Potential Energy ----------

const KE_THINGS = [
  { what: "a cyclist and bike", mass: [40, 120], v: [3, 12] },
  { what: "a skateboarder", mass: [40, 80], v: [2, 9] },
  { what: "a runner", mass: [50, 90], v: [3, 9] },
  { what: "a loaded shopping cart", mass: [10, 30], v: [1, 4] },
  { what: "a rolling boulder", mass: [100, 400], v: [2, 10] },
  { what: "a small car", mass: [800, 1400], v: [5, 20] },
];

function kineticQuestion(d: Level): Question {
  const t = pick(d === 1 ? KE_THINGS.slice(0, 5) : KE_THINGS);
  const v = randInt(t.v[0], d === 1 ? Math.min(t.v[1], t.v[0] + 4) : t.v[1]);
  const m = 2 * randInt(t.mass[0] / 2, t.mass[1] / 2); // even, so ½mv² is a whole number
  const ke = (m * v * v) / 2;
  const what = t.what;
  if (d === 3 && chance(0.5)) {
    return typed(
      `${cap(what)} has ${ke} J of kinetic energy and a mass of ${m} kg. How fast is it moving? (Eₖ = ½mv²)`,
      String(v),
      `Rearrange Eₖ = ½mv² to v² = 2Eₖ ÷ m = ${2 * ke} ÷ ${m} = ${v * v}, then take the square root.`,
      "number",
      { suffix: "m/s" },
    );
  }
  return typed(
    `${cap(what)} with a mass of ${m} kg moves at ${v} m/s. What is its kinetic energy? (Eₖ = ½mv²)`,
    String(ke),
    `Square the speed first (${v}² = ${v * v}), then multiply by the mass (${m}) and by ½. The unit is joules (J).`,
    "number",
    { suffix: "J" },
  );
}

const PE_THINGS = [
  { what: "a flowerpot on a balcony", mass: [2, 4, 5, 8, 10], h: [3, 5, 6, 10, 12, 15] },
  { what: "a diver on a platform", mass: [50, 60, 70, 80], h: [3, 5, 10] },
  { what: "a rock on a cliff ledge", mass: [5, 10, 20, 50], h: [10, 15, 20, 30, 40] },
  { what: "water in a rooftop tank", mass: [100, 200, 250, 500], h: [5, 10, 15, 20, 30] },
];

function potentialQuestion(d: Level): Question {
  if (d === 3 && chance(0.4)) {
    const m = pick([5, 10, 20, 25, 50]);
    const h = randInt(2, 30);
    const pe = Math.round(m * h * 98) / 10;
    return typed(
      `A ${m} kg object has ${fmt(pe, 1)} J of gravitational potential energy. How high above the ground is it? (Eg = mgh, g = 9.8 N/kg)`,
      String(h),
      `Rearrange: h = Eg ÷ (m × g) = ${fmt(pe, 1)} ÷ (${m} × 9.8).`,
      "number",
      { suffix: "m" },
    );
  }
  const t = pick(PE_THINGS);
  const m = pick(t.mass);
  const h = pick(t.h);
  const pe = Math.round(m * h * 98) / 10;
  return typed(
    `${cap(t.what)} has a mass of ${m} kg and is ${h} m above the ground. What is its gravitational potential energy? (Eg = mgh, g = 9.8 N/kg)`,
    fmt(pe, 1),
    `Multiply mass × 9.8 × height: ${m} × 9.8 × ${h}. The answer is in joules (J).`,
    "decimal",
    { suffix: "J" },
  );
}

function conservationTable(d: Level): Question {
  const total = pick([200, 300, 400, 500, 600]);
  const peB = total - 10 * randInt(2, Math.floor(total / 20));
  const peC = total - 10 * randInt(Math.floor(total / 20) + 1, Math.floor(total / 10) - 1);
  if (d === 3 && chance(0.5)) {
    const lost = pick([20, 30, 40, 50, 60]);
    const keEnd = randInt(5, Math.floor((total - lost) / 10) - 1) * 10;
    const peEnd = total - lost - keEnd;
    return typed(
      `A skateboarder starts at the top of a ramp with ${total} J of energy (all gravitational potential). At the end of the ramp she has ${keEnd} J of kinetic energy and ${peEnd} J of potential energy. How much energy was changed to thermal energy by friction?`,
      String(lost),
      "Energy is conserved: the total stays the same, but some becomes thermal energy. Lost = starting energy − (kinetic + potential energy now).",
      "number",
      { suffix: "J" },
    );
  }
  const visual: Visual = {
    type: "table",
    title: `A cart on a frictionless track (total energy ${total} J)`,
    headers: ["Point", "Potential energy (J)", "Kinetic energy (J)"],
    rows: [
      ["A (top)", total, 0],
      ["B", peB, total - peB],
      ["C", peC, "?"],
    ],
  };
  return typed(
    "A cart rolls along a track with no friction. What is the kinetic energy at point C?",
    String(total - peC),
    `With no friction, total energy stays at ${total} J. Kinetic = total − potential = ${total} − ${peC}.`,
    "number",
    { suffix: "J", visual },
  );
}

function hydroOrder(d: Level): OrderQuestion {
  const chains = [
    {
      prompt: "Put the energy changes in a hydroelectric dam in order.",
      hint: "Water stored high up has gravitational potential energy. It falls and gains kinetic energy, spins a turbine, and the generator changes that motion into electrical energy.",
      steps: [
        { id: "a", label: "Water stored high behind the dam (gravitational potential energy)" },
        { id: "b", label: "Water rushes down the pipe (kinetic energy)" },
        { id: "c", label: "The turbine spins (kinetic energy)" },
        { id: "d", label: "The generator makes electricity (electrical energy)" },
        { id: "e", label: "A light bulb gives off light and heat (radiant and thermal energy)" },
      ],
    },
    {
      prompt: "Put the energy changes for a roller-coaster car in order, starting at the lift hill.",
      hint: "The chain lift adds gravitational potential energy. As the car drops it changes to kinetic energy; friction and brakes turn some of it into thermal energy.",
      steps: [
        { id: "a", label: "A motor lifts the car up the hill (electrical to gravitational potential energy)" },
        { id: "b", label: "The car sits at the top with maximum potential energy" },
        { id: "c", label: "The car speeds down the drop (potential to kinetic energy)" },
        { id: "d", label: "The car climbs the next hill, slowing down (kinetic to potential energy)" },
        { id: "e", label: "Brakes bring it to a stop (kinetic to thermal energy)" },
      ],
    },
    {
      prompt: "Put the energy changes from food to a sprint in order.",
      hint: "Plants capture light as chemical energy; you release that chemical energy to move your muscles, and much of it ends as thermal energy.",
      steps: [
        { id: "a", label: "Sunlight is absorbed by a plant (radiant energy)" },
        { id: "b", label: "The plant stores energy in sugars (chemical energy)" },
        { id: "c", label: "A person eats the plant (chemical energy)" },
        { id: "d", label: "Muscles contract and the person sprints (kinetic energy)" },
        { id: "e", label: "The body warms up (thermal energy)" },
      ],
    },
  ];
  const c = pick(chains);
  return {
    kind: "order",
    prompt: c.prompt,
    hint: c.hint,
    items: d === 1 ? keepInOrder(c.steps, 4) : c.steps,
  };
}

const PK_SORT: SortSet = {
  prompt: "Potential or kinetic energy? Sort each example.",
  hint: "Kinetic energy is the energy of motion. Potential energy is stored energy: height, a stretched or squashed object, or chemical bonds.",
  bins: [
    { id: "potential", label: "potential (stored)", emoji: "🔋" },
    { id: "kinetic", label: "kinetic (motion)", emoji: "🏃" },
  ],
  items: [
    { label: "a book on a high shelf", emoji: "📚", bin: "potential" },
    { label: "a stretched elastic band", emoji: "🪢", bin: "potential" },
    { label: "a charged battery", emoji: "🔋", bin: "potential" },
    { label: "water behind a dam", emoji: "🌊", bin: "potential" },
    { label: "a compressed spring", emoji: "🌀", bin: "potential" },
    { label: "a car driving on the highway", emoji: "🚗", bin: "kinetic" },
    { label: "a falling apple", emoji: "🍎", bin: "kinetic" },
    { label: "wind blowing", emoji: "💨", bin: "kinetic" },
    { label: "a river flowing", emoji: "🏞️", bin: "kinetic" },
    { label: "a thrown ball", emoji: "⚾", bin: "kinetic" },
  ],
};

const ENERGY_BANK: Item[] = [
  {
    prompt: "A skier's speed doubles. What happens to her kinetic energy?",
    right: "It becomes 4 times as large",
    wrong: ["It doubles", "It stays the same", "It becomes 8 times as large"],
    hint: "Kinetic energy depends on speed squared (v²). Doubling the speed multiplies v² by 2 × 2 = 4.",
    hard: true,
  },
  {
    prompt: "A truck and a car move at the same speed. The truck has three times the mass. How do their kinetic energies compare?",
    right: "The truck has 3 times as much kinetic energy",
    wrong: ["They are the same", "The truck has 9 times as much", "The car has more"],
    hint: "Kinetic energy is directly proportional to mass (½mv²). Tripling the mass triples the energy at the same speed.",
    hard: true,
  },
  {
    prompt: "What does the law of conservation of energy say?",
    right: "Energy cannot be created or destroyed, only changed from one form to another",
    wrong: ["Energy is used up as things move", "Energy can be created if a machine is efficient", "Energy only exists in living things"],
    hint: "The total amount of energy in a closed system stays constant, even though forms change (e.g. chemical → kinetic → thermal).",
  },
  {
    prompt: "A solar panel changes which form of energy into which?",
    right: "Light (radiant) energy into electrical energy",
    wrong: ["Electrical energy into light", "Chemical energy into kinetic energy", "Thermal energy into sound"],
    hint: "Solar cells are made to turn sunlight directly into electricity.",
    emoji: "☀️",
  },
  {
    prompt: "When you rub your hands together to warm them, which energy change is happening?",
    right: "Kinetic energy is changing into thermal energy",
    wrong: ["Thermal energy is changing into potential energy", "Chemical energy is being destroyed", "Electrical energy is changing into sound only"],
    hint: "Friction between the surfaces turns the energy of motion into heat.",
  },
  {
    prompt: "A bouncing ball never bounces back to its starting height. Where does the 'missing' energy go?",
    right: "Mostly into thermal energy and sound when the ball hits the ground",
    wrong: ["It disappears", "It becomes extra gravitational potential energy", "It is stored in the air as a battery"],
    hint: "Energy is conserved, but some of it is changed to forms (heat and sound) that are not useful for bouncing.",
    hard: true,
  },
  {
    prompt: "At the very top of its flight, a ball thrown straight up is momentarily at rest. What is true at that instant?",
    right: "Its kinetic energy is zero and its gravitational potential energy is at a maximum",
    wrong: ["Its kinetic energy is at a maximum", "It has no energy at all", "Its potential energy is zero"],
    hint: "At the top, speed is zero, so Eₖ = 0. All the energy is stored as height. (Ignoring air resistance.)",
  },
  {
    prompt: "Which form of energy does a wind turbine's blade have, and what does the generator change it to?",
    right: "Kinetic energy, changed to electrical energy",
    wrong: ["Thermal energy, changed to kinetic energy", "Chemical energy, changed to light", "Electrical energy, changed to kinetic energy"],
    hint: "Moving air turns the blades (kinetic energy). A generator changes that motion into electricity.",
    emoji: "🌬️",
  },
  {
    prompt: "A battery-powered fan is running. What is the main energy change?",
    right: "Chemical → electrical → kinetic (and some thermal and sound)",
    wrong: ["Kinetic → chemical", "Thermal → electrical → chemical", "Sound → light"],
    hint: "Chemical reactions in the battery produce electrical energy, which the motor changes to kinetic energy. Some is wasted as heat and noise.",
  },
  {
    prompt: "Why is a perpetual motion machine (one that runs forever without any energy input) impossible?",
    right: "Some energy is always changed to thermal energy by friction, so the machine slows down unless energy is added",
    wrong: ["Energy is destroyed by motion", "Machines cannot have kinetic energy", "Gravity stops all motion"],
    hint: "Energy isn't lost, but it spreads out as thermal energy that can't be fully recovered to keep the machine going.",
    hard: true,
  },
];

function mechanicalEnergy(d: Level): Question[] {
  return [
    kineticQuestion(d),
    potentialQuestion(d),
    d === 1 ? kineticQuestion(d) : potentialQuestion(d),
    conservationTable(d),
    hydroOrder(d),
    sortQuestion(PK_SORT, perBin(d)),
    ...levelled(ENERGY_BANK, 2, d),
  ];
}

// ---------- Thermal Energy and Energy Sources ----------

const HEAT_SORT: SortSet = {
  prompt: "Conduction, convection or radiation? Sort each example of heat transfer.",
  hint: "Conduction: heat passes through direct contact. Convection: heat moves with a flowing fluid (liquid or gas). Radiation: heat travels as waves and needs no matter.",
  bins: [
    { id: "conduction", label: "conduction", emoji: "🥄" },
    { id: "convection", label: "convection", emoji: "♨️" },
    { id: "radiation", label: "radiation", emoji: "☀️" },
  ],
  items: [
    { label: "a metal spoon warming up in hot soup", emoji: "🥄", bin: "conduction" },
    { label: "a frying pan handle getting hot", emoji: "🍳", bin: "conduction" },
    { label: "your hand warming on a mug", emoji: "☕", bin: "conduction" },
    { label: "warm air rising above a heater", emoji: "♨️", bin: "convection" },
    { label: "water circulating as it heats in a pot", emoji: "🍲", bin: "convection" },
    { label: "a sea breeze at the beach", emoji: "🏖️", bin: "convection" },
    { label: "the Sun warming your face", emoji: "☀️", bin: "radiation" },
    { label: "warmth felt beside a campfire a metre away", emoji: "🔥", bin: "radiation" },
    { label: "a heat lamp warming your hands", emoji: "💡", bin: "radiation" },
  ],
};

const SPECIFIC_HEATS = [
  { name: "water", c: 4.18, masses: [50, 100, 150, 200, 250] },
  { name: "aluminum", c: 0.9, masses: [100, 200, 300, 400, 500] },
  { name: "copper", c: 0.39, masses: [100, 200, 300, 400, 500] },
  { name: "iron", c: 0.45, masses: [100, 200, 300, 400, 500] },
];

function specificHeat(d: Level): Question {
  const s = d === 1 ? SPECIFIC_HEATS[0] : pick(SPECIFIC_HEATS);
  const m = pick(s.masses);
  const dT = randInt(5, 40);
  const Q = Math.round(m * s.c * 100 * dT) / 100;
  const cText = `${s.c} J/(g·°C)`;
  if (d === 3 && chance(0.5)) {
    const t0 = randInt(10, 30);
    return typed(
      `${Q} J of heat is added to ${m} g of ${s.name} starting at ${t0} °C. The specific heat capacity of ${s.name} is ${cText}. What is the final temperature? (Q = mcΔT)`,
      String(t0 + dT),
      `First find the temperature change: ΔT = Q ÷ (m × c) = ${Q} ÷ (${m} × ${s.c}) = ${dT} °C. Then add it to the starting temperature.`,
      "number",
      { suffix: "°C" },
    );
  }
  return typed(
    `How much heat is needed to warm ${m} g of ${s.name} by ${dT} °C? The specific heat capacity of ${s.name} is ${cText}. (Q = mcΔT)`,
    String(Q),
    `Multiply mass × specific heat capacity × temperature change: ${m} × ${s.c} × ${dT}. The answer is in joules (J).`,
    "number",
    { suffix: "J" },
  );
}

function efficiencyQuestion(d: Level): Question {
  const total = pick([100, 200, 400, 500, 800, 1000]);
  const eff = pick([20, 25, 40, 50, 60, 75, 80]);
  const useful = (total * eff) / 100;
  const dev = pick([
    "an electric motor",
    "a gas furnace",
    "a lamp",
    "a toy car's motor",
    "a hair dryer",
    "a water pump",
  ]);
  const mode = d === 1 ? 0 : randInt(0, 2);
  if (mode === 0) {
    return typed(
      `In a test, ${dev} takes in ${total} J of energy and gives out ${useful} J of useful energy. What is its efficiency? (efficiency = useful energy out ÷ total energy in × 100)`,
      String(eff),
      `Divide the useful energy by the total input: ${useful} ÷ ${total}, then multiply by 100 to get a percent.`,
      "number",
      { suffix: "%" },
    );
  }
  if (mode === 1) {
    return typed(
      `${cap(dev)} is ${eff}% efficient. If it takes in ${total} J of energy, how many joules of useful energy does it give out?`,
      String(useful),
      `Useful energy out = ${eff}% of ${total} = ${eff / 100} × ${total}.`,
      "number",
      { suffix: "J" },
    );
  }
  return typed(
    `${cap(dev)} takes in ${total} J and gives out ${useful} J of useful energy. How many joules are wasted, mostly as thermal energy?`,
    String(total - useful),
    "Energy is conserved. Whatever is not useful output is transformed into other forms, mostly heat: wasted = input − useful.",
    "number",
    { suffix: "J" },
  );
}

const SOURCE_SORT: SortSet = {
  prompt: "Renewable or non-renewable? Sort each energy source.",
  hint: "Renewable sources are replaced naturally within a human lifetime (sun, wind, flowing water, heat from Earth, plants). Non-renewable sources took millions of years to form or are limited in supply (coal, oil, natural gas, uranium).",
  bins: [
    { id: "renewable", label: "renewable", emoji: "♻️" },
    { id: "non", label: "non-renewable", emoji: "⛽" },
  ],
  items: [
    { label: "solar energy", emoji: "☀️", bin: "renewable" },
    { label: "wind energy", emoji: "🌬️", bin: "renewable" },
    { label: "hydroelectric (flowing water)", emoji: "💧", bin: "renewable" },
    { label: "geothermal heat", emoji: "🌋", bin: "renewable" },
    { label: "tidal energy", emoji: "🌊", bin: "renewable" },
    { label: "coal", emoji: "⚫", bin: "non" },
    { label: "crude oil", emoji: "🛢️", bin: "non" },
    { label: "natural gas", emoji: "🔥", bin: "non" },
    { label: "uranium (nuclear fission)", emoji: "⚛️", bin: "non" },
  ],
};

const THERMAL_BANK: Item[] = [
  {
    prompt: "What is the difference between temperature and thermal energy?",
    right: "Temperature is the average kinetic energy of particles; thermal energy is the total energy of all the particles",
    wrong: ["They are the same thing", "Temperature measures heat in joules", "Thermal energy is only found in solids"],
    hint: "A bathtub of warm water has more thermal energy than a cup of hotter water, because it has far more particles.",
    hard: true,
  },
  {
    prompt: "In which direction does heat naturally flow?",
    right: "From a warmer object to a cooler object",
    wrong: ["From a cooler object to a warmer object", "Only upward", "From a bigger object to a smaller one"],
    hint: "Heat is thermal energy transferred because of a temperature difference, always from hot toward cold, until the temperatures are equal.",
  },
  {
    prompt: "Why do metal pots often have plastic or wooden handles?",
    right: "Plastic and wood are poor conductors (insulators), so the handle stays cooler",
    wrong: ["Metal can't be shaped into handles", "Plastic is a better conductor", "Wood makes food taste better"],
    hint: "Metals conduct heat well. Insulators slow down conduction.",
  },
  {
    prompt: "Why does the air above a campfire rise?",
    right: "Warm air is less dense than cool air, so it floats up (a convection current)",
    wrong: ["Warm air is heavier than cool air", "Air is conducted upward through the flame", "Radiation pushes the air up"],
    hint: "Heated particles spread out, so the air is less dense and rises. Cooler, denser air flows in to take its place, creating a convection current.",
  },
  {
    prompt: "Why do coastal cities often have milder temperatures than inland cities at the same latitude?",
    right: "Water has a high specific heat capacity, so large bodies of water warm and cool slowly",
    wrong: ["Water has a very low specific heat capacity", "The ocean produces its own heat", "Sand conducts heat more slowly than air"],
    hint: "It takes a lot of energy to change water's temperature. The ocean stores heat in summer and releases it slowly in winter.",
    hard: true,
  },
  {
    prompt: "A thermos bottle keeps drinks hot by reducing conduction, convection and radiation. Which feature reduces radiation?",
    right: "Shiny, reflective inner walls",
    wrong: ["A vacuum-free gap", "A thick metal cap", "A dark, rough inner surface"],
    hint: "Shiny surfaces reflect radiant energy back. A vacuum between the walls stops conduction and convection.",
    hard: true,
  },
  {
    prompt: "The Sun's energy reaches Earth across empty space. Which type of heat transfer is this?",
    right: "Radiation",
    wrong: ["Conduction", "Convection", "Evaporation"],
    hint: "Conduction and convection need matter. Radiation travels as electromagnetic waves, even through a vacuum.",
  },
  {
    prompt: "A material with a high specific heat capacity, compared with one with a low capacity, will:",
    right: "need more energy to raise its temperature by the same amount",
    wrong: ["heat up faster with the same energy", "never change temperature", "always be a liquid"],
    hint: "Specific heat capacity is the energy needed to warm 1 g by 1 °C. A higher number means it takes more energy.",
  },
  {
    prompt: "Which energy source provides the largest share of Canada's electricity?",
    right: "Hydroelectricity",
    wrong: ["Coal", "Solar", "Wood"],
    hint: "Canada has many rivers and large dams, and hydroelectric power supplies roughly three-fifths of its electricity.",
    emoji: "💧",
  },
  {
    prompt: "In British Columbia, most electricity is generated by:",
    right: "hydroelectric dams on rivers",
    wrong: ["coal-fired plants", "nuclear reactors", "diesel generators"],
    hint: "BC's mountains and large rivers, such as the Columbia and the Peace, are used for hydroelectric generation.",
  },
  {
    prompt: "Which province gets a large part of its electricity from nuclear power plants?",
    right: "Ontario",
    wrong: ["British Columbia", "Newfoundland and Labrador", "Prince Edward Island"],
    hint: "Ontario uses CANDU reactors that run on uranium. Canada is also a major producer of uranium, mined in Saskatchewan.",
    hard: true,
  },
  {
    prompt: "Why are fossil fuels (coal, oil and natural gas) described as non-renewable?",
    right: "They formed from ancient living things over millions of years, much faster than we use them",
    wrong: ["They cannot be burned twice", "They are only found in one country", "They are made by factories"],
    hint: "We are using fossil fuels hundreds of times faster than nature can make them.",
  },
  {
    prompt: "What is a major environmental drawback of burning fossil fuels?",
    right: "It releases carbon dioxide, which adds to climate change",
    wrong: ["It adds oxygen to the atmosphere", "It cools the Earth", "It makes the water supply more basic"],
    hint: "Burning fossil fuels releases CO₂, a greenhouse gas, as well as air pollutants.",
  },
  {
    prompt: "Many remote Indigenous communities across Canada have relied on diesel generators for power. What are some of them doing now?",
    right: "Building solar, wind or small hydro projects to produce cleaner local power",
    wrong: ["Switching to coal only", "Giving up electricity", "Importing nuclear reactors"],
    hint: "Community-owned renewable projects can lower fuel costs and noise and reduce pollution, while giving communities more control over their energy.",
  },
  {
    prompt: "Why can't solar panels alone supply all of a community's electricity at night?",
    right: "Panels only produce power when light reaches them, so storage or other sources are needed",
    wrong: ["Solar panels stop working forever in the dark", "Light is not energy", "Panels need coal to start"],
    hint: "Solar and wind vary with the weather and time of day. Batteries, hydro and other sources help even out supply.",
  },
];

function thermal(d: Level): Question[] {
  return [
    sortQuestion(HEAT_SORT, 2),
    specificHeat(d),
    specificHeat(d),
    efficiencyQuestion(d),
    efficiencyQuestion(d),
    sortQuestion(SOURCE_SORT, perBin(d)),
    ...levelled(THERMAL_BANK, 2, d),
  ];
}

// ---------- The Universe ----------

function lightTravel(d: Level): Question {
  const speed = "300 000";
  if (d === 3 && chance(0.4)) {
    const mins = pick([2, 5, 10]);
    return typed(
      `Light travels about ${speed} km each second. How far does it travel in ${mins} minutes (in km)?`,
      String(300000 * 60 * mins),
      `${mins} minutes = ${mins * 60} seconds. Multiply the seconds by 300 000 km/s.`,
      "number",
      { suffix: "km" },
    );
  }
  if (d >= 2 && chance(0.4)) {
    return typed(
      "The Sun is about 150 000 000 km from Earth. Light travels about 300 000 km each second. How many seconds does sunlight take to reach us?",
      "500",
      "Time = distance ÷ speed = 150 000 000 ÷ 300 000. That is a little over 8 minutes.",
      "number",
      { suffix: "s" },
    );
  }
  const k = d === 1 ? randInt(2, 9) : randInt(5, 60);
  return typed(
    `A radio signal, which travels at the speed of light (about ${speed} km/s), is sent from a spacecraft ${group(k * 300000)} km away. How many seconds does the signal take to arrive?`,
    String(k),
    `Time = distance ÷ speed = ${group(k * 300000)} ÷ 300 000.`,
    "number",
    { suffix: "s" },
  );
}

function lightYear(d: Level): Question {
  const n = d === 1 ? randInt(2, 12) : randInt(4, 90);
  if (d === 1 || chance(0.5)) {
    return typed(
      `A star is ${n} light-years away. How many years ago did the light we see tonight leave the star?`,
      String(n),
      "A light-year is the distance light travels in one year. Light from a star that is n light-years away takes n years to reach us, so we see it as it was n years ago.",
      "number",
      { suffix: "years" },
    );
  }
  return mcq(
    `We see a galaxy that is ${n * 1000000} light-years away. What are we seeing?`,
    `The galaxy as it was ${group(n * 1000000)} years ago`,
    [
      "The galaxy exactly as it is right now",
      `The galaxy as it will be in ${group(n * 1000000)} years`,
      `The galaxy as it was ${n} years ago`,
    ],
    "Light takes time to travel. Looking far into space means looking back in time: the light left the galaxy as many years ago as its distance in light-years.",
    undefined,
    3,
  );
}

function redshiftDirection(d: Level): Question {
  const lab = 656;
  const delta = randInt(2, d === 1 ? 12 : 9) * pick([-1, 1]);
  const observed = lab + delta;
  const away = delta > 0;
  return mcq(
    `A hydrogen emission line has a wavelength of ${lab} nm in a laboratory. In light from a galaxy it is measured at ${observed} nm. What does this suggest?`,
    away ? "The galaxy is moving away from us (redshift)" : "The galaxy is moving toward us (blueshift)",
    [
      away ? "The galaxy is moving toward us (blueshift)" : "The galaxy is moving away from us (redshift)",
      "The galaxy is not moving at all relative to us",
      "The galaxy contains no hydrogen",
    ],
    `Compare the wavelengths. Longer than the lab value means the light is stretched toward the red end, so the source is moving away. Shorter means it is moving toward us. Here ${observed} nm is ${away ? "longer" : "shorter"} than ${lab} nm.`,
    {
      type: "table",
      title: "Hydrogen emission line",
      headers: ["Where measured", "Wavelength (nm)"],
      rows: [
        ["Laboratory", lab],
        ["Galaxy", observed],
      ],
    },
    3,
  );
}

function hubbleQuestion(d: Level): Question {
  const k = 20;
  const dist = [100, 200, 300, 400];
  const target = d === 1 ? 500 : pick([500, 600, 700, 800]);
  return typed(
    `In this simplified data set, galaxies move away from us faster the farther they are. A galaxy ${target} million light-years away should be moving away at about how many km/s?`,
    String(k * target),
    `The speed grows in step with distance: each extra million light-years adds ${k} km/s. Speed = ${k} × distance.`,
    "number",
    {
      suffix: "km/s",
      visual: {
        type: "table",
        title: "Galaxy speed and distance (simplified)",
        headers: ["Distance (million light-years)", "Speed away (km/s)"],
        rows: dist.map((x) => [x, x * k]),
      },
    },
  );
}

function emOrder(d: Level): OrderQuestion {
  const spec = [
    { id: "radio", label: "Radio waves", emoji: "📻" },
    { id: "micro", label: "Microwaves", emoji: "📡" },
    { id: "ir", label: "Infrared", emoji: "🔴" },
    { id: "vis", label: "Visible light", emoji: "🌈" },
    { id: "uv", label: "Ultraviolet", emoji: "🟣" },
    { id: "xray", label: "X-rays", emoji: "🩻" },
    { id: "gamma", label: "Gamma rays", emoji: "☢️" },
  ];
  const kept = keepInOrder(spec, d + 3);
  const mode = pick(["wavelength", "energy", "frequency", "short"]);
  const items = mode === "short" ? [...kept].reverse() : kept;
  const prompt =
    mode === "wavelength"
      ? "Order these parts of the electromagnetic spectrum from the longest wavelength to the shortest."
      : mode === "energy"
        ? "Order these parts of the electromagnetic spectrum from the lowest energy to the highest."
        : mode === "frequency"
          ? "Order these parts of the electromagnetic spectrum from the lowest frequency to the highest."
          : "Order these parts of the electromagnetic spectrum from the shortest wavelength to the longest.";
  return {
    kind: "order",
    prompt,
    hint: "Remember the spectrum from long waves to short: radio, microwave, infrared, visible, ultraviolet, X-ray, gamma. Shorter wavelength means higher frequency and more energy.",
    items,
  };
}

function starOrder(d: Level): OrderQuestion {
  const sunlike = [
    { id: "neb", label: "A nebula of gas and dust" },
    { id: "proto", label: "A protostar forms as gravity pulls the gas together" },
    { id: "main", label: "A main-sequence star fuses hydrogen into helium" },
    { id: "giant", label: "A red giant" },
    { id: "pn", label: "The outer layers drift away (planetary nebula)" },
    { id: "wd", label: "A white dwarf" },
  ];
  const massive = [
    { id: "neb", label: "A nebula of gas and dust" },
    { id: "proto", label: "A protostar forms as gravity pulls the gas together" },
    { id: "main", label: "A massive main-sequence star fuses hydrogen" },
    { id: "super", label: "A red supergiant" },
    { id: "sn", label: "A supernova explosion" },
    { id: "ns", label: "A neutron star or a black hole" },
  ];
  const sun = d === 1 || chance(0.5);
  const list = sun ? sunlike : massive;
  return {
    kind: "order",
    prompt: sun ? "Put the life cycle of a star like our Sun in order." : "Put the life cycle of a very massive star in order.",
    hint: sun
      ? "Stars begin in a nebula, spend most of their lives fusing hydrogen, swell into a red giant, shed their outer layers and leave a white dwarf."
      : "Massive stars burn faster. After a red supergiant stage they explode as a supernova, leaving a dense neutron star or a black hole.",
    items: d === 1 ? keepInOrder(list, 5) : list,
  };
}

function scaleOrder(d: Level): OrderQuestion {
  const things = [
    { id: "earth", label: "Earth (about 12 700 km across)" },
    { id: "jup", label: "Jupiter (about 140 000 km across)" },
    { id: "sun", label: "The Sun (about 1.4 million km across)" },
    { id: "ss", label: "The solar system out to Neptune's orbit (about 9 billion km across)" },
    { id: "mw", label: "The Milky Way galaxy (about 100 000 light-years across)" },
    { id: "lg", label: "The Andromeda galaxy and the Milky Way together (about 2.5 million light-years apart)" },
  ];
  return {
    kind: "order",
    prompt: "Order these from the smallest to the largest.",
    hint: "Use the numbers: planets are thousands to hundreds of thousands of km; the Sun is millions; the solar system is billions of km; a galaxy is measured in light-years, where one light-year is about 9.5 trillion km.",
    items: d === 1 ? keepInOrder(things, 4) : d === 2 ? keepInOrder(things, 5) : things,
  };
}

const UNIVERSE_BANK: Item[] = [
  {
    prompt: "About how old is the universe, according to the Big Bang theory?",
    right: "About 13.8 billion years",
    wrong: ["About 4.6 billion years", "About 6000 years", "About 138 million years"],
    hint: "Measurements of the cosmic microwave background and the expansion rate give an age of about 13.8 billion years. Earth is much younger, at about 4.5 billion years.",
  },
  {
    prompt: "Which statement best describes the Big Bang?",
    right: "The universe began extremely hot and dense and has been expanding and cooling ever since",
    wrong: ["An explosion that happened at one place in empty space", "The moment when the Sun formed", "A collision between two galaxies"],
    hint: "The Big Bang was not an explosion into space. Space itself has been expanding, carrying galaxies apart.",
  },
  {
    prompt: "What is the cosmic microwave background (CMB)?",
    right: "Faint microwave radiation coming from every direction, left over from the early hot universe",
    wrong: ["Radiation from a single nearby star", "A cloud of gas in the Milky Way", "Light from the first galaxy"],
    hint: "The CMB was released when the young universe cooled enough for light to travel freely. As space expanded, its wavelength stretched into the microwave range.",
  },
  {
    prompt: "Who found the cosmic microwave background by accident in the 1960s while working with a radio antenna?",
    right: "Arno Penzias and Robert Wilson",
    wrong: ["Isaac Newton and Galileo", "Albert Einstein and Marie Curie", "Neil Armstrong and Buzz Aldrin"],
    hint: "Two radio astronomers detected a steady 'hiss' from all directions that matched the prediction for leftover radiation from the Big Bang.",
    hard: true,
  },
  {
    prompt: "Edwin Hubble found that the light from distant galaxies is shifted toward the red end of the spectrum. What does this indicate?",
    right: "Most galaxies are moving away from us, and the universe is expanding",
    wrong: ["The galaxies are cooling off", "The galaxies are moving toward us", "Earth is at the centre of the universe"],
    hint: "Redshift is like the stretched sound of a siren moving away. Farther galaxies are redshifted more, matching an expanding universe.",
  },
  {
    prompt: "Why does expansion of the universe not make Earth the centre of everything, even though every distant galaxy seems to move away from us?",
    right: "Space is expanding everywhere, so observers in any galaxy would see the others moving away",
    wrong: ["Earth is the only place with light", "Galaxies are repelled by the Milky Way", "The galaxies are all running toward a distant edge"],
    hint: "Imagine dots on an inflating balloon: from any dot, all the other dots move away.",
    hard: true,
  },
  {
    prompt: "Which two types of evidence most strongly support the Big Bang theory?",
    right: "The redshift of distant galaxies and the cosmic microwave background",
    wrong: ["Sunspots and eclipses", "Moon phases and tides", "The seasons and the tilt of Earth"],
    hint: "Redshift shows the universe is expanding. The CMB is the afterglow of the early hot universe. The mix of hydrogen and helium also matches predictions.",
  },
  {
    prompt: "What powers a star like the Sun for most of its life?",
    right: "Nuclear fusion of hydrogen into helium in its core",
    wrong: ["Burning of coal and oil", "Nuclear fission of uranium", "Friction in its atmosphere"],
    hint: "In a star's hot, dense core, hydrogen nuclei fuse into helium and release huge amounts of energy.",
    emoji: "☀️",
  },
  {
    prompt: "Which of these stars is the hottest?",
    right: "A blue star",
    wrong: ["A red star", "An orange star", "They are all the same temperature"],
    hint: "Star colour shows surface temperature: blue is hottest, then white, yellow, orange and red (the coolest).",
  },
  {
    prompt: "The carbon and oxygen atoms in your body were mostly made:",
    right: "inside stars, then spread through space when the stars died",
    wrong: ["in the Big Bang", "in volcanoes on Earth", "by plants"],
    hint: "The Big Bang made mostly hydrogen and helium. Heavier elements form in stars and are scattered by supernovae and other stellar deaths.",
    hard: true,
  },
  {
    prompt: "What is a black hole?",
    right: "A region where gravity is so strong that nothing, not even light, can escape",
    wrong: ["A hole in the surface of the Moon", "A star that has run out of colour", "A planet made of dark matter"],
    hint: "Some black holes form when very massive stars collapse. We detect them by their effects on nearby stars and gas.",
  },
  {
    prompt: "What kind of galaxy is the Milky Way?",
    right: "A spiral galaxy",
    wrong: ["An elliptical galaxy", "An irregular galaxy", "A galaxy cluster"],
    hint: "The Milky Way has a central bulge and spiral arms (it is a barred spiral). Our Sun lies in one of the arms.",
  },
  {
    prompt: "What is a light-year?",
    right: "The distance light travels in one year, about 9.5 trillion km",
    wrong: ["The time it takes light to reach Earth", "One year of sunlight", "A unit of brightness"],
    hint: "It has 'year' in its name, but it measures distance. It's like saying 'the town is a two-hour drive away'.",
  },
  {
    prompt: "Why are X-ray telescopes placed in orbit above the atmosphere?",
    right: "Earth's atmosphere absorbs X-rays, so they never reach the ground",
    wrong: ["X-rays only travel upward", "It's too bright on the ground", "Telescopes work better when they're moving"],
    hint: "The atmosphere blocks most X-rays and ultraviolet light, which protects us but means we must observe those wavelengths from space.",
    hard: true,
  },
  {
    prompt: "The James Webb Space Telescope mainly observes infrared light. Why is this helpful?",
    right: "Infrared passes through dust clouds and lets it see very distant galaxies whose light has been redshifted",
    wrong: ["Infrared is the only light that exists in space", "It makes stars look bigger", "Infrared is faster than visible light"],
    hint: "Expansion stretches light from the earliest galaxies into the infrared. Infrared also passes through dust that blocks visible light.",
    hard: true,
  },
  {
    prompt: "Canada's CHIME telescope in BC's Okanagan region detects radio waves from space. What is a radio telescope good for?",
    right: "Studying objects that give off radio waves, such as fast radio bursts, and it can work day or night",
    wrong: ["Seeing only the Moon", "Listening to sound in space", "Taking colour photographs of the planets"],
    hint: "Radio waves are a form of light, not sound. Radio telescopes collect them and are not blocked by daylight or most clouds.",
    hard: true,
  },
  {
    prompt: "Which type of electromagnetic wave has the shortest wavelength?",
    right: "Gamma rays",
    wrong: ["Radio waves", "Visible light", "Microwaves"],
    hint: "On the spectrum, wavelength decreases from radio waves to gamma rays.",
  },
  {
    prompt: "Astronomers split starlight into a spectrum. What can the dark lines in it tell them?",
    right: "Which elements are in the star",
    wrong: ["How many planets it has", "What language aliens speak", "The star's name"],
    hint: "Each element absorbs and emits light at its own set of wavelengths, like a fingerprint.",
  },
  {
    prompt: "Most of the universe's mass and energy is thought to be dark matter and dark energy. What does 'dark' mean here?",
    right: "We cannot see it directly because it does not give off or absorb light, but we detect its effects",
    wrong: ["It is black in colour", "It has been proven to be empty space", "It is made of black holes only"],
    hint: "Dark matter's gravity affects how galaxies rotate, and dark energy appears to speed up expansion. Their nature is still unknown.",
    hard: true,
  },
];

function universe(d: Level): Question[] {
  return [
    lightTravel(d),
    redshiftDirection(d),
    d === 1 ? lightYear(d) : chance(0.5) ? hubbleQuestion(d) : lightYear(d),
    emOrder(d),
    starOrder(d),
    scaleOrder(d),
    ...levelled(UNIVERSE_BANK, 2, d),
  ];
}

// ---------- Indigenous Knowledge and Science ----------

const RESEARCH_SORT: SortSet = {
  prompt: "Respectful or not? Sort each research practice involving an Indigenous community.",
  hint: "Respectful research starts with relationships: ask permission, follow the community's protocols, share the benefits, and credit the people who hold the knowledge.",
  bins: [
    { id: "respectful", label: "respectful practice", emoji: "🤝" },
    { id: "not", label: "not respectful", emoji: "🚫" },
  ],
  items: [
    { label: "asking the community what questions matter to them", emoji: "❓", bin: "respectful" },
    { label: "getting consent and agreeing how results will be shared", emoji: "📝", bin: "respectful" },
    { label: "crediting Knowledge Keepers by name when they agree", emoji: "🏷️", bin: "respectful" },
    { label: "sharing the results with the community in a useful form", emoji: "📣", bin: "respectful" },
    { label: "recording stories and publishing them without asking", emoji: "🎙️", bin: "not" },
    { label: "assuming every Nation shares the same knowledge", emoji: "🧩", bin: "not" },
    { label: "using knowledge without credit, then keeping the profits", emoji: "💸", bin: "not" },
    { label: "treating Indigenous knowledge as a myth that science must 'prove'", emoji: "🙄", bin: "not" },
  ],
};

const INDIGENOUS_BANK: Item[] = [
  {
    prompt: "Two-Eyed Seeing, a guiding idea brought forward by Mi'kmaw Elder Albert Marshall, means:",
    right: "Learning to see from the strengths of Indigenous knowledge with one eye, and Western science with the other, and using both together",
    wrong: [
      "Replacing Indigenous knowledge with Western science",
      "Replacing Western science with Indigenous knowledge",
      "Choosing whichever view is easier",
    ],
    hint: "The idea is to bring together the strengths of both ways of knowing, rather than ranking one above the other.",
  },
  {
    prompt: "Which statement best describes Indigenous knowledge?",
    right: "Knowledge built over many generations of living in, and carefully observing, a particular place, carried in languages, stories and practices",
    wrong: [
      "A set of old stories with no connection to real evidence",
      "A single body of knowledge that is the same for every Indigenous Nation",
      "Information that exists only in science textbooks",
    ],
    hint: "Indigenous knowledge is place-based, often detailed, and still being used and added to by living communities today.",
  },
  {
    prompt: "Why is it better to say 'First Nations, Métis and Inuit knowledge' than to talk about 'the Indigenous knowledge'?",
    right: "Each Nation and community has its own languages, lands and knowledge",
    wrong: ["There is no difference between communities", "Only Inuit have knowledge about nature", "It sounds more formal"],
    hint: "Indigenous peoples in Canada include many distinct Nations. What is true for one may not be true for another.",
  },
  {
    prompt: "Along the Pacific coast, some First Nations built rock-walled terraces on beaches called clam gardens. What have scientists working with First Nations found about them?",
    right: "Clam gardens can help clams grow and survive better, so they are a form of long-term food management",
    wrong: ["They made the clams poisonous", "They are natural formations that no one built", "They were only for decoration"],
    hint: "Studies, often done with coastal First Nations, show that terraced beaches can support more and faster-growing clams.",
  },
  {
    prompt: "Inuit hunters and Elders have shared observations about sea ice, weather and animals that help track Arctic change. What does this show?",
    right: "Local observations can add detailed, long-term information to scientific measurements",
    wrong: ["Scientists no longer need any instruments", "Only satellites can measure ice", "Observations from people are always inaccurate"],
    hint: "People who live on the land year after year notice patterns that satellites or short studies can miss. Together, the two give a fuller picture.",
  },
  {
    prompt: "Some Indigenous peoples have long used carefully planned, low-intensity fires to care for the land. How are some wildfire managers now working with them?",
    right: "By supporting communities' own fire stewardship, which can reduce the risk of larger wildfires",
    wrong: ["By banning all use of fire", "By asking communities to stop managing land", "By lighting fires only in cities"],
    hint: "Planned burns can clear fuel and renew plants. Leadership by local communities who know their land is key.",
    hard: true,
  },
  {
    prompt: "Oral histories from coastal peoples tell of a great earthquake and flood. Scientists later dated the 1700 Cascadia earthquake with tree rings and written records of a tsunami in Japan. What does this show?",
    right: "Different kinds of evidence, including oral history, can support and strengthen each other",
    wrong: ["Oral histories can't be trusted", "Only written records count as evidence", "Earthquakes cannot be dated"],
    hint: "When separate lines of evidence point to the same event, we can be more confident. Oral histories are an important record of the past.",
  },
  {
    prompt: "OCAP® is a set of principles from the First Nations Information Governance Centre. What do the letters stand for?",
    right: "Ownership, Control, Access and Possession",
    wrong: ["Observation, Collection, Analysis and Publication", "Organization, Care, Agreement and Privacy", "Only the Canadian Association of Physicists"],
    hint: "They say that First Nations communities have the right to govern the collection and use of information about their people and lands.",
    hard: true,
  },
  {
    prompt: "A scientist wants to study a local river and talk with a nearby First Nation about its history. What should come first?",
    right: "Contacting the community, building a relationship and learning what research they want and how it should be done",
    wrong: ["Collecting samples secretly, then telling the community later", "Publishing first, then asking", "Assuming the community won't be interested"],
    hint: "Respect and consent come before research. Communities may have their own research protocols.",
  },
  {
    prompt: "Why might fisheries managers invite local First Nations salmon stewards to help monitor salmon runs?",
    right: "They have generations of knowledge of local rivers and runs, which adds to long-term survey data",
    wrong: ["Because salmon can't be counted by scientists", "To avoid collecting any data", "Because it saves time for the managers only"],
    hint: "Combining local knowledge with data from counts and tests helps give a more complete picture of fish populations.",
  },
  {
    prompt: "Many Indigenous worldviews describe people as part of the natural world, with responsibilities to care for it. How might this shape decisions about a forest?",
    right: "It can encourage managing for the long-term health of the whole ecosystem, not just short-term use",
    wrong: ["It means no one may ever use the forest", "It means the forest is only a resource to sell", "It has no connection to land management"],
    hint: "Perspectives vary between Nations, but many emphasize reciprocity and caring for the land for future generations.",
    hard: true,
  },
  {
    prompt: "Which approach to knowledge shows respect for both Indigenous knowledge and Western science?",
    right: "Each is strong in different ways, and together they can answer questions neither answers alone",
    wrong: [
      "Only knowledge published in a journal counts",
      "Indigenous knowledge is valid only after being verified by lab tests",
      "Western science has nothing useful to offer",
    ],
    hint: "Respect means treating both as valid systems with their own methods, strengths and limits.",
  },
  {
    prompt: "Place names in Indigenous languages often describe features of the land or what can be found there. How can this be useful?",
    right: "The names carry knowledge about local plants, animals, travel routes and history",
    wrong: ["They are only decorative", "They make maps harder to read, so they should be avoided", "They are all translations of the same word"],
    hint: "Languages hold detailed knowledge about a place. Revitalizing Indigenous languages also helps keep that knowledge alive.",
  },
];

function indigenous(d: Level): Question[] {
  return [sortQuestion(RESEARCH_SORT, perBin(d)), ...levelled(INDIGENOUS_BANK, 7, d)];
}

export const course: Course = {
  grade: "10",
  subject: "science",
  bigIdeas: {
    "ca-bc": [
      "DNA is the basis for the diversity of living things.",
      "Energy is conserved and its transformation can affect the environment.",
      "Chemical processes require energy change as atoms are rearranged.",
      "The formation of the universe can be explained by the Big Bang theory.",
    ],
  },
  units: [
    {
      id: "inquiry-and-measurement",
      title: "Inquiry & Measurement",
      emoji: "📏",
      blurb: "Variables, units and graphs",
      parentNote:
        "Doing science fairly: independent, dependent and controlled variables, repeating trials and averaging, uncertainty, accuracy and precision, graph slopes, SI units and conversions, and scientific notation.",
      standards: {
        "ca-bc": "Scientific inquiry: questioning, planning fair tests, collecting and analyzing data, uncertainty; SI units and scientific notation",
      },
      generate: ({ difficulty = 2 }: GenerateOptions = {}) => inquiry(difficulty),
    },
    {
      id: "dna-and-proteins",
      title: "DNA & Proteins",
      emoji: "🧬",
      blurb: "From DNA code to proteins",
      parentNote:
        "DNA structure and base pairing, genes and chromosomes, transcription and translation using a codon table, how mutations change proteins, and how cells use different genes.",
      standards: {
        "ca-bc": "DNA structure and function; gene expression and protein synthesis; mutations",
      },
      generate: ({ difficulty = 2 }: GenerateOptions = {}) => dnaProteins(difficulty),
    },
    {
      id: "heredity-and-genetic-technology",
      title: "Heredity & Gene Tech",
      emoji: "🌱",
      blurb: "Punnett squares and genetic choices",
      parentNote:
        "Alleles, genotype and phenotype, dominant and recessive traits, Punnett squares and probability (including incomplete dominance), plus an introduction to selective breeding, genetic engineering and the ethics of genetic technologies.",
      standards: {
        "ca-bc": "Inheritance of traits, Punnett squares and probability; genetic technologies and their ethical, social and environmental implications",
      },
      generate: ({ difficulty = 2 }: GenerateOptions = {}) => heredity(difficulty),
    },
    {
      id: "ionic-compounds",
      title: "Ionic Compounds",
      emoji: "🧂",
      blurb: "Ions, formulas and names",
      parentNote:
        "How atoms form ions, writing formulas by balancing charges, naming simple ionic compounds (including metals with more than one charge), and properties of ionic substances.",
      standards: {
        "ca-bc": "Atomic structure and the periodic table; ions; naming and writing formulas of ionic compounds",
      },
      generate: ({ difficulty = 2 }: GenerateOptions = {}) => ionicCompounds(difficulty),
    },
    {
      id: "chemical-reactions",
      title: "Chemical Reactions",
      emoji: "⚗️",
      blurb: "Balance equations and spot patterns",
      parentNote:
        "Evidence of chemical change, balancing equations, conservation of mass, types of reactions (synthesis, decomposition, replacement and combustion), energy changes, and factors that affect how fast reactions go.",
      standards: {
        "ca-bc": "Chemical reactions: balanced equations, conservation of mass, types of reactions, reaction rates, energy change",
      },
      generate: ({ difficulty = 2 }: GenerateOptions = {}) => reactions(difficulty),
    },
    {
      id: "acids-and-bases",
      title: "Acids & Bases",
      emoji: "🍋",
      blurb: "pH, indicators and neutralization",
      parentNote:
        "Properties of acids and bases, the pH scale (including that each step is a factor of 10), neutralization and the salts it forms, and everyday and environmental examples such as antacids, acid rain and ocean acidification.",
      standards: {
        "ca-bc": "Properties of acids and bases; pH; neutralization reactions; applications and environmental effects",
      },
      generate: ({ difficulty = 2 }: GenerateOptions = {}) => acidsBases(difficulty),
    },
    {
      id: "kinetic-and-potential-energy",
      title: "Energy in Motion",
      emoji: "🎢",
      blurb: "Kinetic, potential and conserved",
      parentNote:
        "Kinetic and gravitational potential energy with calculations, how energy changes form in devices and natural systems, and the law of conservation of energy.",
      standards: {
        "ca-bc": "Forms of energy; kinetic and potential energy; energy transformations; law of conservation of energy",
      },
      generate: ({ difficulty = 2 }: GenerateOptions = {}) => mechanicalEnergy(difficulty),
    },
    {
      id: "thermal-energy-and-sources",
      title: "Heat & Energy Sources",
      emoji: "🔥",
      blurb: "Heat transfer and energy sources",
      parentNote:
        "Conduction, convection and radiation, an introduction to specific heat capacity (Q = mcΔT), efficiency and wasted energy, and renewable and non-renewable energy sources, with Canadian examples.",
      standards: {
        "ca-bc": "Thermal energy and heat transfer; specific heat; efficiency; energy sources and their effects on the environment",
      },
      generate: ({ difficulty = 2 }: GenerateOptions = {}) => thermal(difficulty),
    },
    {
      id: "the-universe",
      title: "The Universe",
      emoji: "🔭",
      blurb: "Big Bang, stars and galaxies",
      parentNote:
        "Evidence for the Big Bang (redshift and the cosmic microwave background), the life cycle of stars, galaxies and scale, light-years, and how the electromagnetic spectrum is used in astronomy.",
      standards: {
        "ca-bc": "Big Bang theory and its evidence; stars, galaxies and scale; the electromagnetic spectrum in astronomy",
      },
      generate: ({ difficulty = 2 }: GenerateOptions = {}) => universe(difficulty),
    },
    {
      id: "indigenous-knowledge-and-science",
      title: "Two Ways of Knowing",
      emoji: "🤝",
      blurb: "Indigenous knowledge and science",
      parentNote:
        "How Indigenous knowledge and Western science can work together respectfully, with examples from Canada such as clam gardens, Arctic monitoring and Two-Eyed Seeing, and good practices for research with communities.",
      standards: {
        "ca-bc": "Local and traditional knowledge, including First Peoples knowledge, and how it contributes to scientific understanding; ethical research relationships",
      },
      generate: ({ difficulty = 2 }: GenerateOptions = {}) => indigenous(difficulty),
    },
  ],
};
