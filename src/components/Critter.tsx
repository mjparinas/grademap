"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

// The mascot cast, all drawn from one parametric SVG so they share a style,
// moods and pointer-following eyes. Ollie the Otter is the main guide; each
// subject has its own guide; the rest can be unlocked in the shop.

export type Mood = "happy" | "cheer" | "think" | "oops" | "wave" | "sleepy";

type Ears = "round" | "small" | "pointy" | "long" | "tufts" | "none";
type Nose = "button" | "beak" | "bill" | "snout";
type Extra = "shell" | "glasses" | "goggles" | "hat" | "mask" | "antlers" | "turtle" | "panda" | "horn" | "scarf" | "teeth" | "puffin";

export interface CritterDef {
  id: string;
  name: string;
  species: string;
  role?: string;
  fur: string;
  furDark: string;
  face: string;
  belly: string;
  ears: Ears;
  earInner?: string;
  nose: Nose;
  noseColour: string;
  extras: Extra[];
}

export const CRITTERS: CritterDef[] = [
  { id: "ollie", name: "Ollie", species: "otter", role: "Your guide", fur: "#9a6440", furDark: "#74462a", face: "#f6e2c8", belly: "#f6e2c8", ears: "small", nose: "button", noseColour: "#3d2a20", extras: ["shell"] },
  { id: "hoot", name: "Hoot", species: "owl", role: "Math guide", fur: "#7b6fd6", furDark: "#5a4fb3", face: "#efeaff", belly: "#d9d2ff", ears: "tufts", nose: "beak", noseColour: "#ffa83d", extras: ["glasses"] },
  { id: "ruby", name: "Ruby", species: "fox", role: "Reading guide", fur: "#f07a2b", furDark: "#c95a12", face: "#fff4e8", belly: "#fff4e8", ears: "pointy", earInner: "#3d2a20", nose: "button", noseColour: "#2b1d16", extras: ["scarf"] },
  { id: "bolt", name: "Bolt", species: "beaver", role: "Science guide", fur: "#a86b3c", furDark: "#7f4c25", face: "#e9c8a3", belly: "#e9c8a3", ears: "small", nose: "button", noseColour: "#3d2a20", extras: ["goggles", "teeth"] },
  { id: "juniper", name: "Juniper", species: "bear", role: "Our World guide", fur: "#c9874a", furDark: "#a1652d", face: "#f3d9b8", belly: "#f3d9b8", ears: "round", nose: "button", noseColour: "#3d2a20", extras: ["hat"] },
  { id: "clover", name: "Clover", species: "bunny", fur: "#ece6f2", furDark: "#cfc4dc", face: "#ffffff", belly: "#ffffff", ears: "long", earInner: "#ffb8cf", nose: "button", noseColour: "#ff8fb1", extras: ["teeth"] },
  { id: "poppy", name: "Poppy", species: "puffin", fur: "#2f3445", furDark: "#1d2130", face: "#f7f8fb", belly: "#f7f8fb", ears: "none", nose: "bill", noseColour: "#ff7b39", extras: ["puffin"] },
  { id: "rocco", name: "Rocco", species: "raccoon", fur: "#9aa3ad", furDark: "#6c7580", face: "#eef1f4", belly: "#d9dee3", ears: "pointy", earInner: "#3b3f46", nose: "button", noseColour: "#2b2f36", extras: ["mask"] },
  { id: "maple", name: "Maple", species: "moose", fur: "#8a5a3b", furDark: "#5f3b24", face: "#c89a72", belly: "#c89a72", ears: "small", nose: "snout", noseColour: "#5f3b24", extras: ["antlers"] },
  { id: "shelly", name: "Shelly", species: "turtle", fur: "#5cc28a", furDark: "#3a9a68", face: "#a8e6c1", belly: "#f3e3a2", ears: "none", nose: "button", noseColour: "#2f6b4a", extras: ["turtle"] },
  { id: "bao", name: "Bao", species: "panda", fur: "#ffffff", furDark: "#2b2f36", face: "#ffffff", belly: "#ffffff", ears: "round", nose: "button", noseColour: "#2b2f36", extras: ["panda"] },
  { id: "marlo", name: "Marlo", species: "marmot", fur: "#b9a58a", furDark: "#8d7a5f", face: "#f1e6d2", belly: "#f1e6d2", ears: "small", nose: "button", noseColour: "#3d2a20", extras: ["teeth"] },
  { id: "willow", name: "Willow", species: "wolf", fur: "#8d97a8", furDark: "#5f6877", face: "#e6ebf2", belly: "#e6ebf2", ears: "pointy", earInner: "#414857", nose: "button", noseColour: "#2b2f36", extras: ["scarf"] },
  { id: "frost", name: "Frost", species: "arctic fox", fur: "#f4f8fc", furDark: "#c5d3e3", face: "#ffffff", belly: "#ffffff", ears: "pointy", earInner: "#9db4cf", nose: "button", noseColour: "#2b2f36", extras: [] },
  { id: "nori", name: "Nori", species: "narwhal", fur: "#7fa6d6", furDark: "#5a84b8", face: "#dbe9fa", belly: "#dbe9fa", ears: "none", nose: "button", noseColour: "#3a5a85", extras: ["horn"] },
];

