import { pick, randInt, sample, shuffle, textChoice } from "../random";
import type { GenerateOptions, Question, Unit, Visual } from "../types";
import { buildSet, levelOf, on, others, numQ, range, spaced, typeIn } from "./kit";

// Ontario Grade 5 mathematics (2020 curriculum). Whole numbers go up to 100 000 and decimals to hundredths.


/** Read-aloud says big numbers without the thin spaces. */
function say<T extends Question>(q: T): T {
  const plain = (text: string) => text.replace(/(\d) (?=\d{3}\b)/g, "$1");
  const spoken = plain(q.prompt);
  if (spoken !== q.prompt) q.speak = spoken;
  if (q.kind === "choice") {
    for (const c of q.choices) {
      const s = plain(c.label);
      if (s !== c.label) c.speak = s;
    }
  }
  return q;
}

/** 12.5 → "12.5", 12 → "12", 12.05 → "12.05". */
const dec = (n: number): string => String(Math.round(n * 100) / 100);
const dec2 = (n: number): string => (Math.round(n * 100) / 100).toFixed(2);
const money = (n: number): string => `$${dec2(n)}`;

// ---------- Big numbers ----------

function numbers100k(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const lo = d === 1 ? 1000 : 10000;
  const hi = d === 1 ? 9999 : 99999;
  const distinct = (count: number): number[] => {
    const out = new Set<number>();
    while (out.size < count) out.add(randInt(lo, hi));
    return [...out];
  };
  const more = (): Question => {
    const step = pick([10, 100, 1000, 10000].slice(0, d === 1 ? 3 : 4));
    const n = randInt(11000, 89999 - step);
    const up = pick([true, false]);
    const prompt = `What number is ${spaced(step)} ${up ? "more" : "less"} than ${spaced(n)}?`;
    const ans = up ? n + step : n - step;
    return say(typeIn(prompt, ans, `${up ? "Add" : "Take away"} ${spaced(step)}. Only one digit changes.`));
  };
  const place = (): Question => {
    const digits = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 5);
    const n = Number(digits.join(""));
    const pos = randInt(0, 4);
    const value = digits[pos] * 10 ** (4 - pos);
    const wrongPlaces = others(range(0, 4), pos, 2).map((p) => digits[pos] * 10 ** (4 - p));
    return say(textChoice(`In ${spaced(n)}, what is the ${digits[pos]} worth?`, spaced(value), wrongPlaces.map(spaced), "Look at which place the digit is in: ones, tens, hundreds, thousands or ten thousands.", { type: "equation", text: spaced(n) }));
  };
  const compare = (): Question => {
    const nums = distinct(3);
    const big = Math.max(...nums);
    return say(textChoice("Which number is the greatest?", spaced(big), nums.filter((n) => n !== big).map(spaced), "Compare the ten thousands first, then thousands, then hundreds."));
  };
  const order = (): Question => {
    const nums = distinct(4).sort((a, b) => a - b);
    return { kind: "order", prompt: "Tap the numbers from least to greatest.", hint: "Compare the biggest places first.", items: nums.map((n) => ({ id: String(n), label: spaced(n) })) };
  };
  const expanded = (): Question => {
    const digits = sample(range(1, 9), 4);
    const n = digits[0] * 10000 + digits[1] * 1000 + digits[2] * 100 + digits[3];
    const text = `${digits[0] * 10000} + ${digits[1] * 1000} + ${digits[2] * 100} + ${digits[3]}`;
    const swapped = digits[0] * 10000 + digits[2] * 1000 + digits[1] * 100 + digits[3];
    const wrong = [swapped === n ? n + 1000 : swapped, digits[0] * 1000 + digits[1] * 100 + digits[2] * 10 + digits[3]];
    return say(textChoice(`Which number is ${text.replace(/(\d+)/g, (m) => spaced(Number(m)))}?`, spaced(n), wrong.map(spaced), "Write each part in its place and put the zeros in the gaps."));
  };
  const timesTenth = (): Question => {
    const c = pick([
      { n: 40, f: 0.1 },
      { n: 250, f: 0.1 },
      { n: 700, f: 0.01 },
      { n: 90, f: 0.01 },
      { n: 600, f: 0.1 },
      { n: 35, f: 0.1 },
    ]);
    const v = c.n * c.f;
    return textChoice(`What is ${c.n} × ${c.f}?`, dec(v), [dec(v * 10), dec(v / 10)], `Multiplying by ${c.f} makes the number ${c.f === 0.1 ? "10" : "100"} times smaller.`, { type: "equation", text: `${c.n} × ${c.f} = ?` });
  };
  const closest = (): Question => {
    const target = pick([20000, 50000, 75000, 90000]);
    const near = target + pick([-1, 1]) * randInt(300, 900);
    const far1 = target + pick([-1, 1]) * randInt(3000, 6000);
    const far2 = target + pick([-1, 1]) * randInt(7000, 9000);
    return say(textChoice(`Which number is closest to ${spaced(target)}?`, spaced(near), [spaced(far1), spaced(far2)], "Find the difference between each choice and the target. The smallest difference wins."));
  };
  return buildSet([more, more, place, place, compare, order, d === 1 ? compare : expanded, d === 3 ? closest : timesTenth]);
}

// ---------- Fractions ----------

