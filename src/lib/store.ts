"use client";

import { useMemo } from "react";
import { create } from "zustand";
import { DEFAULT_FRAMEWORK } from "@/content/frameworks";
import { ageBandFor } from "@/content/subjects";
import type { FrameworkId, GradeId } from "@/content/types";
import { derive, type Derived } from "./derive";
import * as localdb from "./localdb";
import {
  dayKey,
  defaultChildSettings,
  newId,
  type AppEvent,
  type ChildSettings,
  type FamilyInfo,
  type Profile,
} from "./model";
import { TRIAL_DAYS } from "./plan";
import { dailyQuests } from "./quests";
import { getItem, STARTER } from "./shop";
import { setCalmCheck } from "./juice";
import { setQuietCheck, setSoundCheck } from "./sound";
import { getTrophy, newlyEarned, TIER_STYLE } from "./trophies";

export interface Toast {
  id: string;
  kind: "trophy" | "level" | "quest" | "info";
  title: string;
  subtitle: string;
  icon: string;
  tier?: keyof typeof TIER_STYLE;
}

export interface SyncState {
  cursor: number;
  lastSyncAt?: number;
  status: "idle" | "syncing" | "error" | "offline" | "signed-out";
  error?: string;
  /** Profile ids whose record or settings changed since the last upload. */
  dirtyProfiles: string[];
  dirtyFamily: boolean;
}

type NewEvent = AppEvent extends infer E ? (E extends AppEvent ? Omit<E, "id" | "t" | "profileId"> : never) : never;

interface State {
  ready: boolean;
  deviceId: string;
  profiles: Profile[];
  activeId: string | null;
  settings: Record<string, ChildSettings>;
  family: FamilyInfo;
  pin: { hash: string; salt: string } | null;
  events: AppEvent[];
  sync: SyncState;
  toasts: Toast[];

  init: () => Promise<void>;
  addProfile: (p: { name: string; avatar: string; colour: string; grade: GradeId; framework?: FrameworkId; birthYear?: number }) => string;
  updateProfile: (id: string, patch: Partial<Profile>) => void;
  removeProfile: (id: string) => void;
  resetProgress: (id: string) => void;
  setActive: (id: string | null) => void;
  updateSettings: (profileId: string, patch: Partial<ChildSettings>) => void;
  /** Record events for the active child; awards trophies and quests. */
  log: (events: NewEvent[]) => void;
  buy: (itemId: string) => boolean;
  equip: (itemId: string) => void;
  setPin: (pin: string) => Promise<void>;
  checkPin: (pin: string) => Promise<boolean>;
  setFamily: (patch: Partial<FamilyInfo>, fromServer?: boolean) => void;
  setSync: (patch: Partial<SyncState>) => void;
  mergeRemote: (data: { events: AppEvent[]; profiles: Profile[]; settings: ChildSettings[]; family?: FamilyInfo }) => void;
  pushToast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
  wipeDevice: () => Promise<void>;
}

const save = (key: string, value: unknown) => void localdb.setKV(key, value);

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function newFamily(): FamilyInfo {
  const now = Date.now();
  return { plan: "trial", trialEndsAt: now + TRIAL_DAYS * 86_400_000, updatedAt: now };
}

// Derived stats are cached per child and recomputed only when their events change.
const deriveCache = new Map<string, { events: AppEvent[]; resetAt: number; day: string; value: Derived }>();

export function eventsFor(events: AppEvent[], profile: Profile | undefined): AppEvent[] {
  if (!profile) return [];
  return events.filter((e) => e.profileId === profile.id && e.t > (profile.resetAt ?? 0));
}

export function derivedFor(state: Pick<State, "events" | "profiles">, profileId: string | null): Derived {
  const profile = state.profiles.find((p) => p.id === profileId);
  const key = profileId ?? "";
  const cached = deriveCache.get(key);
  const today = dayKey(Date.now());
  if (cached && cached.events === state.events && cached.resetAt === (profile?.resetAt ?? 0) && cached.day === today) {
    return cached.value;
  }
  const value = derive(eventsFor(state.events, profile));
  deriveCache.set(key, { events: state.events, resetAt: profile?.resetAt ?? 0, day: today, value });
  return value;
}

