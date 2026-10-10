// The room: a place to spend coins on that a child keeps coming back to. Items are bought with coins
// like anything in the shop (a `buy` event, so ownership merges across devices), and where each one
// sits is a small per-child setting on the profile.

export type RoomSlot = "wall" | "floor" | "decor" | "lamp" | "plant" | "corner" | "toy";

export interface RoomItem {
  id: string;
  slot: RoomSlot;
  name: string;
  cost: number;
  /** Shown in the picker, and in the scene for everything except walls and floors. */
  icon: string;
  /** Background for walls and floors. */
  paint?: string;
  unlock?: { level: number; label: string };
}

export const ROOM_SLOTS: { slot: RoomSlot; label: string; icon: string; /** Where it sits in the scene, as percentages of its width and height, and a font size in px. */ at?: { x: number; y: number; size: number } }[] = [
  { slot: "wall", label: "Walls", icon: "🎨" },
  { slot: "floor", label: "Floors", icon: "🟫" },
  { slot: "decor", label: "Wall art", icon: "🖼️", at: { x: 12, y: 8, size: 64 } },
  { slot: "lamp", label: "Lights", icon: "💡", at: { x: 76, y: 14, size: 44 } },
  { slot: "plant", label: "Plants", icon: "🪴", at: { x: 84, y: 52, size: 56 } },
  { slot: "corner", label: "Cosy corner", icon: "🛋️", at: { x: 4, y: 50, size: 72 } },
  { slot: "toy", label: "Toys", icon: "🧸", at: { x: 26, y: 66, size: 40 } },
];

export const ROOM_STARTER: Record<string, string> = { wall: "room-wall-plain", floor: "room-floor-wood" };

export const ROOM_ITEMS: RoomItem[] = [
  { id: "room-wall-plain", slot: "wall", name: "Plain blue", cost: 0, icon: "⬜", paint: "#e6efff" },
  { id: "room-wall-sun", slot: "wall", name: "Sunshine", cost: 60, icon: "🟨", paint: "#fff1b8" },
  { id: "room-wall-mint", slot: "wall", name: "Mint", cost: 60, icon: "🟩", paint: "#d5f5e8" },
  { id: "room-wall-lilac", slot: "wall", name: "Lilac", cost: 60, icon: "🟪", paint: "#e6defa" },
  { id: "room-wall-peach", slot: "wall", name: "Peach", cost: 60, icon: "🟧", paint: "#ffe0cf" },
  { id: "room-wall-night", slot: "wall", name: "Starry night", cost: 150, icon: "🌌", paint: "linear-gradient(#1e2a5e, #3a4fb8)" },
  { id: "room-wall-forest", slot: "wall", name: "Forest", cost: 150, icon: "🌲", paint: "linear-gradient(#bfe8c4, #6fbf8a)" },
  { id: "room-wall-sunset", slot: "wall", name: "Sunset", cost: 200, icon: "🌇", paint: "linear-gradient(#ffd6a5, #ff8fa3)", unlock: { level: 8, label: "Reach level 8" } },

  { id: "room-floor-wood", slot: "floor", name: "Wood", cost: 0, icon: "🟫", paint: "#e8c9a0" },
  { id: "room-floor-grass", slot: "floor", name: "Grass", cost: 80, icon: "🌱", paint: "#9fd68a" },
  { id: "room-floor-blue", slot: "floor", name: "Blue carpet", cost: 80, icon: "🟦", paint: "#8fb4f0" },
  { id: "room-floor-snow", slot: "floor", name: "Snow", cost: 100, icon: "❄️", paint: "#f4f8fc" },
  { id: "room-floor-check", slot: "floor", name: "Checkerboard", cost: 120, icon: "♟️", paint: "repeating-conic-gradient(#ffffff 0% 25%, #c9d6ef 0% 50%) 0 0 / 48px 48px" },

  { id: "room-decor-art", slot: "decor", name: "Painting", cost: 60, icon: "🖼️" },
  { id: "room-decor-window", slot: "decor", name: "Window", cost: 80, icon: "🪟" },
  { id: "room-decor-map", slot: "decor", name: "Big map", cost: 100, icon: "🗺️" },
  { id: "room-decor-night", slot: "decor", name: "City at night", cost: 120, icon: "🌃" },
  { id: "room-decor-rainbow", slot: "decor", name: "Rainbow", cost: 150, icon: "🌈", unlock: { level: 6, label: "Reach level 6" } },

  { id: "room-lamp-bulb", slot: "lamp", name: "Desk lamp", cost: 70, icon: "💡" },
  { id: "room-lamp-lantern", slot: "lamp", name: "Lantern", cost: 90, icon: "🏮" },
  { id: "room-lamp-fairy", slot: "lamp", name: "Fairy lights", cost: 140, icon: "✨" },
  { id: "room-lamp-moon", slot: "lamp", name: "Moon light", cost: 160, icon: "🌙", unlock: { level: 10, label: "Reach level 10" } },

  { id: "room-plant-cactus", slot: "plant", name: "Cactus", cost: 60, icon: "🌵" },
  { id: "room-plant-pot", slot: "plant", name: "Potted plant", cost: 80, icon: "🪴" },
  { id: "room-plant-tulips", slot: "plant", name: "Tulips", cost: 90, icon: "🌷" },
  { id: "room-plant-sunflower", slot: "plant", name: "Sunflower", cost: 100, icon: "🌻" },
  { id: "room-plant-bamboo", slot: "plant", name: "Bamboo", cost: 100, icon: "🎋" },
  { id: "room-plant-maple", slot: "plant", name: "Maple tree", cost: 120, icon: "🍁" },

  { id: "room-corner-basket", slot: "corner", name: "Cosy basket", cost: 100, icon: "🧺" },
  { id: "room-corner-chair", slot: "corner", name: "Reading chair", cost: 90, icon: "🪑" },
  { id: "room-corner-bed", slot: "corner", name: "Snug bed", cost: 200, icon: "🛏️" },
  { id: "room-corner-couch", slot: "corner", name: "Couch", cost: 200, icon: "🛋️" },
  { id: "room-corner-tent", slot: "corner", name: "Camping tent", cost: 250, icon: "⛺", unlock: { level: 12, label: "Reach level 12" } },

  { id: "room-toy-teddy", slot: "toy", name: "Teddy bear", cost: 80, icon: "🧸" },
  { id: "room-toy-blocks", slot: "toy", name: "Building blocks", cost: 90, icon: "🧱" },
  { id: "room-toy-kite", slot: "toy", name: "Kite", cost: 100, icon: "🪁" },
  { id: "room-toy-rocket", slot: "toy", name: "Toy rocket", cost: 140, icon: "🚀" },
  { id: "room-toy-puzzle", slot: "toy", name: "Puzzle", cost: 110, icon: "🧩" },
];

export function getRoomItem(id: string | undefined): RoomItem | undefined {
  return ROOM_ITEMS.find((i) => i.id === id);
}

export function isRoomOwned(item: RoomItem, owned: string[]): boolean {
  return item.cost === 0 || owned.includes(item.id);
}

/** What is in each slot right now, with the starter wall and floor filled in. Only owned, known items count. */
export function roomLayout(room: Record<string, string> | undefined, owned: string[]): Partial<Record<RoomSlot, RoomItem>> {
  const out: Partial<Record<RoomSlot, RoomItem>> = {};
  for (const [slot, id] of Object.entries({ ...ROOM_STARTER, ...room })) {
    const item = getRoomItem(id);
    if (item && item.slot === slot && isRoomOwned(item, owned)) out[slot as RoomSlot] = item;
  }
  return out;
}
