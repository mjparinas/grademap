// Detects the Android app (a Trusted Web Activity, see docs/ANDROID.md). Google Play doesn't allow
// selling subscriptions inside an app through an outside checkout, so the Android app has no
// purchase screens; families subscribe on the website and the plan shows up here after sync.
//
// The app opens /play/?app=android (startUrl in android/twa-manifest.json). Chrome also reports
// document.referrer as android-app://<package> on a cold start. The flag is kept in sessionStorage,
// so the parent area (a separate page load) still knows, but ordinary Chrome tabs never get it.

const KEY = "grademap.android-app";

export function isAndroidApp(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.sessionStorage.getItem(KEY)) return true;
    const fromApp = new URLSearchParams(window.location.search).get("app") === "android" || document.referrer.startsWith("android-app://");
    if (fromApp) window.sessionStorage.setItem(KEY, "1");
    return fromApp;
  } catch {
    return false;
  }
}
