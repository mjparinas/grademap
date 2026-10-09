# Adding a province or state

Everything that differs by jurisdiction lives in a `Framework` (`src/content/frameworks.ts`). No screen changes are needed.

1. **Framework.** Create `src/content/<name>/framework.ts` exporting a `Framework`: id (add it to `FrameworkId` in `types.ts`), slug, `curriculumName`, grades, subjects offered, report-card scale and guide, and the scoring scheme. Register it in `frameworks.ts`. The province picker in Children, Settings and the Start screen reads that list, so it appears automatically.
2. **Official standards.** Save the official expectations under `docs/research/<name>/` with their source and date, and write a README like `docs/research/ontario/README.md`.
3. **Courses.** For each grade add `src/content/<name>/g<N>.ts` exporting `courses`. A course lists:
   - `units`: units written for this jurisdiction. Give them ids that do not clash with BC ids.
   - `shares`: BC (or other) unit ids to reuse. Each gives the new standards text for that unit. Share only after sampling the unit's questions and confirming they fit the new curriculum.
   - `order`: the unit order for this framework.
   - `bigIdeas`: strand headings.
4. **Register the grade.** Add the grade loader to `src/content/index.ts` and `all.ts`. Each grade and framework is its own download.
5. **Check the standard codes.** Extend the test in `content.test.ts` so the codes in `standards` must exist in the official data.
6. **Run** `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`, and the e2e scripts in AGENTS.md.

Progress is shared across frameworks for shared unit ids, so a child who switches province keeps the progress they earned on units both provinces teach.
