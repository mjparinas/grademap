"use client";

import { useState, type CSSProperties } from "react";
import type { Choice, ChoiceQuestion as Q } from "@/lib/types";
import { Coin, Shape } from "../visuals";
import { isLocked, type QuestionProps } from "./types";

function layoutFor(choices: Choice[]): "tiles" | "big" | "list" {
  if (choices.some((c) => c.emoji || c.shape || c.coin)) return "tiles";
  if (choices.every((c) => c.label.length <= 12)) return "big";
  return "list";
}

export function ChoiceQuestion({ q, status, onAttempt }: QuestionProps<Q>) {
  const [wrong, setWrong] = useState<string[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const locked = isLocked(status);
  const layout = layoutFor(q.choices);
  const longest = Math.max(...q.choices.map((c) => c.label.length));
  const bigText = longest <= 3 ? "text-5xl sm:text-6xl" : longest <= 6 ? "text-3xl sm:text-5xl" : "text-2xl sm:text-4xl";

  const grid =
    layout === "list"
      ? "grid-cols-1 max-w-2xl"
      : q.choices.length === 4
        ? "grid-cols-2 sm:grid-cols-4"
        : q.choices.length === 2
          ? "grid-cols-2 max-w-xl"
          : "grid-cols-3";

  return (
    <div className={`mx-auto grid w-full gap-3 sm:gap-4 ${grid}`}>
      {q.choices.map((c, i) => {
        const isWrong = wrong.includes(c.id);
        const isRight = c.id === q.answer;
        const showRight = (status === "correct" && picked === c.id) || (status === "revealed" && isRight);
        const tone = showRight ? (status === "revealed" ? "btn-primary" : "btn-good") : isWrong ? "btn-nudge" : "";
        return (
          <div key={c.id} className="animate-rise-in" style={{ animationDelay: `${i * 70}ms` }}>
            <button
              type="button"
              data-quiet
              data-testid="choice"
              disabled={locked || isWrong}
              onClick={(e) => {
                setPicked(c.id);
                if (!isRight) setWrong((w) => [...w, c.id]);
                onAttempt(isRight, e.currentTarget);
              }}
              style={status === "revealed" && isRight ? ({ "--c": "#4f8ef7", "--c-dark": "#2f6fd6" } as CSSProperties) : undefined}
              className={`btn w-full ${tone} ${isWrong ? "animate-shake opacity-60" : ""} ${
                showRight ? "animate-correct-pop" : ""
              } ${locked && !showRight ? "opacity-50" : ""} ${
                layout === "big"
                  ? `min-h-24 px-2 sm:min-h-32 ${bigText}`
                  : layout === "list"
                    ? "min-h-20 justify-start px-5 py-3 text-left font-read text-2xl"
                    : "min-h-32 flex-col px-3 py-3 text-xl sm:min-h-40 sm:text-2xl"
              }`}
            >
              {layout === "tiles" && (
                <>
                  {c.emoji && <span className="text-5xl leading-none sm:text-6xl">{c.emoji}</span>}
                  {c.shape && <Shape shape={c.shape} size={80} />}
                  {c.coin && <Coin cents={c.coin} />}
                </>
              )}
              <span className={layout === "tiles" ? "font-read leading-tight" : ""}>{c.label}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