export function getCritter(id: string | undefined): CritterDef {
  return CRITTERS.find((c) => c.id === id) ?? CRITTERS[0];
}

const INK = "#3d2a20";
const part: CSSProperties = { transformBox: "fill-box", transformOrigin: "center" };

function EarsLayer({ c }: { c: CritterDef }) {
  const inner = c.earInner ?? c.furDark;
  switch (c.ears) {
    case "round":
      return (
        <g>
          <circle cx="55" cy="50" r="17" fill={c.ears === "round" && c.extras.includes("panda") ? "#2b2f36" : c.fur} />
          <circle cx="145" cy="50" r="17" fill={c.extras.includes("panda") ? "#2b2f36" : c.fur} />
          {!c.extras.includes("panda") && (
            <>
              <circle cx="55" cy="50" r="8" fill={inner} />
              <circle cx="145" cy="50" r="8" fill={inner} />
            </>
          )}
        </g>
      );
    case "small":
      return (
        <g>
          <circle cx="58" cy="52" r="13" fill={c.fur} />
          <circle cx="142" cy="52" r="13" fill={c.fur} />
          <circle cx="58" cy="52" r="6.5" fill={c.furDark} />
          <circle cx="142" cy="52" r="6.5" fill={c.furDark} />
        </g>
      );
    case "pointy":
      return (
        <g>
          <path d="M44 66 L52 18 L86 46 Z" fill={c.fur} />
          <path d="M156 66 L148 18 L114 46 Z" fill={c.fur} />
          <path d="M53 52 L56 30 L73 45 Z" fill={inner} />
          <path d="M147 52 L144 30 L127 45 Z" fill={inner} />
        </g>
      );
    case "long":
      return (
        <g>
          <ellipse cx="74" cy="22" rx="13" ry="38" fill={c.fur} transform="rotate(-12 74 22)" />
          <ellipse cx="126" cy="22" rx="13" ry="38" fill={c.fur} transform="rotate(12 126 22)" />
          <ellipse cx="74" cy="24" rx="6" ry="28" fill={inner} transform="rotate(-12 74 24)" />
          <ellipse cx="126" cy="24" rx="6" ry="28" fill={inner} transform="rotate(12 126 24)" />
        </g>
      );
    case "tufts":
      return (
        <g fill={c.furDark}>
          <path d="M50 58 L46 22 L80 44 Z" />
          <path d="M150 58 L154 22 L120 44 Z" />
        </g>
      );
    default:
      return null;
  }
}

