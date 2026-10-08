import type { Framework } from "@/content/frameworks";
import type { GradeId } from "@/content/types";

// The report card explainer. Works on the server (public SEO pages) and in
// the parent area. Everything comes from the framework, so other provinces
// and states slot in without code changes.

export function ReportCardGuide({ framework, grade = "2", headingLevel = 2 }: { framework: Framework; grade?: GradeId; headingLevel?: 1 | 2 }) {
  const scheme = framework.scoringFor(grade);
  const guide = framework.reportCard;
  const H = headingLevel === 1 ? "h1" : "h2";
  return (
    <div className="flex flex-col gap-6">
      <section>
        <H className="mb-2 text-3xl font-bold">{guide.title}</H>
        <p className="font-read text-lg text-ink-soft">{guide.intro}</p>
      </section>

      <section aria-labelledby="levels">
        <h3 id="levels" className="mb-3 text-2xl font-bold">
          The four levels
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {scheme.levels.map((l, i) => (
            <div key={l.id} className="rounded-2xl border border-line bg-white p-4" style={{ borderLeft: `8px solid ${l.colour}` }}>
              <p className="flex items-center gap-2 text-xl font-bold">
                <span aria-hidden="true">{l.icon}</span> {l.label}
                <span className="ml-auto rounded-full bg-black/5 px-2 py-0.5 text-xs font-semibold text-ink-soft">Level {i + 1} of 4</span>
              </p>
              <p className="mt-1 font-read text-sm">
                <b>Official meaning:</b> {l.description}
              </p>
              <p className="mt-1 font-read text-sm text-ink-soft">
                <b>In plain words:</b> {l.atHome}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-sm text-ink-soft">Source: {scheme.source}.</p>
      </section>

      <section aria-labelledby="facts">
        <h3 id="facts" className="mb-3 text-2xl font-bold">
          What else is on the report card
        </h3>
        <ul className="grid gap-3 sm:grid-cols-2">
          {guide.facts.map((f) => (
            <li key={f.title} className="rounded-2xl border border-line bg-white p-4">
              <p className="font-bold">{f.title}</p>
              <p className="font-read text-sm text-ink-soft">{f.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="faq">
        <h3 id="faq" className="mb-3 text-2xl font-bold">
          Common questions
        </h3>
        <div className="flex flex-col gap-2">
          {guide.faqs.map((f) => (
            <details key={f.q} className="rounded-2xl border border-line bg-white p-4">
              <summary className="cursor-pointer text-lg font-semibold">{f.q}</summary>
              <p className="mt-2 font-read text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
