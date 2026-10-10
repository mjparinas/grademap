"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LinkCard } from "../AccountLinkPage";

export function UnsubscribeView() {
  const [token, setToken] = useState<string | null>(null);
  const [reminders, setReminders] = useState(false);
  const [state, setState] = useState<"idle" | "busy" | "done" | "failed">("idle");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token") ?? "";
    const isReminders = params.get("kind") === "reminders";
    window.history.replaceState(null, "", window.location.pathname);
    queueMicrotask(() => {
      setToken(t);
      setReminders(isReminders);
    });
  }, []);

  async function unsubscribe() {
    setState("busy");
    const res = await fetch(`/api/email/unsubscribe/?${reminders ? "kind=reminders&" : ""}token=${encodeURIComponent(token ?? "")}`, { method: "POST" }).catch(() => null);
    setState(res?.ok ? "done" : "failed");
  }

  return (
    <LinkCard title={state === "done" ? "You’re unsubscribed" : reminders ? "Stop practice reminders?" : "Stop the weekly report?"}>
      {state === "done" ? (
        <p className="font-read text-lg">{reminders ? "You won’t get practice reminders any more." : "You won’t get the weekly progress email any more."} You can turn it back on any time in the Parent area under Account &amp; sync.</p>
      ) : (
        <>
          <p className="font-read text-lg">{reminders ? "We’ll stop sending practice reminders." : "We’ll stop sending the weekly progress email."} Account emails, like password resets, will still reach you when you ask for them.</p>
          {state === "failed" && (
            <p role="alert" className="font-semibold text-nudge-dark">
              That link isn’t valid or couldn’t be reached. You can also switch it off in the Parent area under Account &amp; sync.
            </p>
          )}
          <button type="button" className="btn btn-good min-h-14 text-xl" disabled={!token || state === "busy"} onClick={() => void unsubscribe()}>
            {state === "busy" ? "One moment…" : "Unsubscribe"}
          </button>
        </>
      )}
      <Link href="/parents/" className="btn min-h-14 text-xl">
        Go to the Parent area
      </Link>
    </LinkCard>
  );
}
