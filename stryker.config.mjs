// Mutation testing for the rules that turn events into what children and parents see.
// Run with `npm run test:mutation` (about 10 to 20 minutes from scratch; reruns only redo what changed).
// Too slow for every PR. Report: reports/mutation/mutation.html
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  testRunner: "vitest5",
  plugins: ["@stryker-mutator/*", "./scripts/stryker-vitest5.mjs"],
  vitest: { configFile: "vitest.config.mts", related: true },
  coverageAnalysis: "perTest",
  mutate: [
    "src/lib/derive.ts",
    "src/lib/proficiency.ts",
    "src/lib/adaptive.ts",
    "src/lib/gametime.ts",
    "src/lib/goal.ts",
    "src/lib/stickers.ts",
    "src/lib/trophies.ts",
    "src/lib/nextup.ts",
    "src/lib/progressSince.ts",
    "src/lib/plan.ts",
    "src/lib/buddy.ts",
    "src/lib/familyGoal.ts",
    "src/lib/quests.ts",
    "src/lib/shop.ts",
    "src/lib/milestones.ts",
    "src/lib/reports.ts",
  ],
  // Copy and labels aren't rules; a surviving string mutant there is noise.
  mutator: { excludedMutations: ["StringLiteral"] },
  reporters: ["clear-text", "progress", "html", "json"],
  htmlReporter: { fileName: "reports/mutation/mutation.html" },
  jsonReporter: { fileName: "reports/mutation/mutation.json" },
  tempDirName: ".stryker-tmp",
  // Reuses earlier results for unchanged code and tests; `npm run test:mutation -- --force` redoes everything.
  // Mutants in module-level code (the trophy and sticker lists) aren't tied to tests, so new tests for
  // them only show up with --force.
  incremental: true,
  incrementalFile: "reports/mutation/stryker-incremental.json",
  thresholds: { high: 85, low: 70, break: null },
  concurrency: 4,
  timeoutMS: 20000,
};

export default config;
