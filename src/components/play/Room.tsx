"use client";

import { useState } from "react";
import { isRoomOwned, ROOM_ITEMS, ROOM_SLOTS, roomLayout, type RoomItem, type RoomSlot } from "@/lib/room";
import { sounds } from "@/lib/sound";
import { useActiveProfile, useDerived, useStore } from "@/lib/store";
import { CritterSvg } from "../Critter";
import { Page } from "../ui";
import { BackButton } from "./Practice";

/** The room scene. Sizes are in container-width units so it scales down to a 320 px phone. */
export function RoomScene({ layout, companion }: { layout: Partial<Record<RoomSlot, RoomItem>>; companion?: string }) {
  const names = Object.values(layout).map((i) => i.name).join(", ");
  return (
    <div
      role="img"
      aria-label={`Your room: ${names}`}
      className="relative mx-auto aspect-[5/3] w-full max-w-xl overflow-hidden rounded-3xl border-4 border-line"
      style={{ containerType: "inline-size" }}
    >
      <div className="absolute inset-x-0 top-0 h-[62%]" style={{ background: layout.wall?.paint ?? "#e6efff" }} />
      <div className="absolute inset-x-0 bottom-0 h-[38%] border-t-4 border-black/10" style={{ background: layout.floor?.paint ?? "#e8c9a0" }} />
      {ROOM_SLOTS.map(({ slot, at }) => {
        const item = layout[slot];
        if (!item || !at) return null;
        return (
          <span key={slot} aria-hidden="true" className="absolute leading-none" style={{ left: `${at.x}%`, top: `${at.y}%`, fontSize: `${at.size / 5.6}cqw` }}>
            {item.icon}
          </span>
        );
      })}
      <div className="absolute" aria-hidden="true" style={{ left: "38%", top: "34%", width: "28cqw", height: "28cqw" }}>
        <CritterSvg id={companion ?? "ollie"} mood="happy" />
      </div>
    </div>
  );
}

export function Room() {
  const profile = useActiveProfile()!;
  const d = useDerived();
  const place = useStore((s) => s.placeRoomItem);
  const updateProfile = useStore((s) => s.updateProfile);
  const [slot, setSlot] = useState<RoomSlot>("wall");
  const layout = roomLayout(profile.room, d.owned);
  const items = ROOM_ITEMS.filter((i) => i.slot === slot);
  const optional = slot !== "wall" && slot !== "floor";
  const bought = ROOM_ITEMS.filter((i) => i.cost > 0 && d.owned.includes(i.id)).length;
  const total = ROOM_ITEMS.filter((i) => i.cost > 0).length;

  return (
    <Page className="gap-5">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <BackButton />
          <h1 className="text-3xl font-bold sm:text-4xl">🏠 My Room</h1>
        </div>
        <span className="flex h-14 items-center gap-1 rounded-2xl bg-white px-4 text-2xl font-bold shadow-[0_4px_0_var(--color-line)]">🪙 {d.coins}</span>
      </header>

      <RoomScene layout={layout} companion={profile.companion} />
      <p className="text-center font-read text-lg text-ink-soft">
        {bought === 0 ? "Spend coins to make this room yours." : `You have ${bought} of ${total} things for your room.`}
      </p>

      <div role="tablist" aria-label="Room parts" className="flex flex-wrap gap-2 narrow:flex-nowrap narrow:gap-1.5">
        {ROOM_SLOTS.map((s) => (
          <button
            key={s.slot}
            type="button"
            role="tab"
            aria-selected={slot === s.slot}
            aria-label={s.label}
            onClick={() => setSlot(s.slot)}
            className={`btn h-14 gap-2 px-4 text-lg narrow:min-w-12 narrow:flex-1 narrow:px-1 ${slot === s.slot ? "btn-soft" : ""}`}
          >
            <span aria-hidden="true">{s.icon}</span> <span className="narrow:hidden">{s.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {optional && (
          <button
            type="button"
            className={`btn h-full min-h-32 w-full flex-col gap-1 p-3 ${layout[slot] ? "" : "btn-good"}`}
            aria-pressed={!layout[slot]}
            onClick={() => updateProfile(profile.id, { room: { ...profile.room, [slot]: "" } })}
          >
            <span aria-hidden="true" className="text-5xl">🚫</span>
            <span className="text-lg font-bold">Empty</span>
          </button>
        )}
        {items.map((item) => {
          const owned = isRoomOwned(item, d.owned);
          const on = layout[slot]?.id === item.id;
          const locked = !owned && item.unlock && d.level < item.unlock.level;
          const cannotAfford = !owned && !locked && d.coins < item.cost;
          return (
            <button
              key={item.id}
              type="button"
              disabled={Boolean(locked) || cannotAfford}
              aria-pressed={on}
              onClick={() => {
                if (place(item.id)) sounds.pop(3);
              }}
              className={`btn h-full min-h-32 w-full flex-col gap-1 p-3 ${on ? "btn-good" : ""}`}
              aria-label={`${item.name}${on ? ", in your room" : owned ? ", owned" : locked ? `, locked: ${item.unlock?.label}` : `, ${item.cost} coins`}`}
            >
              <span aria-hidden="true" className="text-5xl">{item.icon}</span>
              <span className="text-lg leading-tight font-bold">{item.name}</span>
              <span className={`rounded-full px-3 py-0.5 text-sm font-bold ${on ? "bg-white/30" : owned ? "bg-good-soft text-good-dark" : cannotAfford || locked ? "bg-black/5 text-ink-soft" : "bg-[#fff4cc] text-[#7a5700]"}`}>
                {on ? "In your room ✓" : owned ? "Owned · Use" : locked ? `🔒 ${item.unlock?.label}` : `🪙 ${item.cost}`}
              </span>
            </button>
          );
        })}
      </div>
    </Page>
  );
}
