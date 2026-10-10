# Android app (phones and tablets)

The Android app is a **Trusted Web Activity (TWA)**: a small shell, built with [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap), that opens `/play/` full screen in Chrome with no browser bar. There is no app code to maintain. Lessons, sync and the offline service worker are the web app's, so a release of the site is a release of the Android app.

## Why a TWA and not Capacitor

- GradeMap is already an installable PWA with a service worker and a manifest (`src/app/manifest.ts`), and `AGENTS.md` says not to add features that only work in a native shell.
- Nothing in the code needs a native API. Read-aloud uses the Web Speech API, vibration uses `navigator.vibrate`, sound is synthesized, and there are no push notifications, camera or file access. All of these work inside a TWA, which uses the device's own Chrome.
- Capacitor bundles its own WebView and a copy of the web files. That means a second release process and the risk of the app and site drifting apart. Revisit only if a native-only feature is ever approved (for example Play Billing, see below).
- One package serves phones, tablets and Chromebooks. The web manifest has `orientation: any` (Bubblewrap `default`), and the layouts are already tested on phones and tablets in both orientations (`scripts/e2e-devices.mjs`).

## What is in the repo

| File | What it does |
| --- | --- |
| `android/twa-manifest.json` | Bubblewrap project config: package id, host, colours, icons, start URL `/play/`. |
| `src/app/.well-known/assetlinks.json/route.ts` | Serves `/.well-known/assetlinks.json`, the file that lets Android hide the browser bar. It answers 200 with no redirect (Google won't follow one). |
| `src/lib/android.ts` | The package id and the asset links builder. Fingerprints come from the `ANDROID_CERT_SHA256` environment variable. |
| `.gitignore` | Keeps `*.keystore`, `*.jks` and build output out of git. |

The web manifest is unchanged. The package id `ca.grademap.app` is in two places (`android/twa-manifest.json` and `src/lib/android.ts`); a test keeps them equal. **It can never change once the app is published.**

## What you need to do yourself

Nothing here can be done from code; each step needs an account, a key or a domain.

1. **Deploy to the production domain first** (`docs/DEPLOY.md`). The TWA verifies the site over the network, so localhost or a preview URL won't do.
2. **Set the real domain.** In `android/twa-manifest.json`, replace `grademap.ca` in `host`, `iconUrl`, `maskableIconUrl` and `webManifestUrl` if the domain is different. It should match `NEXT_PUBLIC_SITE_URL`.
3. **Create a Google Play Console developer account** (play.google.com/console; a one-time fee and identity verification). Check Google's current rules for new accounts: a personal account may have to run a closed test with a minimum number of testers for a set time before it can publish to production.
4. **Create the upload key** (keep the file and passwords in a password manager; never commit them):
   ```bash
   cd android
   npx @bubblewrap/cli init --manifest=https://<domain>/manifest.webmanifest
   ```
   Bubblewrap needs a JDK and the Android SDK and offers to download both. `init` can create the keystore; the path and alias in `twa-manifest.json` are `./grademap-upload.keystore` and `grademap-upload`. If `init` rewrites `twa-manifest.json`, check that `packageId` is still `ca.grademap.app`.
5. **Build:** `npx @bubblewrap/cli build` in `android/` makes `app-release-bundle.aab` (upload to Play) and an `.apk` (install on a device for testing).
6. **Use Play App Signing** when you create the app in the Play Console (it is the default). Google re-signs the app with its own key, so **the fingerprint that matters is Google's**: Play Console > your app > App integrity > App signing > "SHA-256 certificate fingerprint".
7. **Set `ANDROID_CERT_SHA256`** in Vercel to that fingerprint. To also test an APK you built locally, add the upload key's fingerprint too (`keytool -list -v -keystore grademap-upload.keystore`), comma-separated. No redeploy of the build is needed: the route reads the variable on each request.
8. **Check the link:** open `https://<domain>/.well-known/assetlinks.json` (it should list your fingerprint) and, with the app installed on a device, confirm there is no browser bar. If the bar shows, the fingerprint, package id or host doesn't match.
9. **Fill in the Play listing:** screenshots (phone, 7" and 10" tablet), descriptions, the privacy policy URL (`/privacy/`), the Data safety form and the content rating questionnaire.

For later releases, raise `appVersionCode` and `appVersionName` in `android/twa-manifest.json`, run `npx @bubblewrap/cli build`, and upload the new bundle. Site changes need no new release.

## Paying: not inside the Android app

Google Play generally requires subscriptions for digital content sold inside an app to use Google Play Billing (with a fee), and doesn't allow sending people from the app to an outside checkout such as Stripe. Decision: **the Android app has no purchase screens** and families subscribe on the website. Their plan syncs to the app like any other device.

- The app opens `/play/?app=android` (`startUrl` in `android/twa-manifest.json`). `src/lib/twa.ts` (`isAndroidApp`) reads that, or the `android-app://` referrer, and keeps it in `sessionStorage`.
- On the parent area's Subscription page, the Android app shows the plan and a plain note, with no prices, buttons or link to the website (Play's rules also cover steering).
- Rejection is still possible. Check Google's current payments policy before you submit, and if it asks for more, the fallback is Google Play Billing (not built).
- The Families policy also applies because the app is for children. The no-ads, no-tracking and no-purchases-by-kids rules in `AGENTS.md` fit it, and the parent area is behind the PIN gate.

## Testing before you publish

- Open the production site in Chrome on a phone and a tablet. "Install app" should be offered, which checks the manifest and service worker.
- Use Play Console **internal testing** to install the real bundle on your own devices (no review).
- Check: opening `/play/` from the app icon, rotating the screen, working offline after one online visit, read-aloud, and that a link to an outside site opens in a Custom Tab and returns to the app.