function fractions5(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const equiv = (): Question => {
    const den = pick([2, 3, 4, 6]);
    const mult = pick(den === 2 ? [3, 4, 5, 6] : den === 3 ? [2, 3, 4] : den === 4 ? [2, 3] : [2]);
    const num = randInt(1, den - 1);
    return typeIn("What number goes in the box to make the fractions equal?", num * mult, `Multiply the top and bottom by ${mult}.`, { type: "equation", text: `${num}/${den} = ☐/${den * mult}` });
  };
  const mixedOf = (n: number, den: number) => `${Math.floor(n / den)} ${n % den}/${den}`;
  const toMixed = (): Question => {
    const den = pick([2, 3, 4, 5, 6, 8]);
    const whole = randInt(1, 3);
    const rem = randInt(1, den - 1);
    const n = whole * den + rem;
    const right = mixedOf(n, den);
    const wrong = [...new Set([`${whole} ${den - rem}/${den}`, `${whole + 1} ${rem}/${den}`, `${rem} ${whole}/${den}`])].filter((w) => w !== right);
    return textChoice(`Write ${n}/${den} as a mixed number.`, right, wrong.slice(0, 2), "Divide the top by the bottom. The answer is the whole number. The remainder is the new top.");
  };
  const toImproper = (): Question => {
    const den = pick([2, 3, 4, 5, 6, 8]);
    const whole = randInt(1, 3);
    const rem = randInt(1, den - 1);
    const n = whole * den + rem;
    return textChoice(`Write ${whole} ${rem}/${den} as an improper fraction.`, `${n}/${den}`, [`${whole * rem}/${den}`, `${n + den}/${den}`], "Multiply the whole number by the denominator, then add the numerator.");
  };
  const compare = (): Question => {
    const dens = [2, 3, 4, 5, 6, 8, 10, 12];
    for (;;) {
      const [d1, d2] = sample(dens, 2);
      const n1 = randInt(1, d1 * 2 - 1);
      const n2 = randInt(1, d2 * 2 - 1);
      if (n1 * d2 === n2 * d1) continue;
      const bigger = n1 * d2 > n2 * d1 ? `${n1}/${d1}` : `${n2}/${d2}`;
      const smaller = bigger === `${n1}/${d1}` ? `${n2}/${d2}` : `${n1}/${d1}`;
      if (bigger === smaller) continue;
      return textChoice(`Which fraction is greater, ${n1}/${d1} or ${n2}/${d2}?`, bigger, [smaller], "Make the denominators match, or compare each fraction with 1 whole.");
    }
  };
  const addSub = (): Question => {
    const den = pick([4, 5, 6, 8, 10, 12]);
    const add = pick([true, false]);
    const a = randInt(1, den - 2);
    const b = randInt(1, den - 1 - (add ? a : 0));
    const ans = add ? a + b : Math.max(a, b) - Math.min(a, b);
    if (ans === 0 || (add && a + b >= den)) return addSub();
    const x = add ? a : Math.max(a, b);
    const y = add ? b : Math.min(a, b);
    const right = `${ans}/${den}`;
    const wrong = [`${ans}/${den * 2}`, `${ans + 1}/${den}`].filter((w) => w !== right);
    return textChoice(`What is ${x}/${den} ${add ? "+" : "−"} ${y}/${den}?`, right, wrong, `The denominators match. ${add ? "Add" : "Subtract"} the numerators and keep the denominator.`, { type: "equation", text: `${x}/${den} ${add ? "+" : "−"} ${y}/${den} = ?` });
  };
  const wholeUnit = (): Question => {
    const den = pick([2, 3, 4, 5]);
    const n = randInt(2, 6);
    return pick([
      () => textChoice(`What is ${n} × 1/${den}?`, `${n}/${den}`, [`${n}/${n * den}`, `${n * den}/${den}`], "Repeat the unit fraction. n × 1/d = n/d.", { type: "equation", text: `${n} × 1/${den} = ?` }),
      () => numQ(`How many 1/${den}s are in ${n} wholes? (${n} ÷ 1/${den})`, n * den, `Each whole has ${den} pieces of size 1/${den}. Multiply.`, undefined, 40, 2),
    ])();
  };
  return buildSet([equiv, equiv, toMixed, toImproper, compare, addSub, addSub, d === 1 ? equiv : wholeUnit]);
}

// ---------- Decimals, fractions and percents ----------

function decimals5(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const readDec = (): Question => {
    const n = randInt(1, 99);
    const frac = `${n}/100`;
    const text = n < 10 ? `0.0${n}` : `0.${n}`;
    return pick([
      () => textChoice(`Write ${frac} as a decimal.`, text, [(n / 10).toFixed(1), String(n / 1000)], "Hundredths have two places after the decimal point.", { type: "equation", text: frac }),
      () => textChoice(`Write ${text} as a fraction.`, frac, [`${n}/10`, `${n}/1000`], "Two decimal places means hundredths.", { type: "equation", text }),
    ])();
  };
  const round = (): Question => {
    const hn = randInt(101, 989);
    const tenthsN = Math.floor((hn + 5) / 10);
    const right = (tenthsN / 10).toFixed(1);
    const other = ((hn % 10 >= 5 ? tenthsN - 1 : tenthsN + 1) / 10).toFixed(1);
    const whole = String(Math.round(hn / 100));
    const wrong = [other, Number(whole) === tenthsN / 10 ? String(Math.round(hn / 100) + 1) : whole];
    return textChoice(`Round ${dec2(hn / 100)} to the nearest tenth.`, right, wrong, "Look at the hundredths digit. 5 or more, round the tenths up.");
  };
  const compare = (): Question => {
    const nums = sample(range(10, 399), 4).sort((a, b) => a - b);
    return { kind: "order", prompt: "Tap the decimals from least to greatest.", hint: "Line up the decimal points. Compare ones, then tenths, then hundredths.", items: nums.map((n) => ({ id: String(n), label: dec2(n / 100) })) };
  };
  const SETS = [
    { f: "1/2", p: 50, dd: "0.5" },
    { f: "1/4", p: 25, dd: "0.25" },
    { f: "3/4", p: 75, dd: "0.75" },
    { f: "1/5", p: 20, dd: "0.2" },
    { f: "2/5", p: 40, dd: "0.4" },
    { f: "1/10", p: 10, dd: "0.1" },
    { f: "7/10", p: 70, dd: "0.7" },
    { f: "9/10", p: 90, dd: "0.9" },
    { f: "23/100", p: 23, dd: "0.23" },
  ];
  const percent = (): Question => {
    const s = pick(SETS);
    const others3 = SETS.filter((x) => x !== s);
    return pick([
      () => textChoice(`Which percent is the same as ${s.f}?`, `${s.p}%`, sample(others3, 2).map((x) => `${x.p}%`), "A percent is a fraction out of 100.", { type: "equation", text: s.f }),
      () => textChoice(`Which decimal is the same as ${s.p}%?`, s.dd, sample(others3, 2).map((x) => x.dd), "Percent means out of 100. Write it as hundredths.", { type: "equation", text: `${s.p}%` }),
      () => textChoice(`Which fraction is the same as ${s.dd}?`, s.f, sample(others3, 2).map((x) => x.f), "Read the decimal as tenths or hundredths.", { type: "equation", text: s.dd }),
    ])();
  };
  const addDec = (): Question => {
    const a = randInt(101, 899);
    const b = randInt(101, 899);
    const sum = a + b;
    return typeIn(`What is ${dec2(a / 100)} + ${dec2(b / 100)}?`, dec(sum / 100), "Line up the decimal points. Add hundredths first.", { type: "equation", text: `${dec2(a / 100)} + ${dec2(b / 100)} = ?` }, { keypad: "decimal", accept: [dec2(sum / 100), (sum / 100).toFixed(1)].filter((v) => Number(v) === sum / 100) });
  };
  const subDec = (): Question => {
    const a = randInt(500, 999);
    const b = randInt(101, a - 50);
    const diff = a - b;
    return typeIn(`What is ${dec2(a / 100)} − ${dec2(b / 100)}?`, dec(diff / 100), "Line up the decimal points. Regroup when you need to.", { type: "equation", text: `${dec2(a / 100)} − ${dec2(b / 100)} = ?` }, { keypad: "decimal", accept: [dec2(diff / 100), (diff / 100).toFixed(1)].filter((v) => Number(v) === diff / 100) });
  };
  const estimate = (): Question => {
    const a = randInt(201, 799) / 100;
    const b = randInt(201, 799) / 100;
    const est = Math.round(a) + Math.round(b);
    return textChoice(`Estimate ${dec2(a)} + ${dec2(b)} by rounding each number to the nearest whole number.`, String(est), [String(est + 1), String(est - 1)], "Round each decimal to the nearest whole number, then add.");
  };
  return buildSet([readDec, readDec, round, compare, percent, percent, d === 1 ? addDec : estimate, d === 1 ? subDec : pick([addDec, subDec])]);
}

