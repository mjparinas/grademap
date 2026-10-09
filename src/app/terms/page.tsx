import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section } from "@/components/site/Legal";
import { APP_NAME, CONTACT_EMAIL, LEGAL_NAME } from "@/lib/brand";
import { FREE_UNITS_PER_COURSE, MAX_CHILDREN, PRICES, TRIAL_DAYS } from "@/lib/plan";

export const metadata: Metadata = {
  title: "Terms of use",
  description: `The terms for using ${APP_NAME}: your account, the family plan, free trial, cancelling, and the rules for using the service.`,
  alternates: { canonical: "/terms/" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of use"
      intro={`These terms are the agreement between you and ${LEGAL_NAME} ("we", "us") for using ${APP_NAME}. Please read them. By creating an account or using ${APP_NAME}, you agree to them.`}
    >
      <Section title="Who can use it">
        <p>
          {APP_NAME} is for children in Kindergarten to Grade 9, used with a parent or guardian. You must be at least 18, or the age of majority where you live, to create an account. You confirm that you are the parent or legal guardian of any child you add, or have their parent’s permission. How we handle information is described in our <Link href="/privacy/">privacy policy</Link>.
        </p>
      </Section>

      <Section title="Your account">
        <ul>
          <li>Give us accurate information and keep your password and Parent area PIN private.</li>
          <li>You’re responsible for activity on your account. Tell us at once if you think someone else has accessed it.</li>
          <li>One family account can have up to {MAX_CHILDREN} children.</li>
        </ul>
      </Section>

      <Section title="Free trial, free content and the family plan">
        <ul>
          <li>New accounts get a {TRIAL_DAYS}-day free trial with everything switched on. No card is needed to start.</li>
          <li>After the trial, the first {FREE_UNITS_PER_COURSE} units of every course stay free.</li>
          <li>
            The family plan unlocks everything for up to {MAX_CHILDREN} children and costs {PRICES.month.label} or {PRICES.year.label} ({PRICES.month.currency}). Taxes may be added where required.
          </li>
          <li>Features and prices can change. We’ll give you notice before a price change affects your subscription.</li>
        </ul>
      </Section>

      <Section title="Billing, renewal and cancelling">
        <ul>
          <li>Payments are processed by Stripe. Your subscription renews automatically each month or year until you cancel.</li>
          <li>You can cancel at any time in the Parent area under Subscription. You keep access until the end of the period you’ve paid for, and you won’t be charged again.</li>
          <li>Except where the law says otherwise, payments already made are not refundable. If something went wrong with a charge, email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we’ll make it right where we reasonably can.</li>
          <li>Children can’t buy anything. Coins and rewards are earned only by learning and have no cash value.</li>
        </ul>
      </Section>

      <Section title="What you can and can’t do">
        <p>Please use {APP_NAME} only for its intended purpose: learning at home. You agree not to:</p>
        <ul>
          <li>copy, resell, scrape or republish our lessons, questions or artwork, or build a competing product from them;</li>
          <li>try to break, overload, reverse engineer or get around the security or paywall of the service;</li>
          <li>share your account in a way that goes beyond one family; or</li>
          <li>use the service for anything unlawful or harmful.</li>
        </ul>
        <p>We may suspend or close accounts that break these rules.</p>
      </Section>

      <Section title="What we do and don’t promise">
        <ul>
          <li>
            {APP_NAME} is a practice and learning aid. It is matched to the published curriculum and uses report-card language, but its levels reflect practice in the app. They are not a school mark, and your child’s teacher decides proficiency.
          </li>
          <li>We work hard to keep content accurate, but we can’t promise it is free of mistakes, or that your child will reach a particular result.</li>
          <li>We aim to keep the service available, including offline, but we can’t promise it will always run without interruption or errors.</li>
          <li>{APP_NAME} is independent. It isn’t affiliated with, or endorsed by, any ministry of education or school.</li>
        </ul>
      </Section>

      <Section title="Our content and your data">
        <p>
          We own {APP_NAME}, including its lessons, questions, characters and design, and we give you a personal, non-transferable licence to use it for your family’s learning. Your children’s progress and information belong to you; you can export or delete them at any time, as described in the privacy policy.
        </p>
      </Section>

      <Section title="Limits on our responsibility">
        <p>
          {APP_NAME} is provided “as is” and “as available”. To the fullest extent the law allows, we are not responsible for indirect or consequential losses, and our total responsibility to you for any claim is limited to the amount you paid us in the 12 months before it arose (or C$100 if you’ve paid nothing). Nothing in these terms removes rights you have under consumer protection law that can’t be waived, or limits liability that can’t legally be limited.
        </p>
      </Section>

      <Section title="Ending your account">
        <p>
          You can stop using {APP_NAME} and delete your account at any time from the Parent area. We may suspend or end the service or your account if you break these terms or if we have to by law, and we’ll refund any unused prepaid time if we end your account for reasons other than your breach.
        </p>
      </Section>

      <Section title="Changes to these terms">
        <p>
          We may update these terms. If a change matters, we’ll tell account holders by email or in the app before it takes effect. Using {APP_NAME} after that means you accept the new terms.
        </p>
      </Section>

      <Section title="Governing law">
        <p>These terms are governed by the laws of British Columbia and the federal laws of Canada that apply there. Disputes will be handled by the courts of British Columbia, unless consumer law where you live gives you the right to use your own courts.</p>
      </Section>

      <Section title="Contact us">
        <p>
          Questions about these terms: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </Section>
    </LegalPage>
  );
}
