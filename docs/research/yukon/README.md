# Yukon research record

**Sources:** Yukon Education, "Learn about the Yukon's school curriculum" (yukon.ca/en/school-curriculum); the Council of Ministers of Education, Canada (CMEC) Student Transfer Guide for Yukon (2023, cmec.ca/docs/transferguide/2024/Yukon-2023_Student-Transfer-Guide_EN.pdf); Yukon Education's "How Are We Doing" reports (the Foundation Skills Assessment is written in Yukon).

## What the sources say
- Yukon **implements the BC curriculum**, adapted to the Yukon context, and integrates Yukon First Nations languages, history, culture and ways of knowing, doing and being into all areas of learning (CMEC guide, section 1.6).
- Kindergarten to Grade 9 report on the **four-point Provincial Proficiency Scale**: Emerging, Developing, Proficient, Extending. Letter grades with percentages start in Grade 10 (section 1.8).
- Yukon adds locally developed **Yukon First Nations content**; for Grade 5 social studies the guide names Yukon First Nations Governance and Yukon First Nations Citizenship.
- Yukon students write the BC **Foundation Skills Assessment** in Grades 4 and 7.
- French: BC's Core French and Français langue seconde – immersion curricula apply.

## Mapping
- Every BC unit is shared with `ca-yt` standards (`yukonCourse` in `src/content/yukon/kit.ts`), so progress is the same whichever of BC or Yukon a family picks. Yukon has no separate outcome codes, so Yukon standards repeat BC's text and `content.test.ts` checks no extra codes.
- Yukon-only units are `bankUnit` sets in `src/content/yukon/units/` with ids starting `yk-`: the three Grade 5 Yukon First Nations units.
- The scale, report-card page and guides reuse BC's, reworded for the Yukon (`YUKON` in `frameworks.ts`, `YUKON_GUIDES` in `guides.ts`).

## Known gaps
- Yukon First Nations content is light, in the present tense, and **needs review by Yukon First Nations partners and Yukon Education** before launch; the Grade 5 units were written from the public course titles, not the full Yukon materials.
- The Yukon French First Language (Francophone) program is not built.
- The Grade 10 to 12 Yukon courses are out of scope (Kindergarten to Grade 9 only).
- Yukon Education's own pages were not readable automatically; recheck the report-card and assessment details at yukon.ca before launch.
