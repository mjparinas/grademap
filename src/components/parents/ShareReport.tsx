"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Dialog } from "../ui";

async function call<T>(url: string, method: string, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, { method, credentials: "same-origin", headers: { "content-type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) });
  } catch {
    throw new Error("You’re offline. Connect to the internet and try again.");
  }
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new Error(data.error ?? `Something went wrong (${res.status}).`);
  return data;
}

/** Makes a read-only link to a child's report that a grandparent, tutor or teacher can open. */
export function ShareReport({ profileId, name, days }: { profileId: string; name: string; days: number }) {
  const account = useStore((s) => s.family.account);
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  async function create() {
    setBusy(true);
    setMessage("");
    try {
      const { url } = await call<{ url: string }>("/api/share/", "POST", { profileId, days });
      setLink(url);
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function stop() {
    setBusy(true);
    try {
      await call("/api/share/?profileId=" + encodeURIComponent(profileId), "DELETE");
      setLink("");
      setMessage("Sharing stopped. Old links no longer work.");
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setMessage("Copy didn’t work. Select the link and copy it.");
    }
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="rounded-xl border border-line bg-white px-3 py-2 text-sm font-semibold">
        🔗 Share
      </button>
      <Dialog open={open} title={`Share ${name}’s report`} onClose={() => setOpen(false)}>
        {!account ? (
          <p className="font-read text-ink-soft">Sign in under Account &amp; sync to share a report. Shared reports are kept on your account.</p>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="font-read text-ink-soft">
              Anyone with the link can see the last {days} days of {name}’s practice: totals, strengths and units. It doesn’t show your email or other children, and it stops working after 30 days or when you stop sharing.
            </p>
            {link ? (
              <>
                <input readOnly aria-label="Report link" value={link} onFocus={(e) => e.currentTarget.select()} className="rounded-xl border-2 border-line px-3 py-2 text-sm" />
                <button type="button" className="btn btn-good min-h-12" onClick={() => void copy()}>
                  {copied ? "Copied!" : "Copy link"}
                </button>
              </>
            ) : (
              <button type="button" className="btn btn-good min-h-12" disabled={busy} onClick={() => void create()}>
                {busy ? "One moment…" : "Create a link"}
              </button>
            )}
            <button type="button" className="btn min-h-12" disabled={busy} onClick={() => void stop()}>
              Stop sharing {name}’s report
            </button>
            {message && (
              <p role="status" className="text-sm font-semibold">
                {message}
              </p>
            )}
          </div>
        )}
        <button type="button" className="btn btn-soft mt-3 min-h-12 w-full" onClick={() => setOpen(false)}>
          Close
        </button>
      </Dialog>
    </>
  );
}
