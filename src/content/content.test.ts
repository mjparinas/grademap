import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { COURSES } from "./all";
import { allUnitRefs, AVAILABLE_GRADES, coursesForGrade, coursesInFramework, getUnitRef, isGradeLoaded, loadGrade, parseUnitKey, unitKey } from "./index";
import { ageBandFor } from "./subjects";
import type { Course, FrameworkId, Question, Visual } from "./types";

const RUNS = 120;

// The official Saskatchewan outcomes (docs/research/saskatchewan). Unit standards cite them by code.
const SK_OUTCOMES = JSON.parse(readFileSync(join(__dirname, "../../docs/research/saskatchewan/outcomes.json"), "utf8")) as Record<
  string,
  Record<string, { outcomes: { code: string }[] }[]>
>;

// The official Manitoba outcomes (docs/research/manitoba). Unit standards cite them by code.
// The official Nova Scotia outcomes (docs/research/nova-scotia). Unit standards cite them by code, or by bundle or outcome title.
// The official New Brunswick curriculum (docs/research/new-brunswick). Unit standards cite its strand and big idea ("Number: Operations").
const NB_OUTCOMES = JSON.parse(readFileSync(join(__dirname, "../../docs/research/new-brunswick/outcomes.json"), "utf8")) as Record<string, { idx: string }[]>;
const NS_OUTCOMES = JSON.parse(readFileSync(join(__dirname, "../../docs/research/nova-scotia/outcomes.json"), "utf8")) as Record<string, { idx: string }[]>;
const MB_OUTCOMES = JSON.parse(readFileSync(join(__dirname, "../../docs/research/manitoba/outcomes.json"), "utf8")) as Record<string, { idx: string }[]>;

// The official Ontario expectations (docs/research/ontario). Unit standards cite them by code.
const ONTARIO_EXPECTATIONS = JSON.parse(readFileSync(join(__dirname, "../../docs/research/ontario/expectations.json"), "utf8")) as Record<
  string,
  { idx: string; kind: string }[]
>;

/** The codes a standard cites, e.g. "B1.1–B1.3, B2.2 · ..." gives B1.1, B1.3, B2.2. */
function citedCodes(standard: string): string[] {
  return (standard.split(" · ")[0].match(/[A-F]\d{1,2}(?:\.\d{1,2})?/g) ?? []).filter(Boolean);
}

const KEYPAD_PATTERN: Record<string, RegExp> = {
  number: /^\d+$/,
  integer: /^-?\d+$/,
  decimal: /^-?\d+(\.\d+)?$/,
  fraction: /^-?\d+(\/\d+|\.\d+)?$/,
};

function numericValue(text: string): number {
  if (text.includes("/")) {
    const [a, b] = text.split("/").map(Number);
    return a / b;
  }
  return Number(text);
}

function checkVisual(v: Visual) {
  switch (v.type) {
    case "numberLine":
      expect(v.max).toBeGreaterThan(v.min);
      expect(v.step).toBeGreaterThan(0);
      expect((v.max - v.min) / v.step).toBeLessThanOrEqual(40);
      if (v.blankAt !== undefined) {
        expect(v.blankAt).toBeGreaterThanOrEqual(v.min);
        expect(v.blankAt).toBeLessThanOrEqual(v.max);
      }
      break;
    case "fraction":
      expect(v.denominator).toBeGreaterThan(0);
      expect(v.denominator).toBeLessThanOrEqual(24);
      expect(v.numerator).toBeGreaterThanOrEqual(0);
      expect(v.numerator).toBeLessThanOrEqual(v.denominator * 3);
      break;
    case "clock":
      expect(v.hour).toBeGreaterThanOrEqual(1);
      expect(v.hour).toBeLessThanOrEqual(12);
      expect(v.minute).toBeGreaterThanOrEqual(0);
      expect(v.minute).toBeLessThanOrEqual(59);
      break;
    case "array":
      expect(v.rows).toBeGreaterThanOrEqual(1);
      expect(v.cols).toBeGreaterThanOrEqual(1);
      expect(v.rows * v.cols).toBeLessThanOrEqual(144);
      break;
    case "dots":
      expect(v.count).toBeGreaterThanOrEqual(0);
      expect(v.count).toBeLessThanOrEqual(30);
      break;
    case "blocks":
      expect(v.hundreds ?? 0).toBeLessThanOrEqual(9);
      expect(v.tens).toBeLessThanOrEqual(19);
      expect(v.ones).toBeLessThanOrEqual(19);
      break;
    case "grid":
      for (const p of v.points) {
        expect(Math.abs(p.x)).toBeLessThanOrEqual(v.size);
        expect(Math.abs(p.y)).toBeLessThanOrEqual(v.size);
      }
      break;
    case "bars":
      expect(v.bars.length).toBeGreaterThanOrEqual(2);
      break;
    case "pictograph":
      expect(v.rows.length).toBeGreaterThanOrEqual(2);
      if (v.each !== undefined) expect(Number.isInteger(v.each) && v.each >= 1).toBe(true);
      for (const r of v.rows) expect(r.count).toBeLessThanOrEqual(20);
      break;
    case "angle":
      expect(v.degrees).toBeGreaterThan(0);
      expect(v.degrees).toBeLessThan(360);
      break;
  }
}