// ---------- Multiplying, dividing and ratios ----------

function multiplyDivide5(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const fact = (): Question => {
    const a = randInt(d === 1 ? 2 : 6, 12);
    const b = randInt(d === 1 ? 2 : 6, 12);
    return pick([
      () => typeIn(`What is ${a} × ${b}?`, a * b, "Use a fact you know and add or take away.", { type: "equation", text: `${a} × ${b} = ?` }),
      () => typeIn(`What is ${a * b} ÷ ${a}?`, b, "Think of the multiplication fact that goes with it.", { type: "equation", text: `${a * b} ÷ ${a} = ?` }),
    ])();
  };
  const twoDigit = (): Question => {
    const a = randInt(12, d === 3 ? 49 : 35);
    const b = randInt(11, d === 3 ? 39 : 25);
    const tens = Math.floor(a / 10) * 10;
    const ones = a % 10;
    return typeIn(`What is ${a} × ${b}?`, a * b, `Area model: ${tens} × ${b} + ${ones} × ${b}.`, { type: "equation", text: `${a} × ${b} = ?` });
  };
  const divide = (): Question => {
    const b = randInt(11, 25);
    const q = randInt(11, 40);
    return typeIn(`What is ${b * q} ÷ ${b}?`, q, `Estimate first. Then use the area model or the long division steps.`, { type: "equation", text: `${b * q} ÷ ${b} = ?` });
  };
  const remainder = (): Question => {
    const b = pick([12, 15, 16, 20, 24, 25]);
    const q = randInt(5, 20);
    const r = randInt(1, b - 1);
    const total = b * q + r;
    return pick([
      () => typeIn(`A school has ${total} markers. Each box holds ${b}. How many full boxes can it fill?`, q, `Divide ${total} by ${b}. The whole number part is the number of full boxes.`),
      () => typeIn(`A school has ${total} markers. Each box holds ${b}. How many markers are left over after filling as many boxes as possible?`, r, `Divide ${total} by ${b}. The remainder is what is left over.`),
    ])();
  };
  const scale = (): Question => {
    const a = randInt(2, 5);
    let b = randInt(2, 7);
    while (b === a) b = randInt(2, 7);
    const k = randInt(2, 6);
    return typeIn(`The ratio of red beads to blue beads is ${a} to ${b}. There are ${a * k} red beads. How many blue beads are there?`, b * k, `${a} × ${k} = ${a * k}, so multiply the blue part by ${k} as well.`, { type: "table", headers: ["Red", "Blue"], rows: [[a, b], [a * k, "?"]] });
  };
  const rate = (): Question => {
    const per = pick([4, 6, 8, 12, 15, 25]);
    const n = randInt(3, 9);
    return pick([
      () => typeIn(`A bike rider goes ${per} km each hour. How far does the rider go in ${n} hours?`, per * n, `For every 1 hour it is ${per} km. Multiply by ${n}.`, { type: "table", headers: ["Hours", "Kilometres"], rows: [[1, per], [2, per * 2], [3, per * 3]] }),
      () => typeIn(`A printer prints ${per} pages every minute. How many minutes does it take to print ${per * n} pages?`, n, `Divide the total pages by ${per}.`),
    ])();
  };
  const equivRatio = (): Question => {
    const a = randInt(2, 5);
    let b = randInt(2, 7);
    while (b === a) b = randInt(2, 7);
    const k = randInt(2, 4);
    const right = `${a * k} to ${b * k}`;
    const wrong = [`${a * k} to ${b * k + 1}`, `${a + k} to ${b + k}`].filter((w) => w !== right);
    return textChoice(`Which ratio is equivalent to ${a} to ${b}?`, right, wrong, "Multiply both numbers by the same amount.");
  };
  return buildSet([fact, fact, twoDigit, twoDigit, divide, remainder, d === 1 ? rate : scale, d === 1 ? rate : pick([rate, equivRatio])]);
}

