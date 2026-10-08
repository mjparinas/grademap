"use client";

import { useState } from "react";
import { celebrate } from "@/lib/juice";
import { SHOP, type ItemKind, type ShopItem } from "@/lib/shop";
import { sounds } from "@/lib/sound";
import { useActiveProfile, useDerived, useStore } from "@/lib/store";
import { Critter, CritterSvg } from "../Critter";
import { Dialog, Page } from "../ui";
import { BackButton } from "./Practice";

const TABS: { kind: ItemKind; label: string; icon: string }[] = [
  { kind: "companion", label: "Buddies", icon: "🐾" },
  { kind: "confetti", label: "Celebrations", icon: "🎉" },
  { kind: "title", label: "Titles", icon: "🏷️" },
];

export function Shop() {
  const profile = useActiveProfile()!;
  const d = useDerived();
  const buy = useStore((s) => s.buy);
  const [tab, setTab] = useState<ItemKind>("companion");
  const [confirm, setConfirm] = useState<ShopItem | null>(null);

  const equipped = (item: ShopItem) =>
    item.kind === "companion" ? profile.companion === item.id : item.kind === "title" ? profile.title === item.id : profile.confetti === item.id;
  const owned = (item: ShopItem) => item.cost === 0 || d.owned.includes(item.id);

  const choose = (item: ShopItem) => {
    if (owned(item)) {
      buy(item.id);
      sounds.pop(3);
    } else setConfirm(item);
  };

  return (
    <Page className="gap-5">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <BackButton />
          <h1 className="text-3xl font-bold sm:text-4xl">🛍️ Shop</h1>
        </div>
        <span className="flex h-14 items-center gap-1 rounded-2xl bg-white px-4 text-2xl font-bold shadow-[0_4px_0_var(--color-line)]">🪙 {d.coins}</span>
      </header>
      <p className="font-read text-lg text-ink-soft">Earn coins by learning, finishing quests and winning trophies.</p>

      <div className="flex flex-wrap gap-2" role="tablist">
        {TABS.map((t) => (
          <button key={t.kind} type="button" role="tab" aria-selected={tab === t.kind} onClick={() => setTab(t.kind)} className={`btn h-14 px-4 text-lg ${tab === t.kind ? "btn-soft" : ""}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {SHOP.filter((i) => i.kind === tab).map((item, i) => {
          const isOwned = owned(item);
          const isOn = equipped(item);
          const affordable = d.coins >= item.cost;
          return (
            <div key={item.id} className="animate-rise-in" style={{ animationDelay: `${i * 40}ms` }}>
              <button
                type="button"
                onClick={() => choose(item)}
                className={`btn h-full w-full flex-col gap-2 p-3 ${isOn ? "btn-good" : ""}`}
                aria-label={`${item.name}${isOn ? ", equipped" : isOwned ? ", owned" : `, ${item.cost} coins`}`}
              >
                <span className="flex h-24 w-24 items-center justify-center">
                  {item.critter ? <CritterSvg id={item.critter} mood={isOn ? "cheer" : "happy"} /> : <span className="text-6xl">{item.icon}</span>}
                </span>
                <span className="text-lg leading-tight font-bold">{item.name}</span>
                <span className={`rounded-full px-3 py-0.5 text-sm font-bold ${isOn ? "bg-white/30" : isOwned ? "bg-good-soft text-good-dark" : affordable ? "bg-[#fff4cc] text-[#a07400]" : "bg-black/5 text-ink-soft"}`}>
                  {isOn ? "Using ✓" : isOwned ? "Owned · Use" : `🪙 ${item.cost}`}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <Dialog open={!!confirm} title={confirm ? `Get ${confirm.name}?` : ""} onClose={() => setConfirm(null)}>
        {confirm && (
          <div className="flex flex-col items-center gap-4">
            {confirm.critter ? <Critter id={confirm.critter} mood="wave" size={130} /> : <span className="text-7xl">{confirm.icon}</span>}
            {d.coins >= confirm.cost ? (
              <>
                <p className="font-read text-lg">
                  It costs <b>🪙 {confirm.cost}</b>. You have 🪙 {d.coins}.
                </p>
                <button
                  type="button"
                  className="btn btn-good min-h-16 w-full text-2xl"
                  onClick={() => {
                    if (buy(confirm.id)) {
                      sounds.complete();
                      celebrate(confirm.confetti ?? []);
                    }
                    setConfirm(null);
                  }}
                >
                  Buy it!
                </button>
              </>
            ) : (
              <p className="font-read text-lg">You need 🪙 {confirm.cost - d.coins} more coins. Keep learning to earn them!</p>
            )}
            <button type="button" className="btn min-h-14 w-full text-xl" onClick={() => setConfirm(null)}>
              {d.coins >= confirm.cost ? "Not now" : "OK"}
            </button>
          </div>
        )}
      </Dialog>
    </Page>
  );
}
