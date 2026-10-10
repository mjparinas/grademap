"use client";

import { useState, type CSSProperties } from "react";
import { allUnitRefs } from "@/content";
import { getSubjectMeta } from "@/content/subjects";
import type { SubjectId } from "@/content/types";
import { onColour } from "@/lib/contrast";
import { countEarned, momentStickers, unitStickers, type Sticker } from "@/lib/stickers";
import { useActiveProfile, useChildSettings, useDerived } from "@/lib/store";
import { useBand } from "../band";
import { Critter, SpeechBubble } from "../Critter";
import { Page, ProgressBar, subjectVars } from "../ui";
import { BackButton } from "./Practice";

type PageId = SubjectId | "moments";

export function StickerBook() {
  const profile = useActiveProfile()!;
  const settings = useChildSettings();
  const d = useDerived();
  const band = useBand();
  const [page, setPage] = useState<PageId>("moments");

  const enabled = settings?.enabledSubjects ?? [];
  const refs = allUnitRefs(profile.grade, profile.framework).filter((r) => enabled.includes(r.course.subject));
  const bySubject = unitStickers(refs, d);
  const subjects = Object.keys(bySubject) as SubjectId[];
  const moments = momentStickers(d);
  const pages: { id: PageId; label: string; emoji: string; colour: string; dark: string; stickers: Sticker[] }[] = [
    { id: "moments", label: "Moments", emoji: "🌟", colour: "#f0bd2a", dark: "#b88905", stickers: moments },
    ...subjects.map((s) => {
      const m = getSubjectMeta(s);
      return { id: s as PageId, label: m.title[band], emoji: m.emoji, colour: m.colour, dark: m.colourDark, stickers: bySubject[s] };
    }),
  ];
  const current = pages.find((p) => p.id === page) ?? pages[0];
  const all = pages.flatMap((p) => p.stickers);
  const got = countEarned(all);
  const meta = current.id === "moments" ? undefined : getSubjectMeta(current.id);

  return (
    <Page style={meta ? subjectVars(meta) : undefined} className="gap-5">
      <header className="flex items-center gap-3">
        <BackButton />
        <h1 className="text-3xl font-bold sm:text-4xl">📒 Sticker Book</h1>
      </header>

      <div className="flex items-center gap-3">
        <Critter id={profile.companion} mood={got === all.length ? "cheer" : "happy"} size={84} className="short:hidden" />
        <SpeechBubble className="flex-1">
          <p className="font-read text-lg font-bold sm:text-xl">{got === 0 ? "Finish a lesson to stick your first sticker!" : `You have ${got} of ${all.length} stickers.`}</p>
          <ProgressBar value={got} max={all.length} className="mt-2" label="Stickers collected" />
        </SpeechBubble>
      </div>

      <div role="tablist" aria-label="Sticker pages" className="flex flex-wrap gap-2 narrow:flex-nowrap narrow:gap-1.5">
        {pages.map((p) => {
          const on = p.id === current.id;
          return (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={on}
              aria-label={`${p.label}, ${countEarned(p.stickers)} of ${p.stickers.length}`}
              onClick={() => setPage(p.id)}
              className={`btn h-14 gap-2 px-4 text-lg narrow:min-w-14 narrow:flex-1 narrow:px-2 ${on ? "" : "btn-soft"}`}
              style={on ? ({ "--btn-bg": p.colour, "--btn-edge": p.dark, "--btn-fg": onColour(p.colour) } as CSSProperties) : undefined}
            >
              <span aria-hidden="true" className="narrow:text-2xl">{p.emoji}</span> <span className="narrow:hidden">{p.label}</span>
            </button>
          );
        })}
      </div>

      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5" aria-label={`${current.label} stickers`}>
        {current.stickers.map((s) => (
          <li
            key={s.id}
            className={`card flex flex-col items-center gap-1 p-3 text-center ${s.shiny ? "ring-4 ring-[#f0bd2a]" : ""}`}
            style={{ borderStyle: s.earned ? "solid" : "dashed" }}
          >
            <span aria-hidden="true" className={`text-5xl ${s.earned ? "" : "opacity-30 grayscale"}`}>
              {s.earned ? s.emoji : "❔"}
            </span>
            <span className="text-base leading-tight font-bold">
              {s.earned ? s.name : "Sticker to find"}
              {s.shiny && <span className="sr-only"> (shiny)</span>}
            </span>
            {!s.earned && <span className="text-sm leading-tight font-semibold text-ink-soft">{s.hint}</span>}
            {s.shiny && <span aria-hidden="true" className="text-sm font-bold text-[#6b4f00]">✨ Shiny</span>}
          </li>
        ))}
      </ul>
    </Page>
  );
}
