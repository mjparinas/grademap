"use client";

import { useState } from "react";
import { REPORT_REASONS, type ReportReason } from "@/lib/reportReasons";
import { Dialog } from "../ui";

/** A small flag on the feedback bar that lets a child or parent tell us a question is wrong or unclear. */
export function ReportQuestion({ unitKey, prompt }: { unitKey: string; prompt: string }) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"choose" | "sending" | "sent" | "failed">("choose");

  async function send(reason: ReportReason) {
    setState("sending");
    try {
      const res = await fetch("/api/feedback/", {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ unitKey, prompt, reason }),
      });
      setState(res.ok ? "sent" : "failed");
    } catch {
      setState("failed");
    }
  }
  const close = () => {
    setOpen(false);
    setState("choose");
  };

  return (
    <>
      <button
        type="button"
        aria-label="Report a problem with this question"
        title="Report a problem with this question"
        onClick={() => setOpen(true)}
        className="absolute -top-14 right-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-xl text-ink-soft shadow-md ring-1 ring-black/10 hover:bg-white short:hidden"
      >
        <span aria-hidden="true">⚑</span>
      </button>
      <Dialog open={open} title={state === "sent" ? "Thank you!" : "What’s wrong with this question?"} onClose={close}>
        {state === "sent" ? (
          <>
            <p className="mb-4 font-read text-lg text-ink-soft">We’ll take a look. Your report doesn’t include your name.</p>
            <button type="button" className="btn btn-good min-h-14 w-full text-xl" onClick={close}>
              Back to the question
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            {state === "failed" && <p role="alert" className="font-semibold text-nudge-dark">That didn’t send. Check your connection and try again.</p>}
            {REPORT_REASONS.map((r) => (
              <button key={r.id} type="button" disabled={state === "sending"} className="btn min-h-14 text-lg" onClick={() => void send(r.id)}>
                {r.label}
              </button>
            ))}
            <button type="button" className="btn btn-soft min-h-12" onClick={close}>
              Cancel
            </button>
          </div>
        )}
      </Dialog>
    </>
  );
}
