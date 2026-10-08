"use client";

import confetti from "canvas-confetti";

const COLOURS = ["#4f8ef7", "#e9559a", "#25b47e", "#ff9636", "#f5b301", "#8b5cf6"];

// The store says whether the active child asked for calm motion. Injected, like the sound check,
// so this module never imports the store.
let calmOn: () => boolean = () => false;
export function setCalmCheck(check: () => boolean) {
  calmOn = check;
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && (calmOn() || window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}

function centreOf(el: Element): { x: number; y: number } {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

/** Stars burst out of an element (a correct answer, a coin, a filled basket). */
export function burstFrom(el: Element | null, count = 26) {
  if (!el || prefersReducedMotion()) return;
  const { x, y } = centreOf(el);
  confetti({
    colors: COLOURS,
    disableForReducedMotion: true,
    zIndex: 60,
    particleCount: count,
    spread: 360,
    startVelocity: 22,
    gravity: 0.7,
    decay: 0.9,
    ticks: 70,
    scalar: 0.9,
    shapes: ["star", "circle"],
    origin: { x: x / window.innerWidth, y: y / window.innerHeight },
  });
}

/** "+1"-style text that pops up from an element and floats away. */
export function floatText(el: Element | null, text: string, colour?: string) {
  if (!el || prefersReducedMotion()) return;
  const { x, y } = centreOf(el);
  const span = document.createElement("span");
  span.className = "float-text";
  span.textContent = text;
  span.style.left = `${x}px`;
  span.style.top = `${y - 20}px`;
  if (colour) span.style.color = colour;
  document.body.appendChild(span);
  span.addEventListener("animationend", () => span.remove());
}

/** Replay a one-shot CSS animation class on an element. */
export function replay(el: Element | null, className: string) {
  if (!el) return;
  el.classList.remove(className);
  // Force a reflow so the browser restarts the animation.
  void (el as HTMLElement).offsetWidth;
  el.classList.add(className);
  el.addEventListener("animationend", () => el.classList.remove(className), { once: true });
}

/** A big two-sided celebration for finishing a unit. Pass emoji for a themed style. */
export function celebrate(emoji: string[] = []) {
  if (prefersReducedMotion()) return;
  const shapes = emoji.length ? emoji.map((text) => confetti.shapeFromText({ text, scalar: 2 })) : undefined;
  const base = { colors: COLOURS, disableForReducedMotion: true, zIndex: 60, ticks: 240, ...(shapes ? { shapes, scalar: 2 } : {}) };
  confetti({ ...base, particleCount: shapes ? 40 : 90, spread: 70, angle: 60, origin: { x: 0, y: 0.75 }, startVelocity: 58 });
  confetti({ ...base, particleCount: shapes ? 40 : 90, spread: 70, angle: 120, origin: { x: 1, y: 0.75 }, startVelocity: 58 });
  setTimeout(() => {
    confetti({
      ...base,
      particleCount: shapes ? 50 : 140,
      spread: 130,
      origin: { x: 0.5, y: 0.3 },
      ...(shapes ? {} : { scalar: 1.15, shapes: ["star", "square", "circle"] as confetti.Shape[] }),
    });
  }, 380);
}
