import { describe, expect, it } from "vitest";
import { withSeed } from "@/content/random";
import type { GradeId } from "@/content/types";
import { bubbleRound, catchRounds, memoryPairs, muncherRules, ninjaRound, shuffled, type MuncherRule } from "./content";

const GRADES: GradeId[] = ["k", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const band = (grade: GradeId) => (grade === "k" ? 0 : Number(grade));

const isPrime = (n: number) => n > 1 && Array.from({ length: Math.floor(Math.sqrt(n)) - 1 }, (_, i) => i + 2).every((d) => n % d !== 0);

/** Whether a cell really matches the rule its title states. Independent of the generator. */
function fits(title: string, text: string): boolean {
  const num = (re: RegExp) => Number(title.match(re)?.[1]);
  if (/^Munch the \d+s$/.test(title)) return Number(text) === num(/^Munch the (\d+)s$/);
  if (/^Munch numbers bigger than \d+$/.test(title)) return Number(text) > num(/(\d+)$/);
  if (/^Munch numbers smaller than \d+$/.test(title)) return Number(text) < num(/(\d+)$/);
  if (title === "Munch even numbers") return Number(text) % 2 === 0;
  if (title === "Munch odd numbers") return Number(text) % 2 === 1;
  if (/^Munch multiples of \d+$/.test(title)) return Number(text) % num(/(\d+)$/) === 0;
  if (/^Munch numbers between \d+ and \d+$/.test(title)) {
    const [, lo, hi] = title.match(/(\d+) and (\d+)/)!;
    const n = Number(text);
    return n > Number(lo) && n < Number(hi);
  }
  if (/^Munch sums that make \d+$/.test(title)) {
    const [a, b] = text.split("+").map(Number);
    return a + b === num(/(\d+)$/);
  }
  if (/^Munch products that make \d+$/.test(title)) {
    const [a, b] = text.split("×").map(Number);
    return a * b === num(/(\d+)$/);
  }
  if (title === "Munch prime numbers") return isPrime(Number(text));
  if (/^Munch factors of \d+$/.test(title)) return num(/(\d+)$/) % Number(text) === 0;
  if (title === "Munch numbers that round to 100") {
    const n = Number(text);
    return n >= 50 && n < 150 && Math.round(n / 100) * 100 === 100;
  }
  if (title === "Munch negative numbers") return Number(text) < 0;
  if (title === "Munch decimals bigger than 0.5") return Number(text) > 0.5;
  if (title === "Munch fractions equal to ½") {
    const [n, d] = text.split("/").map(Number);
    return d > 0 && n * 2 === d;
  }
  throw new Error(`No checker for “${title}”`);
}

function checkCells(rule: MuncherRule) {
  for (const want of [true, false]) {
    for (let i = 0; i < 12; i++) {
      const cell = rule.cell(want);
      expect(cell.good, `${rule.title}: ${cell.text}`).toBe(want);
      expect(fits(rule.title, cell.text), `${rule.title}: ${cell.text}`).toBe(want);
      if (!want) expect(rule.why(cell.text).length).toBeGreaterThan(0);
    }
  }
}

describe("Number Munchers", () => {
  it("only marks a cell right when it really fits the rule", () => {
    for (const grade of GRADES) {
      const rules = withSeed(band(grade) + 11, () => muncherRules(grade));
      expect(rules.length).toBeGreaterThanOrEqual(3);
      for (const rule of rules) checkCells(rule);
      const titles = rules.map((r) => r.title).join(" ");
      expect(titles.includes("negative")).toBe(band(grade) >= 7);
      expect(titles.includes("decimal")).toBe(band(grade) >= 6);
      if (grade === "k") {
        for (const rule of rules) {
          const n = Number(rule.cell(true).text);
          expect(n).toBeGreaterThanOrEqual(0);
          expect(n).toBeLessThanOrEqual(10);
        }
      }
    }
  });
});

describe("Word Ninja", () => {
  it("never lists a word as both a target and a decoy, and the words fit the grade", () => {
    for (const grade of GRADES) {
      for (let seed = 1; seed <= 12; seed++) {
        const round = withSeed(seed + band(grade) * 20, () => ninjaRound(grade));
        const overlap = round.targets.filter((w) => round.decoys.includes(w));
        expect(overlap, `${grade} ${round.title}`).toEqual([]);
        expect(round.targets.length).toBeGreaterThan(0);
        expect(round.decoys.length).toBeGreaterThan(0);
        expect(round.speak.length).toBeGreaterThan(0);
        const g = band(grade);
        if (g <= 3) {
          expect(round.targets).toEqual([round.title]);
          expect(round.decoys).toHaveLength(10);
          expect(round.speak).toBe(`Slice the word ${round.title}`);
        } else if (g <= 5) {
          expect(round.title).toMatch(/^Slice the (nouns|verbs|adjectives)$/);
          if (round.title.endsWith("nouns")) expect(round.targets).toContain("dog");
          if (round.title.endsWith("verbs")) expect(round.targets).toContain("run");
          if (round.title.endsWith("adjectives")) expect(round.targets).toContain("happy");
          expect(round.decoys.some((w) => round.targets.includes(w))).toBe(false);
        } else {
          expect(round.title).toMatch(/Slice words that mean “(big|happy|fast|smart)”/);
          if (round.title.includes("big")) {
            expect(round.targets).toContain("huge");
            expect(round.decoys).toContain("tiny");
          }
          if (round.title.includes("happy")) expect(round.decoys).toContain("sad");
          if (round.title.includes("fast")) expect(round.decoys).toContain("slow");
          if (round.title.includes("smart")) expect(round.targets).toContain("clever");
        }
      }
    }
  });
});

describe("Critter Catch", () => {
  it("keeps the right critters in the right round for the grade", () => {
    const expectRound = (grade: GradeId, title: string, good: string, bad: string) => {
      const round = catchRounds(grade).find((r) => r.title === title);
      expect(round, title).toBeDefined();
      expect(round!.good.map((c) => c.label)).toContain(good);
      expect(round!.bad.map((c) => c.label)).toContain(bad);
      const labels = [...round!.good, ...round!.bad].map((c) => c.label);
      expect(new Set(labels).size).toBe(labels.length);
    };

    for (const grade of GRADES) {
      const titles = catchRounds(grade).map((r) => r.title);
      expect(titles[0]).toBe("Catch living things");
      expectRound(grade, "Catch living things", "dog", "rock");
      const g = band(grade);
      if (g <= 1) {
        expect(titles).toEqual(["Catch living things", "Catch things that give light", "Catch warm-weather things"]);
        expectRound(grade, "Catch things that give light", "sun", "moon");
        expectRound(grade, "Catch warm-weather things", "shorts", "mittens");
      } else if (g <= 3) {
        expect(titles).toEqual(["Catch living things", "Catch the solids", "Catch things a magnet pulls"]);
        expectRound(grade, "Catch the solids", "ice", "milk");
        expectRound(grade, "Catch things a magnet pulls", "paper clip", "wood");
      } else if (g <= 5) {
        expect(titles).toEqual(["Catch living things", "Catch the plant-eaters", "Catch renewable resources"]);
        expectRound(grade, "Catch the plant-eaters", "rabbit", "lion");
        expectRound(grade, "Catch renewable resources", "sunlight", "oil");
      } else {
        expect(titles).toEqual(["Catch living things", "Catch the planets", "Catch electrical conductors"]);
        expectRound(grade, "Catch the planets", "Earth", "Sun");
        expectRound(grade, "Catch electrical conductors", "steel bolt", "wood");
      }
    }
  });
});

describe("Bubble Pop", () => {
  it("pops letters, rhymes or word skills that really belong, and never both lists", () => {
    const seen = new Set<string>();
    for (let seed = 1; seed <= 40; seed++) {
      for (const grade of ["3", "4", "6", "9"] as GradeId[]) {
        const round = withSeed(seed, () => bubbleRound(grade));
        seen.add(round.title);
        const overlap = round.good.filter((w) => round.bad.includes(w));
        expect(overlap, round.title).toEqual([]);
        if (round.title.startsWith("Pop words with the prefix")) {
          expect(round.good).toContain("unhappy");
          expect(round.bad).toContain("under");
        }
        if (round.title === "Pop correctly spelled words") {
          expect(round.good).toContain("because");
          expect(round.bad).toContain("becuase");
        }
        if (round.title === "Pop words with 3 syllables") {
          expect(round.good).toContain("banana");
          expect(round.bad).toEqual(expect.arrayContaining(["apple", "watermelon"]));
        }
      }
    }
    expect([...seen].sort()).toEqual(["Pop correctly spelled words", "Pop words with 3 syllables", "Pop words with the prefix un-"]);

    for (let seed = 1; seed <= 8; seed++) {
      const letter = withSeed(seed, () => bubbleRound("k"));
      expect(letter.good).toHaveLength(2);
      expect(letter.good[0].toLowerCase()).toBe(letter.good[1].toLowerCase());
      expect(letter.bad).not.toContain(letter.good[0]);
      expect(letter.bad).not.toContain(letter.good[1]);

      const rhyme = withSeed(seed, () => bubbleRound("2"));
      const head = rhyme.title.replace("Pop words that rhyme with ", "");
      const ending = [...head].reduce((suffix) => {
        const next = head.slice(head.length - suffix.length - 1);
        return rhyme.good.every((w) => w.endsWith(next)) ? next : suffix;
      }, "");
      expect(ending.length).toBeGreaterThanOrEqual(2);
      expect(rhyme.good).not.toContain(head);
      for (const word of rhyme.bad) expect(word.endsWith(ending), word).toBe(false);
    }
  });
});

describe("Memory Match", () => {
  const FACTS: Record<string, string> = {
    "3 + 4": "7",
    "5 × 2": "10",
    "7 × 8": "56",
    "9 × 9": "81",
    "½": "50%",
    "0.3": "30%",
    "British Columbia": "Victoria",
    Ontario: "Toronto",
    hot: "cold",
    Egypt: "pyramids",
    "🐄": "🥛",
  };

  it("pairs a prompt with its real match, and the set fits the grade", () => {
    for (const grade of GRADES) {
      expect(withSeed(1, () => memoryPairs(grade, 3))).toHaveLength(3);
      expect(withSeed(1, () => memoryPairs(grade, 20))).toHaveLength(8);
      for (let seed = 1; seed <= 10; seed++) {
        const pairs = withSeed(seed, () => memoryPairs(grade, 8));
        const left = pairs.map((p) => p.a);
        expect(new Set(left).size).toBe(left.length);
        for (const { a, b } of pairs) {
          expect(a).not.toBe(b);
          if (FACTS[a]) expect(b, a).toBe(FACTS[a]);
        }
        const sample = pairs.map((p) => p.a).join(" ");
        const g = band(grade);
        const equation = /\d/.test(sample);
        const province = sample.includes("British Columbia") || sample.includes("Ontario");
        const percent = sample.includes("%") || sample.includes("½");
        const story = sample.includes("Egypt") || sample.includes("Rome");
        if (g <= 1) expect(equation || province || percent).toBe(false);
        if (g >= 2 && g <= 3) expect(province || percent).toBe(false);
        if (g >= 4 && g <= 5) expect(equation || province).toBe(true);
        if (g >= 6) expect(percent || story).toBe(true);
      }
    }
  });
});

describe("shuffled", () => {
  it("keeps every item and drops none", () => {
    const items = ["a", "b", "c", "d", "e"];
    expect(withSeed(4, () => shuffled(items)).slice().sort()).toEqual([...items].sort());
    expect(items).toEqual(["a", "b", "c", "d", "e"]);
  });
});
