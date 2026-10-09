import { Fragment, type ReactNode } from "react";
import { COIN_NAMES } from "@/content/money";
import type { ShapeName, Visual } from "@/content/types";

const INK = "#253047";

/** Render text, drawing each ☐ as a dashed box. */
export function WithBlanks({ text }: { text: string }) {
  const parts = text.split("☐");
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 && <span className="blank-box mx-1" role="img" aria-label="blank" />}
        </Fragment>
      ))}
    </>
  );
}

// ---------- Money ----------

const COIN_STYLE: Record<number, { size: number; fill: string; ring: string; text: string; label: string }> = {
  5: { size: 62, fill: "#d9dde3", ring: "#a9b0ba", text: "#4b5563", label: "5¢" },
  10: { size: 54, fill: "#e3e6ea", ring: "#aeb5be", text: "#4b5563", label: "10¢" },
  25: { size: 70, fill: "#d6dbe1", ring: "#9ea6b0", text: "#374151", label: "25¢" },
  100: { size: 78, fill: "#f2c74e", ring: "#c9971a", text: "#7a5600", label: "$1" },
  200: { size: 82, fill: "#d6dbe1", ring: "#9ea6b0", text: "#7a5600", label: "$2" },
};

const BILL_STYLE: Record<number, { fill: string; dark: string; label: string }> = {
  500: { fill: "#5b9bea", dark: "#2f6fd6", label: "$5" },
  1000: { fill: "#a98af0", dark: "#7b55d9", label: "$10" },
  2000: { fill: "#57c18a", dark: "#2c9461", label: "$20" },
  5000: { fill: "#ef7272", dark: "#cc3d3d", label: "$50" },
};

export function Coin({ cents, scale = 1 }: { cents: number; scale?: number }) {
  const bill = BILL_STYLE[cents];
  if (bill) {
    return (
      <svg width={110 * scale} height={56 * scale} viewBox="0 0 110 56" role="img" aria-label={COIN_NAMES[cents]}>
        <rect x="2" y="2" width="106" height="52" rx="6" fill={bill.fill} stroke={bill.dark} strokeWidth="3" />
        <rect x="9" y="9" width="92" height="38" rx="4" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1.5" />
        <circle cx="80" cy="28" r="13" fill="#ffffff" opacity="0.3" />
        <text x="34" y="29" textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-fredoka)" fontWeight="700" fontSize="24" fill="#fff">
          {bill.label}
        </text>
      </svg>
    );
  }
  const c = COIN_STYLE[cents] ?? COIN_STYLE[5];
  const size = c.size * scale;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={`${COIN_NAMES[cents]}, ${c.label}`}>
      {cents === 100 ? (
        <polygon
          points={Array.from({ length: 11 }, (_, i) => {
            const a = (i / 11) * Math.PI * 2 - Math.PI / 2;
            return `${50 + 47 * Math.cos(a)},${50 + 47 * Math.sin(a)}`;
          }).join(" ")}
          fill={c.fill}
          stroke={c.ring}
          strokeWidth="4"
        />
      ) : (
        <circle cx="50" cy="50" r="46" fill={c.fill} stroke={c.ring} strokeWidth="5" />
      )}
      {cents === 200 && <circle cx="50" cy="50" r="30" fill="#f2c74e" stroke="#c9971a" strokeWidth="3" />}
      <circle cx="50" cy="50" r="38" fill="none" stroke={c.ring} strokeWidth="1.5" strokeDasharray="2 3" opacity="0.7" />
      <ellipse cx="36" cy="30" rx="14" ry="7" fill="#fff" opacity="0.45" transform="rotate(-25 36 30)" />
      <text x="50" y="51" textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-fredoka)" fontWeight="700" fontSize={c.label.length > 2 ? 30 : 34} fill={c.text}>
        {c.label}
      </text>
    </svg>
  );
}

// ---------- Shapes ----------

const SHAPE_FILL: Record<ShapeName, string> = {
  triangle: "#ff9636",
  square: "#4f8ef7",
  rectangle: "#25b47e",
  pentagon: "#e9559a",
  hexagon: "#8b5cf6",
  octagon: "#ef4444",
  circle: "#f5b301",
  oval: "#06b6d4",
  rhombus: "#f472b6",
  trapezoid: "#84cc16",
  parallelogram: "#fb923c",
  cube: "#4f8ef7",
  sphere: "#e9559a",
  cylinder: "#25b47e",
  cone: "#ff9636",
  "rectangular-prism": "#8b5cf6",
  pyramid: "#f5b301",
};