// ---------- Expressions and equations ----------

function algebra5(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const translate = (): Question => {
    const k = randInt(2, 9);
    const cases: [string, string, string[]][] = [
      [`${k} more than a number n`, `n + ${k}`, [`${k} − n`, `n − ${k}`]],
      [`${k} less than a number n`, `n − ${k}`, [`${k} − n`, `n + ${k}`]],
      [`${k} times a number n`, `${k} × n`, [`n + ${k}`, `n ÷ ${k}`]],
      [`a number n divided by ${k}`, `n ÷ ${k}`, [`${k} ÷ n`, `n × ${k}`]],
      [`the sum of a number n and ${k}`, `n + ${k}`, [`n × ${k}`, `${k} − n`]],
    ];
    const [words, right, wrong] = pick(cases);
    return textChoice(`Which expression means “${words}”?`, right, wrong, "Turn each word into a symbol. Be careful with the order for subtraction and division.");
  };
  const evaluate = (): Question => {
    const n = randInt(2, 9);
    const a = randInt(2, 6);
    const b = randInt(1, 9);
    return pick([
      () => typeIn(`Evaluate ${a}n + ${b} when n = ${n}.`, a * n + b, `Put ${n} in for n: ${a} × ${n} + ${b}. Multiply first.`, { type: "equation", text: `${a}n + ${b}, n = ${n}` }),
      () => typeIn(`Evaluate ${a * 2}n − ${b} when n = ${n + 1}.`, a * 2 * (n + 1) - b, `Put ${n + 1} in for n. Multiply first, then subtract.`, { type: "equation", text: `${a * 2}n − ${b}, n = ${n + 1}` }),
    ])();
  };
  const solve = (): Question => {
    const kinds = [
      () => {
        const n = randInt(10, 70);
        const a = randInt(10, 99 - n);
        return { text: `n + ${a} = ${n + a}`, n };
      },
      () => {
        const a = randInt(10, 40);
        const n = randInt(a + 5, 100);
        return { text: `n − ${a} = ${n - a}`, n };
      },
      () => {
        const a = randInt(3, 12);
        const n = randInt(3, Math.floor(100 / a));
        return { text: `${a}n = ${a * n}`, n };
      },
      () => {
        const a = randInt(3, 9);
        const n = randInt(4, Math.floor(100 / a));
        return { text: `n ÷ ${a} = ${n}`, n: n * a };
      },
    ];
    const k = pick(d === 1 ? kinds.slice(0, 2) : kinds)();
    return typeIn("Solve for n.", k.n, "Use the opposite operation to get n by itself.", { type: "equation", text: k.text });
  };
  const inequality = (): Question => {
    const bound = randInt(15, 30);
    const a = randInt(5, 12);
    return pick([
      () => {
        const limit = bound - a;
        const right = randInt(1, limit - 1);
        return textChoice(`Which number makes n + ${a} < ${bound} true?`, String(right), sample(range(limit, limit + 6), 2).map(String), "Try each choice. The sum must be less than the number on the right.", { type: "equation", text: `n + ${a} < ${bound}` });
      },
      () => {
        const limit = bound + a;
        const right = randInt(limit + 1, Math.min(50, limit + 8));
        return textChoice(`Which number makes n − ${a} > ${bound} true?`, String(right), sample(range(Math.max(a, limit - 8), limit), 2).map(String), "Try each choice. The difference must be greater than the number on the right.", { type: "equation", text: `n − ${a} > ${bound}` });
      },
    ])();
  };
  const verify = (): Question => {
    const n = randInt(4, 15);
    const a = randInt(3, 9);
    const claim = pick([true, false]) ? n : n + pick([-1, 1, 2]);
    const ok = claim === n;
    return textChoice(`Is n = ${claim} the solution to ${a}n = ${a * n}?`, ok ? "Yes" : "No", [ok ? "No" : "Yes"], `Put ${claim} in for n. Does ${a} × ${claim} equal ${a * n}?`);
  };
  return buildSet([translate, translate, evaluate, evaluate, solve, solve, inequality, d === 1 ? solve : verify]);
}

// ---------- Data ----------