/**
 * Evaluates arithmetic like "7 × (-8) + 3" or "(4 + 2) ÷ 3" with the usual order
 * of operations. Returns undefined for anything else (words, unknowns, units).
 */
function evaluate(text: string): number | undefined {
  // Skip mixed numbers ("7 1/2") and spaced thousands ("12 500").
  if (/\d\s+\d/.test(text)) return undefined;
  const src = text.replace(/−/g, "-").replace(/×/g, "*").replace(/÷/g, "/").replace(/\s+/g, "");
  if (!/^[\d.+\-*/()]+$/.test(src) || !/[+\-*/]/.test(src.replace(/^-/, ""))) return undefined;
  let i = 0;
  const expr = (): number => {
    let v = term();
    while (src[i] === "+" || src[i] === "-") v = src[i++] === "+" ? v + term() : v - term();
    return v;
  };
  const term = (): number => {
    let v = factor();
    while (src[i] === "*" || src[i] === "/") v = src[i++] === "*" ? v * factor() : v / factor();
    return v;
  };
  const factor = (): number => {
    if (src[i] === "-") return i++, -factor();
    if (src[i] === "(") {
      i++;
      const v = expr();
      if (src[i++] !== ")") throw new Error("bad");
      return v;
    }
    const m = /^\d+(\.\d+)?/.exec(src.slice(i));
    if (!m) throw new Error("bad");
    i += m[0].length;
    return Number(m[0]);
  };
  try {
    const v = expr();
    return i === src.length && Number.isFinite(v) ? v : undefined;
  } catch {
    return undefined;
  }
}

/** Where a visual fully determines the answer, check the maths. */
function checkMath(q: Question, answerText: string) {
  const v = q.visual;
  const n = numericValue(answerText.replace(/[^\d./-]/g, ""));
  if (v?.type === "equation") {
    const m = v.text.match(/^(.+) = \?$/);
    const expected = m ? evaluate(m[1]) : undefined;
    if (expected !== undefined) expect(n, `${v.text} → ${answerText}`).toBeCloseTo(expected, 6);
    const missing = v.text.match(/^(\d+) \+ ☐ = (\d+)$/);
    if (missing) expect(Number(missing[1]) + n).toBe(Number(missing[2]));
  }
  if (v?.type === "blocks" && q.prompt.startsWith("What number")) {
    expect(n).toBe((v.hundreds ?? 0) * 100 + v.tens * 10 + v.ones);
  }
  if (v?.type === "ruler") expect(n).toBe(v.length);
  if (v?.type === "tenFrame") expect(n).toBe(v.filled + (v.extra ?? 0));
  if (v?.type === "dots" && /^How many/.test(q.prompt)) expect(n).toBe(v.count);
  if (v?.type === "array" && /^How many/.test(q.prompt)) expect(n).toBe(v.rows * v.cols);
}

