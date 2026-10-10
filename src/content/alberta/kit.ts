import type { Unit } from "../types";

// Shared helpers for the Alberta units. They are the Ontario helpers (seeded random questions, number
// formatting and so on) plus `ab()`, which writes a unit's Alberta standard. The citations in `ab()` are
// checked against docs/research/alberta/outcomes.json in alberta.test.ts.
export * from "../ontario/kit";

/** Standards text for a unit: the official citation, then a short plain description. */
export function ab(citation: string, text: string): Unit["standards"] {
  return { "ca-ab": `${citation} · ${text}` };
}
