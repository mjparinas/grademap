import type { Question } from "@/content/types";
import { speakSegments, type SpeechLanguage } from "./speech";

// What read-aloud says for a question, split by language: an English prompt about a
// French word is read by an English voice, and the French is read by a French voice.

export interface Segment {
  text: string;
  lang: SpeechLanguage;
}

/** Splits a prompt on « French » quotations, which Core French uses to mark French inside English text. */
function promptSegments(text: string): Segment[] {
  const out: Segment[] = [];
  const re = /«([^»]*)»/g;
  let last = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (m.index > last) out.push({ text: text.slice(last, m.index), lang: "en" });
    out.push({ text: m[1], lang: "fr" });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last), lang: "en" });
  return out.filter((s) => /[\p{L}\p{N}]/u.test(s.text));
}

/** What read-aloud says: honours `speak`, and never reads choices marked silent. */
export function readAloudSegments(q: Question): Segment[] {
  const prompt: SpeechLanguage = q.lang ?? "en";
  const parts: Segment[] = [];
  if (q.visual?.type === "story") parts.push({ text: q.visual.lines.join(" "), lang: q.visualLang ?? prompt });
  if (q.visual?.type === "passage") {
    parts.push({ text: [q.visual.title, ...q.visual.paragraphs].filter(Boolean).join(". ").replace(/\n/g, " "), lang: q.visualLang ?? prompt });
  }
  const said = q.speak ?? q.prompt;
  parts.push(...(q.lang ? [{ text: said, lang: prompt }] : promptSegments(said)));
  if (q.kind === "choice") {
    const labels = q.choices.map((c) => c.speak ?? c.label).filter((s) => s !== "");
    if (labels.length === q.choices.length) parts.push({ text: labels.join(", or "), lang: q.choicesLang ?? prompt });
  }
  // Join neighbours that share a language so the voice doesn't stop and start mid-sentence.
  const merged: Segment[] = [];
  for (const p of parts) {
    const prev = merged[merged.length - 1];
    if (prev && prev.lang === p.lang) prev.text = `${prev.text}. ${p.text}`;
    else merged.push({ ...p });
  }
  return merged;
}

/** The whole read-aloud text, ignoring language (for tests and captions). */
export function readAloudText(q: Question): string {
  return readAloudSegments(q).map((s) => s.text).join(". ");
}

export function speakQuestion(q: Question) {
  speakSegments(readAloudSegments(q));
}