function data5(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const sampling = (): Question => {
    const bank = [
      { q: "A school wants to know the favourite lunch of ALL students. Which sample is best?", right: "ask a few students chosen at random from every grade", wrong: ["ask only your best friends", "ask only the students in one class"] },
      { q: "A town wants to know if people want a new park. Which sample is best?", right: "ask people chosen at random from all parts of the town", wrong: ["ask only people at the library", "ask only the mayor's family"] },
      { q: "Why is a representative sample important?", right: "It reflects the whole group.", wrong: ["It makes the survey shorter.", "It gives the answer you expected."] },
      { q: "Why would asking only the hockey team about favourite sports give a poor sample?", right: "Most of them would pick hockey, so it does not represent everyone.", wrong: ["The team is too small to ask.", "Hockey players do not have opinions."] },
    ];
    const b = pick(bank);
    return textChoice(b.q, b.right, b.wrong, "A good sample is random and includes all kinds of people from the group.");
  };
  const relFreq = (): Question => {
    const total = pick([10, 20, 25, 50]);
    const count = randInt(1, total - 1);
    const pct = (count * 100) / total;
    if (!Number.isInteger(pct)) return relFreq();
    return typeIn(`${count} out of ${total} students chose soccer. What percent of the students is that?`, pct, `Write ${count}/${total} as a fraction out of 100.`, { type: "equation", text: `${count}/${total} = ☐/100` }, { suffix: "%" });
  };
  const stacked = (): Question => {
    const classes = ["Room A", "Room B", "Room C"];
    const rows = classes.map((c) => ({ c, walk: randInt(3, 12), bus: randInt(3, 12), car: randInt(2, 8) }));
    const visual: Visual = { type: "table", title: "How we get to school", headers: ["Class", "Walk", "Bus", "Car"], rows: rows.map((r) => [r.c, r.walk, r.bus, r.car]) };
    const r = pick(rows);
    return pick([
      () => numQ(`How many students are in ${r.c}?`, r.walk + r.bus + r.car, "Add the three parts of the stack.", visual, 40, 5),
      () => numQ(`How many students in all three rooms take the bus?`, rows.reduce((s, x) => s + x.bus, 0), "Add the bus numbers from every room.", visual, 50, 5),
    ])();
  };
  const mean = (): Question => {
    const m = randInt(5, 15);
    for (;;) {
      const nums = range(1, 4).map(() => randInt(2, 25));
      const last = m * 5 - nums.reduce((s, x) => s + x, 0);
      if (last >= 1 && last <= 30 && new Set([...nums, last]).size === 5) return numQ("What is the mean of these numbers?", m, "Add them all, then divide by how many there are.", { type: "equation", text: shuffle([...nums, last]).join(", ") }, 30, 1);
    }
  };
  const median = (): Question => {
    const n = pick([5, 6]);
    const nums = sample(range(1, 40), n).sort((a, b) => a - b);
    const m = n % 2 ? nums[(n - 1) / 2] : (nums[n / 2 - 1] + nums[n / 2]) / 2;
    const wrong = others(nums.map(String), String(m), 2);
    return textChoice("What is the median of these numbers?", String(m), wrong, "Put the numbers in order. With two middle numbers, find the number halfway between them.", { type: "equation", text: shuffle(nums).join(", ") });
  };
  const misleading = (): Question => {
    const bank = [
      { q: "A bar graph's side scale starts at 50 instead of 0. Why can this be misleading?", right: "It makes small differences look big.", wrong: ["It makes the bars shorter than they are.", "It hides the title."] },
      { q: "A graph has no title or labels. Why is that a problem?", right: "You cannot tell what the data is about.", wrong: ["The bars will be too tall.", "It must be wrong."] },
      { q: "A graph uses pictures that get bigger in both height and width to show twice as much. Why is that misleading?", right: "The picture looks about four times as big.", wrong: ["The picture is too small to see.", "It uses too many colours."] },
    ];
    const b = pick(bank);
    return textChoice(b.q, b.right, b.wrong, "Look closely at the scale, labels and sizes before you trust a graph.");
  };
  const bimodal = (): Question => {
    const [a, b, c, e] = sample(range(1, 12), 4).sort((x, y) => x - y);
    const list = shuffle([a, a, b, c, c, e]);
    return textChoice("What are the modes of this data?", `${a} and ${c}`, [`${a} and ${b}`, `${c} and ${e}`], "The mode is the value that appears most often. There can be more than one.", { type: "equation", text: list.join(", ") });
  };
  return buildSet([sampling, relFreq, relFreq, stacked, mean, median, d === 1 ? mean : misleading, bimodal]);
}

// ---------- Probability ----------

function probability5(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const spinner = () => {
    const total = pick([4, 5, 6, 8, 10]);
    const red = randInt(1, total - 1);
    const segs = shuffle([...Array(red).fill("🔴"), ...Array(total - red).fill("🔵")]);
    return { total, red, segs };
  };
  const prob = (): Question => {
    const s = spinner();
    return textChoice("The spinner has equal sections. What is the probability of landing on red?", `${s.red}/${s.total}`, others(range(1, s.total - 1), s.red, 2).map((n) => `${n}/${s.total}`), "Probability = favourable outcomes ÷ all outcomes.", { type: "spinner", segments: s.segs });
  };
  const line = (): Question => {
    const bank = [
      { q: "On a probability line, where does an impossible event go?", right: "0", wrong: ["1/2", "1"] },
      { q: "On a probability line, where does a certain event go?", right: "1", wrong: ["0", "1/2"] },
      { q: "On a probability line, where does an event that is equally likely and unlikely to happen go?", right: "1/2", wrong: ["0", "1"] },
      { q: "A probability of 9/10 is…", right: "very likely", wrong: ["unlikely", "impossible"] },
      { q: "A probability of 1/10 is…", right: "unlikely", wrong: ["likely", "certain"] },
    ];
    const b = pick(bank);
    return textChoice(b.q, b.right, b.wrong, "Probabilities go from 0 (impossible) to 1 (certain).");
  };
  const experimental = (): Question => {
    const total = pick([10, 20, 25, 40]);
    let hits = randInt(2, total - 2);
    if (hits * 2 === total) hits += 1;
    return textChoice(`A coin is tossed ${total} times and lands on heads ${hits} times. What is the experimental probability of heads?`, `${hits}/${total}`, ["1/2", `${total - hits}/${total}`], "Experimental probability = times it happened ÷ times you tried.");
  };
  const theoretical = (): Question =>
    pick([
      () => textChoice("What is the theoretical probability of rolling a 3 on a regular die?", "1/6", ["1/3", "3/6"], "There are 6 equally likely outcomes. One of them is a 3."),
      () => textChoice("What is the theoretical probability of tossing tails on a fair coin?", "1/2", ["1/4", "2/1"], "There are 2 equally likely outcomes. One of them is tails."),
      () => textChoice("What is the theoretical probability of rolling an even number on a regular die?", "3/6", ["1/6", "2/6"], "Even numbers are 2, 4 and 6. That is 3 out of 6."),
    ])();
  const predict = (): Question => {
    const times = pick([40, 60, 80, 100]);
    const den = pick([2, 4, 5, 10]);
    return typeIn(`A spinner lands on red with probability 1/${den}. About how many times would you expect red in ${times} spins?`, times / den, `Find 1/${den} of ${times}. Divide by ${den}.`);
  };
  const compare = (): Question =>
    pick([
      () => textChoice("Aiyana tossed a coin 10 times and got 7 heads. What is true?", "Experimental probability can be different from theoretical probability.", ["The coin must be unfair.", "The next toss must be tails."], "Small experiments often differ from the theory. More trials usually get closer."),
      () => textChoice("When you do more and more trials, the experimental probability usually…", "gets closer to the theoretical probability", ["gets farther away", "turns into 0"], "Many trials even out the luck."),
    ])();
  return buildSet([prob, prob, line, line, experimental, theoretical, d === 1 ? line : predict, compare]);
}