function Eyes({ mood, c }: { mood: Mood; c: CritterDef }) {
  const owl = c.species === "owl";
  if (mood === "cheer") {
    return (
      <g stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M71 89 Q80 78 89 89" />
        <path d="M111 89 Q120 78 129 89" />
      </g>
    );
  }
  if (mood === "sleepy") {
    return (
      <g stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M71 87 Q80 95 89 87" />
        <path d="M111 87 Q120 95 129 87" />
      </g>
    );
  }
  const lookUp = mood === "think" ? -4 : 0;
  const r = owl ? 9 : 7.5;
  return (
    <g style={{ transform: "translate(calc(var(--look-x, 0) * 4px), calc(var(--look-y, 0) * 3px))", transition: "transform 0.15s ease-out" }}>
      <g className="animate-blink" style={part}>
        <ellipse cx="80" cy={87 + lookUp} rx={r} ry={r + 2} fill={INK} />
        <ellipse cx="120" cy={87 + lookUp} rx={r} ry={r + 2} fill={INK} />
        <circle cx="82.5" cy={83 + lookUp} r="3" fill="#fff" />
        <circle cx="122.5" cy={83 + lookUp} r="3" fill="#fff" />
      </g>
    </g>
  );
}

function Mouth({ mood, c }: { mood: Mood; c: CritterDef }) {
  const y = c.nose === "snout" ? 6 : 0;
  if (c.nose === "beak" || c.nose === "bill") {
    if (mood === "cheer") return <path d="M92 112 Q100 124 108 112 Z" fill="#7a2e35" />;
    return null;
  }
  if (mood === "cheer") {
    return (
      <g transform={`translate(0 ${y})`}>
        <path d="M86 111 Q100 134 114 111 Z" fill="#7a2e35" />
        <ellipse cx="100" cy="122" rx="7" ry="4.5" fill="#ff8a9a" />
      </g>
    );
  }
  if (mood === "oops") return <ellipse cx="100" cy={116 + y} rx="5" ry="6" fill="#7a2e35" />;
  if (mood === "think") return <path d={`M92 ${115 + y} Q100 ${113 + y} 108 ${117 + y}`} stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none" />;
  return (
    <g stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none" transform={`translate(0 ${y})`}>
      <path d="M100 108 V112" />
      <path d="M100 112 Q93 120 86 113" />
      <path d="M100 112 Q107 120 114 113" />
    </g>
  );
}

function NoseLayer({ c }: { c: CritterDef }) {
  switch (c.nose) {
    case "beak":
      return <path d="M91 98 L109 98 L100 114 Z" fill={c.noseColour} stroke="#e08a1f" strokeWidth="2" strokeLinejoin="round" />;
    case "bill":
      return (
        <g>
          <path d="M84 98 Q100 92 116 98 L108 120 Q100 124 92 120 Z" fill={c.noseColour} />
          <path d="M90 104 Q100 100 110 104" stroke="#ffd23d" strokeWidth="4" fill="none" />
          <path d="M84 98 Q100 92 116 98" stroke="#ffd23d" strokeWidth="3" fill="none" />
        </g>
      );
    case "snout":
      return (
        <g>
          <ellipse cx="100" cy="106" rx="24" ry="16" fill={c.furDark} opacity="0.35" />
          <ellipse cx="91" cy="104" rx="4" ry="5" fill={INK} />
          <ellipse cx="109" cy="104" rx="4" ry="5" fill={INK} />
        </g>
      );
    default:
      return (
        <g>
          <ellipse cx="100" cy="101" rx="11" ry="8" fill={c.noseColour} />
          <ellipse cx="96" cy="98.5" rx="3.5" ry="2" fill="#fff" opacity="0.5" />
        </g>
      );
  }
}

function Arms({ mood, c }: { mood: Mood; c: CritterDef }) {
  const colour = c.extras.includes("panda") ? "#2b2f36" : c.furDark;
  if (mood === "cheer") {
    return (
      <g fill={colour}>
        <ellipse cx="44" cy="112" rx="12" ry="20" transform="rotate(-35 44 112)" />
        <ellipse cx="156" cy="112" rx="12" ry="20" transform="rotate(35 156 112)" />
      </g>
    );
  }
  if (mood === "wave") {
    return (
      <g fill={colour}>
        <ellipse cx="80" cy="146" rx="13" ry="10" />
        <g className="animate-wave" style={{ transformBox: "view-box", transformOrigin: "140px 140px" }}>
          <ellipse cx="158" cy="108" rx="12" ry="20" transform="rotate(30 158 108)" />
        </g>
      </g>
    );
  }
  if (mood === "think") {
    return (
      <g fill={colour}>
        <ellipse cx="80" cy="146" rx="13" ry="10" />
        <ellipse cx="124" cy="128" rx="11" ry="13" />
      </g>
    );
  }
  return (
    <g>
      {c.extras.includes("shell") && (
        <>
          <path d="M88 152 Q100 132 112 152 Q100 158 88 152 Z" fill="#ffb4c6" stroke="#f08aa5" strokeWidth="2" />
          <path d="M100 138 V154 M94 142 L96 153 M106 142 L104 153" stroke="#f08aa5" strokeWidth="1.6" />
        </>
      )}
      <g fill={colour}>
        <ellipse cx="82" cy="148" rx="12" ry="9.5" />
        <ellipse cx="118" cy="148" rx="12" ry="9.5" />
      </g>
    </g>
  );
}