function checkQuestion(q: Question, course: Course) {
  const band = ageBandFor(course.grade);
  expect(q.prompt.trim()).not.toBe("");
  expect(q.hint.trim()).not.toBe("");
  if (band === "little") {
    // Little kids hear the prompt read aloud; keep it short.
    expect(q.prompt.length, `prompt too long for K/1: "${q.prompt}"`).toBeLessThanOrEqual(80);
  }
  if (q.visual) checkVisual(q.visual);

  switch (q.kind) {
    case "choice": {
      expect(q.choices.length).toBeGreaterThanOrEqual(2);
      expect(q.choices.length).toBeLessThanOrEqual(band === "little" ? 4 : 5);
      expect(new Set(q.choices.map((c) => c.id)).size).toBe(q.choices.length);
      // Two buttons that look the same would make the question unfair.
      const looks = q.choices.map((c) => `${c.emoji ?? ""}|${c.shape ?? ""}|${c.coin ?? ""}|${c.label}`);
      expect(new Set(looks).size, `duplicate choices in "${q.prompt}"`).toBe(q.choices.length);
      expect(q.choices.map((c) => c.id)).toContain(q.answer);
      checkMath(q, q.choices.find((c) => c.id === q.answer)!.label);
      break;
    }
    case "input": {
      expect(course.grade, "Kindergarten questions can't need typing").not.toBe("k");
      const pad = q.keypad ?? "number";
      expect(q.answer, `"${q.answer}" doesn't fit the ${pad} keypad`).toMatch(KEYPAD_PATTERN[pad]);
      for (const a of q.accept ?? []) expect(a).toMatch(KEYPAD_PATTERN[pad]);
      checkMath(q, q.answer);
      break;
    }
    case "build":
      expect(Number.isInteger(q.target)).toBe(true);
      expect(q.target).toBeGreaterThanOrEqual(1);
      expect(q.target).toBeLessThanOrEqual(q.hundreds ? 999 : 99);
      break;
    case "coins":
      expect(q.target % 5).toBe(0);
      expect(q.target).toBeGreaterThan(0);
      expect(q.coins).toContain(5);
      break;
    case "order":
      expect(q.items.length).toBeGreaterThanOrEqual(3);
      expect(q.items.length).toBeLessThanOrEqual(6);
      expect(new Set(q.items.map((i) => i.id)).size).toBe(q.items.length);
      expect(new Set(q.items.map((i) => i.label)).size).toBe(q.items.length);
      break;
    case "sort": {
      const bins = q.bins.map((b) => b.id);
      expect(bins.length).toBeGreaterThanOrEqual(2);
      expect(bins.length).toBeLessThanOrEqual(3);
      for (const item of q.items) expect(bins).toContain(item.bin);
      for (const bin of bins) expect(q.items.some((i) => i.bin === bin)).toBe(true);
      expect(new Set(q.items.map((i) => i.id)).size).toBe(q.items.length);
      expect(q.items.length).toBeLessThanOrEqual(8);
      break;
    }
  }
}

