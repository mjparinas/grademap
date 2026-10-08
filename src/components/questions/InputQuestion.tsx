"use client";

import { useEffect, useRef, useState } from "react";
import { replay } from "@/lib/juice";
import { sounds } from "@/lib/sound";
import type { InputQuestion as Q } from "@/content/types";
import { isLocked, type QuestionProps } from "./types";

// An on-screen keypad, so answers never depend on a phone keyboard popping up.
// A hardware keyboard works too.

function normalise(text: string): string {
  let t = text.trim().replace(/−/g, "-").replace(/\s+/g, "");
  if (/^-?\d*\.\d+$/.test(t)) t = String(Number(t));
  if (/^-?\d+$/.test(t)) t = String(Number(t));
  return t;
}

function value(text: string): number | null {
  const t = normalise(text);
  if (/^-?\d+\/\d+$/.test(t)) {
    const [a, b] = t.split("/").map(Number);
    return b ? a / b : null;
  }
  return /^-?\d+(\.\d+)?$/.test(t) ? Number(t) : null;
}

export function isRightAnswer(q: Q, entry: string): boolean {
  const e = normalise(entry);
  if (!e) return false;
  const accepted = [q.answer, ...(q.accept ?? [])].map(normalise);
  if (accepted.includes(e)) return true;
  // Decimals like 0.50 and 0.5 are the same number; fractions must match one of the accepted forms.
  if (!e.includes("/") && !q.answer.includes("/")) {
    const v = value(e);
    const a = value(q.answer);
    return v !== null && a !== null && Math.abs(v - a) < 1e-9;
  }
  return false;
}

export function InputQuestion({ q, status, onAttempt }: QuestionProps<Q>) {
  const [entry, setEntry] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const locked = isLocked(status);
  const pad = q.keypad ?? "number";
  const shown = status === "revealed" ? q.answer : entry;

  const keys = ["7", "8", "9", "4", "5", "6", "1", "2", "3", pad === "integer" ? "−" : pad === "decimal" ? "." : pad === "fraction" ? "/" : "", "0", "⌫"];

  const press = (k: string) => {
    if (locked || !k) return;
    sounds.tap();
    if (k === "⌫") return setEntry((e) => e.slice(0, -1));
    setEntry((e) => {
      if (e.length >= 9) return e;
      if (k === "−") return e.startsWith("-") ? e.slice(1) : `-${e}`;
      if ((k === "." || k === "/") && (e.includes(k) || !e || e === "-")) return e;
      return e + k;
    });
  };

  const submit = (el: Element | null) => {
    if (locked || !entry) return;
    const ok = isRightAnswer(q, entry);
    if (!ok) {
      replay(box.current, "animate-shake");
      setEntry("");
    }
    onAttempt(ok, el);
  };

  // Hardware keyboards.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (locked) return;
      if (/^\d$/.test(e.key)) press(e.key);
      else if (e.key === "Backspace") press("⌫");
      else if (e.key === "." && pad === "decimal") press(".");
      else if (e.key === "/" && pad === "fraction") press("/");
      else if (e.key === "-" && pad === "integer") press("−");
      else if (e.key === "Enter") submit(box.current);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-4">
      <div
        ref={box}
        className={`flex h-20 w-full items-center justify-center gap-2 rounded-2xl border-4 bg-white px-4 font-read text-5xl font-bold ${
          status === "correct" ? "border-good text-good-dark" : status === "revealed" ? "border-help text-[#2f6fd6]" : "border-line"
        }`}
        aria-live="polite"
        aria-label={`Your answer: ${shown || "empty"}`}
      >
        <span className={shown ? "" : "text-ink/25"}>{shown.replace("-", "−") || "?"}</span>
        {q.suffix && <span className="text-3xl text-ink-soft">{q.suffix}</span>}
      </div>
      <div className="grid w-full grid-cols-3 gap-2.5">
        {keys.map((k, i) =>
          k ? (
            <button key={i} type="button" data-quiet disabled={locked} onClick={() => press(k)} className="btn h-16 text-3xl" aria-label={k === "⌫" ? "Delete" : k}>
              {k}
            </button>
          ) : (
            <span key={i} />
          ),
        )}
      </div>
      <button
        type="button"
        data-quiet
        disabled={locked || !entry}
        onClick={(e) => submit(e.currentTarget)}
        className={`btn btn-good min-h-18 w-full text-3xl ${locked || !entry ? "opacity-50" : ""}`}
      >
        Check ✓
      </button>
    </div>
  );
}
