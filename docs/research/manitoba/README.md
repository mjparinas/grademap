# Manitoba research record

**Source:** Manitoba Education and Early Childhood Learning (edu.gov.mb.ca/k12): the math, science and social studies curriculum frameworks (Kindergarten to Grade 9), the English language arts framework (PDFs for Kindergarten to Grade 8, a web page for Grade 9), the Core French framework (Grades 4 to 9) and the Provincial Report Card Policy.

`fetch.sh` downloads the pages and `build_outcomes.py` parses them into `outcomes.json` (`{"<grade>/<subject>": [{idx, kind, content}]}`) and `src/content/manitoba/overall.ts` (the learning focus shown as the course overview). Rebuild by running `./fetch.sh <cache>` and then `build_outcomes.py` on the cache. `content.test.ts` checks every `ca-mb` standard against `outcomes.json`. Core French cites strands (Oral Communication, Reading, Writing, Culture) because the framework has no numbered outcomes; French Immersion units cite no codes.

## Mapping
- BC units that fit are shared with `course(..., { share })`, Ontario units are copied with `adopt(...)` and Manitoba outcome text (`src/content/manitoba/kit.ts`).
- Manitoba-only units (Manitoba and Canada, the North, regions, post-Confederation history and others) are `bankUnit` sets in `src/content/manitoba/units/`, with ids starting `mb-`.
- French: Immersion Kindergarten to Grade 9 and Core French Grade 4 to 9, built in `french.ts`.

## Scale
Levels 1 to 4 (plus NYD), levels only in Grades 1 to 6, percentages added from Grade 7, nothing in Kindergarten. Learning skills (personal management, active participation, social responsibility) stand in for BC Core Competencies.

## Known gaps
- Content needs review by Manitoba teachers, and French by a French teacher.
- Some outcomes are only partly covered; extend the tables when adding units.
- First Nations, Métis and Inuit content is light and needs partner review before launch.
- Provincial assessment details (guides) should be checked against Manitoba Education before launch.
- Report card details were summarised from the Provincial Report Card Policy and should be rechecked at launch.
