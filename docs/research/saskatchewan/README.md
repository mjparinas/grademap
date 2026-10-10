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
- Science units for Grade 3 soils, Grade 4 rocks, minerals and erosion, Grade 6 electricity use, Grade 8 water systems and Grade 9 exploring our universe are new, written for Saskatchewan. They need review by a Saskatchewan science teacher (check dates and local facts such as the Dirty Thirties, the 2011 Souris flood and the Quill Lakes).
- French is not built (no Core French or Immersion for Saskatchewan).
- First Nations, Métis and treaty content is light and needs partner review before launch.
- Shared BC and Ontario question sets need review by Saskatchewan teachers.
- Some outcomes are only partly covered (for example Grade 8 microscope work, Grade 6 flight design and Grade 9 human reproduction); extend the tables when adding units.
- Provincial assessment details (grades 4, 5, 7, 9) should be checked against the Ministry of Education before launch.
