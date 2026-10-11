import Link from "next/link";
import type { ReactNode } from "react";
import { FRAMEWORKS } from "@/content/frameworks";
import { GUIDE_FRAMEWORKS } from "@/content/guides";
import { APP_NAME, WORDMARK_COLOURS } from "@/lib/brand";
import { TRIAL_DAYS } from "@/lib/plan";
import { teacherPath, TEACHER_SIGNUP } from "./teachers";

export function SiteHeader() {
  return (
    <header className="print:hidden sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-2xl font-bold tracking-tight" aria-label={APP_NAME}>
          {APP_NAME.split("").map((ch, i) => (
            <span key={i} aria-hidden="true" style={{ color: WORDMARK_COLOURS[i % WORDMARK_COLOURS.length] }}>
              {ch}
            </span>
          ))}
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 text-sm font-semibold sm:gap-3 sm:text-base">
          <Link href="/curriculum/" className="rounded-lg px-2 py-1 hover:bg-black/5">
            Curriculum
          </Link>
          <Link href="/report-cards/" className="hidden rounded-lg px-2 py-1 hover:bg-black/5 sm:inline">
            Report cards
          </Link>
          <Link href="/parents/" className="hidden rounded-lg px-2 py-1 hover:bg-black/5 sm:inline">
            Parents
          </Link>
          <Link href={teacherPath.hub()} className="hidden rounded-lg px-2 py-1 hover:bg-black/5 sm:inline">
            Teachers
          </Link>
          <Link href="/play/" className="btn btn-good h-11 px-4 text-base">
            Play free
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="print:hidden mt-16 border-t border-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="text-xl font-bold">{APP_NAME}</p>
          <p className="mt-1 font-read text-sm text-ink-soft">Curriculum-matched practice, games and progress reports for Kindergarten to Grade 9.</p>
        </div>
        <div>
          <p className="font-bold">Curriculum</p>
          <ul className="mt-2 space-y-1 text-sm">
            {FRAMEWORKS.map((f) => (
              <li key={f.id}>
                <Link className="text-ink-soft hover:underline" href={`/curriculum/${f.slug}/`}>
                  {f.curriculumName}
                </Link>
              </li>
            ))}
            {FRAMEWORKS.map((f) => (
              <li key={`rc-${f.id}`}>
                <Link className="text-ink-soft hover:underline" href={`/report-cards/${f.slug}/`}>
                  {f.region} report card guide
                </Link>
              </li>
            ))}
            {GUIDE_FRAMEWORKS.map((f) => (
              <li key={`pg-${f.id}`}>
                <Link className="text-ink-soft hover:underline" href={`/guides/${f.slug}/`}>
                  {f.region} parent guides
                </Link>
              </li>
            ))}
            <li>
              <Link className="text-ink-soft hover:underline" href="/compare/">
                Compare apps
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-bold">For families</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <Link className="text-ink-soft hover:underline" href="/play/">
                Start learning
              </Link>
            </li>
            <li>
              <Link className="text-ink-soft hover:underline" href="/parents/">
                Parent area
              </Link>
            </li>
            <li>
              <Link className="text-ink-soft hover:underline" href={teacherPath.hub()}>
                For teachers
              </Link>
            </li>
            <li>
              <Link className="text-ink-soft hover:underline" href={TEACHER_SIGNUP}>
                Teacher sign in
              </Link>
            </li>
            <li>
              <Link className="text-ink-soft hover:underline" href="/pricing/">
                Pricing
              </Link>
            </li>
            <li>
              <Link className="text-ink-soft hover:underline" href="/help/">
                Help
              </Link>
            </li>
            <li>
              <Link className="text-ink-soft hover:underline" href="/contact/">
                Contact
              </Link>
            </li>
            <li>
              <Link className="text-ink-soft hover:underline" href="/privacy/">
                Privacy policy
              </Link>
            </li>
            <li>
              <Link className="text-ink-soft hover:underline" href="/terms/">
                Terms of use
              </Link>
            </li>
            <li>
              <Link className="text-ink-soft hover:underline" href="/accessibility/">
                Accessibility
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="pb-8 text-center text-xs text-ink-soft">
        © {new Date().getFullYear()} {APP_NAME}. Not affiliated with any ministry of education.
      </p>
    </footer>
  );
}

/**
 * The closing call to action for public pages that bring in search visitors. Every page that
 * explains the curriculum or a guide ends with it (`<SitePage cta>`), so a parent who has read
 * enough always has a button to start practising.
 */
export function PageCta() {
  const provinces = FRAMEWORKS.map((f) => f.region).join(" and ");
  return (
    <section aria-labelledby="page-cta" className="card mt-10 flex flex-col gap-3 p-6">
      <h2 id="page-cta" className="text-2xl font-bold">
        Ready to try {APP_NAME}?
      </h2>
      <p className="font-read text-ink-soft">
        Curriculum-matched practice for Kindergarten to Grade 9 in {provinces}, with kind hints, learning games and no ads. Free for {TRIAL_DAYS} days, no card needed.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href="/play/" className="btn btn-good min-h-14 px-8 text-xl">
          Try it free
        </Link>
        <Link href="/pricing/" className="btn min-h-14 px-6 text-lg">
          See pricing
        </Link>
      </div>
    </section>
  );
}

export function SitePage({ children, cta = false }: { children: ReactNode; /** Ends the page with the call to action. */ cta?: boolean }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        {children}
        {cta && <PageCta />}
      </main>
      <SiteFooter />
    </>
  );
}

export function Crumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-soft">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-1">
            {c.href ? (
              <Link href={c.href} className="hover:underline">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-semibold text-ink">
                {c.label}
              </span>
            )}
            {i < items.length - 1 && <span aria-hidden="true">›</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