function BackLayer({ c }: { c: CritterDef }) {
  return (
    <g>
      {c.extras.includes("turtle") && (
        <g>
          <ellipse cx="100" cy="160" rx="70" ry="44" fill="#8a6b3a" />
          <ellipse cx="100" cy="158" rx="62" ry="38" fill="#b48a4a" />
          <path d="M70 140 L100 128 L130 140 L130 172 L100 184 L70 172 Z" fill="#9c7740" opacity="0.6" />
        </g>
      )}
      {c.extras.includes("antlers") && (
        <g fill="#d9b277" stroke="#b88d4f" strokeWidth="2" strokeLinejoin="round">
          <path d="M60 50 C40 40 30 20 38 10 C42 22 50 26 54 24 C52 14 56 6 62 4 C62 16 66 26 70 30 C72 22 78 16 84 16 C80 28 76 40 68 52 Z" />
          <path d="M140 50 C160 40 170 20 162 10 C158 22 150 26 146 24 C148 14 144 6 138 4 C138 16 134 26 130 30 C128 22 122 16 116 16 C120 28 124 40 132 52 Z" />
        </g>
      )}
    </g>
  );
}

function FaceExtras({ c }: { c: CritterDef }) {
  // The puffin's white face sits under everything else.
  if (!c.extras.includes("puffin")) return null;
  return <path d="M52 92 Q60 60 100 56 Q140 60 148 92 Q140 120 100 124 Q60 120 52 92 Z" fill="#f7f8fb" />;
}

function TopExtras({ c }: { c: CritterDef }) {
  return (
    <g>
      {c.extras.includes("teeth") && (
        <g>
          <rect x="92" y="111" width="8" height="10" rx="2" fill="#fff" stroke="#d9d2c4" strokeWidth="1.2" />
          <rect x="100" y="111" width="8" height="10" rx="2" fill="#fff" stroke="#d9d2c4" strokeWidth="1.2" />
        </g>
      )}
      {c.extras.includes("glasses") && (
        <g fill="none" stroke="#2b2f45" strokeWidth="3.5">
          <circle cx="80" cy="87" r="15" />
          <circle cx="120" cy="87" r="15" />
          <path d="M95 86 Q100 82 105 86" />
        </g>
      )}
      {c.extras.includes("goggles") && (
        <g>
          <rect x="52" y="52" width="96" height="10" rx="5" fill="#4b5563" />
          <circle cx="78" cy="56" r="14" fill="#9fe3ff" stroke="#4b5563" strokeWidth="4" />
          <circle cx="122" cy="56" r="14" fill="#9fe3ff" stroke="#4b5563" strokeWidth="4" />
          <ellipse cx="74" cy="52" rx="4" ry="3" fill="#fff" opacity="0.8" />
          <ellipse cx="118" cy="52" rx="4" ry="3" fill="#fff" opacity="0.8" />
        </g>
      )}
      {c.extras.includes("hat") && (
        <g>
          <ellipse cx="100" cy="44" rx="58" ry="12" fill="#5f8a3a" />
          <path d="M66 44 Q66 14 100 12 Q134 14 134 44 Z" fill="#76a64a" />
          <rect x="66" y="34" width="68" height="8" fill="#e6b422" />
        </g>
      )}
      {c.extras.includes("horn") && (
        <g>
          <path d="M96 40 L100 0 L104 40 Z" fill="#f3ead2" stroke="#d6c9a5" strokeWidth="2" strokeLinejoin="round" />
          <path d="M97 30 L103 26 M98 20 L102 17 M99 11 L101 9" stroke="#d6c9a5" strokeWidth="1.5" />
        </g>
      )}
      {c.extras.includes("scarf") && (
        <g>
          <path d="M56 128 Q100 146 144 128 L144 140 Q100 158 56 140 Z" fill="#4f8ef7" />
          <rect x="118" y="134" width="14" height="28" rx="4" fill="#3b78e0" />
        </g>
      )}
    </g>
  );
}

