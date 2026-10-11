# Nova Scotia outcomes: source and checking record

- **Source:** the Nova Scotia curriculum site, curriculum.novascotia.ca (Department of Education and Early Childhood Development), outcome PDFs per subject and grade.
- **Rebuild:** `fetch.sh <cache>` downloads the PDFs and converts them with `pdftotext`; `python3 -I build_outcomes.py <cache> src/content/nova-scotia/overall.ts > outcomes.json` writes `outcomes.json` and the course overviews in `overall.ts`.
- **How units cite them:** math by outcome code (`N06`); Grade 9 language by outcome number; Primary to Grade 8 language by strand title; science by learning bundle; social studies by the outcome headline. `src/content/content.test.ts` checks every citation against `outcomes.json`.
- **French:** Immersion units cite course names and Core French cites strands, so they are not checked against `outcomes.json`.
- **Known gaps:** the Grade 9 science outcomes PDF is a scan, so Grade 9 science units cite bundle titles rather than codes. Some outcomes have no unit yet, and a few shared units were dropped because their questions name other provinces.
- **Review needed:** Nova Scotia teachers for all content, a French teacher for the French units, and Mi'kmaw, Acadian, African Nova Scotian and Gaelic community partners for the culture-related units. Provincial assessment grades should be checked against the department's site before launch.
