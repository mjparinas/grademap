"use client";

import { useRef, useState, type CSSProperties } from "react";
import { replay } from "@/lib/juice";
import { sounds } from "@/lib/sound";
import type { BuildQuestion as Q } from "@/lib/types";
import { OneCube, TenRod } from "../visuals";
import { isLocked, type QuestionProps } from "./types";

export function BuildQuestion({ q, status, onAttempt }: QuestionProps<Q>) {
  const [tens, setTens] = useState(0);
  const [ones, setOnes] = useState(0);
  const tray = useRef<HTMLDivElement>(null);
  const locked = isLocked(status);

  // When we show the answer, show it with blocks too.
  const shownTens = status === "revealed" ? Math.floor(q.target / 10) : tens;
  const shownOnes = status === "revealed" ? q.target % 10 : ones;
  const value = shownTens * 10 + shownOnes;

  const change = (dt: number, d1: number) => {
    const nt = Math.min(9, Math.max(0, tens + dt));
    const no = Math.min(9, Math.max(0, ones + d1));
    if (nt === tens && no === ones) {
      replay(tray.current, "animate-shake");
      return;
    }
    if (dt > 0 || d1 > 0) sounds.clack();
    else sounds.whoosh();
    setTens(nt);
    setOnes(no);
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4">
      <div
        ref={tray}
        className="card flex min-h-[230px] w-full flex-col items-center justify-end gap-3 p-4 sm:min-h-[260px]"
      >
        <div className="flex min-h-[176px] items-end justify-center gap-8">
          <div className="flex items-end gap-1.5">
            {Array.from({ length: shownTens }, (_, i) => (
              <div key={`t${i}`} className="animate-drop-in">
                <TenRod size={15} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {Array.from({ length: shownOnes }, (_, i) => (
              <div key={`o${i}`} className="animate-drop-in">
                <OneCube size={15} />
              </div>
            ))}
          </div>
        </div>
        <p className="text-2xl font-semibold text-ink-soft">
          {shownTens} {shownTens === 1 ? "ten" : "tens"} + {shownOnes} {shownOnes === 1 ? "one" : "ones"} ={" "}
          <span key={value} className="inline-block animate-pop-in text-4xl font-bold text-ink">
            {value}
          </span>
        </p>
      </div>

      <div className="grid w-full grid-cols-2 gap-3 sm:gap-4">
        <div className="flex gap-2">
          <button type="button" data-quiet disabled={locked} onClick={() => change(1, 0)} className="btn btn-primary min-h-20 flex-1 text-2xl" style={{ "--c": "#4f8ef7", "--c-dark": "#2f6fd6" } as CSSProperties}>
            <span
              aria-hidden="true"
              className="inline-block h-4 w-14 rounded-sm border-2 border-white/90"
              style={{ background: "repeating-linear-gradient(90deg, #86b1fa 0 9px, #2f6fd6 9px 11px)" }}
            />
            + Ten
          </button>
          <button type="button" data-quiet disabled={locked || tens === 0} onClick={() => change(-1, 0)} className="btn min-h-20 w-16 text-3xl" aria-label="Take away a ten">
            −
          </button>
        </div>
        <div className="flex gap-2">
          <button type="button" data-quiet disabled={locked} onClick={() => change(0, 1)} className="btn btn-primary min-h-20 flex-1 text-2xl" style={{ "--c": "#ff9f43", "--c-dark": "#e07f1f" } as CSSProperties}>
            <span aria-hidden="true" className="inline-block h-4 w-4 rounded-sm border-2 border-white/90 bg-[#ffc98a]" />
            + One
          </button>
          <button type="button" data-quiet disabled={locked || ones === 0} onClick={() => change(0, -1)} className="btn min-h-20 w-16 text-3xl" aria-label="Take away a one">
            −
          </button>
        </div>
      </div>

      <button
        type="button"
        data-quiet
        disabled={locked || value === 0}
        onClick={(e) => onAttempt(value === q.target, e.currentTarget)}
        className={`btn btn-good min-h-18 w-full max-w-sm text-3xl ${locked || value === 0 ? "opacity-50" : ""}`}
      >
        Check ✓
      </button>
    </div>
  );
}
