"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

export type MascotMood = "happy" | "cheer" | "think" | "oops" | "wave";

const FUR = "#9a6440";
const FUR_DARK = "#74462a";
const FACE = "#f6e2c8";
const NOSE = "#3d2a20";
const CHEEK = "#ff9fb0";

const svgPart: CSSProperties = { transformBox: "fill-box", transformOrigin: "center" };

function Eyes({ mood }: { mood: MascotMood }) {
  if (mood === "cheer") {
    return (
      <g stroke={NOSE} strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M71 89 Q80 78 89 89" />
        <path d="M111 89 Q120 78 129 89" />
      </g>
    );
  }
  const lookUp = mood === "think" ? -4 : 0;
  return (
    // Pupils follow the pointer via --look-x / --look-y set on the wrapper.
    <g style={{ transform: "translate(calc(var(--look-x, 0) * 4px), calc(var(--look-y, 0) * 3px))", transition: "transform 0.15s ease-out" }}>
    <g className="animate-blink" style={svgPart}>
      <ellipse cx="80" cy={87 + lookUp} rx="7.5" ry="9.5" fill={NOSE} />
      <ellipse cx="120" cy={87 + lookUp} rx="7.5" ry="9.5" fill={NOSE} />
      <circle cx="82.5" cy={83 + lookUp} r="3" fill="#fff" />
      <circle cx="122.5" cy={83 + lookUp} r="3" fill="#fff" />
    </g>
    </g>
  );
}

function Mouth({ mood }: { mood: MascotMood }) {
  if (mood === "cheer") {
    return (
      <g>
        <path d="M86 111 Q100 134 114 111 Z" fill="#7a2e35" />
        <ellipse cx="100" cy="122" rx="7" ry="4.5" fill="#ff8a9a" />
      </g>
    );
  }
  if (mood === "oops") return <ellipse cx="100" cy="116" rx="5" ry="6" fill="#7a2e35" />;
  if (mood === "think") {
    return <path d="M92 115 Q100 113 108 117" stroke={NOSE} strokeWidth="3.5" strokeLinecap="round" fill="none" />;
  }
  return (
    <g stroke={NOSE} strokeWidth="3.5" strokeLinecap="round" fill="none">
      <path d="M100 108 V112" />
      <path d="M100 112 Q93 120 86 113" />
      <path d="M100 112 Q107 120 114 113" />
    </g>
  );
}

function Arms({ mood }: { mood: MascotMood }) {
  if (mood === "cheer") {
    return (
      <g fill={FUR_DARK}>
        <ellipse cx="44" cy="112" rx="12" ry="20" transform="rotate(-35 44 112)" />
        <ellipse cx="156" cy="112" rx="12" ry="20" transform="rotate(35 156 112)" />
      </g>
    );
  }
  if (mood === "wave") {
    return (
      <g fill={FUR_DARK}>
        <ellipse cx="80" cy="146" rx="13" ry="10" />
        <g className="animate-wave" style={{ transformBox: "view-box", transformOrigin: "140px 140px" }}>
          <ellipse cx="158" cy="108" rx="12" ry="20" transform="rotate(30 158 108)" />
        </g>
      </g>
    );
  }
  if (mood === "think") {
    return (
      <g fill={FUR_DARK}>
        <ellipse cx="80" cy="146" rx="13" ry="10" />
        <ellipse cx="124" cy="128" rx="11" ry="13" />
      </g>
    );
  }
  // Holding a little shell on its tummy, like real sea otters do.
  return (
    <g>
      <path d="M88 152 Q100 132 112 152 Q100 158 88 152 Z" fill="#ffb4c6" stroke="#f08aa5" strokeWidth="2" />
      <path d="M100 138 V154 M94 142 L96 153 M106 142 L104 153" stroke="#f08aa5" strokeWidth="1.6" />
      <g fill={FUR_DARK}>
        <ellipse cx="82" cy="148" rx="12" ry="9.5" />
        <ellipse cx="118" cy="148" rx="12" ry="9.5" />
      </g>
    </g>
  );
}

function OtterSvg({ mood }: { mood: MascotMood }) {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" aria-hidden="true">
      {/* body */}
      <ellipse cx="100" cy="162" rx="58" ry="40" fill={FUR} />
      <ellipse cx="100" cy="168" rx="38" ry="27" fill={FACE} />
      <Arms mood={mood} />
      <g className={mood === "oops" ? "animate-wiggle" : undefined} style={{ ...svgPart, transformOrigin: "50% 80%" }}>
        {/* ears */}
        <circle cx="57" cy="52" r="14" fill={FUR} />
        <circle cx="57" cy="52" r="7" fill={FUR_DARK} />
        <circle cx="143" cy="52" r="14" fill={FUR} />
        <circle cx="143" cy="52" r="7" fill={FUR_DARK} />
        {/* head */}
        <circle cx="100" cy="90" r="56" fill={FUR} />
        <ellipse cx="100" cy="101" rx="45" ry="36" fill={FACE} />
        <ellipse cx="80" cy="64" rx="10" ry="5" fill="#ffffff" opacity="0.18" />
        <Eyes mood={mood} />
        <circle cx="66" cy="106" r="8" fill={CHEEK} opacity="0.55" />
        <circle cx="134" cy="106" r="8" fill={CHEEK} opacity="0.55" />
        {/* whiskers */}
        <g stroke="#c9a98a" strokeWidth="2" strokeLinecap="round">
          <path d="M80 104 L56 99" />
          <path d="M80 109 L55 110" />
          <path d="M120 104 L144 99" />
          <path d="M120 109 L145 110" />
        </g>
        <ellipse cx="100" cy="101" rx="11" ry="8" fill={NOSE} />
        <ellipse cx="96" cy="98.5" rx="3.5" ry="2" fill="#fff" opacity="0.5" />
        <Mouth mood={mood} />
        {mood === "think" && (
          <g fill="#4f8ef7">
            <circle cx="160" cy="40" r="5" />
            <circle cx="172" cy="26" r="7" />
          </g>
        )}
      </g>
    </svg>
  );
}

const MOOD_MOTION: Record<MascotMood, string> = {
  happy: "animate-float",
  wave: "animate-float",
  think: "animate-float",
  cheer: "animate-cheer",
  oops: "",
};

export function Mascot({
  mood = "happy",
  size = 120,
  className = "",
}: {
  mood?: MascotMood;
  size?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Ollie watches your finger or mouse.
  useEffect(() => {
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height * 0.42);
        const dist = Math.max(1, Math.hypot(dx, dy));
        const pull = Math.min(1, dist / 160);
        el.style.setProperty("--look-x", ((dx / dist) * pull).toFixed(2));
        el.style.setProperty("--look-y", ((dy / dist) * pull).toFixed(2));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      // Re-mounting on mood change replays the one-shot cheer/oops animations.
      key={mood}
      className={`shrink-0 ${MOOD_MOTION[mood]} ${className}`}
      style={{ width: size, height: size }}
    >
      <OtterSvg mood={mood} />
    </div>
  );
}

export function SpeechBubble({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative card px-5 py-4 ${className}`}>
      <span
        aria-hidden="true"
        className="absolute -left-[13px] top-8 h-5 w-5 rotate-45 bg-white"
        style={{ borderLeft: "3px solid var(--color-line)", borderBottom: "3px solid var(--color-line)" }}
      />
      {children}
    </div>
  );
}