function polygon(n: number, r = 40, cx = 50, cy = 52, rot = -Math.PI / 2) {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + rot;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");
}

export function Shape({ shape, size = 120 }: { shape: ShapeName; size?: number }) {
  const fill = SHAPE_FILL[shape];
  const common = { fill, stroke: INK, strokeWidth: 3, strokeLinejoin: "round" as const };
  let body: ReactNode;
  switch (shape) {
    case "triangle":
      body = <polygon points="50,10 92,86 8,86" {...common} />;
      break;
    case "square":
      body = <rect x="15" y="15" width="70" height="70" rx="3" {...common} />;
      break;
    case "rectangle":
      body = <rect x="5" y="25" width="90" height="50" rx="3" {...common} />;
      break;
    case "pentagon":
      body = <polygon points={polygon(5, 42)} {...common} />;
      break;
    case "hexagon":
      body = <polygon points={polygon(6, 42, 50, 50)} {...common} />;
      break;
    case "octagon":
      body = <polygon points={polygon(8, 42, 50, 50, -Math.PI / 8)} {...common} />;
      break;
    case "circle":
      body = <circle cx="50" cy="50" r="40" {...common} />;
      break;
    case "oval":
      body = <ellipse cx="50" cy="50" rx="44" ry="28" {...common} />;
      break;
    case "rhombus":
      body = <polygon points="50,8 88,50 50,92 12,50" {...common} />;
      break;
    case "trapezoid":
      body = <polygon points="28,24 72,24 94,78 6,78" {...common} />;
      break;
    case "parallelogram":
      body = <polygon points="26,24 96,24 74,78 4,78" {...common} />;
      break;
    case "cube":
      body = (
        <g {...common}>
          <polygon points="20,35 60,35 60,85 20,85" />
          <polygon points="20,35 38,17 78,17 60,35" fill="#86b1fa" />
          <polygon points="60,35 78,17 78,67 60,85" fill="#2f6fd6" />
        </g>
      );
      break;
    case "rectangular-prism":
      body = (
        <g {...common}>
          <polygon points="8,40 64,40 64,84 8,84" />
          <polygon points="8,40 28,22 84,22 64,40" fill="#b9a2f7" />
          <polygon points="64,40 84,22 84,66 64,84" fill="#6d3fd6" />
        </g>
      );
      break;
    case "pyramid":
      body = (
        <g {...common}>
          <polygon points="50,10 12,78 62,88" />
          <polygon points="50,10 62,88 90,70" fill="#c99200" />
        </g>
      );
      break;
    case "sphere":
      body = (
        <g>
          <defs>
            <radialGradient id="sphere-g" cx="35%" cy="32%" r="70%">
              <stop offset="0%" stopColor="#ffd1e6" />
              <stop offset="100%" stopColor={fill} />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="40" fill="url(#sphere-g)" stroke={INK} strokeWidth="3" />
          <ellipse cx="50" cy="50" rx="40" ry="11" fill="none" stroke={INK} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
        </g>
      );
      break;
    case "cylinder":
      body = (
        <g {...common}>
          <path d="M20 22 V78 A30 10 0 0 0 80 78 V22" />
          <ellipse cx="50" cy="22" rx="30" ry="10" fill="#7fd8b0" />
        </g>
      );
      break;
    case "cone":
      body = (
        <g {...common}>
          <path d="M50 10 L82 78 A32 10 0 0 1 18 78 Z" />
          <ellipse cx="50" cy="78" rx="32" ry="10" fill="#ffc085" />
        </g>
      );
      break;
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={shape.replace("-", " ")}>
      {body}
    </svg>
  );
}

// ---------- Base-ten blocks ----------

export function TenRod({ size = 14 }: { size?: number }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-md border-2 border-[#2f6fd6]" style={{ width: size + 4 }}>
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} className="bg-[#4f8ef7]" style={{ height: size, borderTop: i ? "1.5px solid #2f6fd6" : undefined }} />
      ))}
    </div>
  );
}

