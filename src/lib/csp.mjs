// Content Security Policy, built without 'unsafe-inline' in production.
//
// Static pages can't carry a per-request nonce, so `scripts/csp-postbuild.mjs` hashes every inline
// script, <style> element and style="" attribute in each prerendered page after `next build`
// and writes the policy into that page as a <meta http-equiv> tag. The one dynamic page
// (`/shared/{token}/`) gets a per-request nonce from `src/proxy.ts`. Plain .mjs so the build
// script, next.config.ts and the proxy can all import it.
import { createHash } from "node:crypto";

// Hosts error reports go to, when a Sentry DSN is configured.
const SENTRY = "https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://*.ingest.de.sentry.io";

// Directives that don't depend on the page's inline code.
const FETCH = [
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self' blob: data:",
  `connect-src 'self' ${SENTRY}`,
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
];

// A <meta> policy ignores frame-ancestors, so it also goes out as a header on every response.
// It has no default-src or script-src on purpose: those would be combined with the page's
// hashed policy and block the inline scripts the hashes allow.
export const HEADER_POLICY = ["frame-ancestors 'none'", "base-uri 'self'", "form-action 'self'", "object-src 'none'"].join("; ");

/**
 * `next dev` needs eval and inline code for hot reloading. Never used in production. As a header
 * it also reaches the Piper worker, which loads its cached scripts from blob: URLs.
 */
export const DEV_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
  "style-src 'self' 'unsafe-inline'",
  ...FETCH,
  "frame-ancestors 'none'",
].join("; ");

/** Policy for a dynamically rendered page: Next.js puts the nonce on its own scripts. */
export function noncePolicy(nonce) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self'",
    "style-src-attr 'none'",
    ...FETCH,
    "frame-ancestors 'none'",
  ].join("; ");
}

const sha256 = (text) => `'sha256-${createHash("sha256").update(text, "utf8").digest("base64")}'`;

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
const decodeEntities = (s) =>
  s.replace(/&(?:#x([0-9a-f]+)|#(\d+)|(amp|lt|gt|quot|apos));/gi, (_, hex, dec, name) =>
    name ? ENTITIES[name.toLowerCase()] : String.fromCodePoint(hex ? parseInt(hex, 16) : parseInt(dec, 10)),
  );

const JS_TYPES = new Set(["", "module", "text/javascript", "application/javascript"]);

/** The hashes a page's inline code needs: scripts, <style> elements and style="" attributes. */
export function inlineHashes(html) {
  const scripts = new Set();
  const styles = new Set();
  const styleAttrs = new Set();

  // Script and style bodies are removed before looking for attributes, so text inside the
  // framework's data payload can't be mistaken for markup.
  const markup = html
    .replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (_, attrs, body) => {
      const type = /\stype\s*=\s*"([^"]*)"/i.exec(attrs)?.[1].toLowerCase() ?? "";
      // Data blocks (JSON-LD) never run, and external scripts are covered by 'self'.
      if (!/\ssrc\s*=/i.test(attrs) && JS_TYPES.has(type) && body.trim()) scripts.add(sha256(body));
      return "";
    })
    .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, (_, body) => {
      if (body.trim()) styles.add(sha256(body));
      return "";
    });

  for (const m of markup.matchAll(/<[a-z][^>]*?\sstyle\s*=\s*"([^"]*)"/gi)) styleAttrs.add(sha256(decodeEntities(m[1])));

  return { scripts: [...scripts].sort(), styles: [...styles].sort(), styleAttrs: [...styleAttrs].sort() };
}

/** The policy for one prerendered page. */
export function pagePolicy({ scripts, styles, styleAttrs }) {
  return [
    "default-src 'self'",
    `script-src 'self' ${scripts.join(" ")}`.trim(),
    `style-src 'self' ${styles.join(" ")}`.trim(),
    styleAttrs.length ? `style-src-attr 'unsafe-hashes' ${styleAttrs.join(" ")}` : "style-src-attr 'none'",
    ...FETCH,
  ].join("; ");
}

const META = /<meta http-equiv="Content-Security-Policy"[^>]*>/gi;

/** Writes the page's policy into its <head>, right after the charset so it precedes every script. */
export function addPolicyMeta(html) {
  const clean = html.replace(META, "");
  const meta = `<meta http-equiv="Content-Security-Policy" content="${pagePolicy(inlineHashes(clean))}"/>`;
  const charset = /<meta charSet="utf-8"\s*\/?>/i.exec(clean);
  if (charset) return clean.slice(0, charset.index + charset[0].length) + meta + clean.slice(charset.index + charset[0].length);
  const head = /<head[^>]*>/i.exec(clean);
  if (!head) throw new Error("No <head> to put the Content-Security-Policy tag in");
  return clean.slice(0, head.index + head[0].length) + meta + clean.slice(head.index + head[0].length);
}
