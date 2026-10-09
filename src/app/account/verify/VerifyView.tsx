"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LinkCard } from "../AccountLinkPage";

export function VerifyView() {
  const [state, setState] = useState<"working" | "ok" | "failed">("working");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token") ?? "";
    window.history.replaceState(null, "", window.location.pathname);
    const request = token
      ? fetch("/api/auth/verify/", {
          method: "POST",
          credentials: "same-origin",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ token }),
        })
      : Promise.reject(new Error("This link isn’t valid. Open the link from your email."));
    void request
      .then(async (res) => {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
        setState("ok");
      })
      .catch((e: Error) => {
        setError(e.message);
        setState("failed");
      });
  }, []);

  return (
    <LinkCard title={state === "ok" ? "Email confirmed" : state === "failed" ? "We couldn’t confirm that" : "Confirming…"}>
      {state === "ok" && <p className="font-read text-lg">Thank you! Your email address is confirmed.</p>}
      {state === "failed" && <p className="font-read text-lg">{error}</p>}
      <Link href="/parents/" className="btn btn-good min-h-14 text-xl">
        Go to the Parent area
      </Link>
    </LinkCard>
  );
}