export function OneCube({ size = 14 }: { size?: number }) {
  return <div className="rounded-[4px] border-2 border-[#e07f1f] bg-[#ffb35c]" style={{ width: size + 4, height: size + 4 }} />;
}

export function HundredFlat({ size = 7 }: { size?: number }) {
  return (
    <div
      className="rounded-md border-2 border-[#16925f]"
      style={{
        width: size * 10 + 4,
        height: size * 10 + 4,
        backgroundColor: "#4cc996",
        backgroundImage: "linear-gradient(90deg, rgba(22,146,95,.9) 1px, transparent 1px), linear-gradient(0deg, rgba(22,146,95,.9) 1px, transparent 1px)",
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  );
}

export function Blocks({ hundreds = 0, tens, ones, size = 14 }: { hundreds?: number; tens: number; ones: number; size?: number }) {
  return (
    <div className="flex flex-wrap items-end justify-center gap-5" role="img" aria-label={`${hundreds ? `${hundreds} hundreds, ` : ""}${tens} tens and ${ones} ones`}>
      {hundreds > 0 && (
        <div className="flex flex-wrap items-end gap-1.5">
          {Array.from({ length: hundreds }, (_, i) => (
            <div key={i} className="animate-pop-in" style={{ animationDelay: `${i * 50}ms` }}>
              <HundredFlat size={Math.round(size * 0.55)} />
            </div>
          ))}
        </div>
      )}
      <div className="flex items-end gap-1.5">
        {Array.from({ length: tens }, (_, i) => (
          <div key={i} className="animate-pop-in" style={{ animationDelay: `${i * 40}ms` }}>
            <TenRod size={size} />
          </div>
        ))}
      </div>
      {ones > 0 && (
        <div className="grid grid-cols-3 gap-1.5">
          {Array.from({ length: ones }, (_, i) => (
            <div key={i} className="animate-pop-in" style={{ animationDelay: `${(tens + i) * 40}ms` }}>
              <OneCube size={size} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Counting ----------

/** Objects in tidy rows of five, the easiest way for young kids to count. */
export function Dots({ count, emoji = "🔵" }: { count: number; emoji?: string }) {
  const rows = Math.ceil(count / 5);
  return (
    <div className="flex flex-col items-center gap-1.5" role="img" aria-label={`${count} ${emoji}`}>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="flex gap-1.5 text-4xl leading-none sm:text-5xl">
          {Array.from({ length: Math.min(5, count - r * 5) }, (_, i) => (
            <span key={i} className="animate-pop-in" style={{ animationDelay: `${(r * 5 + i) * 45}ms` }}>
              {emoji}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export function TenFrames({ filled, extra = 0 }: { filled: number; extra?: number }) {
  const total = filled + extra;
  const frames = total > 10 ? 2 : 1;
  const colourAt = (i: number) => (i < filled ? "#ef4444" : "#4f8ef7");
  return (
    <div className="flex flex-wrap justify-center gap-3" role="img" aria-label={`${filled} red${extra ? ` and ${extra} blue` : ""} counters`}>
      {Array.from({ length: frames }, (_, frame) => (
        <div key={frame} className="grid grid-cols-5 gap-1 rounded-xl border-[3px] border-ink/70 bg-white p-1.5">
          {Array.from({ length: 10 }, (_, j) => {
            const i = frame * 10 + j;
            return (
              <div key={j} className="flex h-9 w-9 items-center justify-center rounded-md bg-paper sm:h-11 sm:w-11">
                {i < total && <div className="h-6 w-6 animate-pop-in rounded-full sm:h-8 sm:w-8" style={{ background: colourAt(i), animationDelay: `${i * 30}ms` }} />}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function ArrayGrid({ rows, cols, emoji }: { rows: number; cols: number; emoji?: string }) {
  return (
    <div className="inline-grid gap-1.5 rounded-2xl bg-white p-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }} role="img" aria-label={`${rows} rows of ${cols}`}>
      {Array.from({ length: rows * cols }, (_, i) =>
        emoji ? (
          <span key={i} className="text-2xl leading-none sm:text-3xl">
            {emoji}
          </span>
        ) : (
          <span key={i} className="h-5 w-5 rounded-full bg-[#4f8ef7] sm:h-6 sm:w-6" />
        ),
      )}
    </div>
  );
}

// ---------- Measurement ----------

export function Ruler({ length, emoji }: { length: number; emoji: string }) {
  const max = 15;
  const unit = 100 / max;
  return (
    <div className="w-full max-w-xl" role="img" aria-label={`an object ${length} centimetres long on a ruler`}>
      <div className="relative mb-1 h-14">
        <div className="absolute bottom-0 left-0 flex h-9 animate-rise-in items-center justify-end rounded-l-md rounded-r-full border-[3px] border-[#c43a7c] bg-[#ff8fc4] pr-1" style={{ width: `${length * unit}%` }}>
          <span className="text-2xl leading-none">{emoji}</span>
        </div>
      </div>
      <div className="relative h-14 rounded-lg border-[3px] border-[#c9971a] bg-[#ffe08a]">
        {Array.from({ length: max + 1 }, (_, i) => (
          <div key={i} className="absolute top-0 flex flex-col items-center" style={{ left: `${i * unit}%`, transform: "translateX(-50%)" }}>
            <div className="w-[2px] bg-ink/80" style={{ height: 16 }} />
            <span className="mt-0.5 text-sm font-semibold text-ink/80">{i}</span>
          </div>
        ))}
        <span className="absolute right-2 bottom-0.5 text-xs font-semibold text-ink/60">cm</span>
      </div>
    </div>
  );
}

export function Clock({ hour, minute }: { hour: number; minute: number }) {
  const minAngle = (minute / 60) * 360;
  const hourAngle = ((hour % 12) / 12) * 360 + (minute / 60) * 30;
  const hand = (angle: number, len: number) => {
    const a = ((angle - 90) * Math.PI) / 180;
    return { x2: 50 + len * Math.cos(a), y2: 50 + len * Math.sin(a) };
  };
  return (
    <svg width="190" height="190" viewBox="0 0 100 100" role="img" aria-label="an analog clock">
      <circle cx="50" cy="50" r="46" fill="#fff" stroke={INK} strokeWidth="3.5" />
      {Array.from({ length: 60 }, (_, i) => {
        const a = (i / 60) * Math.PI * 2;
        const r1 = i % 5 === 0 ? 39 : 42;
        return <line key={i} x1={50 + r1 * Math.sin(a)} y1={50 - r1 * Math.cos(a)} x2={50 + 44 * Math.sin(a)} y2={50 - 44 * Math.cos(a)} stroke={INK} strokeWidth={i % 5 === 0 ? 1.6 : 0.6} />;
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const n = i + 1;
        const a = (n / 12) * Math.PI * 2;
        return (
          <text key={n} x={50 + 31 * Math.sin(a)} y={50 - 31 * Math.cos(a)} textAnchor="middle" dominantBaseline="central" fontSize="9" fontWeight="700" fill={INK} fontFamily="var(--font-fredoka)">
            {n}
          </text>
        );
      })}
      <line x1="50" y1="50" {...hand(hourAngle, 21)} stroke="#ef4444" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="50" y1="50" {...hand(minAngle, 34)} stroke="#4f8ef7" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="50" r="3.5" fill={INK} />
    </svg>
  );
}

export function NumberLine({
  min,
  max,
  step,
  labelEvery,
  marks = [],
  blankAt,
  jumps = [],
}: {
  min: number;
  max: number;
  step: number;
  labelEvery?: number;
  marks?: number[];
  blankAt?: number;
  jumps?: { from: number; to: number }[];
}) {
  const W = 340;
  const pad = 18;
  const x = (v: number) => pad + ((v - min) / (max - min)) * (W - pad * 2);
  const ticks: number[] = [];
  for (let v = min; v <= max + 1e-9; v += step) ticks.push(Math.round(v * 1000) / 1000);
  const every = labelEvery ?? (ticks.length > 12 ? Math.ceil(ticks.length / 10) * step : step);
  const isLabelled = (v: number) => {
    const r = ((v - min) / every) % 1;
    return Math.abs(r) < 1e-6 || Math.abs(r) > 1 - 1e-6;
  };
  return (
    <svg viewBox={`0 0 ${W} 90`} className="w-full max-w-2xl" role="img" aria-label={`a number line from ${min} to ${max}`}>
      {jumps.map((j, i) => {
        const x1 = x(j.from);
        const x2 = x(j.to);
        const h = Math.min(34, Math.abs(x2 - x1) * 0.45 + 8);
        const dir = x2 >= x1 ? -1 : 1;
        return (
          <g key={i}>
            <path d={`M${x1} 50 Q${(x1 + x2) / 2} ${50 - h * 1.6} ${x2} 50`} fill="none" stroke="#e9559a" strokeWidth="2.5" />
            <path d={`M${x2} 50 l${dir * 6} -6 M${x2} 50 l${dir * 7} 2`} stroke="#e9559a" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );
      })}
      <line x1={pad - 8} y1="56" x2={W - pad + 8} y2="56" stroke={INK} strokeWidth="2.5" />
      <path d={`M${W - pad + 8} 56 l-7 -5 v10 Z M${pad - 8} 56 l7 -5 v10 Z`} fill={INK} />
      {ticks.map((v) => (
        <g key={v}>
          <line x1={x(v)} y1="50" x2={x(v)} y2="62" stroke={INK} strokeWidth={isLabelled(v) ? 2 : 1} />
          {isLabelled(v) && v !== blankAt && (
            <text x={x(v)} y="77" textAnchor="middle" fontSize="12" fontWeight="600" fill={INK} fontFamily="var(--font-fredoka)">
              {v}
            </text>
          )}
        </g>
      ))}
      {marks.map((m) => (
        <circle key={m} cx={x(m)} cy="56" r="6" fill="#4f8ef7" stroke="#fff" strokeWidth="2" />
      ))}
      {blankAt !== undefined && (
        <g>
          <rect x={x(blankAt) - 13} y="65" width="26" height="20" rx="5" fill="#fff" stroke="#ff9636" strokeWidth="2.5" strokeDasharray="4 3" />
          <text x={x(blankAt)} y="80" textAnchor="middle" fontSize="13" fontWeight="700" fill="#e57a12">
            ?
          </text>
          <path d={`M${x(blankAt)} 44 l-5 -8 h10 Z`} fill="#ff9636" />
        </g>
      )}
    </svg>
  );
}

export function FractionModel({ numerator, denominator, shape = "bar" }: { numerator: number; denominator: number; shape?: "bar" | "circle" }) {
  const wholes = Math.max(1, Math.ceil(numerator / denominator));
  return (
    <div className="flex flex-wrap justify-center gap-3" role="img" aria-label={`${numerator} out of ${denominator} parts shaded`}>
      {Array.from({ length: wholes }, (_, w) => {
        const shaded = Math.max(0, Math.min(denominator, numerator - w * denominator));
        if (shape === "circle") {
          return (
            <svg key={w} width="140" height="140" viewBox="0 0 100 100">
              {denominator === 1 ? (
                <circle cx="50" cy="50" r="46" fill={shaded ? "#e9559a" : "#fff"} stroke={INK} strokeWidth="2.5" />
              ) : (
                Array.from({ length: denominator }, (_, i) => {
                  const a0 = (i / denominator) * Math.PI * 2 - Math.PI / 2;
                  const a1 = ((i + 1) / denominator) * Math.PI * 2 - Math.PI / 2;
                  const d = `M50 50 L${50 + 46 * Math.cos(a0)} ${50 + 46 * Math.sin(a0)} A46 46 0 0 1 ${50 + 46 * Math.cos(a1)} ${50 + 46 * Math.sin(a1)} Z`;
                  return <path key={i} d={d} fill={i < shaded ? "#e9559a" : "#fff"} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />;
                })
              )}
            </svg>
          );
        }
        return (
          <div key={w} className="flex h-14 w-72 overflow-hidden rounded-lg border-[3px] border-ink bg-white sm:w-96">
            {Array.from({ length: denominator }, (_, i) => (
              <div key={i} className="flex-1" style={{ background: i < shaded ? "#e9559a" : "#fff", borderLeft: i ? `2.5px solid ${INK}` : undefined }} />
            ))}
          </div>
        );
      })}
    </div>
  );
}

export function Angle({ degrees }: { degrees: number }) {
  const r = 70;
  const a = (-degrees * Math.PI) / 180;
  const arc = 26;
  const large = degrees > 180 ? 1 : 0;
  return (
    <svg width="220" height="170" viewBox="-20 -100 200 170" role="img" aria-label="an angle">
      <path d={`M0 0 L${arc} 0 A${arc} ${arc} 0 ${large} 0 ${arc * Math.cos(a)} ${arc * Math.sin(a)} Z`} fill="#ffe2c4" stroke="#ff9636" strokeWidth="2.5" />
      <line x1="0" y1="0" x2={r + 70} y2="0" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <line x1="0" y1="0" x2={(r + 20) * Math.cos(a)} y2={(r + 20) * Math.sin(a)} stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <circle cx="0" cy="0" r="5" fill={INK} />
    </svg>
  );
}

export function CoordinateGrid({ size, min = 0, points }: { size: number; min?: number; points: { x: number; y: number; label?: string }[] }) {
  const span = size - min;
  const W = 260;
  const cell = W / span;
  const px = (v: number) => (v - min) * cell;
  const py = (v: number) => W - (v - min) * cell;
  return (
    <svg viewBox={`-26 -10 ${W + 40} ${W + 40}`} className="w-full max-w-xs" role="img" aria-label="a coordinate grid">
      {Array.from({ length: span + 1 }, (_, i) => (
        <g key={i}>
          <line x1={i * cell} y1="0" x2={i * cell} y2={W} stroke="#d6dbe6" strokeWidth="1" />
          <line x1="0" y1={i * cell} x2={W} y2={i * cell} stroke="#d6dbe6" strokeWidth="1" />
          <text x={i * cell} y={W + 16} textAnchor="middle" fontSize="11" fill={INK}>
            {min + i}
          </text>
          <text x="-12" y={W - i * cell + 4} textAnchor="middle" fontSize="11" fill={INK}>
            {min + i}
          </text>
        </g>
      ))}
      <line x1={px(0)} y1="0" x2={px(0)} y2={W} stroke={INK} strokeWidth="2" />
      <line x1="0" y1={py(0)} x2={W} y2={py(0)} stroke={INK} strokeWidth="2" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={px(p.x)} cy={py(p.y)} r="6" fill="#e9559a" stroke="#fff" strokeWidth="2" />
          {p.label && (
            <text x={px(p.x) + 9} y={py(p.y) - 8} fontSize="13" fontWeight="700" fill="#c43a7c">
              {p.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

// ---------- Data ----------

export function Pictograph({
  title,
  rows,
  each = 1,
}: {
  title: string;
  rows: { label: string; emoji: string; count: number }[];
  /** How many each picture stands for (default 1). `count` is the number of pictures drawn. */
  each?: number;
}) {
  return (
    <div className="w-full max-w-xl rounded-2xl border-[3px] border-line bg-white p-3">
      <p className="mb-2 text-center text-lg font-semibold">{title}</p>
      <div className="flex flex-col gap-1.5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-2 rounded-xl bg-paper px-2 py-1">
            <span className="w-28 shrink-0 text-right text-base font-semibold text-ink-soft capitalize sm:w-36">{r.label}</span>
            <div className="flex flex-wrap gap-0.5 text-2xl leading-tight sm:text-3xl">
              {Array.from({ length: r.count }, (_, i) => (
                <span key={i} className="animate-pop-in" style={{ animationDelay: `${i * 35}ms` }}>
                  {r.emoji}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-sm text-ink-soft">Each picture = {each}</p>
    </div>
  );
}

const BAR_COLOURS = ["#4f8ef7", "#e9559a", "#25b47e", "#ff9636", "#8b5cf6", "#06b6d4"];

/** A bar graph with gridlines, so values can be read off the scale. */
export function BarGraph({ title, bars }: { title: string; bars: { label: string; value: number; emoji?: string }[] }) {
  const maxV = Math.max(...bars.map((b) => b.value), 1);
  const step = maxV <= 10 ? 1 : maxV <= 20 ? 2 : maxV <= 50 ? 5 : maxV <= 100 ? 10 : Math.ceil(maxV / 100) * 10;
  const top = Math.ceil(maxV / step) * step;
  const H = 180;
  const W = Math.max(260, bars.length * 74);
  const slot = (W - 20) / bars.length;
  const bw = Math.min(46, slot - 18);
  const y = (v: number) => H - (v / top) * H;
  return (
    <figure className="w-full max-w-xl rounded-2xl border-[3px] border-line bg-white p-3">
      <figcaption className="mb-1 text-center text-lg font-semibold">{title}</figcaption>
      <svg viewBox={`-34 -10 ${W + 40} ${H + 50}`} className="w-full" role="img" aria-label={title}>
        {Array.from({ length: top / step + 1 }, (_, i) => (
          <g key={i}>
            <line x1="0" y1={y(i * step)} x2={W} y2={y(i * step)} stroke="#e6e9f0" strokeWidth="1" />
            <text x="-8" y={y(i * step) + 4} textAnchor="end" fontSize="11" fill="#5b6680">
              {i * step}
            </text>
          </g>
        ))}
        <line x1="0" y1={H} x2={W} y2={H} stroke={INK} strokeWidth="2" />
        {bars.map((b, i) => {
          const cx = 20 + (i + 0.5) * slot;
          return (
            <g key={b.label}>
              <rect x={cx - bw / 2} y={y(b.value)} width={bw} height={H - y(b.value)} rx="4" fill={BAR_COLOURS[i % BAR_COLOURS.length]} />
              <text x={cx} y={H + 18} textAnchor="middle" fontSize="12" fontWeight="600" fill={INK}>
                {b.emoji ? `${b.emoji} ` : ""}
                {b.label}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

export function DataTable({ title, headers, rows }: { title?: string; headers: string[]; rows: (string | number)[][] }) {
  return (
    <figure className="w-full max-w-xl overflow-x-auto rounded-2xl border-[3px] border-line bg-white p-2">
      {title && <figcaption className="mb-1 text-center text-lg font-semibold">{title}</figcaption>}
      <table className="w-full border-collapse text-center font-read text-lg">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h} className="border-b-2 border-ink/20 bg-paper px-3 py-1.5 font-bold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 ? "bg-paper/60" : ""}>
              {r.map((c, j) => (
                <td key={j} className="border-b border-line px-3 py-1.5">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

export function Spinner({ segments }: { segments: string[] }) {
  const n = segments.length;
  const r = 46;
  const arc = (i: number) => {
    const a0 = (i / n) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2;
    return `M50 50 L${50 + r * Math.cos(a0)} ${50 + r * Math.sin(a0)} A${r} ${r} 0 0 1 ${50 + r * Math.cos(a1)} ${50 + r * Math.sin(a1)} Z`;
  };
  return (
    <svg width="190" height="190" viewBox="0 0 100 100" role="img" aria-label="a spinner">
      {segments.map((c, i) => (
        <path key={i} d={arc(i)} fill={c} stroke="#fff" strokeWidth="1.5" />
      ))}
      <circle cx="50" cy="50" r="47" fill="none" stroke={INK} strokeWidth="2.5" />
      <g className="animate-spin-slow" style={{ transformOrigin: "50px 50px" }}>
        <path d="M50 50 L50 14" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M44 20 L50 10 L56 20 Z" fill={INK} />
      </g>
      <circle cx="50" cy="50" r="5" fill={INK} />
    </svg>
  );
}

export function Towers({ heights, showBlank }: { heights: number[]; showBlank?: boolean }) {
  const colours = ["#4f8ef7", "#e9559a", "#25b47e", "#ff9636"];
  return (
    <div className="flex items-end justify-center gap-5" role="img" aria-label={`towers ${heights.join(", ")} blocks tall`}>
      {heights.map((h, t) => (
        <div key={t} className="flex flex-col items-center gap-1">
          <div className="flex flex-col-reverse gap-0.5">
            {Array.from({ length: h }, (_, i) => (
              <div key={i} className="h-7 w-7 animate-pop-in rounded-md border-2 border-black/15 sm:h-8 sm:w-8" style={{ background: colours[t % colours.length], animationDelay: `${(t * 4 + i) * 50}ms` }} />
            ))}
          </div>
          <span className="text-base font-semibold text-ink-soft">{h}</span>
        </div>
      ))}
      {showBlank && (
        <div className="flex flex-col items-center gap-1">
          <div className="flex h-24 w-9 items-center justify-center rounded-lg border-4 border-dashed border-ink/30 text-3xl font-bold text-ink/40">?</div>
          <span className="text-base font-semibold text-ink-soft">?</span>
        </div>
      )}
    </div>
  );
}

// ---------- Visual switch ----------

export function QuestionVisual({ visual }: { visual: Visual }) {
  switch (visual.type) {
    case "equation":
      return (
        <p className="text-center font-read text-5xl font-bold tracking-wide text-ink sm:text-6xl">
          <WithBlanks text={visual.text} />
        </p>
      );
    case "emoji":
      return (
        <div className="flex flex-col items-center gap-2">
          <span className="animate-pop-in text-7xl leading-none sm:text-8xl">{visual.emoji}</span>
          {visual.caption && (
            <span className={`font-read text-4xl font-bold text-ink ${visual.caption.includes("_") ? "tracking-[0.12em]" : ""}`}>{visual.caption}</span>
          )}
        </div>
      );
    case "emojiRow":
      return (
        <div className="flex flex-wrap items-center justify-center gap-2 text-5xl sm:text-6xl">
          {visual.items.map((e, i) => (
            <span key={i} className="animate-pop-in" style={{ animationDelay: `${i * 60}ms` }}>
              {e}
            </span>
          ))}
          {visual.showBlank && (
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-dashed border-ink/30 text-4xl font-bold text-ink/40 sm:h-20 sm:w-20">?</span>
          )}
        </div>
      );
    case "dots":
      return <Dots count={visual.count} emoji={visual.emoji} />;
    case "blocks":
      return <Blocks hundreds={visual.hundreds} tens={visual.tens} ones={visual.ones} size={16} />;
    case "coins":
      return (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {visual.coins.map((c, i) => (
            <div key={i} className="animate-pop-in" style={{ animationDelay: `${i * 70}ms` }}>
              <Coin cents={c} scale={1.15} />
            </div>
          ))}
        </div>
      );
    case "ruler":
      return <Ruler length={visual.length} emoji={visual.emoji} />;
    case "pictograph":
      return <Pictograph title={visual.title} rows={visual.rows} each={visual.each} />;
    case "bars":
      return <BarGraph title={visual.title} bars={visual.bars} />;
    case "table":
      return <DataTable title={visual.title} headers={visual.headers} rows={visual.rows} />;
    case "shape":
      return (
        <div className="animate-pop-in">
          <Shape shape={visual.shape} size={150} />
        </div>
      );
    case "spinner":
      return <Spinner segments={visual.segments} />;
    case "towers":
      return <Towers heights={visual.heights} showBlank={visual.showBlank} />;
    case "tenFrame":
      return <TenFrames filled={visual.filled} extra={visual.extra} />;
    case "clock":
      return <Clock hour={visual.hour} minute={visual.minute} />;
    case "numberLine":
      return <NumberLine {...visual} />;
    case "fraction":
      return <FractionModel numerator={visual.numerator} denominator={visual.denominator} shape={visual.shape} />;
    case "array":
      return <ArrayGrid rows={visual.rows} cols={visual.cols} emoji={visual.emoji} />;
    case "letter":
      return (
        <div className="flex flex-col items-center gap-2">
          <span className="animate-pop-in rounded-3xl border-4 border-line bg-white px-8 py-4 font-read text-7xl font-bold text-ink shadow-[0_6px_0_var(--color-line)] sm:text-8xl">
            {visual.text}
          </span>
          {visual.caption && <span className="font-read text-2xl text-ink-soft">{visual.caption}</span>}
        </div>
      );
    case "grid":
      return <CoordinateGrid size={visual.size} min={visual.min} points={visual.points} />;
    case "angle":
      return <Angle degrees={visual.degrees} />;
    case "story":
      return (
        <div className="w-full max-w-2xl rounded-2xl border-[3px] border-[#f3c6dc] bg-[#fff7fb] px-5 py-4">
          {visual.lines.map((line, i) => (
            <p key={i} className="font-read text-xl leading-relaxed sm:text-2xl">
              {line}
            </p>
          ))}
        </div>
      );
    case "passage":
      return (
        <article className="max-h-[45vh] w-full max-w-2xl overflow-y-auto rounded-2xl border-[3px] border-[#f3c6dc] bg-[#fff7fb] px-5 py-4">
          {visual.title && <h3 className="mb-2 text-xl font-bold">{visual.title}</h3>}
          {visual.paragraphs.map((p, i) =>
            p === "" ? (
              <div key={i} aria-hidden className="h-4" />
            ) : (
              <p key={i} className="mb-2 whitespace-pre-line font-read text-lg leading-relaxed sm:text-xl">
                {p}
              </p>
            ),
          )}
        </article>
      );
  }
}
