import type { Metadata } from "next";
import Link from "next/link";
import { Crumbs, SitePage } from "@/components/site/SiteChrome";
import { APP_NAME, CONTACT_EMAIL } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Contact us",
  description: `Questions, feedback or a privacy request? Email the ${APP_NAME} team.`,
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <SitePage>
      <Crumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold">Contact us</h1>
        <p className="mt-3 font-read text-lg">
          The quickest way to reach us is email:{" "}
          <a className="font-semibold text-[#2f6fd6] underline" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          . A person reads every message.
        </p>
        <div className="card mt-6 flex flex-col gap-3 p-6 font-read text-lg">
          <p>
            <strong>Helpful to include:</strong> the device and browser you use, and what you expected to happen. Please don’t send passwords, and there’s no need to send your child’s full name.
          </p>
          <p>
            <strong>A question looks wrong?</strong> Tap the flag above the answer bar in the app. That reaches us directly.
          </p>
          <p>
            <strong>Privacy requests:</strong> you can export or delete everything yourself in the Parent area. For anything else, email us. See the <Link className="underline" href="/privacy/">privacy policy</Link>.
          </p>
        </div>
        <p className="mt-6">
          Many answers are already on the <Link className="font-semibold underline" href="/help/">help page</Link>.
        </p>
      </div>
    </SitePage>
  );
}
