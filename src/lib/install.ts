/** Helpers for the "Add to Home Screen" nudge shown in the parent area. */

export const INSTALL_SNOOZE_DAYS = 30;
export const KIDS_SNOOZE_DAYS = 7;
const KEY = "grademap.install.dismissed";
const KIDS_KEY = "grademap.install.kids.dismissed";

/** The event Chromium browsers fire when the app can be installed. It isn't in lib.dom yet. */
export type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export type InstallKind = "prompt" | "ios" | "bookmark" | null;

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

/** Phones and tablets. */
export function isMobile(ua = navigator.userAgent, touchPoints = navigator.maxTouchPoints): boolean {
  return /Android|iPhone|iPad|iPod|Mobile/.test(ua) || isIos(ua, touchPoints);
}

export function isSnoozed(now = Date.now(), key = KEY, days = INSTALL_SNOOZE_DAYS): boolean {
  try {
    const t = Number(localStorage.getItem(key));
    return t > 0 && now - t < days * 86_400_000;
  } catch {
    return false;
  }
}

export function snooze(now = Date.now(), key = KEY) {
  try {
    localStorage.setItem(key, String(now));
  } catch {
    // Private mode; the nudge just comes back next visit.
  }
}

/** Which nudge to show right now, if any. */
export function installKind(kids = false): InstallKind {
  if (isStandalone()) return null;
  if (kids ? isSnoozed(Date.now(), KIDS_KEY, KIDS_SNOOZE_DAYS) : isSnoozed()) return null;
  if (deferred) return "prompt";
  if (isIos()) return "ios";
  // Chromium fires its own install event when it can; no event there means installed or not installable, so stay quiet.
  if (!isMobile() && !("onbeforeinstallprompt" in window)) return "bookmark";
  return null;
}

/** The kids' home screen asks more gently and comes back sooner than the parent area does. */
export const snoozeKids = (now = Date.now()) => snooze(now, KIDS_KEY);

/** The keyboard shortcut for bookmarking, written for the device in use. */
export const bookmarkKeys = (ua = navigator.userAgent) => (/Mac/.test(ua) ? "⌘D" : "Ctrl+D");
