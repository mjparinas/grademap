import { describe, expect, it } from "vitest";
import { tagCoreFrench } from "@/content/french";
import type { Question } from "@/content/types";
import { readAloudSegments } from "./readaloud";

const choice = (prompt: string, extra: Partial<Question> = {}): Question =>
  ({
    kind: "choice",
    prompt,
    hint: "h",
    choices: [
      { id: "a", label: "bonjour" },
      { id: "b", label: "merci" },
    ],
    answer: "a",
    ...extra,
  }) as Question;

describe("read-aloud languages", () => {
  it("reads an all-French Immersion question in one French segment", () => {
    const segs = readAloudSegments(choice("Quel mot commence comme « lune »?", { lang: "fr" }));
    expect(segs).toHaveLength(1);
    expect(segs[0].lang).toBe("fr");
  });

  it("switches voices inside a Core French prompt marked with « »", () => {
    const segs = readAloudSegments(choice("What does «bonjour» mean?"));
    expect(segs.map((s) => s.lang)).toEqual(["en", "fr", "en"]);
    expect(segs[1].text).toBe("bonjour");
  });

  it("reads French choices in French when choicesLang is set", () => {
    const q = tagCoreFrench(choice("How do you say “hello”?"));
    const segs = readAloudSegments(q);
    expect(segs[segs.length - 1].lang).toBe("fr");
    expect(segs[0].lang).toBe("en");
  });

  it("keeps English glosses in the English voice", () => {
    const q = tagCoreFrench(choice("What does “the cat” mean?"));
    expect(q.prompt).toContain("“the cat”");
    expect(readAloudSegments(q).every((s) => s.lang === "en")).toBe(true);
  });

  it("reads a French sentence with a bracketed gloss as French only", () => {
    const q = tagCoreFrench(choice("Complète : Je ___ content. (I am happy)"));
    expect(q.lang).toBe("fr");
    expect(readAloudSegments(q).some((s) => s.text.includes("happy"))).toBe(false);
  });
});
