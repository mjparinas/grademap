# Northwest Territories research record

**Sources:** NWT Education, Culture and Employment, "JK-12 Curriculum Renewal" (ece.gov.nt.ca/en/curriculumrenewal) and the "Curriculum Renewal Implementation Plan" fact sheet (October 2022). Read October 2026.

## What the sources say
- The NWT is replacing the **Alberta** curriculum with the **BC curriculum adapted for the NWT**, in divisions: Grades 4 to 6 (trial 2023-24, final 2025-26), Grade 9 (trial 2023-24, final 2024-25), Grades 7 to 9 (trial 2024-25, final 2026-27), Grades 1 to 3 (trial 2025-26, draft in all subjects 2026-27, final 2027-28) and JK/Kindergarten (draft 2026-27, final 2027-28). Grades 10 to 12 follow separately.
- In 2026-27, Grades 1 to 9 therefore use the adapted BC curriculum and Kindergarten is on the draft, so no Alberta content is used for the NWT. Official dates have moved before; recheck the page before launch.
- **Reporting:** adapted-curriculum grades use the four-level proficiency scale (Emerging, Developing, Proficient, Extending) with written feedback; Grades 1 to 9 once fully implemented. A standard NWT report card is still being developed. Grades 10 to 12 keep percentages.
- **Assessments:** the last Alberta Achievement Tests were June 2023. BC's Grade 4 Foundation Skills Assessment began in 2024-25, Grade 7 in 2026-27.
- **NWT-specific curricula that stay:** Dene Kede, Inuuqatigiit, Our Languages, Northern Studies, Hunter Education and the JK/Kindergarten program.

## Mapping
- Every BC unit is shared with `ca-nt` standards (`nwtCourse` in `src/content/nwt/kit.ts`); progress is the same for BC, Yukon and NWT families. NWT has no separate outcome codes for adapted subjects, so its standards repeat BC's text.
- NWT-only units are `bankUnit` sets with ids starting `nt-`: Our Territory (Grade 3), Peoples and Languages (Grade 4, covers Our Languages and the Gwich'in, Sahtú, Tłı̨chǫ, Dehcho, Akaitcho, Inuvialuit and Métis), Dene Kede (Grade 5), Inuuqatigiit (Grade 6) and Treaties, Land Claims and Self-Government (Grade 8), all in social studies.

## Known gaps
- Dene and Inuvialuit units are light, written from public information, and **need review by Dene and Inuvialuit partners and NWT Education, Culture and Employment**. Northern Studies and Hunter Education are not built (they are Grade 10 and older courses); the Our Languages program is covered only by general questions, not language lessons.
- French: BC's Immersion and Core French are shared as-is; NWT's French programs and the Francophone school program (Commission scolaire francophone TNO) are not separately built.
- Grades 10 to 12 are out of scope.
- ECE's pages were read through a text summary; recheck dates and wording at ece.gov.nt.ca before launch.
