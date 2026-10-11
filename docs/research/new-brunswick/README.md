# New Brunswick curriculum: source and checking record

- **Source:** the New Brunswick curriculum site, curriculum.nbed.ca (Department of Education and Early Childhood Development, anglophone sector). The site publishes each course as strands, big ideas and skill descriptors, with a learning focus per course. There are no outcome codes.
- **Rebuild:** `fetch.sh <cache>` downloads 20 course comparison files from the site's data endpoint; `python3 -I build_outcomes.py <cache> src/content/new-brunswick/overall.ts > outcomes.json` writes `outcomes.json` (each row is `idx` = "Strand: Big idea", plus the strand, big idea and skill descriptors) and the course overviews in `overall.ts`.
- **How units cite them:** by `idx`, for example "Number: Operations" or "Geography: Places and Regions". A unit can cite several, separated by a comma. `src/content/content.test.ts` checks every citation against `outcomes.json` (French is not checked this way). The unit's standards text then describes the skill in plain words.
- **Courses covered:** Kindergarten to Grade 2 English language arts; Explore Your World (science and social studies, Kindergarten to Grade 2); Grades 3 to 9 English language arts, math, science and social studies; French Immersion language arts (Grades 1 to 9); Core French (Intensive French in Grades 4 and 5, Post-Intensive French in Grades 6 to 9).
- **Report card:** Kindergarten to Grade 8 use the four-point scale (1 working below, 2 approaching, 3 or 3+ meeting, 4 or 4+ excelling); Grade 9 uses the high school wording (numerical course grades). Source: the department's "Assessing, Evaluating, Reporting" guidelines.

## Known gaps
- **Kindergarten to Grade 5 math is provisional.** The curriculum documents for those grades are on a gated site, so those courses reuse the Grade 6 strands and big ideas ("Number: Number Sense"). The unit content follows the Western and Northern Canadian Protocol outcomes. Replace the citations when the documents can be read.
- **Kindergarten to Grade 2 science and social studies** are one course, Explore Your World, so the units cite its strands.
- **Kindergarten French Immersion** is not built, because New Brunswick's immersion program starts in Grade 1.
- **Shared units:** most units are BC units (`share`) or units from Ontario, Manitoba, Alberta or Nova Scotia (`adopt`), and were kept only where the questions do not name another province. Some New Brunswick outcomes have no unit yet.
- **Science:** New Brunswick science differs from the other Atlantic provinces (Grade 3 weather and habitats, Grade 4 rocks, minerals, soil and Earth's surface, Grade 5 body systems, Grade 6 sensory systems, Grade 7 Earth surface processes, Grade 8 motion and space, Grade 9 solar system and ecosystems), so each of those grades has `nb-` science units. Some adopted units from other provinces remain as extra practice and do not match a New Brunswick topic.
- **New Brunswick units** (`nb-` ids): My Province, Wabanaki Nations, Governments, Natural Resources and others in Grade 3; Wabanaki lands, regions and explorers in Grade 4; the Wabanaki Confederacy, French and British in Atlantic Canada, and worldviews in Grade 5; the Atlantic region and economy in Grade 6; Wabanaki worldviews in Grade 7; Confederation, Black communities, rights and Wabanaki governance in Grade 8; governance, rights, identities and migration, treaties and settlement in Grade 9.

## Review needed
- New Brunswick teachers for all content, including the provisional K to 5 math.
- A French teacher for the French units.
- Wolastoqey, Mi'kmaq and Peskotomuhkati partners for the Wabanaki units, and Acadian and Black community partners for the Acadian and Black history units.
- The provincial assessment grades and dates in `/guides/new-brunswick/provincial-assessments/` against the department's site before launch.
