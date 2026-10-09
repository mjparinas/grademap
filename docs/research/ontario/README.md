# Ontario source and checking record

**Source.** The Ontario Ministry of Education's curriculum site (https://www.dcp.edu.gov.on.ca/en/curriculum), read from its public content API on 2026-10-09.

- Mathematics (2020), Grades 1 to 8
- Language (2023), Grades 1 to 8
- Kindergarten Curriculum (2026)

`expectations.json` holds every strand, overall expectation and specific expectation, keyed by `grade/subject` (`k`, `1` to `8`). Each entry has `idx` (for example `B1.1`), `kind`, `title` and `content` exactly as published. `src/content/ontario/overall.ts` holds the strand headings used as Big Ideas.

**How content is checked.**

- Each Ontario standard is written as `on("B2.4, B2.7", "plain words")` (`src/content/ontario/kit.ts`). `content.test.ts` reads the codes and fails if any code is missing from `expectations.json` for that grade and subject. Ranges such as `C1.1–C1.3` are checked at both ends.
- Questions go through the same fairness checks as BC content (answer among the choices, no look-alike choices, the maths evaluates, keypad fit).
- Report cards follow *Growing Success* (2010): Levels 1 to 4; letter grades in Grades 1 to 6; percentages in Grade 7. Kindergarten has no grades.

**Scope today.** Kindergarten to Grade 7, math and language. Science and social studies are not written yet (the framework lists only the two subjects, so the app does not show the others for Ontario).

**Still to do before launch.**

- An Ontario teacher should review the wording and the units that borrow a BC unit with Ontario standards text (`Course.shares`).
- Grade 7 and Grade 8 report-card percentages should be confirmed against the current *Growing Success* text.
- Grade 8 is not offered yet; the data for it is already in `expectations.json`.