describe("curriculum content", () => {
  it("has unique course and unit ids", () => {
    const courseIds = COURSES.map((c) => `${c.grade}/${c.subject}`);
    expect(new Set(courseIds).size).toBe(courseIds.length);
    for (const c of COURSES) expect(new Set(c.units.map((u) => u.id)).size).toBe(c.units.length);
  });

  it("downloads each grade on demand, with the same courses as the full set", async () => {
    for (const grade of AVAILABLE_GRADES) {
      const expected = coursesInFramework(
        COURSES.filter((c) => c.grade === grade),
        "ca-bc",
      );
      expect(expected.length, `${grade} has content`).toBeGreaterThan(0);
      expect(coursesForGrade(grade, "ca-bc")).toEqual([]);
      await loadGrade(grade);
      expect(isGradeLoaded(grade)).toBe(true);
      expect(coursesForGrade(grade, "ca-bc").map((c) => c.subject)).toEqual(expected.map((c) => c.subject));
      expect(allUnitRefs(grade, "ca-bc").length).toBe(expected.reduce((n, c) => n + c.units.length, 0));
      const first = expected[0];
      const key = unitKey(grade, first.subject, first.units[0].id);
      expect(getUnitRef(key)?.unit.title).toBe(first.units[0].title);
      expect(parseUnitKey(key)).toEqual({ grade, subject: first.subject, unitId: first.units[0].id });
    }
    expect(parseUnitKey("10/math/x")).toBeUndefined();
    expect(parseUnitKey("nonsense")).toBeUndefined();
  });

  it("never uses Math.random in content (pages need repeatable samples)", () => {
    const walk = (dir: string): string[] =>
      readdirSync(dir).flatMap((f) => {
        const p = join(dir, f);
        return statSync(p).isDirectory() ? walk(p) : [p];
      });
    const offenders = [...walk(join(__dirname, "grades")), ...walk(join(__dirname, "ontario")), ...walk(join(__dirname, "alberta")), ...walk(join(__dirname, "saskatchewan")), ...walk(join(__dirname, "manitoba")), ...walk(join(__dirname, "nova-scotia")), ...walk(join(__dirname, "new-brunswick"))].filter((f) => readFileSync(f, "utf8").includes("Math.random"));
    expect(offenders).toEqual([]);
  });

  it("offers BC French Immersion from Kindergarten and Core French from Grade 5, through Grade 9", () => {
    const has = (grade: string, subject: string) => COURSES.some((c) => c.grade === grade && c.subject === subject && c.units.some((u) => u.standards["ca-bc"]));
    for (const g of ["k", "1", "2", "3", "4", "5", "6", "7", "8", "9"]) expect(has(g, "immersion"), `immersion ${g}`).toBe(true);
    for (const g of ["k", "1", "2", "3", "4"]) expect(has(g, "core-french"), `core-french ${g}`).toBe(false);
    for (const g of ["5", "6", "7", "8", "9"]) expect(has(g, "core-french"), `core-french ${g}`).toBe(true);
  });

  it("marks every French Immersion question as French so read-aloud uses a French voice", () => {
    for (const course of COURSES.filter((c) => c.subject === "immersion")) {
      for (const unit of course.units) {
        for (const q of unit.generate({ difficulty: 2 })) expect(q.lang, `${course.grade}/${unit.id}: ${q.prompt}`).toBe("fr");
      }
    }
  });

  for (const course of COURSES) {
    describe(`${course.grade}/${course.subject}`, () => {
      it("has an overview and complete unit info for each framework", () => {
        const frameworks = new Set(course.units.flatMap((u) => Object.keys(u.standards)));
        for (const f of frameworks) expect(course.bigIdeas[f as FrameworkId]?.length ?? 0, `${f} overview`).toBeGreaterThan(0);
        for (const u of course.units) {
          expect(u.title.trim()).not.toBe("");
          expect(u.emoji.trim()).not.toBe("");
          expect(u.blurb.trim()).not.toBe("");
          expect(u.parentNote.trim()).not.toBe("");
          expect(Object.keys(u.standards).length, `${u.id} has standards`).toBeGreaterThan(0);
          for (const text of Object.values(u.standards)) expect((text ?? "").trim()).not.toBe("");
        }
      });

      it("cites real Ontario expectations", () => {
        const official = new Set((ONTARIO_EXPECTATIONS[course.grade === "k" ? "k/all" : `${course.grade}/${course.subject}`] ?? []).map((r) => r.idx));
        for (const u of course.units) {
          const standard = u.standards["ca-on"];
          if (!standard) continue;
          const codes = citedCodes(standard);
          expect(codes.length, `${u.id}: "${standard}" cites no expectation`).toBeGreaterThan(0);
          for (const code of codes) expect(official.has(code), `${u.id} cites ${code}, which is not in Ontario ${course.grade}/${course.subject}`).toBe(true);
        }
      });

      it("cites real Saskatchewan outcomes and no other province's wording", () => {
        const official = new Set((SK_OUTCOMES[course.grade]?.[course.subject] ?? []).flatMap((st) => st.outcomes.map((o) => o.code)));
        for (const u of course.units) {
          const standard = u.standards["ca-sk"];
          if (!standard) continue;
          const codes = standard.split(" · ")[0].match(/[A-Z]{1,3}[K\d]\.\d+[ab]?/g) ?? [];
          expect(codes.length, `${u.id}: "${standard}" cites no outcome`).toBeGreaterThan(0);
          for (const code of codes) expect(official.has(code), `${u.id} cites ${code}, which is not in Saskatchewan ${course.grade}/${course.subject}`).toBe(true);
          // Units borrowed from Ontario must not carry Ontario names into Saskatchewan classrooms.
          if (/^(sk-)/.test(u.id) || u.standards["ca-bc"]) continue;
          for (const q of [1, 2, 3].flatMap((d) => Array.from({ length: 12 }, () => u.generate({ difficulty: d as 1 | 2 | 3 })).flat())) {
            const text = JSON.stringify(q);
            expect(/Ontario|Queen's Park|EQAO|Upper Canada|Lower Canada/.test(text), `${u.id}: ${q.prompt}`).toBe(false);
          }
        }
      });

      it("cites real Manitoba outcomes and no other province's wording", () => {
        const official = new Set((MB_OUTCOMES[`${course.grade}/${course.subject}`] ?? []).map((r) => r.idx));
        const checkCodes = official.size > 0 && course.subject !== "core-french";
        for (const u of course.units) {
          const standard = u.standards["ca-mb"];
          if (!standard) continue;
          const codes = standard.split(" · ")[0].split(/,\s*/).map((c) => c.trim());
          expect(codes.filter(Boolean).length, `${u.id}: "${standard}" cites no outcome`).toBeGreaterThan(0);
          if (checkCodes) for (const code of codes) expect(official.has(code), `${u.id} cites ${code}, which is not in Manitoba ${course.grade}/${course.subject}`).toBe(true);
          // Units borrowed from another province must not carry its names into Manitoba classrooms.
          if (/^mb-/.test(u.id) || u.standards["ca-bc"]) continue;
          for (const q of [1, 2, 3].flatMap((d) => u.generate({ difficulty: d as 1 | 2 | 3 }))) {
            const text = JSON.stringify(q);
            expect(/Ontario|Queen's Park|EQAO|Upper Canada|Lower Canada|Saskatchewan|Regina|Alberta/.test(text), `${u.id}: ${q.prompt}`).toBe(false);
          }
        }
      });

      it("cites real Nova Scotia outcomes and no other province's wording", () => {
        const official = new Set((NS_OUTCOMES[`${course.grade}/${course.subject}`] ?? []).map((r) => r.idx));
        const checkCodes = official.size > 0 && course.subject !== "core-french" && course.subject !== "immersion";
        for (const u of course.units) {
          const standard = u.standards["ca-ns"];
          if (!standard) continue;
          const head = standard.split(" · ")[0];
          expect(head.trim().length, `${u.id}: "${standard}" cites no outcome`).toBeGreaterThan(0);
          if (checkCodes) {
            const labels = official.has(head) ? [head] : head.split(/,\s*/).map((c) => c.trim());
            for (const label of labels) expect(official.has(label), `${u.id} cites "${label}", which is not in Nova Scotia ${course.grade}/${course.subject}`).toBe(true);
          }
          // Units borrowed from another province must not carry its names into Nova Scotia classrooms.
          if (/^ns-/.test(u.id) || u.standards["ca-bc"]) continue;
          for (const q of [1, 2, 3].flatMap((d) => u.generate({ difficulty: d as 1 | 2 | 3 }))) {
            const text = JSON.stringify(q);
            expect(/Ontario|Queen's Park|EQAO|Upper Canada|Lower Canada|Saskatchewan|Regina|Alberta|Manitoba|Winnipeg/.test(text), `${u.id}: ${q.prompt}`).toBe(false);
          }
        }
      });

      it("cites real New Brunswick strands and big ideas and no other province's wording", () => {
        const official = new Set((NB_OUTCOMES[`${course.grade}/${course.subject}`] ?? []).map((r) => r.idx));
        const checkCodes = official.size > 0 && course.subject !== "core-french" && course.subject !== "immersion";
        for (const u of course.units) {
          const standard = u.standards["ca-nb"];
          if (!standard) continue;
          const head = standard.split(" · ")[0];
          expect(head.trim().length, `${u.id}: "${standard}" cites no strand`).toBeGreaterThan(0);
          if (checkCodes) {
            const labels = official.has(head) ? [head] : head.split(/,\s*/).map((c) => c.trim());
            for (const label of labels) expect(official.has(label), `${u.id} cites "${label}", which is not in New Brunswick ${course.grade}/${course.subject}`).toBe(true);
          }
          // Units borrowed from another province must not carry its names into New Brunswick classrooms.
          if (/^nb-/.test(u.id) || u.standards["ca-bc"]) continue;
          for (const q of [1, 2, 3].flatMap((d) => u.generate({ difficulty: d as 1 | 2 | 3 }))) {
            const text = JSON.stringify(q);
            expect(/Ontario|Queen's Park|EQAO|Upper Canada|Lower Canada|Saskatchewan|Regina|Alberta|Manitoba|Winnipeg|Nova Scotia|Halifax|Yukon|Northwest Territories/.test(text), `${u.id}: ${q.prompt}`).toBe(false);
          }
        }
      });

      it("lists shared and ordered units that exist", () => {
        const ids = new Set(course.units.map((u) => u.id));
        for (const id of Object.keys(course.shares ?? {})) expect(ids.has(id), `shared unit ${id}`).toBe(true);
        for (const order of Object.values(course.order ?? {})) for (const id of order ?? []) expect(ids.has(id), `ordered unit ${id}`).toBe(true);
      });

      for (const unit of course.units) {
        it(`${unit.id} generates fair questions`, () => {
          for (let run = 0; run < RUNS; run++) {
            const difficulty = ((run % 3) + 1) as 1 | 2 | 3;
            const qs = unit.generate({ difficulty });
            expect(qs.length).toBeGreaterThanOrEqual(6);
            expect(qs.length).toBeLessThanOrEqual(10);
            qs.forEach((q) => checkQuestion(q, course));
          }
        });
      }
    });
  }
});