export function CritterSvg({ id, mood = "happy" }: { id: string; mood?: Mood }) {
  const c = getCritter(id);
  const headFill = c.extras.includes("panda") ? "#ffffff" : c.fur;
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" aria-hidden="true" overflow="visible">
      <BackLayer c={c} />
      <ellipse cx="100" cy="162" rx="58" ry="40" fill={c.extras.includes("turtle") ? c.fur : c.extras.includes("panda") ? "#2b2f36" : c.fur} />
      <ellipse cx="100" cy="168" rx="38" ry="27" fill={c.belly} />
      <Arms mood={mood} c={c} />
      <g className={mood === "oops" ? "animate-wiggle" : undefined} style={{ ...part, transformOrigin: "50% 80%" }}>
        <EarsLayer c={c} />
        <circle cx="100" cy="90" r="56" fill={headFill} />
        <FaceExtras c={c} />
        {c.nose !== "bill" && <ellipse cx="100" cy="101" rx="45" ry="36" fill={c.face} opacity={c.extras.includes("panda") ? 0 : 1} />}
        {c.extras.includes("mask") && (
          <path d="M58 80 Q80 66 100 82 Q120 66 142 80 Q140 98 120 98 Q108 98 100 90 Q92 98 80 98 Q60 98 58 80 Z" fill="#3b3f46" />
        )}
        {c.extras.includes("panda") && (
          <g fill="#2b2f36">
            <ellipse cx="78" cy="88" rx="15" ry="18" transform="rotate(-20 78 88)" />
            <ellipse cx="122" cy="88" rx="15" ry="18" transform="rotate(20 122 88)" />
          </g>
        )}
        <ellipse cx="80" cy="64" rx="10" ry="5" fill="#ffffff" opacity="0.18" />
        <Eyes mood={mood} c={c} />
        <circle cx="66" cy="106" r="8" fill="#ff9fb0" opacity="0.55" />
        <circle cx="134" cy="106" r="8" fill="#ff9fb0" opacity="0.55" />
        {c.nose === "button" && c.species !== "turtle" && c.species !== "narwhal" && (
          <g stroke="#c9a98a" strokeWidth="2" strokeLinecap="round" opacity={c.species === "bear" || c.species === "panda" ? 0 : 1}>
            <path d="M80 104 L56 99" />
            <path d="M80 109 L55 110" />
            <path d="M120 104 L144 99" />
            <path d="M120 109 L145 110" />
          </g>
        )}
        <NoseLayer c={c} />
        <Mouth mood={mood} c={c} />
        <TopExtras c={c} />
        {mood === "sleepy" && (
          <g fill={INK} fontFamily="var(--font-fredoka, sans-serif)" fontWeight="700" opacity="0.55">
            <text x="150" y="52" fontSize="26">z</text>
            <text x="166" y="32" fontSize="18">z</text>
          </g>
        )}
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

const MOOD_MOTION: Record<Mood, string> = {
  happy: "animate-float",
  wave: "animate-float",
  think: "animate-float",
  cheer: "animate-cheer",
  oops: "",
  sleepy: "animate-float",
};

/** A mascot that floats, reacts to answers and watches your finger. */
export function Critter({ id = "ollie", mood = "happy", size = 120, className = "" }: { id?: string; mood?: Mood; size?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

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
    <div ref={ref} key={mood} className={`shrink-0 ${MOOD_MOTION[mood]} ${className}`} style={{ width: size, height: size }}>
      <CritterSvg id={id} mood={mood} />
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