export const useStore = create<State>()((set, get) => ({
  ready: false,
  deviceId: "",
  profiles: [],
  activeId: null,
  settings: {},
  family: newFamily(),
  pin: null,
  events: [],
  sync: { cursor: 0, status: "signed-out", dirtyProfiles: [], dirtyFamily: false },
  toasts: [],

  init: async () => {
    if (get().ready) return;
    const [deviceId, profiles, activeId, settings, family, pin, sync, events] = await Promise.all([
      localdb.getKV<string>("deviceId"),
      localdb.getKV<Profile[]>("profiles"),
      localdb.getKV<string | null>("activeId"),
      localdb.getKV<Record<string, ChildSettings>>("settings"),
      localdb.getKV<FamilyInfo>("family"),
      localdb.getKV<State["pin"]>("pin"),
      localdb.getKV<SyncState>("sync"),
      localdb.allEvents(),
    ]);
    const id = deviceId ?? newId();
    if (!deviceId) save("deviceId", id);
    const fam = family ?? newFamily();
    if (!family) save("family", fam);
    set({
      ready: true,
      deviceId: id,
      profiles: profiles ?? [],
      activeId: activeId ?? null,
      settings: settings ?? {},
      family: fam,
      pin: pin ?? null,
      sync: { ...get().sync, ...(sync ?? {}), status: fam.account ? "idle" : "signed-out" },
      events,
    });
  },

  addProfile: ({ name, avatar, colour, grade, framework = DEFAULT_FRAMEWORK, birthYear }) => {
    const now = Date.now();
    const id = newId();
    const profile: Profile = {
      id,
      name: name.trim().slice(0, 20) || "Friend",
      avatar,
      colour,
      grade,
      framework,
      birthYear,
      companion: STARTER.companion,
      title: STARTER.title,
      confetti: STARTER.confetti,
      createdAt: now,
      updatedAt: now,
    };
    const settings = { ...get().settings, [id]: defaultChildSettings(id, ageBandFor(grade) === "little") };
    const profiles = [...get().profiles, profile];
    set({ profiles, settings, activeId: id });
    save("profiles", profiles);
    save("settings", settings);
    save("activeId", id);
    get().setSync({ dirtyProfiles: [...new Set([...get().sync.dirtyProfiles, id])] });
    return id;
  },

  updateProfile: (id, patch) => {
    const profiles = get().profiles.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: Date.now() } : p));
    set({ profiles });
    save("profiles", profiles);
    get().setSync({ dirtyProfiles: [...new Set([...get().sync.dirtyProfiles, id])] });
  },

  removeProfile: (id) => {
    get().updateProfile(id, { deleted: true });
    if (get().activeId === id) get().setActive(null);
  },

  resetProgress: (id) => get().updateProfile(id, { resetAt: Date.now() }),

  setActive: (id) => {
    set({ activeId: id });
    save("activeId", id);
  },

  updateSettings: (profileId, patch) => {
    const current = get().settings[profileId] ?? defaultChildSettings(profileId, false);
    const settings = { ...get().settings, [profileId]: { ...current, ...patch, updatedAt: Date.now() } };
    set({ settings });
    save("settings", settings);
    get().setSync({ dirtyProfiles: [...new Set([...get().sync.dirtyProfiles, profileId])] });
  },

  log: (incoming) => {
    const state = get();
    const profile = state.profiles.find((p) => p.id === state.activeId);
    if (!profile || !incoming.length) return;
    const now = Date.now();
    const before = derivedFor(state, profile.id);
    const fresh = incoming.map((e, i) => ({ ...e, id: newId(), t: now + i, profileId: profile.id }) as AppEvent);
    let events = [...state.events, ...fresh];
    let after = derivedFor({ events, profiles: state.profiles }, profile.id);
    const toasts: Omit<Toast, "id">[] = [];

    // Quests complete themselves the moment they're done.
    const day = dayKey(now);
    const claimed = after.questsClaimed[day] ?? [];
    const questEvents: AppEvent[] = [];
    for (const q of dailyQuests(profile.id, day, ageBandFor(profile.grade))) {
      if (!claimed.includes(q.id) && q.progress(after.days[day]) >= q.target) {
        questEvents.push({ type: "quest", quest: q.id, day, reward: q.reward, id: newId(), t: now + 50, profileId: profile.id });
        toasts.push({ kind: "quest", title: "Quest complete!", subtitle: `${q.title} · +${q.reward} coins`, icon: q.icon });
      }
    }
    if (questEvents.length) {
      events = [...events, ...questEvents];
      fresh.push(...questEvents);
      after = derivedFor({ events, profiles: state.profiles }, profile.id);
    }

    // Trophies can unlock other trophies (e.g. levels), so check until nothing new.
    for (let round = 0; round < 3; round++) {
      const earned = newlyEarned(after, { grade: profile.grade });
      if (!earned.length) break;
      const trophyEvents = earned.map(
        (t, i) => ({ type: "trophy", trophy: t.id, id: newId(), t: now + 100 + round * 10 + i, profileId: profile.id }) as AppEvent,
      );
      events = [...events, ...trophyEvents];
      fresh.push(...trophyEvents);
      after = derivedFor({ events, profiles: state.profiles }, profile.id);
      for (const t of earned) {
        toasts.push({ kind: "trophy", title: t.name, subtitle: `${TIER_STYLE[t.tier].label} trophy`, icon: t.icon, tier: t.tier });
      }
    }

    if (after.level > before.level) {
      toasts.unshift({ kind: "level", title: `Level ${after.level}!`, subtitle: "You levelled up!", icon: "⬆️" });
    }

    set({ events });
    void localdb.putEvents(fresh);
    toasts.forEach((t) => get().pushToast(t));
  },

  buy: (itemId) => {
    const state = get();
    const item = getItem(itemId);
    if (!item || !state.activeId) return false;
    const d = derivedFor(state, state.activeId);
    if (d.owned.includes(itemId) || item.cost === 0) {
      get().equip(itemId);
      return true;
    }
    if (d.coins < item.cost) return false;
    get().log([{ type: "buy", item: itemId, cost: item.cost }]);
    get().equip(itemId);
    return true;
  },

  equip: (itemId) => {
    const item = getItem(itemId);
    const id = get().activeId;
    if (!item || !id) return;
    get().updateProfile(id, item.kind === "companion" ? { companion: itemId } : item.kind === "title" ? { title: itemId } : { confetti: itemId });
  },

  setPin: async (pin) => {
    const salt = newId();
    const value = { salt, hash: await sha256(`${salt}:${pin}`) };
    set({ pin: value });
    save("pin", value);
  },

  checkPin: async (pin) => {
    const current = get().pin;
    if (!current) return true;
    return (await sha256(`${current.salt}:${pin}`)) === current.hash;
  },

  setFamily: (patch, fromServer = false) => {
    const family = { ...get().family, ...patch, updatedAt: fromServer ? get().family.updatedAt : Date.now() };
    set({ family });
    save("family", family);
    if (!fromServer) get().setSync({ dirtyFamily: true });
  },

  setSync: (patch) => {
    const sync = { ...get().sync, ...patch };
    set({ sync });
    save("sync", { cursor: sync.cursor, lastSyncAt: sync.lastSyncAt, dirtyProfiles: sync.dirtyProfiles, dirtyFamily: sync.dirtyFamily });
  },

  mergeRemote: ({ events, profiles, settings, family }) => {
    const state = get();
    const known = new Set(state.events.map((e) => e.id));
    const newEvents = events.filter((e) => !known.has(e.id));
    // Last write wins for profiles and settings.
    const byId = new Map(state.profiles.map((p) => [p.id, p]));
    for (const p of profiles) {
      const mine = byId.get(p.id);
      if (!mine || p.updatedAt > mine.updatedAt) byId.set(p.id, p);
    }
    const mergedSettings = { ...state.settings };
    for (const s of settings) {
      const mine = mergedSettings[s.profileId];
      if (!mine || s.updatedAt > mine.updatedAt) mergedSettings[s.profileId] = s;
    }
    const mergedProfiles = [...byId.values()];
    set({
      events: newEvents.length ? [...state.events, ...newEvents] : state.events,
      profiles: mergedProfiles,
      settings: mergedSettings,
      family: family ? { ...state.family, ...family, account: state.family.account } : state.family,
    });
    if (newEvents.length) void localdb.putEvents(newEvents, 1);
    save("profiles", mergedProfiles);
    save("settings", mergedSettings);
    if (family) save("family", get().family);
  },

  pushToast: (t) => set({ toasts: [...get().toasts, { ...t, id: newId() }] }),
  dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),

  wipeDevice: async () => {
    await localdb.clearAll();
    deriveCache.clear();
    set({
      profiles: [],
      activeId: null,
      settings: {},
      family: newFamily(),
      pin: null,
      events: [],
      sync: { cursor: 0, status: "signed-out", dirtyProfiles: [], dirtyFamily: false },
    });
  },
}));

