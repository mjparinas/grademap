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
  /** Must be reached before it can be bought. Coins alone aren't enough. */
  unlock?: { level?: number; trophy?: string; label: string };
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
  { id: "marlo", kind: "companion", name: "Marlo the Marmot", cost: 350, icon: "🐿️", critter: "marlo", unlock: { level: 12, label: "Reach level 12" } },
  { id: "willow", kind: "companion", name: "Willow the Wolf", cost: 400, icon: "🐺", critter: "willow", unlock: { level: 18, label: "Reach level 18" } },
  { id: "frost", kind: "companion", name: "Frost the Arctic Fox", cost: 600, icon: "🦊", critter: "frost", unlock: { level: 30, label: "Reach level 30" } },

  // Celebration styles.
  { id: "classic", kind: "confetti", name: "Classic confetti", cost: 0, icon: "🎉", confetti: [] },
  { id: "hearts", kind: "confetti", name: "Hearts", cost: 150, icon: "💖", confetti: ["💖", "💜", "💛"] },
  { id: "snow", kind: "confetti", name: "Snowflakes", cost: 150, icon: "❄️", confetti: ["❄️", "⛄"] },
  { id: "leaves", kind: "confetti", name: "Maple leaves", cost: 150, icon: "🍁", confetti: ["🍁", "🍂"] },
  { id: "stars", kind: "confetti", name: "Stars", cost: 200, icon: "⭐", confetti: ["⭐", "🌟", "✨"] },
  { id: "sea", kind: "confetti", name: "Under the sea", cost: 250, icon: "🐠", confetti: ["🐠", "🐚", "🐙"] },
  { id: "space", kind: "confetti", name: "Space", cost: 300, icon: "🚀", confetti: ["🚀", "🪐", "🌟"] },
  { id: "rain", kind: "confetti", name: "Rain City", cost: 200, icon: "🌧️", confetti: ["💧", "☔", "🌧️"], unlock: { level: 8, label: "Reach level 8" } },
  { id: "pancakes", kind: "confetti", name: "Pancake stack", cost: 200, icon: "🥞", confetti: ["🥞", "🍁", "🧈"], unlock: { trophy: "streak-7", label: "Win Week Warrior" } },
  { id: "blossoms", kind: "confetti", name: "Cherry blossoms", cost: 250, icon: "🌸", confetti: ["🌸", "💮"], unlock: { level: 10, label: "Reach level 10" } },
  { id: "fireworks", kind: "confetti", name: "Fireworks", cost: 300, icon: "🎆", confetti: ["🎆", "🎇", "✨"], unlock: { level: 15, label: "Reach level 15" } },
  { id: "rainbow", kind: "confetti", name: "Rainbow", cost: 300, icon: "🌈", confetti: ["🌈", "☁️", "⭐"], unlock: { level: 20, label: "Reach level 20" } },
  { id: "gold", kind: "confetti", name: "Gold coins", cost: 400, icon: "🪙", confetti: ["🪙", "✨"], unlock: { trophy: "coins-1000", label: "Win Treasure Hunter" } },
  { id: "aurora", kind: "confetti", name: "Northern lights", cost: 500, icon: "🌌", confetti: ["🌌", "✨", "💚"], unlock: { level: 35, label: "Reach level 35" } },

  // Titles shown under your name.
  { id: "rookie", kind: "title", name: "Rookie", cost: 0, icon: "🌱" },
  { id: "math-whiz", kind: "title", name: "Math Whiz", cost: 120, icon: "🧮" },
  { id: "bookworm", kind: "title", name: "Bookworm", cost: 120, icon: "📚" },
  { id: "lab-legend", kind: "title", name: "Lab Legend", cost: 120, icon: "🧪" },
  { id: "globetrotter", kind: "title", name: "Globetrotter", cost: 120, icon: "🌍" },
  { id: "speedster", kind: "title", name: "Speedster", cost: 180, icon: "⚡" },
  { id: "champion", kind: "title", name: "Champion", cost: 300, icon: "🏆" },
  { id: "legend", kind: "title", name: "Legend", cost: 600, icon: "👑" },
  { id: "comeback-kid", kind: "title", name: "Comeback Kid", cost: 150, icon: "💪", unlock: { trophy: "comeback-100", label: "Win Bounce Back" } },
  { id: "streak-keeper", kind: "title", name: "Streak Keeper", cost: 200, icon: "🔥", unlock: { trophy: "streak-30", label: "Win Monthly Master" } },
  { id: "quiz-whiz", kind: "title", name: "Quiz Whiz", cost: 250, icon: "🧠", unlock: { trophy: "correct-1000", label: "Win Knowledge Machine" } },
  { id: "mastermind", kind: "title", name: "Mastermind", cost: 250, icon: "🌲", unlock: { trophy: "proficient-10", label: "Win Forest" } },
  { id: "trailblazer", kind: "title", name: "Trailblazer", cost: 300, icon: "🧭", unlock: { level: 25, label: "Reach level 25" } },
  { id: "year-round", kind: "title", name: "Year-Round Learner", cost: 400, icon: "🗓️", unlock: { trophy: "days-365", label: "Win A Full Year" } },
  { id: "north-star", kind: "title", name: "North Star", cost: 500, icon: "🌟", unlock: { level: 50, label: "Reach level 50" } },
];

export function getItem(id: string | undefined): ShopItem | undefined {
  return SHOP.find((i) => i.id === id);
}

export function isOwned(id: string, owned: string[]): boolean {
  const item = getItem(id);
  return !!item && (item.cost === 0 || owned.includes(id));
}

/** Whether a child has reached what an item needs (level or trophy). Cost is checked separately. */
export function isUnlocked(item: ShopItem, level: number, trophies: Record<string, number>): boolean {
  const u = item.unlock;
  if (!u) return true;
  return (u.level === undefined || level >= u.level) && (u.trophy === undefined || !!trophies[u.trophy]);
}
