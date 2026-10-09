import { FREE_UNITS_PER_COURSE, MAX_CHILDREN, PRICES, TRIAL_DAYS } from "@/lib/plan";

/** The three plan cards, shared by the landing page and the pricing page. All numbers come from lib/plan.ts. */
export function PricingCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="card p-6">
        <h3 className="text-xl font-bold">Free trial</h3>
        <p className="mt-2 text-4xl font-bold">
          $0 <span className="text-base font-semibold text-ink-soft">for {TRIAL_DAYS} days</span>
        </p>
        <p className="mt-2 font-read text-ink-soft">Everything included. No card needed. Afterwards, the first {FREE_UNITS_PER_COURSE} units of every subject stay free.</p>
      </div>
      <div className="card border-[#4f8ef7] p-6">
        <h3 className="text-xl font-bold">Family · monthly</h3>
        <p className="mt-2 text-4xl font-bold">
          ${PRICES.month.amount} <span className="text-base font-semibold text-ink-soft">CAD / month</span>
        </p>
        <p className="mt-2 font-read text-ink-soft">Up to {MAX_CHILDREN} children. Every grade, mode and game. Cancel anytime.</p>
      </div>
      <div className="card relative border-[#25b47e] p-6">
        <span className="absolute -top-3 right-4 rounded-full bg-[#25b47e] px-3 py-1 text-sm font-bold text-white">{PRICES.year.note}</span>
        <h3 className="text-xl font-bold">Family · yearly</h3>
        <p className="mt-2 text-4xl font-bold">
          ${PRICES.year.amount} <span className="text-base font-semibold text-ink-soft">CAD / year</span>
        </p>
        <p className="mt-2 font-read text-ink-soft">Everything in monthly, for about $10 a month.</p>
      </div>
    </div>
  );
}
