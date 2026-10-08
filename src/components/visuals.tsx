import { Fragment, type ReactNode } from "react";
import { COIN_NAMES } from "@/lib/content/math";
import type { ShapeName, Visual } from "@/lib/types";

/** Render text, drawing each ☐ as a dashed box. */
export function WithBlanks({ text }: { text: string }) {
  const parts = text.split("☐");
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 && <span className="blank-box mx-1" aria-label="blank" />}
        </Fragment>
      ))}
    </>
  );
}

// ---------- Coins ----------

const COIN_STYLE: Record<number, { size: number; fill: string; ring: string; text: string; label: string }> = {
  5: { size: 62, fill: "#d9dde3", ring: "#a9b0ba", text: "#4b5563", label: "5¢" },
  10: { size: 54, fill: "#e3e6ea", ring: "#aeb5be", text: "#4b5563", label: "10¢" },
  25: { size: 70, fill: "#d6dbe1", ring: "#9ea6b0", text: "#374151", label: "25¢" },
  100: { size: 78, fill: "#f2c74e", ring: "#c9971a", text: "#7a5600", label: "$1" },
  200: { size: 82, fill: "#d6dbe1", ring: "#9ea6b0", text: "#7a5600", label: "$2" },
};

export function Coin({ cents, scale = 1 }: { cents: number; scale?: number }) {
  const c = COIN_STYLE[cents];
  const size = c.size * scale;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={`${COIN_NAMES[cents]}, ${c.label}`}>
      {cents === 100 ? (
        // The loonie has 11 sides.
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
      <text
        x="50"
        y="51"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-fredoka)"
        fontWeight="700"
        fontSize={c.label.length > 2 ? 30 : 34}
        fill={c.text}
      >
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
  circle: "#f5b301",
  cube: "#4f8ef7",
  sphere: "#e9559a",
  cylinder: "#25b47e",
  cone: "#ff9636",
};

function polygon(n: number, r = 40, cx = 50, cy = 52) {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");
}

export function Shape({ shape, size = 120 }: { shape: ShapeName; size?: number }) {
  const fill = SHAPE_FILL[shape];
  const stroke = "#253047";
  const common = { fill, stroke, strokeWidth: 3, strokeLinejoin: "round" as const };
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
    case "circle":
      body = <circle cx="50" cy="50" r="40" {...common} />;
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
    case "sphere":
      body = (
        <g>
          <defs>
            <radialGradient id="sphere-g" cx="35%" cy="32%" r="70%">
              <stop offset="0%" stopColor="#ffd1e6" />
              <stop offset="100%" stopColor={fill} />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="40" fill="url(#sphere-g)" stroke={stroke} strokeWidth="3" />
          <ellipse cx="50" cy="50" rx="40" ry="11" fill="none" stroke={stroke} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
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
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={shape}>
      {body}
    </svg>
  );
}

// ---------- Base-ten blocks ----------

export function TenRod({ size = 14 }: { size?: number }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-md border-2 border-[#2f6fd6]" style={{ width: size + 4 }}>
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          className="bg-[#4f8ef7]"
          style={{ height: size, borderTop: i ? "1.5px solid #2f6fd6" : undefined }}
        />
      ))}
    </div>
  );
}

export function OneCube({ size = 14 }: { size?: number }) {
  return <div className="rounded-[4px] border-2 border-[#e07f1f] bg-[#ffb35c]" style={{ width: size + 4, height: size + 4 }} />;
}

