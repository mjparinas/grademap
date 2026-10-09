# Ontario source and checking record

**Source.** The Ontario Ministry of Education's curriculum site (https://www.dcp.edu.gov.on.ca/en/curriculum), read from its public content API on 2026-10-09.

- Mathematics (2020), Grades 1 to 8
- Language (2023), Grades 1 to 8
- Kindergarten Curriculum (2026)

`expectations.json` holds every strand, overall expectation and specific expectation, keyed by `grade/subject` (`k`, `1` to `8`). Each entry has `idx` (for example `B1.1`), `kind`, `title` and `content` exactly as published. `src/content/ontario/overall.ts` holds the strand headings used as Big Ideas.

**How content is checked.**

- Each Ontario standard is written as `on("B2.4, B2.7", "plain words")` (`src/content/ontario/kit.ts`). `content.test.ts` reads the codes and fails if any code is missing from `expectations.json` for that grade and subject. Ranges such as `C1.1–C1.3` are checked at both ends.
- Questions go through the same fairness checks as BC content (answer among the choices, no look-alike choices, the maths evaluates, keypad fit).
- Report cards follow *Growing Success* (2010): Levels 1 to 4; letter grades in Grades 1 to 6; percentages in Grades 7 to 9. Kindergarten has no grades.

**Scope today.** Kindergarten to Grade 9: math, language, science and technology, social studies (Grades 7 and 8 combine Geography and History, whose strand letters repeat, so standards name the subject, e.g. "History A1.1"), plus French (Core French from Grade 4, French Immersion from Grade 1) from the FSL curriculum (2013) and the Grade 9 courses FSF1D and FIF1D. The FSL curriculum is skills-based, so French units cite the strand-level expectations (A Listening, B Speaking, C Reading, D Writing); most share BC French units. 

**Still to do before launch.**

- An Ontario teacher should review the wording and the units that borrow a BC unit with Ontario standards text (`Course.shares`).
- Grade 7 to 9 report-card percentages should be confirmed against the current *Growing Success* text.
- Grade 9 uses the destreamed courses MTH1W and ENL1W; confirm with a teacher that this matches what families expect.