// ---------- Geometry ----------

function geometry5(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const bySides = (): Question => {
    const cases = [
      { s: [5, 5, 5], t: "equilateral" },
      { s: [6, 6, 9], t: "isosceles" },
      { s: [7, 7, 4], t: "isosceles" },
      { s: [4, 5, 6], t: "scalene" },
      { s: [7, 9, 12], t: "scalene" },
      { s: [8, 8, 8], t: "equilateral" },
    ];
    const c = pick(cases);
    return textChoice(`A triangle has sides ${c.s.join(" cm, ")} cm. What kind of triangle is it?`, c.t, ["equilateral", "isosceles", "scalene"].filter((t) => t !== c.t), "Equilateral: 3 equal sides. Isosceles: 2 equal sides. Scalene: no equal sides.");
  };
  const byAngles = (): Question => {
    const cases = [
      { a: [60, 60, 60], t: "acute" },
      { a: [50, 60, 70], t: "acute" },
      { a: [90, 45, 45], t: "right" },
      { a: [90, 30, 60], t: "right" },
      { a: [30, 30, 120], t: "obtuse" },
      { a: [20, 40, 120], t: "obtuse" },
    ];
    const c = pick(cases);
    return textChoice(`A triangle has angles ${c.a.join("°, ")}°. What kind of triangle is it?`, `${c.t} triangle`, ["acute", "right", "obtuse"].filter((t) => t !== c.t).map((t) => `${t} triangle`), "An acute triangle has three acute angles. A right triangle has a 90° angle. An obtuse triangle has one angle bigger than 90°.");
  };
  const canMake = (): Question => {
    const a = randInt(3, 8);
    const b = randInt(3, 8);
    const ok = pick([true, false]);
    const c = ok ? randInt(Math.abs(a - b) + 1, a + b - 1) : a + b + randInt(1, 4);
    return textChoice(`Can you make a triangle with sides ${a} cm, ${b} cm and ${c} cm?`, ok ? "Yes" : "No", [ok ? "No" : "Yes"], "The two shorter sides must add up to more than the longest side.");
  };
  const congruent = (): Question =>
    pick([
      () => textChoice("Two rectangles are congruent. Which must be true?", "They have the same length and width.", ["They have different areas.", "They have different angles."], "Congruent shapes match exactly."),
      () => textChoice("A parallelogram is turned, flipped or slid. Is it still congruent to the original?", "Yes, moving a shape does not change its size or shape", ["No, it becomes a different shape", "No, it gets bigger"], "Slides, flips and turns keep the shape the same."),
    ])();
  const views = (): Question =>
    pick([
      () => textChoice("What is the top view of a cylinder standing on its base?", "a circle", ["a rectangle", "a triangle"], "Look straight down at the top. You see the round end."),
      () => textChoice("What is the front view of a cylinder standing on its base?", "a rectangle", ["a circle", "a triangle"], "Look from the side. You see the flat curved side."),
      () => textChoice("What is the top view of a cube?", "a square", ["a triangle", "a circle"], "Look straight down at the top face."),
      () => textChoice("What is the front view of a cone standing on its base?", "a triangle", ["a circle", "a rectangle"], "From the side, a cone comes to a point at the top."),
    ])();
  const coordinate = (): Question => {
    const x = randInt(2, 8);
    const y = randInt(5, 11);
    const dx = randInt(2, 6);
    const dy = randInt(2, 5);
    const up = pick([true, false]);
    const ny = up ? y + dy : y - dy;
    const right = `(${x + dx}, ${ny})`;
    return textChoice(`Point A is at (${x}, ${y}). It moves ${dx} right and ${dy} ${up ? "up" : "down"}. Where does it land?`, right, [ny === x + dx ? `(${x + dx + 1}, ${ny})` : `(${ny}, ${x + dx})`, `(${x + dx}, ${up ? y - dy : y + dy})`], "Right adds to x. Up adds to y. Down takes away from y.", { type: "grid", size: 16, points: [{ x, y, label: "A" }] });
  };
  const transform = (): Question =>
    pick([
      () => textChoice("Which move turns a shape upside down with a half turn?", "a rotation of 180°", ["a translation", "a reflection"], "A 180° rotation is a half turn around a point."),
      () => textChoice("A shape is rotated 180°. What happens to its size?", "It stays the same.", ["It doubles.", "It is cut in half."], "Rotations, reflections and translations keep the size and shape."),
      () => textChoice("A shape is reflected in a vertical line. What happens?", "It becomes a mirror image on the other side.", ["It slides without turning.", "It turns around a corner."], "A reflection is a flip across a line."),
    ])();
  return buildSet([bySides, bySides, byAngles, canMake, canMake, congruent, d === 1 ? views : coordinate, d === 3 ? transform : pick([views, transform])]);
}

// ---------- Measurement ----------

