"use client";

import { useEffect, useState } from "react";
import { devBilling, openBillingPortal, refreshAccount, startCheckout, type BillingInfo } from "@/lib/account";
import { FREE_UNITS_PER_COURSE, isPremium, MAX_CHILDREN, PRICES, trialDaysLeft } from "@/lib/plan";
import { useRoute } from "@/lib/router";
import { useStore } from "@/lib/store";
import { PageTitle, Panel } from "./common";

const INCLUDED = [
  "Every unit in every subject, Kindergarten to Grade 7",
  "Adventure, Review, Speed Run and Challenge modes",
  "The arcade games, with your learn-to-play timer",
  "Full progress reports over time",
  `Up to ${MAX_CHILDREN} children`,
  "Sync across all your devices",
];

export function SubscriptionPage({ billing, onBilling }: { billing: BillingInfo | null; onBilling: (b: BillingInfo | null) => void }) {
  const family = useStore((s) => s.family);
  const { query } = useRoute();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const premium = isPremium(family);
  const subscribed = family.subscription && ["active", "trialing", "past_due"].includes(family.subscription.status);
  const checkout = query.get("checkout");

  useEffect(() => {
    // Coming back from Stripe: pull the new plan from the server.
    if (checkout === "success") void refreshAccount().then(onBilling);
  }, [checkout, onBilling]);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageTitle title="Subscription" sub="One family membership covers all your children." />
      {checkout === "success" && <Panel className="mb-5 border-good bg-good-soft">🎉 Thank you! Your membership is active.</Panel>}
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Your plan">
          <p className="text-2xl font-bold">
            {subscribed ? `⭐ Premium (${family.subscription?.interval === "year" ? "yearly" : "monthly"})` : premium ? `Free trial · ${trialDaysLeft(family)} days left` : "Free plan"}
          </p>
          {subscribed && family.subscription?.currentPeriodEnd && (
            <p className="text-ink-soft">Renews {new Date(family.subscription.currentPeriodEnd).toLocaleDateString("en-CA", { dateStyle: "long" })}</p>
          )}
          {!premium && (
            <p className="mt-2 font-read text-ink-soft">
              The free plan keeps the first {FREE_UNITS_PER_COURSE} units of each subject, the Daily Challenge, trophies and the report card guide.
            </p>
          )}
          <ul className="mt-4 flex flex-col gap-1.5">
            {INCLUDED.map((x) => (
              <li key={x} className="flex gap-2">
                <span className="text-good">✓</span> {x}
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title={subscribed ? "Manage" : "Choose a plan"}>
          {!family.account ? (
            <p className="font-read">
              To subscribe, first <a className="font-bold text-[#2f6fd6] underline" href="#/account">create a free account</a> so your membership works on every device.
            </p>
          ) : subscribed ? (
            <div className="flex flex-col gap-3">
              {billing?.stripe ? (
                <button type="button" disabled={busy} className="rounded-xl bg-[#253047] px-4 py-3 font-bold text-white" onClick={() => void run(openBillingPortal)}>
                  Manage billing, change plan or cancel
                </button>
              ) : billing?.dev ? (
                <button type="button" disabled={busy} className="rounded-xl border border-line px-4 py-3 font-semibold" onClick={() => void run(() => devBilling("cancel"))}>
                  Cancel (development mode)
                </button>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {(["year", "month"] as const).map((interval) => (
                <button
                  key={interval}
                  type="button"
                  disabled={busy || (!billing?.stripe && !billing?.dev)}
                  onClick={() => void run(() => (billing?.stripe ? startCheckout(interval) : devBilling("subscribe", interval)))}
                  className={`flex items-center justify-between rounded-2xl border-2 px-4 py-3 text-left disabled:opacity-50 ${interval === "year" ? "border-[#25b47e] bg-good-soft" : "border-line"}`}
                >
                  <span>
                    <span className="block text-lg font-bold">{interval === "year" ? "Yearly" : "Monthly"}</span>
                    <span className="block text-sm text-ink-soft">{interval === "year" ? `${PRICES.year.note} · billed once a year` : "Cancel any time"}</span>
                  </span>
                  <span className="text-xl font-bold">{PRICES[interval].label}</span>
                </button>
              ))}
              {billing?.dev && !billing.stripe && (
                <p className="rounded-xl bg-nudge-soft p-3 text-sm">
                  <b>Development mode:</b> Stripe isn&apos;t configured, so these buttons simulate a subscription. Set the Stripe environment variables to take real payments.
                </p>
              )}
              {!billing && <p className="text-sm text-ink-soft">Connecting… (subscriptions need an internet connection)</p>}
              <p className="text-sm text-ink-soft">Prices in Canadian dollars. Payments are handled securely by Stripe; we never see your card details.</p>
            </div>
          )}
          {error && <p className="mt-3 font-semibold text-nudge-dark">{error}</p>}
        </Panel>
      </div>
    </>
  );
}
