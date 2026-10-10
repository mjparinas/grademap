"use client";

import { createContext, useContext } from "react";
import type { AgeBand } from "@/content/types";

// The child's age band ("little" for K–1, "middle" for 2–4, "big" for 5–9)
// adjusts sizes, wording and how much is on screen.

const BandContext = createContext<AgeBand>("middle");

export const BandProvider = BandContext.Provider;

export function useBand(): AgeBand {
  return useContext(BandContext);
}