function measure5(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const convert = (): Question => {
    const n = randInt(2, 9);
    return pick([
      () => typeIn(`${n} km = ☐ m`, n * 1000, "1 kilometre is 1000 metres.", { type: "equation", text: `${n} km = ☐ m` }),
      () => typeIn(`${n} m = ☐ cm`, n * 100, "1 metre is 100 centimetres.", { type: "equation", text: `${n} m = ☐ cm` }),
      () => typeIn(`${n} kg = ☐ g`, n * 1000, "1 kilogram is 1000 grams.", { type: "equation", text: `${n} kg = ☐ g` }),
      () => typeIn(`${n} L = ☐ mL`, n * 1000, "1 litre is 1000 millilitres.", { type: "equation", text: `${n} L = ☐ mL` }),
      () => typeIn(`${n} cm = ☐ mm`, n * 10, "1 centimetre is 10 millimetres.", { type: "equation", text: `${n} cm = ☐ mm` }),
    ])();
  };
  const parallelogram = (): Question => {
    const b = randInt(4, 14);
    const h = randInt(3, 10);
    return typeIn(`A parallelogram has a base of ${b} cm and a height of ${h} cm. What is its area in square centimetres?`, b * h, "Area of a parallelogram = base × height.", { type: "equation", text: `${b} × ${h} = ?` });
  };
  const triangle = (): Question => {
    const b = randInt(3, 14);
    const h = 2 * randInt(2, 7);
    return typeIn(`A triangle has a base of ${b} cm and a height of ${h} cm. What is its area in square centimetres?`, (b * h) / 2, "Area of a triangle = base × height ÷ 2. A triangle is half of a parallelogram.", { type: "equation", text: `${b} × ${h} ÷ 2 = ?` });
  };
  const samePerimeter = (): Question => {
    const n = pick([24, 36, 48, 30]);
    const pairs = range(1, 12).filter((a) => n % a === 0 && a <= n / a).map((a) => [a, n / a] as [number, number]);
    const [a, b] = sample(pairs, 2);
    const p1 = 2 * (a[0] + a[1]);
    const p2 = 2 * (b[0] + b[1]);
    if (p1 === p2) return samePerimeter();
    const small = p1 < p2 ? a : b;
    const big = p1 < p2 ? b : a;
    return textChoice(`A ${a[0]} by ${a[1]} rectangle and a ${b[0]} by ${b[1]} rectangle both have an area of ${n} square units. Which has the smaller perimeter?`, `${small[0]} by ${small[1]}`, [`${big[0]} by ${big[1]}`], "Work out the perimeter of each: 2 × (length + width).");
  };
  const angleEst = (): Question => {
    const deg = pick([30, 45, 60, 120, 135, 150]);
    const wrong = others([30, 45, 60, 90, 120, 135, 150], deg, 6).filter((w) => Math.abs(w - deg) >= 30).slice(0, 2);
    return textChoice("About how big is this angle? Use 90° as a benchmark.", `${deg}°`, wrong.map((w) => `${w}°`), "A right angle is 90°. Half of it is 45°. A straight angle is 180°.", { type: "angle", degrees: deg });
  };
  const protractor = (): Question =>
    pick([
      () => textChoice("What does a protractor measure?", "angles", ["lengths", "mass"], "A protractor is a half circle marked in degrees."),
      () => textChoice("The biggest angle a regular protractor measures is…", "180°", ["90°", "360°"], "A regular protractor is a half circle."),
      () => textChoice("An angle measures 120°. What kind of angle is it?", "obtuse", ["acute", "right"], "Obtuse angles are bigger than 90° and less than 180°."),
    ])();
  const unit = (): Question =>
    pick([
      () => textChoice("Which unit is best for the area of a bedroom floor?", "square metres", ["square centimetres", "square kilometres"], "A bedroom is small, but a square centimetre is tiny."),
      () => textChoice("Which unit is best for the area of a stamp?", "square centimetres", ["square metres", "square kilometres"], "A stamp is very small."),
      () => textChoice("Which unit is best for the length of a hockey rink?", "metres", ["millimetres", "kilometres"], "A rink is longer than a few steps but shorter than a kilometre."),
    ])();
  return buildSet([convert, convert, parallelogram, triangle, samePerimeter, angleEst, d === 1 ? protractor : pick([protractor, unit]), d === 3 ? triangle : unit]);
}

// ---------- Money ----------

function money5(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const transfer = (): Question =>
    pick([
      () => textChoice("Which is a way to send money to a friend online?", "an e-transfer", ["a library card", "a coupon"], "An e-transfer moves money from one bank account to another."),
      () => textChoice("A paper that tells a bank to pay money from your account to someone is called a…", "cheque", ["receipt", "coupon"], "A cheque is a written instruction to a bank."),
      () => textChoice("When a business pays an employee, what is that money called?", "wages or salary", ["a refund", "a tax"], "Wages are what workers earn."),
    ])();
  const withTax = (): Question => {
    const price = pick([10, 20, 30, 40, 50, 90]);
    const tax = price * 0.13;
    const total = price + tax;
    return textChoice(`A pair of boots costs $${price}. HST is 13%. What is the total cost?`, money(total), [money(price + 13), money(tax)], "Find 13% of the price, then add it to the price.", { type: "emoji", emoji: "🥾" });
  };
  const budget = (): Question => {
    const earn = pick([40, 50, 60, 80]);
    const a = randInt(5, 15);
    const b = randInt(5, 15);
    const c = randInt(2, 9);
    const left = earn - a - b - c;
    return numQ(`Maya earns $${earn} a month. She spends $${a} on snacks, $${b} on games and $${c} on gifts. How much is left to save?`, left, "Add what she spends, then subtract from what she earns.", { type: "table", headers: ["Item", "Dollars"], rows: [["Earn", earn], ["Snacks", a], ["Games", b], ["Gifts", c]] }, earn, 0);
  };
  const credit = (): Question =>
    pick([
      () => textChoice("The extra money you pay back when you borrow is called…", "interest", ["a refund", "a deposit"], "Interest is the cost of borrowing."),
      () => textChoice("Money that you owe is called…", "debt", ["savings", "income"], "Debt is what you must pay back."),
      () => textChoice("Which is a good reason to be careful with credit?", "you have to pay back more than you borrowed", ["it is always free", "it never needs to be paid back"], "Credit is borrowed money, and it usually costs interest."),
    ])();
  const unitRate = (): Question => {
    const per = randInt(12, 30) / 10;
    const n = randInt(2, 6);
    const total = Math.round(per * n * 100) / 100;
    return typeIn(`${n} litres of juice cost ${money(total)}. What is the cost per litre in dollars?`, dec(total / n), `Divide ${money(total)} by ${n}.`, undefined, { keypad: "decimal", accept: [dec2(total / n)] });
  };
  const bestValue = (): Question => {
    for (;;) {
      const n1 = randInt(2, 5);
      const n2 = randInt(2, 8);
      if (n1 === n2) continue;
      const p1 = randInt(n1 * 10, n1 * 40) / 10;
      const p2 = randInt(n2 * 10, n2 * 40) / 10;
      const r1 = p1 / n1;
      const r2 = p2 / n2;
      if (Math.abs(r1 - r2) < 0.2) continue;
      const better = r1 < r2 ? "A" : "B";
      return textChoice(`Pack A has ${n1} bottles for ${money(p1)}. Pack B has ${n2} bottles for ${money(p2)}. Which pack is the better value?`, `Pack ${better}`, [`Pack ${better === "A" ? "B" : "A"}`], "Find the cost of one bottle in each pack. Lower is better value.");
    }
  };
  const taxes = (): Question =>
    pick([
      () => textChoice("Which tax is added to the price at the store?", "sales tax (HST)", ["property tax", "income tax"], "Sales tax is added at the till."),
      () => textChoice("Which tax is paid on money a person earns?", "income tax", ["sales tax", "property tax"], "Income tax is taken from earnings."),
      () => textChoice("Which tax is based on the value of a home?", "property tax", ["income tax", "sales tax"], "People who own a home or land pay property tax."),
      () => textChoice("What do governments use tax money for?", "services like schools, roads and hospitals", ["only for prizes", "nothing"], "Tax money pays for things people use together."),
    ])();
  return buildSet([transfer, withTax, withTax, budget, credit, unitRate, d === 1 ? credit : bestValue, taxes]);
}

