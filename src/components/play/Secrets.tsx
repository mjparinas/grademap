"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { hashSeed } from "@/content/random";
import { createKonamiMatcher, stepForGesture, stepForKey, TAP_MAX } from "@/lib/konami";
import { dayKey } from "@/lib/model";
import { sounds } from "@/lib/sound";
import { derivedFor, useActiveProfile, useStore } from "@/lib/store";
import { useNow } from "@/lib/useNow";
import { Critter, SpeechBubble } from "../Critter";

// Easter eggs. Each is found by playing, earns a quiet secret trophy and never gets in the way.

/** Logs a secret for the active child once; later finds are ignored. */
export function findSecret(code: string) {
  const st = useStore.getState();
  if (!st.activeId || derivedFor(st, st.activeId).secrets.includes(code)) return;
  st.log([{ type: "secret", code }]);
}

const WORDS: Record<string, string> = { ollie: "ollie", hoot: "hoot", moose: "maple", eh: "" };

interface Visitor {
  id: number;
  critter: string;
  say?: string;
}

/** Konami code, secret words and the critters that run across the screen. */
export function SecretsListener() {
  const profile = useActiveProfile();
  const companion = profile?.companion ?? "ollie";
  const [visitors, setVisitors] = useState<Visitor[]>([]);

  useEffect(() => {
    const feed = createKonamiMatcher();
    let typed = "";
    const onKey = (e: KeyboardEvent) => {
      const step = stepForKey(e.key);
      if (step && feed(step)) findSecret("konami");

      // Secret words are typed on a physical keyboard, never inside a text box.
      const target = e.target as HTMLElement | null;
      if (target?.closest?.("input, textarea, select, [contenteditable='true']")) return;
      if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
      typed = (typed + e.key.toLowerCase()).slice(-8);
      for (const word of Object.keys(WORDS)) {
        if (typed.endsWith(word)) {
          typed = "";
          const critter = WORDS[word] || companion;
          setVisitors((v) => [...v, { id: Date.now(), critter, say: word === "eh" ? "Eh?" : undefined }]);
          findSecret("secret-word");
          break;
        }
      }
    };
    let start: { x: number; y: number } | null = null;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") start = { x: e.clientX, y: e.clientY };
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "touch" || !start) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      start = null;
      const swipe = stepForGesture(dx, dy);
      if (swipe) {
        if (feed(swipe)) findSecret("konami");
      } else if (Math.hypot(dx, dy) <= TAP_MAX) {
        // Two taps after the swipes stand in for B and A.
        if (feed("tap")) findSecret("konami");
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [companion]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 bottom-0 z-30 overflow-hidden">
      {visitors.map((v) => (
        <div
          key={v.id}
          className="animate-cross flex items-end"
          style={{ animationDuration: "3.2s" }}
          onAnimationEnd={() => setVisitors((all) => all.filter((x) => x.id !== v.id))}
        >
          <div className="animate-bounce">
            {v.say && <SpeechBubble className="mb-1 px-3 py-1 text-xl font-bold">{v.say}</SpeechBubble>}
            <Critter id={v.critter} mood="cheer" size={84} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Tap your buddy 10 times (within a couple of seconds of each tap) and they get dizzy. */
export function BuddyButton({ name, children }: { name: string; children: ReactNode }) {
  const taps = useRef({ n: 0, t: 0 });
  const [dizzy, setDizzy] = useState(false);
  return (
    <button
      type="button"
      aria-label={`Pat ${name}`}
      className={`shrink-0 rounded-full ${dizzy ? "animate-spin" : ""}`}
      style={dizzy ? { animationDuration: "0.5s", animationIterationCount: 3 } : undefined}
      onAnimationEnd={() => setDizzy(false)}
      onClick={() => {
        const now = Date.now();
        taps.current = { n: now - taps.current.t < 2000 ? taps.current.n + 1 : 1, t: now };
        if (taps.current.n >= 10) {
          taps.current.n = 0;
          setDizzy(true);
          sounds.pop(4);
          findSecret("dizzy-ollie");
        }
      }}
    >
      {children}
    </button>
  );
}

/** On about one day in six, if the home screen sits quiet for a while, a very polite moose strolls past. */
export function MooseVisitor() {
  const profile = useActiveProfile();
  const [show, setShow] = useState(false);
  const [sorry, setSorry] = useState(false);
  const today = dayKey(useNow(3_600_000));
  const day = profile ? hashSeed(`${profile.id}:${today}:moose`) % 6 === 0 : false;

  useEffect(() => {
    if (!day) return;
    let timer = setTimeout(() => setShow(true), 12_000);
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setShow(true), 12_000);
    };
    window.addEventListener("pointerdown", reset);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("pointerdown", reset);
    };
  }, [day]);

  if (!show) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 overflow-hidden">
      <div className="animate-cross flex items-end" style={{ animationDuration: "9s" }} onAnimationEnd={() => setShow(false)}>
        <button
          type="button"
          aria-label="A moose strolls by. Say hello"
          className="pointer-events-auto relative min-h-12 min-w-12"
          onClick={() => {
            setSorry(true);
            sounds.pop(2);
            findSecret("polite-moose");
          }}
        >
          {sorry && <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-lg font-bold shadow">Sorry!</span>}
          <span className={sorry ? "inline-block origin-bottom rotate-12" : "inline-block"}>
            <Critter id="maple" mood={sorry ? "wave" : "happy"} size={84} />
          </span>
        </button>
      </div>
    </div>
  );
}
