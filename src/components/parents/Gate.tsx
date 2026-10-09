"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Critter } from "../Critter";

// Parent PIN. On first visit the parent sets one; after that the parent area
// needs it. "Forgot PIN" asks a multiplication question young kids can't do.

function Keypad({ value, onChange, onSubmit, max = 6 }: { value: string; onChange: (v: string) => void; onSubmit: () => void; max?: number }) {
  return (
    <div className="grid w-full max-w-xs grid-cols-3 gap-2.5">
      {["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "OK"].map((k) => (
        <button
          key={k}
          type="button"
          className={`btn h-16 text-2xl ${k === "OK" ? "btn-good" : ""}`}
          onClick={() => {
            if (k === "OK") onSubmit();
            else if (k === "⌫") onChange(value.slice(0, -1));
            else if (value.length < max) onChange(value + k);
          }}
          aria-label={k === "⌫" ? "Delete" : k}
        >
          {k}
        </button>
      ))}
    </div>
  );
}

function Dots({ n, of = 4 }: { n: number; of?: number }) {
  return (
    <div className="flex gap-3" role="img" aria-label={`${n} digits entered`}>
      {Array.from({ length: Math.max(of, n) }, (_, i) => (
        <span key={i} className={`h-4 w-4 rounded-full ${i < n ? "bg-ink" : "bg-ink/15"}`} />
      ))}
    </div>
  );
}

export function Gate({ onPass }: { onPass: () => void }) {
  const pin = useStore((s) => s.pin);
  const setPin = useStore((s) => s.setPin);
  const checkPin = useStore((s) => s.checkPin);
  const [entry, setEntry] = useState("");
  const [first, setFirst] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [forgot, setForgot] = useState(false);
  const [challenge] = useState(() => [12 + Math.floor(Math.random() * 8), 6 + Math.floor(Math.random() * 4)]);
  const [resetting, setResetting] = useState(false);

  const creating = !pin || resetting;

  const submit = async () => {
    setError("");
    if (forgot) {
      if (Number(entry) === challenge[0] * challenge[1]) {
        setForgot(false);
        setResetting(true);
        setEntry("");
      } else {
        setError("That's not right. Try again.");
        setEntry("");
      }
      return;
    }
    if (creating) {
      if (entry.length < 4) return setError("Use at least 4 digits.");
      if (first === null) {
        setFirst(entry);
        setEntry("");
        return;
      }
      if (entry !== first) {
        setError("The PINs didn't match. Start again.");
        setFirst(null);
        setEntry("");
        return;
      }
      await setPin(entry);
      onPass();
      return;
    }
    if (await checkPin(entry)) onPass();
    else {
      setError("Wrong PIN.");
      setEntry("");
    }
  };

  const title = forgot
    ? `What is ${challenge[0]} × ${challenge[1]}?`
    : creating
      ? first === null
        ? "Create a parent PIN"
        : "Type it again to confirm"
      : "Parents only";

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-5 px-4 text-center">
      <div className="self-start">
        <Link href="/play/" className="btn h-12 px-4 text-base">
          ← Back
        </Link>
      </div>
      <Critter id="hoot" mood="think" size={110} />
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="max-w-sm font-read text-ink-soft">
        {forgot
          ? "Answer this to set a new PIN."
          : creating
            ? "This keeps the parent area (settings, reports and billing) away from little fingers."
            : "Enter your PIN to open the parent area."}
      </p>
      {forgot ? <p className="text-4xl font-bold tabular-nums">{entry || "?"}</p> : <Dots n={entry.length} />}
      {error && <p className="animate-shake font-semibold text-nudge-dark">{error}</p>}
      <Keypad value={entry} onChange={setEntry} onSubmit={() => void submit()} max={forgot ? 4 : 6} />
      {!creating && !forgot && (
        <button type="button" className="text-sm font-semibold text-ink-soft underline" onClick={() => setForgot(true)}>
          Forgot PIN?
        </button>
      )}
    </main>
  );
}
