# Saskatchewan research record

**Source:** the Saskatchewan Curriculum (curriculum.gov.sk.ca), Kindergarten to Grade 9: math, English language arts, science and social studies (Kindergarten uses the same four areas of learning).

`outcomes.json` holds every outcome code and text, grouped as `{grade: {subject: [{name, outcomes: [{code, text}]}]}}`. `content.test.ts` checks every `ca-sk` standard against it, and checks that borrowed Ontario units don't leak Ontario wording.

## Mapping
- BC units that fit an outcome are shared with `share(...)` (`src/content/saskatchewan/kit.ts`).
- Ontario-only units are reused with `reuse(...)` and Saskatchewan outcome text.
- Saskatchewan-only units (treaties, the Prairies, the North, and others) are new `bankUnit` sets in `g4-social.ts`, `g5-science.ts`, `g7-social.ts`, `g8-social.ts` and `g9-social.ts`.
- `outcomes.ts` is generated from `outcomes.json` and used as `bigIdeas` (one strand per entry).

## Scale
Saskatchewan has no single provincial report-card scale. The framework uses the four-level pattern many divisions use (Beginning, Approaching, Meeting, Exemplary), with the same kid labels. Saskatchewan's cross-curricular competencies and broad areas of learning stand in for BC Core Competencies and Ontario learning skills.

## Known gaps
- Science: Grade 3 soils, Grade 4 rocks and minerals, Grade 6 electricity use (EL6.1), Grade 8 water systems and Grade 9 space (EU9) are thin or missing, because the available units were Ontario-specific.
- French is not built (no Core French or Immersion for Saskatchewan).
- First Nations, Métis and treaty content is light and needs partner review before launch.
- Shared BC and Ontario question sets need review by Saskatchewan teachers.
- Provincial assessment details (grades 4, 5, 7, 9) should be checked against the Ministry of Education before launch.
