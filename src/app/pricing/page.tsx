import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/components/site/jsonld";
import { PricingCards } from "@/components/site/Pricing";
import { Crumbs, SitePage } from "@/components/site/SiteChrome";
import { APP_NAME } from "@/lib/brand";
import { FREE_UNITS_PER_COURSE, MAX_CHILDREN, PRICES, TRIAL_DAYS } from "@/lib/plan";
import { JsonLd, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing",
  description: `${APP_NAME} is free for ${TRIAL_DAYS} days, then ${PRICES.month.label} or ${PRICES.year.label} for up to ${MAX_CHILDREN} children. No ads, and the first ${FREE_UNITS_PER_COURSE} units of every course stay free.`,
  alternates: { canonical: "/pricing/" },
};

export default function PricingPage() {
  const crumbs = [{ label: "Home", href: "/" }, { label: "Pricing" }];
  return (
    <SitePage>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${APP_NAME} family plan`,
            url: `${SITE_URL}/pricing/`,
            offers: [
              { "@type": "Offer", name: "Monthly", price: PRICES.month.amount, priceCurrency: PRICES.month.currency },
              { "@type": "Offer", name: "Yearly", price: PRICES.year.amount, priceCurrency: PRICES.year.currency },
            ],
          },
        ]}
      />
      <Crumbs items={crumbs} />
      <h1 className="text-4xl font-bold">Simple pricing for the whole family</h1>
      <p className="mt-2 max-w-2xl font-read text-lg text-ink-soft">One plan covers up to {MAX_CHILDREN} children, every grade from Kindergarten to Grade 7, every mode and every game. Prices are in Canadian dollars; taxes may be added.</p>
      <div className="mt-8">
        <PricingCards />
      </div>
      <ul className="mt-8 flex max-w-2xl flex-col gap-2 font-read text-lg">
        <li>✓ No ads, no tracking pixels, and we never sell information.</li>
        <li>✓ Children can’t buy anything. Coins are earned only by learning.</li>
        <li>✓ Cancel any time in the Parent area. You keep access until the end of the period you’ve paid for.</li>
        <li>✓ After the trial, the first {FREE_UNITS_PER_COURSE} units of every course stay free forever.</li>
      </ul>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/play/" className="btn btn-good min-h-14 px-8 text-xl">
          Start the free trial
        </Link>
        <Link href="/help/#billing" className="btn min-h-14 px-6 text-lg">
          Billing questions
        </Link>
      </div>
    </SitePage>
  );
}