export const units: Unit[] = [
  {
    id: "numbers-100k",
    title: "Big Numbers",
    emoji: "🔢",
    blurb: "Numbers up to 100 000",
    standards: on("B1.1, B1.2, B2.3", "reading, comparing and ordering whole numbers to 100 000, and multiplying by 0.1 and 0.01"),
    parentNote: "Place value to 100 000, comparing and ordering big numbers, expanded form, and multiplying by 0.1 and 0.01 as a way to divide by 10 and 100.",
    generate: numbers100k,
  },
  {
    id: "fractions-5",
    title: "Fractions",
    emoji: "🍰",
    blurb: "Mixed numbers and adding",
    standards: on("B1.3, B1.4, B2.5, B2.8", "equivalent, improper and mixed fractions, comparing them, adding and subtracting like denominators, and whole numbers by unit fractions"),
    parentNote: "Equivalent fractions up to twelfths, improper fractions and mixed numbers, comparing fractions, adding and subtracting with the same denominator, and multiplying a whole number by a unit fraction.",
    generate: fractions5,
  },
  {
    id: "decimals-5",
    title: "Decimals & Percents",
    emoji: "💯",
    blurb: "Hundredths and percents",
    standards: on("B1.5–B1.7, B2.3, B2.4", "decimals to hundredths, rounding, percents, and adding and subtracting decimals"),
    parentNote: "Reading, comparing and rounding decimals to hundredths, linking fractions, decimals and percents, estimating, and adding and subtracting decimals.",
    generate: decimals5,
  },
  {
    id: "multiply-divide-5",
    title: "Multiply, Divide & Ratios",
    emoji: "✖️",
    blurb: "Two-digit numbers and ratios",
    standards: on("B2.2, B2.6, B2.7, B2.9", "multiplication facts to 12 × 12, two-digit by two-digit multiplication, dividing by two-digit numbers, and equivalent ratios and rates"),
    parentNote: "Facts to 12 × 12, multiplying two two-digit numbers, dividing three-digit numbers by two-digit numbers, and using equivalent ratios and rates.",
    generate: multiplyDivide5,
  },
  {
    id: "algebra-5",
    title: "Expressions & Equations",
    emoji: "🔤",
    blurb: "Letters stand for numbers",
    standards: on("C2.1–C2.4", "translating words to expressions, evaluating expressions, and solving equations and inequalities"),
    parentNote: "Writing expressions like n + 5 for “5 more than a number”, evaluating them, solving equations to 100, and finding numbers that make an inequality true.",
    generate: algebra5,
  },
  {
    id: "data-5",
    title: "Data & Samples",
    emoji: "📊",
    blurb: "Samples, mean and misleading graphs",
    standards: on("D1.1–D1.6", "sampling, relative frequency, stacked-bar graphs, mean, median and mode, and misleading graphs"),
    parentNote: "Choosing a fair sample, using percents to compare groups, reading stacked-bar graphs, finding mean, median and mode, and spotting misleading graphs.",
    generate: data5,
  },
  {
    id: "probability-5",
    title: "Probability",
    emoji: "🎲",
    blurb: "Fractions and experiments",
    standards: on("D2.1, D2.2", "probability as a fraction, the probability line, and theoretical and experimental probability"),
    parentNote: "Writing probability as a fraction, placing events on a probability line from 0 to 1, and comparing what should happen with what happens in an experiment.",
    generate: probability5,
  },
  {
    id: "shapes-5",
    title: "Triangles & Moves",
    emoji: "🔺",
    blurb: "Triangles, views and transformations",
    standards: on("E1.1–E1.5", "types of triangles, congruent shapes, top, front and side views, coordinates and transformations"),
    parentNote: "Sorting triangles by sides and angles, knowing when a triangle can be made, seeing 3D objects from different views, and sliding, flipping and turning shapes on a grid.",
    generate: geometry5,
  },
  {
    id: "measure-5",
    title: "Measure It",
    emoji: "📏",
    blurb: "Metric units, area and angles",
    standards: on("E2.1–E2.6", "metric conversions, angles and protractors, and the area of parallelograms and triangles"),
    parentNote: "Converting larger metric units to smaller ones, estimating and classifying angles, finding the area of parallelograms and triangles, and seeing that shapes with the same area can have different perimeters.",
    generate: measure5,
  },
  {
    id: "money-5",
    title: "Money & Taxes",
    emoji: "🧾",
    blurb: "Tax, budgets and best value",
    standards: on("F1.1–F1.6", "moving money, total costs with sales tax, budgets, credit and debt, unit rates and taxes"),
    parentNote: "Ways money moves, working out a price with 13% HST, planning a budget, understanding interest and debt, finding the best value with unit rates, and what taxes pay for.",
    generate: money5,
  },
];
