/** Helpers for the "Add to Home Screen" nudge shown in the parent area. */

export const INSTALL_SNOOZE_DAYS = 30;
const KEY = "grademap.install.dismissed";

/** The event Chromium browsers fire when the app can be installed. It isn't in lib.dom yet. */
export type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export type InstallKind = "prompt" | "ios" | null;

let deferred: InstallPromptEvent | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((fn) => fn());

// The browser can fire this before the parent screens mount, so listen from the moment this module loads.
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e as InstallPromptEvent;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    notify();
  });
}

export const getInstallPrompt = () => deferred;

export function onInstallChange(fn: () => void) {
  listeners.add(fn);
  return () => void listeners.delete(fn);
}

export function clearInstallPrompt() {
  deferred = null;
  notify();
}

/** iPhone, iPad and iPod (iPadOS reports itself as a Mac, so touch support gives it away). */
export function isIos(ua = navigator.userAgent, touchPoints = navigator.maxTouchPoints): boolean {
  return /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && touchPoints > 1);
}

/** True when the app is already running from the home screen. */
export function isStandalone(): boolean {
  return window.matchMedia?.("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export function isSnoozed(now = Date.now()): boolean {
  try {
    const t = Number(localStorage.getItem(KEY));
    return t > 0 && now - t < INSTALL_SNOOZE_DAYS * 86_400_000;
  } catch {
    return false;
  }
}

export function snooze(now = Date.now()) {
  try {
    localStorage.setItem(KEY, String(now));
  } catch {
    // Private mode; the nudge just comes back next visit.
  }
}

/** Which nudge to show right now, if any. */
export function installKind(): InstallKind {
  if (isStandalone() || isSnoozed()) return null;
  if (deferred) return "prompt";
  return isIos() ? "ios" : null;
}
