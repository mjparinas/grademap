// Things kids can spend coins on. Coins are only ever earned by learning and
// playing: there's no way to buy them with real money.

export type ItemKind = "companion" | "confetti" | "title";

export interface ShopItem {
  id: string;
  kind: ItemKind;
  name: string;
  cost: number;
  /** Emoji for confetti/titles; companions draw their critter. */
  icon: string;
  critter?: string;
  confetti?: string[];
}

export const STARTER = { companion: "ollie", confetti: "classic", title: "rookie" };

export const SHOP: ShopItem[] = [
  // Companions: your buddy on the home screen.
  { id: "ollie", kind: "companion", name: "Ollie the Otter", cost: 0, icon: "🦦", critter: "ollie" },
  { id: "hoot", kind: "companion", name: "Hoot the Owl", cost: 120, icon: "🦉", critter: "hoot" },
  { id: "ruby", kind: "companion", name: "Ruby the Fox", cost: 120, icon: "🦊", critter: "ruby" },
  { id: "bolt", kind: "companion", name: "Bolt the Beaver", cost: 120, icon: "🦫", critter: "bolt" },
  { id: "juniper", kind: "companion", name: "Juniper the Bear", cost: 120, icon: "🐻", critter: "juniper" },
  { id: "clover", kind: "companion", name: "Clover the Bunny", cost: 200, icon: "🐰", critter: "clover" },
  { id: "poppy", kind: "companion", name: "Poppy the Puffin", cost: 250, icon: "🐧", critter: "poppy" },
  { id: "rocco", kind: "companion", name: "Rocco the Raccoon", cost: 250, icon: "🦝", critter: "rocco" },
  { id: "maple", kind: "companion", name: "Maple the Moose", cost: 300, icon: "🦌", critter: "maple" },
  { id: "shelly", kind: "companion", name: "Shelly the Turtle", cost: 300, icon: "🐢", critter: "shelly" },
  { id: "bao", kind: "companion", name: "Bao the Panda", cost: 350, icon: "🐼", critter: "bao" },
  { id: "nori", kind: "companion", name: "Nori the Narwhal", cost: 500, icon: "🐋", critter: "nori" },

  // Celebration styles.
  { id: "classic", kind: "confetti", name: "Classic confetti", cost: 0, icon: "🎉", confetti: [] },
  { id: "hearts", kind: "confetti", name: "Hearts", cost: 150, icon: "💖", confetti: ["💖", "💜", "💛"] },
  { id: "snow", kind: "confetti", name: "Snowflakes", cost: 150, icon: "❄️", confetti: ["❄️", "⛄"] },
  { id: "leaves", kind: "confetti", name: "Maple leaves", cost: 150, icon: "🍁", confetti: ["🍁", "🍂"] },
  { id: "stars", kind: "confetti", name: "Stars", cost: 200, icon: "⭐", confetti: ["⭐", "🌟", "✨"] },
  { id: "sea", kind: "confetti", name: "Under the sea", cost: 250, icon: "🐠", confetti: ["🐠", "🐚", "🐙"] },
  { id: "space", kind: "confetti", name: "Space", cost: 300, icon: "🚀", confetti: ["🚀", "🪐", "🌟"] },

  // Titles shown under your name.
  { id: "rookie", kind: "title", name: "Rookie", cost: 0, icon: "🌱" },
  { id: "math-whiz", kind: "title", name: "Math Whiz", cost: 120, icon: "🧮" },
  { id: "bookworm", kind: "title", name: "Bookworm", cost: 120, icon: "📚" },
  { id: "lab-legend", kind: "title", name: "Lab Legend", cost: 120, icon: "🧪" },
  { id: "globetrotter", kind: "title", name: "Globetrotter", cost: 120, icon: "🌍" },
  { id: "speedster", kind: "title", name: "Speedster", cost: 180, icon: "⚡" },
  { id: "champion", kind: "title", name: "Champion", cost: 300, icon: "🏆" },
  { id: "legend", kind: "title", name: "Legend", cost: 600, icon: "👑" },
];

export function getItem(id: string | undefined): ShopItem | undefined {
  return SHOP.find((i) => i.id === id);
}

export function isOwned(id: string, owned: string[]): boolean {
  const item = getItem(id);
  return !!item && (item.cost === 0 || owned.includes(id));
}
