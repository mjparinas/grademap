import Link from "next/link";
import type { ReactNode } from "react";
import { FRAMEWORKS } from "@/content/frameworks";
import { APP_NAME } from "@/lib/brand";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          <span className="text-[#4f8ef7]">Grade</span>
          <span className="text-[#e9559a]">Map</span>
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 text-sm font-semibold sm:gap-3 sm:text-base">
          <Link href="/curriculum/" className="rounded-lg px-2 py-1 hover:bg-black/5">
            Curriculum
          </Link>
          <Link href={`/report-cards/${FRAMEWORKS[0].slug}/`} className="hidden rounded-lg px-2 py-1 hover:bg-black/5 sm:inline">
            Report cards
          </Link>
          <Link href="/parents/" className="hidden rounded-lg px-2 py-1 hover:bg-black/5 sm:inline">
            Parents
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
    <footer className="mt-16 border-t border-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="text-xl font-bold">{APP_NAME}</p>
          <p className="mt-1 font-read text-sm text-ink-soft">Curriculum-matched practice, games and progress reports for Kindergarten to Grade 7.</p>
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
            <li>
              <Link className="text-ink-soft hover:underline" href={`/report-cards/${FRAMEWORKS[0].slug}/`}>
                Report card guide
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
          </ul>
        </div>
      </div>
      <p className="pb-8 text-center text-xs text-ink-soft">
        © {new Date().getFullYear()} {APP_NAME}. Not affiliated with any ministry of education.
      </p>
    </footer>
  );
}

export function SitePage({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
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
