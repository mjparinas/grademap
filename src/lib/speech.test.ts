import { describe, expect, it } from "vitest";
import { chooseVoice, rankVoices, type VoiceLike } from "./speech";

const v = (name: string, lang: string, localService = true, extra: Partial<VoiceLike> = {}): VoiceLike => ({
  name,
  lang,
  localService,
  voiceURI: name,
  default: false,
  ...extra,
});

// Real voice names as browsers report them.
const EDGE_WINDOWS = [
  v("Microsoft David - English (United States)", "en-US", true, { default: true }),
  v("Microsoft Zira - English (United States)", "en-US"),
  v("Microsoft Linda - English (Canada)", "en-CA"),
  v("Microsoft Aria Online (Natural) - English (United States)", "en-US", false),
  v("Microsoft Clara Online (Natural) - English (Canada)", "en-CA", false),
  v("Microsoft Sonia Online (Natural) - English (United Kingdom)", "en-GB", false),
  v("Microsoft Denise Online (Natural) - French (France)", "fr-FR", false),
];
const CHROME_WINDOWS = [
  v("Microsoft David - English (United States)", "en-US", true, { default: true }),
  v("Microsoft Linda - English (Canada)", "en-CA"),
  v("Google US English", "en-US", false),
  v("Google UK English Female", "en-GB", false),
  v("Google français", "fr-FR", false),
];
const MAC_SAFARI = [
  v("Albert", "en-US"),
  v("Bad News", "en-US"),
  v("Fred", "en-US"),
  v("Grandma (English (US))", "en-US"),
  v("Samantha", "en-US", true, { default: true }),
  v("Ava (Premium)", "en-US"),
  v("Daniel", "en-GB"),
];
const IPAD = [v("Samantha", "en-US", true, { default: true }), v("Karen", "en-AU"), v("Ava (Enhanced)", "en-US"), v("Thomas", "fr-FR")];

describe("read-aloud voice ranking", () => {
  it("prefers Edge's natural voices, Canadian first, over the old Windows voices", () => {
    const ranked = rankVoices(EDGE_WINDOWS);
    expect(ranked[0].name).toBe("Microsoft Clara Online (Natural) - English (Canada)");
    expect(ranked[1].name).toBe("Microsoft Aria Online (Natural) - English (United States)");
    expect(ranked.at(-1)?.quality).toBe("basic");
    // A natural US voice beats a robotic Canadian one: quality first, locale breaks ties.
    expect(ranked.findIndex((o) => o.name.includes("Linda"))).toBeGreaterThan(ranked.findIndex((o) => o.name.includes("Aria")));
    expect(ranked.some((o) => o.lang.startsWith("fr"))).toBe(false);
  });

  it("prefers Chrome's Google voices online and falls back to an on-device voice offline", () => {
    const ranked = rankVoices(CHROME_WINDOWS);
    expect(ranked[0].name).toBe("Google US English");
    expect(chooseVoice(ranked, null, false)?.name).toBe("Google US English");
    expect(chooseVoice(ranked, null, true)?.online).toBe(false);
  });

  it("drops Apple's joke voices and puts downloaded Premium/Enhanced voices first", () => {
    const mac = rankVoices(MAC_SAFARI).map((o) => o.name);
    expect(mac[0]).toBe("Ava (Premium)");
    expect(mac).not.toContain("Albert");
    expect(mac).not.toContain("Bad News");
    expect(mac).not.toContain("Fred");
    expect(mac.at(-1)).toBe("Grandma (English (US))");
    expect(rankVoices(IPAD)[0].name).toBe("Ava (Enhanced)");
  });

  it("uses the parent's choice when it can play, otherwise the best playable voice", () => {
    const ranked = rankVoices(EDGE_WINDOWS);
    const linda = "Microsoft Linda - English (Canada)";
    expect(chooseVoice(ranked, linda, false)?.name).toBe(linda);
    // A chosen cloud voice can't play offline.
    const aria = "Microsoft Aria Online (Natural) - English (United States)";
    expect(chooseVoice(ranked, aria, true)?.online).toBe(false);
    // A voice from another device isn't installed here.
    expect(chooseVoice(ranked, "Ava (Premium)", false)?.name).toBe(ranked[0].name);
    expect(chooseVoice([], null, false)).toBeUndefined();
  });
});
