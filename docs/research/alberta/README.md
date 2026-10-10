# Alberta source and checking record

**Sources.** Alberta Education publications, read on 2026-10-10. All are Crown documents released under the Open Government Licence – Alberta.

- New K–6 curriculum overviews, with a "snapshot by grade" for each subject: English language arts and literature (2022), mathematics (April 2022), science (March 2023), social studies (May 2025) and French immersion language arts and literature (2023). Hosted on open.alberta.ca (dataset `da982352-b50d-49a2-8805-c9073a7ecebd`).
- Alberta Mathematics K–6 scope and sequence, 2022 numbered outcomes (Alberta Regional Professional Development Consortia, aplc.ca). It is the source of the K–6 math outcome codes (for example `4N1.1`).
- Science K–6 numbered outcomes, 2023–2024 (aplc.ca, revised May 17, 2024). It is the source of the K–6 science outcome codes (for example `3ES 1.2`).
- The Alberta K–9 Mathematics Program of Studies with Achievement Indicators (2007). It is the source of the Grade 7 to 9 specific outcomes, cited by strand and number (`N5`, `PR2`, `SS3`, `SP1`).
- Science Grades 7–8–9 Program of Studies (2003, updated 2009 and 2014): the five units in each grade.
- French as a Second Language Nine-Year Program of Studies, Grades 4 to 12 (2004): the four general outcomes (Applications, Language competence, Global citizenship, Strategies).
- Alberta's curriculum renewal timeline (alberta.ca/curriculum-subject-areas): K–6 is in place, with Grades 4 to 6 social studies mandatory from September 2026. Draft Grades 7 to 9 mathematics and social studies are being piloted in 2026–27 and become mandatory in September 2027. Grades 7 to 9 science is following a different track.

`outcomes.json` holds the codes and lines the tests check against:

- `math` and `science["k-6"]`: every outcome code found in those documents.
- `math["7"|"8"|"9"]`: the strand-and-number codes found in the 2007 program.
- `science["7-9-units"]`: the Grade 7 to 9 science units.
- `snapshots`: the official "snapshot by grade" lines (English language arts, French immersion, science) and topic phrases (social studies). K–6 language, social studies and French immersion units cite these verbatim, because the full learning outcomes for those subjects are only published on the New LearnAlberta site (curriculum.learnalberta.ca), which we could not read automatically.
- `language-7-9`, `social-7-9`, `core-french`: the general outcome and issue headings for the older Grades 7 to 9 programs and the French as a Second Language program.

**How content is checked.** Each Alberta standard is written as `ab("4N1.1, 4N2.1", "plain words")` (`src/content/alberta/kit.ts`). `src/content/alberta/alberta.test.ts` reads the citation before the ` · ` and fails if it names a code, unit or snapshot line that is not in `outcomes.json` for that grade and subject. Questions go through the same fairness checks as BC and Ontario content.

**Report cards.** Alberta has no provincial report-card scale; school authorities choose their own. The Alberta framework uses four plain practice steps (Beginning, Approaching, Meeting, Exceeding) with the same kid labels and the same rule that this is practice, not a report-card mark.

**How units are shared.** Where an existing BC or Ontario unit truly fits an Alberta outcome, the Alberta course lists it under `Course.shares` with Alberta standards text. An Alberta child therefore downloads Ontario's file for the grade as well (`EXTRA_DEPENDS` in `src/content/index.ts`). Units that are BC- or Ontario-specific are not shared.

**Still to do before launch.**

- An Alberta teacher should review all content, especially the units that borrow a BC or Ontario unit with Alberta standards text.
- The full K–6 English language arts, social studies and French immersion learning outcomes should be read on the New LearnAlberta site and cited by code, replacing the snapshot lines.
- Grades 7 to 9: mathematics and social studies will change in September 2027 (draft curricula are in pilot). Science 7 to 9 and English language arts 7 to 9 have no new programs yet. Re-check when the new programs are final.
- Social studies Grade 7 to 9 and English language arts 7 to 9 are cited by general outcome or issue heading from the existing programs; confirm the headings against the current documents.
- French immersion for Grades 7 to 9 has no checked citation yet.
- First Nations, Métis and Inuit content is deliberately light and needs partner review before launch.
- Confirm the Provincial Achievement Test and screening wording in the Alberta parent guides against alberta.ca; the schedule is changing.
