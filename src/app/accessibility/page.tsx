import type { Metadata } from "next";
import { Crumbs, SitePage } from "@/components/site/SiteChrome";
import { Section } from "@/components/site/Legal";
import { APP_NAME, CONTACT_EMAIL } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Accessibility",
  description: `What ${APP_NAME} does to be usable by every child, what we have tested, and what we haven’t yet.`,
  alternates: { canonical: "/accessibility/" },
};

export default function AccessibilityPage() {
  return (
    <SitePage cta>
      <Crumbs items={[{ label: "Home", href: "/" }, { label: "Accessibility" }]} />
      <article className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold">Accessibility</h1>
        <p className="mt-4 font-read text-lg">
          We want every child to be able to learn with {APP_NAME}. This page says what we have done, what we have checked and what we have not, so you can decide whether it works for your child or your class.
        </p>
        <div className="mt-6 flex flex-col gap-6">
          <Section title="Where we are">
            <p>
              We aim to meet WCAG 2.2 level AA. Our automated checks against those rules pass on the kids’ app, the parent area, the teacher area and the public pages, and they run on every change we make. <strong>We have not yet tested with screen readers or with keyboard-only use, so we cannot say the app fully meets the standard.</strong> Schools can ask us for our conformance report.
            </p>
          </Section>
          <Section title="What is built in">
            <ul>
              <li>Large touch targets and layouts that work from small phones to tablets, with no sideways scrolling.</li>
              <li>Read-aloud for every question, using the voices on the device, including a French voice for French questions.</li>
              <li>Per child, a parent or teacher can turn on calm motion, quiet sounds, hidden timers, shorter sessions, roomy text and high contrast. These change how things look and sound, never the scoring.</li>
              <li>A reading font designed for beginning readers for questions and stories.</li>
              <li>Colours that pass contrast checks and a simulated colour-blind check. Charts use a single colour family and have table views.</li>
              <li>Hints and a second try on every question. No time pressure in normal practice.</li>
              <li>Everything respects the device’s reduced motion setting.</li>
            </ul>
          </Section>
          <Section title="What we know is missing">
            <ul>
              <li>We haven’t tested with VoiceOver, TalkBack or NVDA, or with a keyboard alone, yet.</li>
              <li>The arcade games are visual and need a finger or pointer. They are optional rewards, and nothing assigned depends on them.</li>
              <li>Some pictures in questions are described in the question text, but not every picture has a longer description.</li>
            </ul>
          </Section>
          <Section title="Tell us">
            <p>
              If something doesn’t work for a child, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Tell us the device and what you were trying to do. We aim to reply within 5 business days and to fix what we can.
            </p>
          </Section>
        </div>
      </article>
    </SitePage>
  );
}