// ---------- Hooks ----------

export function useReady(): boolean {
  return useStore((s) => s.ready);
}

export function useProfiles(): Profile[] {
  const profiles = useStore((s) => s.profiles);
  return useMemo(() => profiles.filter((p) => !p.deleted), [profiles]);
}

export function useActiveProfile(): Profile | undefined {
  return useStore((s) => s.profiles.find((p) => p.id === s.activeId && !p.deleted));
}

export function useDerived(profileId?: string | null): Derived {
  const events = useStore((s) => s.events);
  const profiles = useStore((s) => s.profiles);
  const activeId = useStore((s) => s.activeId);
  const id = profileId === undefined ? activeId : profileId;
  return useMemo(() => derivedFor({ events, profiles }, id), [events, profiles, id]);
}

export function useChildSettings(profileId?: string | null): ChildSettings | undefined {
  const activeId = useStore((s) => s.activeId);
  const id = profileId ?? activeId;
  return useStore((s) => (id ? s.settings[id] : undefined));
}

export function useTrophyName(id: string): string {
  return getTrophy(id)?.name ?? id;
}

function activeSettings(): ChildSettings | undefined {
  const s = useStore.getState();
  return s.activeId ? s.settings[s.activeId] : undefined;
}
setSoundCheck(() => activeSettings()?.sound ?? true);
setQuietCheck(() => Boolean(activeSettings()?.quietSounds));
setCalmCheck(() => Boolean(activeSettings()?.calmMotion));

// A "calm" class on the page stops CSS animations too (see globals.css).
if (typeof document !== "undefined") {
  const apply = () => {
    const s = activeSettings();
    const root = document.documentElement.classList;
    root.toggle("calm", Boolean(s?.calmMotion));
    root.toggle("roomy", Boolean(s?.roomyText));
    root.toggle("contrast", Boolean(s?.highContrast));
  };
  useStore.subscribe(apply);
  apply();
}
