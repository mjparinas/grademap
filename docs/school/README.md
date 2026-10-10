# Using Gradelings in a school or district

Everything here is a **draft prepared for the owner**. None of it has been reviewed by a lawyer, and the contract and consent texts must be before anyone signs or sends them. Placeholders are marked `[...]`.

BC has no provincial approval list: each of the 60 districts decides for itself, usually through a Privacy Impact Assessment (PIA) under FIPPA, and sometimes a Supplemental Review when data leaves Canada. See `/mnt/project-files/school-approval/bc-school-approval-gaps.md` in the project files for the research behind this. Ontario boards run their own privacy reviews on the same pattern.

| File | What it is | Status |
| --- | --- | --- |
| [pia-pack.md](pia-pack.md) | The answers a district asks for: data inventory, data flow, service providers, retention, access, security, breach handling. Written from the code as it is today. | Draft. Facts checked against the repo; items marked **(confirm)** need a provider's written answer. |
| [school-data-agreement.md](school-data-agreement.md) | A short data agreement a school or district can sign. | Draft template. Needs a lawyer and a real legal entity. |
| [parent-consent-letter.md](parent-consent-letter.md) | A letter a teacher can send home. | Draft template for teachers and districts to adapt. |
| [accessibility-conformance.md](accessibility-conformance.md) | WCAG 2.2 A/AA conformance report in the shape districts ask for (a VPAT-style table). | Honest first version: automated checks only. Manual screen reader and keyboard testing is still to do. |

Public pages that go with this: `/privacy/` (with a "Schools and classes" section), `/terms/` (teachers and classes) and `/accessibility/`.

## What the product does today

- A teacher has an ordinary account (confirmed email) and creates classes for one province's curriculum.
- **Two ways to get students in.** A parent can link their own child with the class code (the parent decides, and can unlink). Or the teacher adds students by first name or nickname, and each gets a login code. There is no email or password for a student.
- A student account holds a first name or nickname, the class's grade, an avatar and practice results. It has no parent area, no billing and no way to see anything but its own play.
- The teacher sees first name, grade, avatar and results on the units they assigned, plus a "what to look at next" list.
- Removing a student, closing a class and deleting a teacher account each delete the students' data at once.

## Still to do before a district can say yes

1. **Real legal entity and contact details** in `src/lib/brand.ts` (`LEGAL_NAME`, `CONTACT_EMAIL`, `MAILING_ADDRESS`), then a lawyer's review of the privacy policy, terms and the agreement.
2. **Provider answers** for the **(confirm)** items in the PIA pack (Turso encryption at rest and backups, Fly region, Resend and Sentry data handling).
3. **Screen reader and keyboard testing** (VoiceOver, TalkBack, NVDA), then update the conformance report.
4. **A named BC teacher or district reviewer** for the content, and First Peoples partner review of the Indigenous content (see `AGENTS.md`, Open items).
5. **Decisions for the owner**, listed at the end of the PIA pack: retention for inactive classes, whether a school plan exists, and whether teachers may have more than one class owner (co-teaching).
6. **A pilot** with one friendly school or district, which will show their actual process.
