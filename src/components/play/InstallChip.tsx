"use client";

import { useEffect, useState } from "react";
import { bookmarkKeys, clearInstallPrompt, getInstallPrompt, installKind, onInstallChange, snoozeKids, type InstallKind } from "@/lib/install";
import { APP_NAME } from "@/lib/brand";
import { Dialog } from "../ui";

/** A small, skippable card at the bottom of the kids' home screen. Phones and tablets only, and never once the app is installed. */
export function InstallChip({ little }: { little: boolean }) {
  const [kind, setKind] = useState<InstallKind>(null);
  const [steps, setSteps] = useState(false);

  useEffect(() => {
    const update = () => setKind(installKind(true));
    update();
    return onInstallChange(update);
  }, []);

  if (!kind) return null;

  const dismiss = () => {
    snoozeKids();
    setSteps(false);
    setKind(null);
  };
  const add = async () => {
    if (kind === "ios") return setSteps(true);
    if (kind === "bookmark") return dismiss();
    const event = getInstallPrompt();
    if (!event) return;
    await event.prompt();
    await event.userChoice.catch(() => undefined);
    clearInstallPrompt();
  };

  return (
    <section className="card flex items-center gap-3 p-3 sm:p-4" aria-label={`Put ${APP_NAME} on your home screen`}>
      <span className="text-4xl" aria-hidden="true">📲</span>
      <div className="min-w-0 flex-1">
        <p className="text-lg font-bold">
          {kind === "bookmark" ? "Save this page!" : little ? "Put me on your screen!" : `Put ${APP_NAME} on your home screen`}
        </p>
        <p className="font-read text-sm text-ink-soft">
          {kind === "bookmark" ? `Press ${bookmarkKeys()} (or ask a grown-up) to find us fast next time.` : "Play with one tap, even without Wi-Fi."}
        </p>
      </div>
      <div className="flex shrink-0 flex-col gap-1.5">
        {kind !== "bookmark" && (
          <button type="button" onClick={add} className="btn btn-good min-h-12 px-4 text-base">
            Add
          </button>
        )}
        <button type="button" onClick={dismiss} className="min-h-12 rounded-xl px-3 text-sm font-bold text-ink-soft">
          {kind === "bookmark" ? "Got it" : "Not now"}
        </button>
      </div>

      <Dialog open={steps} title="Add to Home Screen" onClose={() => setSteps(false)}>
        <ol className="mb-5 list-decimal pl-6 font-read text-lg">
          <li>
            Tap the <b>Share</b> button <span aria-hidden="true">(a square with an arrow pointing up)</span>.
          </li>
          <li>
            Tap <b>Add to Home Screen</b>.
          </li>
          <li>
            Tap <b>Add</b>.
          </li>
        </ol>
        <button type="button" className="btn btn-good min-h-14 w-full text-xl" onClick={dismiss}>
          Got it
        </button>
      </Dialog>
    </section>
  );
}
