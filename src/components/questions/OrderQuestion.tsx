"use client";

import { useRef, useState } from "react";
import { shuffle } from "@/content/random";
import { replay } from "@/lib/juice";
import { sounds } from "@/lib/sound";
import type { OrderQuestion as Q } from "@/content/types";
import { isLocked, type QuestionProps } from "./types";

export function OrderQuestion({ q, status, onAttempt }: QuestionProps<Q>) {
  // Shuffle once, making sure the starting order isn't already correct.
  const [pool] = useState(() => {
    let s = shuffle(q.items);
    while (s.length > 1 && s.every((item, i) => item.id === q.items[i].id)) s = shuffle(q.items);
    return s;
  });
  const [placed, setPlaced] = useState<string[]>([]);
  const [wrongFrom, setWrongFrom] = useState<number | null>(null);
  const slotsRef = useRef<HTMLDivElement>(null);
  const locked = isLocked(status);
  const compact = q.items.every((i) => i.label.length <= 4);

  const shown = status === "revealed" ? q.items.map((i) => i.id) : placed;
  const byId = (id: string) => q.items.find((i) => i.id === id)!;
  const full = placed.length === q.items.length;

  const place = (id: string) => {
    sounds.pop(placed.length);
    setWrongFrom(null);
    setPlaced((p) => [...p, id]);
  };

  const unplace = (id: string) => {
    sounds.whoosh();
    setWrongFrom(null);
    setPlaced((p) => p.filter((x) => x !== id));
  };

  const check = (el: Element) => {
    const firstWrong = placed.findIndex((id, i) => id !== q.items[i].id);
    if (firstWrong === -1) {
      onAttempt(true, el);
      return;
    }
    // Keep the part that's right; send the rest back to try again.
    setWrongFrom(firstWrong);
    replay(slotsRef.current, "animate-shake");
    setTimeout(() => setPlaced((p) => p.slice(0, firstWrong)), 650);
    onAttempt(false, el);
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5">
      <div
        ref={slotsRef}
        className={compact ? "flex flex-wrap justify-center gap-3" : "flex w-full flex-col gap-2.5"}
      >
        {q.items.map((_, i) => {
          const id = shown[i];
          const item = id ? byId(id) : null;
          const bad = wrongFrom !== null && i >= wrongFrom && i < placed.length;
          const good = status === "correct" || status === "revealed";
          return (
            <div key={i} className={`flex items-center gap-2.5 ${compact ? "" : "w-full"}`}>
              {!compact && (
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white"
                  style={{ background: "var(--c)" }}
                >
                  {i + 1}
                </span>
              )}
              {item ? (
                <button
                  type="button"
                  data-quiet
                  disabled={locked}
                  onClick={() => unplace(item.id)}
                  className={`btn animate-drop-in ${good ? "btn-good" : bad ? "btn-nudge" : "btn-soft"} ${
                    compact ? "h-20 min-w-20 px-3 text-4xl" : "min-h-16 flex-1 justify-start px-4 text-left font-read text-xl sm:text-2xl"
                  }`}
                >
                  {item.emoji && <span className="text-3xl">{item.emoji}</span>}
                  {item.label}
                </button>
              ) : (
                <div
                  className={`flex items-center justify-center rounded-2xl border-4 border-dashed border-ink/20 text-2xl font-bold text-ink/30 ${
                    compact ? "h-20 w-20" : "min-h-16 flex-1"
                  } ${i === placed.length && !locked ? "animate-pulse-soft border-[color:var(--c)]/60" : ""}`}
                >
                  {compact ? i + 1 : ""}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!locked && (
        <div className="flex flex-wrap justify-center gap-3">
          {pool
            .filter((item) => !placed.includes(item.id))
            .map((item, i) => (
              <div key={item.id} className="animate-pop-in" style={{ animationDelay: `${i * 50}ms` }}>
                <button
                  type="button"
                  data-quiet
                  data-testid="pool-item"
                  onClick={() => place(item.id)}
                  className={`btn ${compact ? "h-20 min-w-20 px-3 text-4xl" : "min-h-16 px-4 font-read text-xl sm:text-2xl"}`}
                >
                  {item.emoji && <span className="text-3xl">{item.emoji}</span>}
                  {item.label}
                </button>
              </div>
            ))}
        </div>
      )}

      {!locked && (
        <button
          type="button"
          data-quiet
          disabled={!full}
          onClick={(e) => check(e.currentTarget)}
          className={`btn btn-good min-h-18 w-full max-w-sm text-3xl ${full ? "animate-pulse-soft" : "opacity-50"}`}
        >
          Check ✓
        </button>
      )}
    </div>
  );
}
