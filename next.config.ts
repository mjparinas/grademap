import path from "node:path";
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// A fixed policy (no per-request nonce) so pages stay statically generated and cacheable offline.
// Error reports go to Sentry's ingest hosts only when a DSN is configured.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self' blob: data:",
  "connect-src 'self' https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://*.ingest.de.sentry.io",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  // The app uses speech output only. Camera, microphone, location and payments aren't needed.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  // Runs as a normal Next.js server (pages are still pre-rendered where possible)
  // so the sync, account and billing APIs can live alongside the site.
  trailingSlash: true,
  images: { unoptimized: true },
  // Vercel sets VERCEL=1 at build time. Its analytics script only exists there, so elsewhere
  // (local, CI, other hosts) we don't load it and avoid failed script requests.
  env: { NEXT_PUBLIC_ON_VERCEL: process.env.VERCEL ? "1" : "" },
  serverExternalPackages: ["@libsql/client", "libsql"],
  turbopack: {
    // Pin the project root so Turbopack never picks up a lockfile from a parent folder.
    root: path.join(__dirname),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
