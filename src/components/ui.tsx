"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Subject } from "@/lib/types";
import { Mascot } from "./Mascot";

export function subjectVars(subject: Pick<Subject, "colour" | "colourDark" | "colourSoft">): CSSProperties {
  return {
    "--c": subject.colour,
    "--c-dark": subject.colourDark,
    "--c-soft": subject.colourSoft,
  } as CSSProperties;
}

export function Stars({ count, max = 3, size = 22, animate = false }: { count: number; max?: number; size?: number; animate?: boolean }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${count} of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={animate && i < count ? "animate-star-pop" : undefined}
          style={animate ? { animationDelay: `${i * 120}ms` } : undefined}
        >
          <path
            d="M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.5L12 17.1l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z"
            fill={i < count ? "var(--color-star)" : "#e5e7eb"}
            stroke={i < count ? "#e0a100" : "#d1d5db"}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  );
}

export function ProgressBar({
  value,
  max,
  className = "",
  height = 20,
  track = "rgba(0, 0, 0, 0.08)",
}: {
  value: number;
  max: number;
  className?: string;
  height?: number;
  track?: string;
}) {
  const pct = max ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div
      className={`relative overflow-hidden rounded-full ${className}`}
      style={{ height, background: track }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <div
        className="relative h-full overflow-hidden rounded-full"
        style={{
          width: `${pct}%`,
          minWidth: pct > 0 ? 20 : 0,
          background: "var(--c, #4f8ef7)",
          // Springy overshoot so each step feels like a reward.
          transition: "width 0.6s cubic-bezier(0.3, 1.5, 0.5, 1)",
        }}
      >
        <div className="absolute inset-x-2 top-1 h-1.5 rounded-full bg-white/40" />
        <div className="absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-white/45 to-transparent" />
      </div>
    </div>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="btn h-14 w-14 shrink-0 text-2xl" aria-label={label}>
      ←
    </Link>
  );
}

/** Soft floating shapes behind every page. */
export function BackgroundDecor() {
  const shapes = [
    { left: "4%", top: "18%", size: 46, colour: "#4f8ef7", kind: "circle", delay: 0 },
    { left: "88%", top: "26%", size: 38, colour: "#e9559a", kind: "star", delay: -4 },
    { left: "12%", top: "72%", size: 34, colour: "#25b47e", kind: "triangle", delay: -8 },
    { left: "82%", top: "78%", size: 50, colour: "#ff9636", kind: "circle", delay: -12 },
    { left: "48%", top: "6%", size: 28, colour: "#f5b301", kind: "star", delay: -6 },
    { left: "60%", top: "90%", size: 30, colour: "#8b5cf6", kind: "triangle", delay: -2 },
  ];
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {shapes.map((s, i) => (
        <svg
          key={i}
          className="absolute animate-drift opacity-[0.16]"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: `${s.delay}s` }}
          viewBox="0 0 24 24"
        >
          {s.kind === "circle" && <circle cx="12" cy="12" r="11" fill={s.colour} />}
          {s.kind === "triangle" && <path d="M12 2 L23 21 H1 Z" fill={s.colour} />}
          {s.kind === "star" && (
            <path d="M12 1.5l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 17.5l-6.4 3.6 1.4-7.1-5.3-5 7.2-.9z" fill={s.colour} />
          )}
        </svg>
      ))}
    </div>
  );
}

export function LoadingScreen() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4">
      <Mascot mood="happy" size={140} />
      <p className="text-xl font-semibold text-ink-soft">Getting ready…</p>
    </main>
  );
}

export function Page({ children, style, className = "" }: { children: ReactNode; style?: CSSProperties; className?: string }) {
  return (
    <main
      className={`mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 sm:px-6 ${className}`}
      style={{
        paddingTop: "max(1rem, env(safe-area-inset-top))",
        paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
        ...style,
      }}
    >
      <BackgroundDecor />
      {children}
    </main>
  );
}

export function Dialog({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div className="card w-full max-w-md animate-pop-in p-6 text-center" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-2xl font-bold">{title}</h2>
        {children}
      </div>
    </div>
  );
}
