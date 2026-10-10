import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section } from "@/components/site/Legal";
import { APP_NAME, CONTACT_EMAIL, LEGAL_NAME, MAILING_ADDRESS } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `How ${APP_NAME} handles your family’s information: what we collect, why, who sees it, and how to export or delete everything.`,
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      intro={`${APP_NAME} is built for children, so we collect as little as we can. This page explains, in plain words, what we keep, why, and how you stay in control. ${LEGAL_NAME} ("we", "us") runs ${APP_NAME}.`}
    >
      <Section title="The short version">
        <ul>
          <li>We show no ads, use no advertising or tracking pixels, and never sell or rent your family’s information.</li>
          <li>We keep a child’s first name or nickname, grade, an optional birth year, an avatar and their practice results. Nothing else about them.</li>
          <li>Children don’t type free text, upload photos or record their voice.</li>
          <li>You can export or delete everything yourself, at any time, from the Parent area.</li>
        </ul>
      </Section>

      <Section title="Who this applies to">
        <p>
          {APP_NAME} is used by children, but it is set up and paid for by a parent or guardian. By creating an account or adding a child, you confirm that you are that child’s parent or legal guardian (or have their permission) and agree to this policy on their behalf. Children are never asked to create accounts, enter an email address or buy anything. Your agreement is our consent to collect a child’s information, and you can withdraw it at any time by deleting the child’s profile or your account.
        </p>
        <p>
          {APP_NAME} is built for families. Where a school or teacher uses {APP_NAME} with a class, see “Schools and classes” below. A teacher should not enrol students through a family account.
        </p>
      </Section>

      <Section title="What we collect">
        <p>
          <strong>About you (the parent):</strong>
        </p>
        <ul>
          <li>Your email address and a password. Passwords are stored only as a salted scrypt hash, never in readable form.</li>
          <li>Subscription details: your plan, billing interval and renewal date. Payments are handled by Stripe, so we never see or store your card number.</li>
        </ul>
        <p>
          <strong>About each child (up to four per family):</strong>
        </p>
        <ul>
          <li>A first name or nickname, grade, an avatar and, if you choose, a birth year (used only to suggest a grade).</li>
          <li>Practice activity: which questions were answered, whether they were right, when, and how long a lesson took. From this we work out progress, levels, trophies and your reports.</li>
          <li>Settings you choose, such as daily goal, timers, game time, sound, read-aloud and calm options.</li>
        </ul>
        <p>
          <strong>If you report a problem with a question:</strong> we keep the question, the reason you picked from a fixed list and the date, linked to your family so we can follow up.
        </p>
        <p>
          <strong>On your device:</strong> the app saves progress on the device first, so it works offline, using the browser’s local storage and IndexedDB. Your Parent area PIN is stored there too, salted and hashed, and your read-aloud voice choice is kept per device. If you never sign in, this information stays on that device and is not sent to us.
        </p>
        <p>
          <strong>Automatically:</strong> our servers keep ordinary technical logs (such as IP address, browser type and the time of a request) for security and to keep the service running. To block repeated guessing of passwords, we also keep a short-lived counter of sign-in, sign-up and reset attempts for each IP address. On our public pages only (not the kids’ app, the parent area or shared reports) we count anonymous page views; see “Who we share it with” below. We use no advertising trackers.
        </p>
      </Section>

      <Section title="Schools and classes">
        <p>
          A teacher can use {APP_NAME} with a class in two ways. A parent can link their own child to a class with the class code, which is the parent’s choice and can be undone at any time. Or the teacher can add students by first name or nickname, and each student signs in with two short codes. Students added by a teacher have no email address and no password.
        </p>
        <p>
          <strong>What we keep about a student a teacher added:</strong> the first name or nickname the teacher typed, the class’s grade and curriculum, an avatar, comfort settings and practice results. Nothing else: no email, birth year, surname, photo, voice or free text. These accounts have no parent area and no billing, and a student’s sign-in works only for their own play.
        </p>
        <p>
          <strong>Who sees it:</strong> the teacher who owns the class sees each student’s first name, avatar, grade and practice results on the units they assigned. Nobody else, including other teachers and other students, sees it. We send no email to student accounts, show no ads and never use their information for anything but running {APP_NAME}.
        </p>
        <p>
          <strong>Deleting it:</strong> when a teacher removes a student, closes a class or deletes their account, the related students’ accounts and practice history are deleted from our live systems straight away. A student’s device is cleared when they sign out.
        </p>
        <p>
          Classes with no sign-in by the teacher, a linked family or a class student for 11 months receive a warning email to the teacher. After 12 months without a sign-in, we delete the class, its assignments and class-account student data automatically. A parent-linked child is unlinked, but their family account and practice history stay. Backups expire on the database provider’s schedule.
        </p>
        <p>
          <strong>Responsibility:</strong> a school or teacher decides whether to use {APP_NAME} with students and is responsible for telling families and getting any consent its own rules require, including the duties of public schools in British Columbia under the Freedom of Information and Protection of Privacy Act (FIPPA) and of Ontario schools under their own privacy laws. For those uses we handle students’ information only to run the service for the school. If a breach affects a school’s students we will tell the school promptly so it can meet its own duties. Schools or districts that need a signed data agreement or privacy answers for a privacy impact assessment can email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </Section>

      <Section title="How we use it">
        <ul>
          <li>To run the app: choose questions, keep score, and show your child’s progress.</li>
          <li>To sync progress between your devices once you’ve signed in.</li>
          <li>To show you reports, including how practice lines up with report-card levels. These reflect practice only; they are not a school mark.</li>
          <li>To manage your subscription and send you important account messages (for example a password reset or a billing notice).</li>
          <li>To keep the service secure and fix problems.</li>
        </ul>
        <p>
          If you choose, we also send a short weekly progress email (it includes each child’s first name and practice totals, and nothing else about them), and you can create a read-only link to a child’s report. Anyone with that link can see that child’s name, grade and the practice totals in the report, until it expires after 30 days or you stop sharing it. You opt in to the weekly email yourself, after confirming your email address, and you can stop it at any time in the Parent area or with the unsubscribe link in each email. You can also opt in to a gentle practice reminder, sent only to you (never to your child) after a few quiet days and at most once a week; it includes only a child’s first name and how many days it has been, and has its own unsubscribe link. Account and billing messages are not marketing and are sent as long as you have an account.
        </p>
        <p>We don’t use children’s information for advertising or to build profiles for any other purpose.</p>
      </Section>

      <Section title="Who we share it with">
        <p>We share information only with service providers that help us run {APP_NAME}, and only what they need:</p>
        <ul>
          <li>
            <strong>Stripe</strong>, to take payments and manage subscriptions. Stripe receives your email and payment details under its own privacy policy.
          </li>
          <li>
            <strong>Resend</strong>, to deliver the emails we send you (such as email confirmation, password resets and the weekly report). It receives your email address and the message, which can include a child’s first name and practice totals.
          </li>
          <li>
            <strong>Sentry</strong>, to tell us when the app crashes. Error reports are stripped of names, email addresses, cookies and what was typed or tapped before they leave your device or our server, and are not used for anything else.
          </li>
          <li>
            <strong>Vercel Web Analytics and Speed Insights</strong>, to count anonymous page views and measure how fast our public website loads, such as which pages are visited, from which country and how quickly they appear. It sets no cookies and builds no profile of a visitor. It is switched off in the kids’ app, the parent area, shared reports and account pages, so nothing a child does is measured.
          </li>
          <li>
            <strong>Our hosting and database providers</strong>, which store the account and progress data described above on our behalf. Our servers and database are in Montréal, Canada. Some service providers above, such as Stripe, Resend and Sentry, may process limited information outside Canada.
          </li>
        </ul>
        <p>
          We may also disclose information if the law requires it, or to protect the safety of a child or our service. If {APP_NAME} is ever sold or merged, your information would stay protected by this policy unless you agree to a change.
        </p>
      </Section>

      <Section title="Cookies and similar storage">
        <p>
          We use one essential, HttpOnly cookie to keep you signed in to your parent account. We also use your browser’s local storage and a service worker to save progress, settings and app files so {APP_NAME} works offline. We don’t use advertising or analytics cookies (our page-view counts are cookieless), so there is no cookie banner to dismiss.
        </p>
      </Section>

      <Section title="Your choices and rights">
        <p>
          Everything below is in the Parent area under <strong>Privacy</strong>:
        </p>
        <ul>
          <li>
            <strong>Export:</strong> download all of your family’s data as a JSON file.
          </li>
          <li>
            <strong>Erase this device:</strong> remove everything saved on the device you’re using.
          </li>
          <li>
            <strong>Delete your account:</strong> permanently delete your account, your children’s profiles and all of their progress from our servers.
          </li>
        </ul>
        <p>
          You can also ask to see, correct or delete your information, or withdraw your consent, by emailing <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We will answer within 30 days. Depending on where you live, you may have further rights under privacy laws such as Canada’s PIPEDA, British Columbia’s PIPA, or US state laws; we will honour them. If you’re unhappy with how we’ve handled a request, you can complain to us first, and you can contact the Office of the Privacy Commissioner of Canada (priv.gc.ca) or the Office of the Information and Privacy Commissioner for British Columbia (oipc.bc.ca).
        </p>
      </Section>

      <Section title="How long we keep it">
        <p>
          We keep account and progress data while your account is open, and we don’t keep a child’s information once it is no longer needed for that purpose. When you delete your account, we delete your family’s data from our live systems straight away. Attempt counters for sign-in expire within minutes, and error reports are kept by Sentry for a short period under its own settings. Stripe keeps its payment records under its own policy, and deleting your account here does not cancel a paid subscription, so cancel it first under Subscription. Copies in backups are removed on a regular cycle, and billing records may be kept for as long as tax and accounting law requires.
        </p>
      </Section>

      <Section title="Security">
        <p>
          Data is encrypted in transit (HTTPS). Passwords are hashed with scrypt, sign-in sessions are stored hashed, and the Parent area is behind a PIN on the device. No system is perfectly secure, but we limit what we collect so there is less to protect. If a breach puts your information at real risk of significant harm, we will tell you and the Office of the Privacy Commissioner of Canada as the law requires, and we keep a record of every breach.
        </p>
      </Section>

      <Section title="Where your information is stored">
        <p>
          Our providers may store and process data in Canada, the United States or other countries, where privacy laws can differ, and courts or authorities there may be able to ask for access to it. We choose providers that protect data to a high standard and we only send them what’s needed.
        </p>
      </Section>

      <Section title="Changes to this policy">
        <p>
          If we change this policy in a way that matters, we’ll update the date at the top and tell account holders by email or in the app before the change takes effect.
        </p>
      </Section>

      <Section title="Contact us">
        <p>
          {LEGAL_NAME} is responsible for the personal information it holds. Questions, requests or complaints go to our privacy contact at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          {MAILING_ADDRESS ? ` or ${MAILING_ADDRESS}` : ""}. See also our <Link href="/terms/">terms of use</Link>.
        </p>
      </Section>
    </LegalPage>
  );
}
