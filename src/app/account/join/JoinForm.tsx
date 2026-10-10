"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LinkCard } from "../AccountLinkPage";

export function JoinForm() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token") ?? "";
    // Read after hydration; the query string isn't available while pre-rendering.
    queueMicrotask(() => setToken(t));
    // Keep the one-time token out of the address bar and browser history.
    if (t) window.history.replaceState(null, "", window.location.pathname);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("busy");
    setError("");
    try {
      const res = await fetch("/api/family/join/", {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Something went wrong. Please try again.");
      setState("done");
    } catch (err) {
      setError((err as Error).message);
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <LinkCard title="You’ve joined">
        <p className="font-read text-lg">You&apos;re signed in. You can see your family&apos;s reports in the Parent area.</p>
        <Link href="/parents/" className="btn btn-good min-h-14 text-xl">
          Go to the Parent area
        </Link>
      </LinkCard>
    );
  }
  if (token === "") {
    return (
      <LinkCard title="This link isn’t valid">
        <p className="font-read text-lg">Open the link from your invitation email, or ask the person who invited you to send a new one.</p>
        <Link href="/parents/" className="btn min-h-14 text-xl">
          Go to the Parent area
        </Link>
      </LinkCard>
    );
  }
  return (
    <LinkCard title="Choose a password">
      <form onSubmit={submit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="font-semibold">Password</span>
          <input type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl border-2 border-line px-3 py-2 text-lg" />
          <span className="text-sm text-ink-soft">At least 8 characters.</span>
        </label>
        {error && (
          <p role="alert" className="font-semibold text-nudge-dark">
            {error}
          </p>
        )}
        <button type="submit" disabled={state === "busy" || token === null} className="btn btn-good min-h-14 text-xl disabled:opacity-60">
          {state === "busy" ? "One moment…" : "Join the family"}
        </button>
      </form>
    </LinkCard>
  );
}
