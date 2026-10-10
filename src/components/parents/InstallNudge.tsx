"use client";

import { useEffect, useState } from "react";
import { bookmarkKeys, clearInstallPrompt, getInstallPrompt, installKind, onInstallChange, snooze, type InstallKind } from "@/lib/install";
import { APP_NAME } from "@/lib/brand";
import { Panel } from "./common";

/** Asks parents to put the app on the home screen. Never shown to kids mid-play, and quiet for a month once dismissed. */
export function InstallNudge() {
  const [kind, setKind] = useState<InstallKind>(null);

  useEffect(() => {
    const update = () => setKind(installKind());
    update();
    return onInstallChange(update);
  }, []);

  if (!kind) return null;

  const dismiss = () => {
    snooze();
    setKind(null);
  };
  const install = async () => {
    const event = getInstallPrompt();
    if (!event) return;
    await event.prompt();
    await event.userChoice.catch(() => undefined);
    clearInstallPrompt();
  };

  return (
    <Panel className="mb-5 border-[#25b47e]/40 bg-[#effaf5]">
      <div className="flex items-start gap-3">
        <span className="text-3xl" aria-hidden="true">📲</span>
        <div className="flex-1">
          <p className="font-bold">{kind === "bookmark" ? `Bookmark ${APP_NAME}` : `Add ${APP_NAME} to your home screen`}</p>
          {kind === "prompt" ? (
            <p className="font-read text-sm">It opens like any other app, fills the whole screen and keeps working offline.</p>
          ) : kind === "bookmark" ? (
            <p className="font-read text-sm">
              Press <b>{bookmarkKeys()}</b> to bookmark this page, so your family can find it again in one click.
            </p>
          ) : (
            <ol className="font-read mt-1 list-decimal pl-5 text-sm">
              <li>
                Tap the <b>Share</b> button <span aria-hidden="true">(a square with an arrow pointing up)</span> in Safari.
              </li>
              <li>
                Scroll down and tap <b>Add to Home Screen</b>.
              </li>
              <li>
                Tap <b>Add</b>.
              </li>
            </ol>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {kind === "prompt" && (
              <button type="button" onClick={install} className="min-h-11 rounded-xl bg-[#253047] px-4 py-2 text-sm font-bold text-white">
                Add to Home Screen
              </button>
            )}
            <button type="button" onClick={dismiss} className="min-h-11 rounded-xl border border-line bg-white px-4 py-2 text-sm font-bold">
              Not now
            </button>
          </div>
        </div>
      </div>
    </Panel>
  );
}
