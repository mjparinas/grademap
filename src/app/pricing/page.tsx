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
      <section className="mt-12 max-w-2xl" aria-labelledby="how-it-works">
        <h2 id="how-it-works" className="text-2xl font-bold">
          How pricing works
        </h2>
        <ol className="mt-4 flex list-decimal flex-col gap-3 pl-6 font-read text-lg">
          <li>
            <b>Start free.</b> Your first {TRIAL_DAYS} days have everything switched on. No card is needed, and we never charge you when the trial ends.
          </li>
          <li>
            <b>After the trial, the free plan stays.</b> The first {FREE_UNITS_PER_COURSE} units of every course remain open. Adventure, Review, Speed Run, Challenge, the arcade games and units {FREE_UNITS_PER_COURSE + 1} and up need the family plan. Progress is never deleted: it is waiting if you subscribe later.
          </li>
          <li>
            <b>Subscribe when you’re ready.</b> Choose monthly or yearly in the Parent area. You pay at checkout, and your card is charged at the start of each period. If you subscribe during the trial, you’re charged right away and the remaining trial days don’t carry over.
          </li>
          <li>
            <b>It renews automatically</b> at the same price each month or year until you cancel. If we ever change the price, we’ll email you before it affects your plan, and you can cancel before then.
          </li>
          <li>
            <b>Cancel any time</b> in the Parent area under Subscription. No call or email is needed. You keep access until the end of the period you’ve paid for and won’t be charged again.
          </li>
          <li>
            <b>If a payment fails,</b> your access continues while Stripe retries the card. If the payment still can’t be taken, the plan ends and you go back to the free plan. You can subscribe again at any time.
          </li>
          <li>
            <b>Refunds.</b> Payments already made are generally not refundable, except where the law says otherwise. If something went wrong with a charge, <Link href="/contact/">contact us</Link>. Read the full <Link href="/terms/">terms</Link>.
          </li>
        </ol>
      </section>
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
