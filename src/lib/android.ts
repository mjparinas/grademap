// The Android app is a Trusted Web Activity: a thin shell that opens /play/ full screen in Chrome.
// Android only hides the browser bar when the site vouches for the app at
// /.well-known/assetlinks.json. See docs/ANDROID.md.

/** Must match `packageId` in android/twa-manifest.json and the Play Console listing. It can never change after publishing. */
export const ANDROID_PACKAGE = "ca.grademap.app";

/** A SHA-256 certificate fingerprint as printed by keytool: 32 pairs of hex digits separated by colons. */
const FINGERPRINT = /^([0-9A-F]{2}:){31}[0-9A-F]{2}$/;

/**
 * Reads fingerprints from a comma-separated list (the `ANDROID_CERT_SHA256` variable).
 * Anything that isn't a valid fingerprint is dropped, so a typo gives an empty list, not a broken file.
 */
export function parseFingerprints(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter((s) => FINGERPRINT.test(s));
}

/** The Digital Asset Links statement that ties this site to the Android app. Empty until a fingerprint is set. */
export function assetLinks(fingerprints: string[], packageName = ANDROID_PACKAGE) {
  if (fingerprints.length === 0) return [];
  return [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: { namespace: "android_app", package_name: packageName, sha256_cert_fingerprints: fingerprints },
    },
  ];
}
