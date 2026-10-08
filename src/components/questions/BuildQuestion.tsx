"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { replay } from "@/lib/juice";
import { sounds } from "@/lib/sound";
import type { BuildQuestion as Q } from "@/content/types";
import { HundredFlat, OneCube, TenRod } from "../visuals";
import { isLocked, type QuestionProps } from "./types";

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

interface Control {
  label: string;
  add: [number, number, number];
  colour: [string, string];
  icon: ReactNode;
  count: number;
  minusLabel: string;
}

export function BuildQuestion({ q, status, onAttempt }: QuestionProps<Q>) {
  const [hundreds, setHundreds] = useState(0);
  const [tens, setTens] = useState(0);
  const [ones, setOnes] = useState(0);
  const tray = useRef<HTMLDivElement>(null);
  const locked = isLocked(status);

  // When we show the answer, show it with blocks too.
  const revealed = status === "revealed";
  const sh = revealed ? Math.floor(q.target / 100) : hundreds;
  const st = revealed ? Math.floor((q.target % 100) / 10) : tens;
  const so = revealed ? q.target % 10 : ones;
  const value = sh * 100 + st * 10 + so;

  const change = (dh: number, dt: number, d1: number) => {
    const nh = Math.min(9, Math.max(0, hundreds + dh));
    const nt = Math.min(9, Math.max(0, tens + dt));
    const no = Math.min(9, Math.max(0, ones + d1));
    if (nh === hundreds && nt === tens && no === ones) {
      replay(tray.current, "animate-shake");
      return;
    }
    if (dh > 0 || dt > 0 || d1 > 0) sounds.clack();
    else sounds.whoosh();
    setHundreds(nh);
    setTens(nt);
    setOnes(no);
  };

  const controls: Control[] = [
    ...(q.hundreds
      ? [
          {
            label: "+ Hundred",
            add: [1, 0, 0] as [number, number, number],
            colour: ["#25b47e", "#16925f"] as [string, string],
            icon: <span aria-hidden="true" className="inline-block h-5 w-5 rounded-sm border-2 border-white/90 bg-[#7fe0b5]" />,
            count: hundreds,
            minusLabel: "Take away a hundred",
          },
        ]
      : []),
    {
      label: "+ Ten",
      add: [0, 1, 0],
      colour: ["#4f8ef7", "#2f6fd6"],
      icon: (
        <span
          aria-hidden="true"
          className="inline-block h-4 w-14 rounded-sm border-2 border-white/90"
          style={{ background: "repeating-linear-gradient(90deg, #86b1fa 0 9px, #2f6fd6 9px 11px)" }}
        />
      ),
      count: tens,
      minusLabel: "Take away a ten",
    },
    {
      label: "+ One",
      add: [0, 0, 1],
      colour: ["#ff9f43", "#e07f1f"],
      icon: <span aria-hidden="true" className="inline-block h-4 w-4 rounded-sm border-2 border-white/90 bg-[#ffc98a]" />,
      count: ones,
      minusLabel: "Take away a one",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4">
      <div ref={tray} className="card flex min-h-[230px] w-full flex-col items-center justify-end gap-3 p-4 sm:min-h-[260px]">
        <div className="flex min-h-[176px] flex-wrap items-end justify-center gap-6">
          {sh > 0 && (
            <div className="flex flex-wrap items-end gap-1.5">
              {Array.from({ length: sh }, (_, i) => (
                <div key={`h${i}`} className="animate-drop-in">
                  <HundredFlat size={8} />
                </div>
              ))}
            </div>
          )}
          <div className="flex items-end gap-1.5">
            {Array.from({ length: st }, (_, i) => (
              <div key={`t${i}`} className="animate-drop-in">
                <TenRod size={15} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {Array.from({ length: so }, (_, i) => (
              <div key={`o${i}`} className="animate-drop-in">
                <OneCube size={15} />
              </div>
            ))}
          </div>
        </div>
        <p className="text-center text-xl font-semibold text-ink-soft sm:text-2xl">
          {q.hundreds && `${plural(sh, "hundred", "hundreds")} + `}
          {plural(st, "ten", "tens")} + {plural(so, "one", "ones")} ={" "}
          <span key={value} className="inline-block animate-pop-in text-4xl font-bold text-ink">
            {value}
          </span>
        </p>
      </div>

      <div className={`grid w-full gap-3 sm:gap-4 ${q.hundreds ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2"}`}>
        {controls.map((c) => (
          <div key={c.label} className="flex gap-2">
            <button
              type="button"
              data-quiet
              disabled={locked}
              onClick={() => change(...c.add)}
              className="btn btn-primary min-h-20 flex-1 text-2xl"
              style={{ "--c": c.colour[0], "--c-dark": c.colour[1] } as CSSProperties}
            >
              {c.icon}
              {c.label}
            </button>
            <button
              type="button"
              data-quiet
              disabled={locked || c.count === 0}
              onClick={() => change(-c.add[0], -c.add[1], -c.add[2])}
              className="btn min-h-20 w-16 text-3xl"
              aria-label={c.minusLabel}
            >
              −
            </button>
          </div>
        ))}
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
