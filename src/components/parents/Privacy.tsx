"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { APP_NAME } from "@/lib/brand";
import { useStore } from "@/lib/store";
import { Dialog } from "../ui";
import { PageTitle, Panel } from "./common";

export function PrivacyPage() {
  const [confirm, setConfirm] = useState(false);
  const wipe = useStore((s) => s.wipeDevice);
  const router = useRouter();

  const exportData = () => {
    const s = useStore.getState();
    const data = {
      exportedAt: new Date().toISOString(),
      app: APP_NAME,
      profiles: s.profiles,
      settings: s.settings,
      events: s.events,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${APP_NAME.toLowerCase()}-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageTitle title="Privacy & data" />
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="What we store">
          <ul className="flex list-disc flex-col gap-2 pl-5 font-read text-ink-soft">
            <li>A first name (or nickname), grade, optional birth year and avatar for each child.</li>
            <li>Practice results: which unit, right or wrong, and how long it took. No free text, photos or voice recordings.</li>
            <li>Your email and a securely hashed password if you create an account.</li>
            <li>No ads, no tracking pixels, and we never sell data.</li>
          </ul>
        </Panel>
        <Panel title="Your data, your choice">
          <div className="flex flex-col gap-3">
            <button type="button" className="rounded-xl bg-[#4f8ef7] px-4 py-2.5 font-bold text-white" onClick={exportData}>
              ⬇️ Download all data (JSON)
            </button>
            <button type="button" className="rounded-xl border border-[#e57a12] px-4 py-2.5 font-semibold text-nudge-dark" onClick={() => setConfirm(true)}>
              Erase everything on this device
            </button>
            <p className="text-sm text-ink-soft">To delete data on our servers too, use “Delete account” on the Account & sync page.</p>
          </div>
        </Panel>
      </div>
      <Dialog open={confirm} title="Erase this device?" onClose={() => setConfirm(false)}>
        <p className="mb-4 font-read text-ink-soft">Removes every child, all progress and settings from this device. If you&apos;re signed in, your account keeps a copy.</p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="btn btn-nudge min-h-14 text-xl"
            onClick={() =>
              void wipe().then(() => router.push("/play/"))
            }
          >
            Yes, erase
          </button>
          <button type="button" className="btn min-h-14 text-xl" onClick={() => setConfirm(false)}>
            Cancel
          </button>
        </div>
      </Dialog>
    </>
  );
}