export function Blocks({ tens, ones, size = 14 }: { tens: number; ones: number; size?: number }) {
  return (
    <div className="flex items-end justify-center gap-6" role="img" aria-label={`${tens} tens and ${ones} ones`}>
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

// ---------- Ten frames ----------

export function TenFrames({ filled, extra = 0 }: { filled: number; extra?: number }) {
  const total = filled + extra;
  // Colour each counter by which addend it belongs to.
  const colourAt = (i: number) => (i < filled ? "#ef4444" : "#4f8ef7");
  return (
    <div className="flex flex-wrap justify-center gap-3" role="img" aria-label={`${filled} red and ${extra} blue counters`}>
      {[0, 1].map((frame) => (
        <div key={frame} className="grid grid-cols-5 gap-1 rounded-xl border-[3px] border-ink/70 bg-white p-1.5">
          {Array.from({ length: 10 }, (_, j) => {
            const i = frame * 10 + j;
            return (
              <div key={j} className="flex h-9 w-9 items-center justify-center rounded-md bg-paper sm:h-11 sm:w-11">
                {i < total && (
                  <div
                    className="h-6 w-6 animate-pop-in rounded-full sm:h-8 sm:w-8"
                    style={{ background: colourAt(i), animationDelay: `${i * 30}ms` }}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ---------- Ruler ----------

export function Ruler({ length, emoji }: { length: number; emoji: string }) {
  const max = 15;
  const unit = 100 / max;
  return (
    <div className="w-full max-w-xl" role="img" aria-label={`an object ${length} centimetres long on a ruler`}>
      <div className="relative mb-1 h-14">
        <div
          className="absolute bottom-0 left-0 flex h-9 items-center justify-end rounded-r-full rounded-l-md border-[3px] border-[#c43a7c] bg-[#ff8fc4] pr-1 animate-rise-in"
          style={{ width: `${length * unit}%` }}
        >
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
        <span className="absolute bottom-0.5 right-2 text-xs font-semibold text-ink/60">cm</span>
      </div>
    </div>
  );
}

// ---------- Pictograph ----------

export function Pictograph({ title, rows }: { title: string; rows: { label: string; emoji: string; count: number }[] }) {
  return (
    <div className="w-full max-w-xl rounded-2xl border-[3px] border-line bg-white p-3">
      <p className="mb-2 text-center text-lg font-semibold">{title}</p>
      <div className="flex flex-col gap-1.5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-2 rounded-xl bg-paper px-2 py-1">
            <span className="w-28 shrink-0 text-right text-base font-semibold capitalize text-ink-soft sm:w-36">
              {r.label}
            </span>
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
      <p className="mt-2 text-center text-sm text-ink-soft">Each picture = 1</p>
    </div>
  );
}

// ---------- Spinner ----------

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
      <circle cx="50" cy="50" r="47" fill="none" stroke="#253047" strokeWidth="2.5" />
      <g className="animate-spin-slow" style={{ transformOrigin: "50px 50px" }}>
        <path d="M50 50 L50 14" stroke="#253047" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M44 20 L50 10 L56 20 Z" fill="#253047" />
      </g>
      <circle cx="50" cy="50" r="5" fill="#253047" />
    </svg>
  );
}

// ---------- Towers ----------

export function Towers({ heights, showBlank }: { heights: number[]; showBlank?: boolean }) {
  const colours = ["#4f8ef7", "#e9559a", "#25b47e", "#ff9636"];
  return (
    <div className="flex items-end justify-center gap-5" role="img" aria-label={`towers ${heights.join(", ")} blocks tall`}>
      {heights.map((h, t) => (
        <div key={t} className="flex flex-col items-center gap-1">
          <div className="flex flex-col-reverse gap-0.5">
            {Array.from({ length: h }, (_, i) => (
              <div
                key={i}
                className="h-7 w-7 animate-pop-in rounded-md border-2 border-black/15 sm:h-8 sm:w-8"
                style={{ background: colours[t % colours.length], animationDelay: `${(t * 4 + i) * 50}ms` }}
              />
            ))}
          </div>
          <span className="text-base font-semibold text-ink-soft">{h}</span>
        </div>
      ))}
      {showBlank && (
        <div className="flex flex-col items-center gap-1">
          <div className="flex h-24 w-9 items-center justify-center rounded-lg border-4 border-dashed border-ink/30 text-3xl font-bold text-ink/40">
            ?
          </div>
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
            <span className={`font-read text-4xl font-bold text-ink ${visual.caption.includes("_") ? "tracking-[0.12em]" : ""}`}>
              {visual.caption}
            </span>
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
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-dashed border-ink/30 text-4xl font-bold text-ink/40 sm:h-20 sm:w-20">
              ?
            </span>
          )}
        </div>
      );
    case "blocks":
      return <Blocks tens={visual.tens} ones={visual.ones} size={16} />;
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
      return <Pictograph title={visual.title} rows={visual.rows} />;
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
  }
}
