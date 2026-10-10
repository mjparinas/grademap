import type { Unit } from "../types";

// Small helpers for the Saskatchewan courses. The outcome codes in `sk()` are checked against the official
// outcomes in content.test.ts.

/** Standards text for a unit: the outcome codes, then a short plain description. */
export function sk(codes: string, text: string): string {
  return `${codes} · ${text}`;
}

/** A unit another framework already provides, with the Saskatchewan outcomes it practises. */
export function share(codes: string, text: string): { standards: Unit["standards"] } {
  return { standards: { "ca-sk": sk(codes, text) } };
}

/**
 * Picks units from another framework's list, in the order given, keeping the unit as it is but with
 * Saskatchewan outcomes as its only standards. Throws if a unit is missing, so a rename cannot go unnoticed.
 */
export function reuse(pool: Unit[], picks: Record<string, string>): Unit[] {
  return Object.entries(picks).map(([id, standards]) => {
    const unit = pool.find((u) => u.id === id);
    if (!unit) throw new Error(`Unit ${id} not found`);
    return { ...unit, standards: { "ca-sk": standards } };
  });
}
