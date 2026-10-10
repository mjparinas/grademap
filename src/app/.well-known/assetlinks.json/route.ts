import { assetLinks, parseFingerprints } from "@/lib/android";

// Digital Asset Links for the Android app (docs/ANDROID.md). Google fetches this file without
// following redirects, so the URL must answer 200 directly. Set ANDROID_CERT_SHA256 to the
// comma-separated SHA-256 fingerprints of the signing keys (Play app signing key first).
// Read on each request, so changing the variable doesn't need a rebuild.

export const dynamic = "force-dynamic";

export function GET() {
  return new Response(JSON.stringify(assetLinks(parseFingerprints(process.env.ANDROID_CERT_SHA256)), null, 2), {
    headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=300" },
  });
}
