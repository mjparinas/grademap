import type { Metadata } from "next";
import { getFramework } from "@/content/frameworks";
import { GRADE_LABEL, getSubjectMeta } from "@/content/subjects";
import { APP_NAME } from "@/lib/brand";
import { levelInfo } from "@/lib/proficiency";
import { loadSharedReport } from "@/server/reportData";

// A read-only report shared by a parent. Private: not indexed, no referrer, and it only works
// while the link is active. It shows practice numbers, never an email address or other family details.

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Shared progress report",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

const pct = (v: number) => `${Math.round(v * 100)}%`;

export default async function SharedReport({ params }: PageProps<"/shared/[token]">) {
  const { token } = await params;
  const data = await loadSharedReport(token);

  if (!data) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">This report isn’t available</h1>
        <p className="mt-3 font-read text-lg text-ink-soft">The link may have expired or been stopped by the parent who shared it. Ask them for a new one.</p>
      </main>
    );
  }

  const { profile, report, days } = data;
  const framework = getFramework(profile.framework);
  const t = report.totals;
  const unitLevelLabel = (level: number) => (level < 0 ? "Not started" : levelInfo(profile.framework, profile.grade, level)?.label ?? "");

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6">
        <p className="text-sm font-semibold text-ink-soft">{APP_NAME} · shared progress report</p>
        <h1 className="text-4xl font-bold">{profile.name}’s report</h1>
        <p className="font-read text-lg text-ink-soft">
          {GRADE_LABEL[profile.grade]} · {framework.curriculumName} · last {days} days
        </p>
      </header>

      <section aria-label="Totals" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Time learning", `${Math.round(t.minutes)} min`],
          ["Active days", String(t.activeDays)],
          ["Questions", String(t.answers)],
          ["Right first try", t.answers ? pct(t.correct / t.answers) : "–"],
        ].map(([label, value]) => (
          <div key={label} className="card p-4">
            <p className="text-sm text-ink-soft">{label}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <h2 className="text-xl font-bold">🌟 Strengths</h2>
          {report.strengths.length ? (
            <ul className="mt-2 flex flex-col gap-1.5 font-read">
              {report.strengths.map((u) => (
                <li key={u.ref.key}>
                  {u.ref.unit.emoji} <b>{u.ref.unit.title}</b> <span className="text-ink-soft">({pct(u.accuracy)})</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 font-read text-ink-soft">Strengths appear after a few lessons in a unit.</p>
          )}
        </div>
        <div className="card p-5">
          <h2 className="text-xl font-bold">🌱 Worth practising</h2>
          {report.needs.length ? (
            <ul className="mt-2 flex flex-col gap-1.5 font-read">
              {report.needs.map((u) => (
                <li key={u.ref.key}>
                  {u.ref.unit.emoji} <b>{u.ref.unit.title}</b> <span className="text-ink-soft">({pct(u.accuracy)})</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 font-read text-ink-soft">Nothing stands out as tricky right now.</p>
          )}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-xl font-bold">Units practised</h2>
        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Units practised and where each stands on the {framework.scoringFor(profile.grade).name}</caption>
            <thead className="bg-paper">
              <tr>
                <th scope="col" className="p-3">Unit</th>
                <th scope="col" className="p-3">Subject</th>
                <th scope="col" className="p-3">Level</th>
                <th scope="col" className="p-3">Recent accuracy</th>
              </tr>
            </thead>
            <tbody>
              {report.units
                .filter((u) => u.attempts > 0)
                .map((u) => (
                  <tr key={u.ref.key} className="border-t border-line">
                    <th scope="row" className="p-3 font-semibold">{u.ref.unit.title}</th>
                    <td className="p-3">{getSubjectMeta(u.ref.course.subject).title.big}</td>
                    <td className="p-3">{unitLevelLabel(u.level)}</td>
                    <td className="p-3">{pct(u.accuracy)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      {t.hints > 0 && (
        <p className="mt-6 font-read text-sm text-ink-soft">
          Hints opened before answering: {t.hints} of {t.answers} questions.
        </p>
      )}

      <p className="mt-6 rounded-2xl bg-[#eef4ff] p-4 font-read text-sm">
        This shows practice in the {APP_NAME} app. It isn’t a report-card mark: a child’s teacher decides proficiency.
      </p>
    </main>
  );
}
