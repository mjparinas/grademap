import { APP_NAME } from "./brand";

/** The public site address, for canonical links, the sitemap and structured data. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://grademap.ca").replace(/\/$/, "");

export function absolute(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: APP_NAME,
  url: SITE_URL,
  logo: absolute("/icon-512.png"),
};

export function JsonLd({ data }: { data: unknown }) {
  // JSON-LD for search engines. `<` is escaped so content can't close the tag.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
