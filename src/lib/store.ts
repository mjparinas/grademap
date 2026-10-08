"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  colour: string;
  createdAt: number;
}

export interface UnitProgress {
  /** Best result so far (1–3). Never goes down. */
  stars: number;
  completions: number;
  lastPlayed: number;
}

export interface Settings {
  sound: boolean;
  /** Read each question out loud automatically. */
  autoRead: boolean;
}

interface State {
  profiles: Profile[];
  activeId: string | null;
  /** profileId → "subject/unit" → progress */
  progress: Record<string, Record<string, UnitProgress>>;
  settings: Settings;
  addProfile: (name: string, avatar: string, colour: string) => string;
  removeProfile: (id: string) => void;
  setActive: (id: string | null) => void;
  recordUnit: (key: string, stars: number) => void;
  resetProgress: (profileId: string) => void;
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

export const MAX_PROFILES = 4;

export const AVATARS = ["🦊", "🐻", "🐸", "🐼", "🦉", "🐳", "🐝", "🦄"];
export const AVATAR_COLOURS = ["#ff9636", "#4f8ef7", "#25b47e", "#e9559a", "#8b5cf6", "#06b6d4", "#f5b301", "#ef4444"];

export const useStore = create<State>()(
  persist(
    (set) => ({
      profiles: [],
      activeId: null,
      progress: {},
      settings: { sound: true, autoRead: false },

      addProfile: (name, avatar, colour) => {
        const id = `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
        set((s) => ({
          profiles: [...s.profiles, { id, name: name.trim() || "Friend", avatar, colour, createdAt: Date.now() }],
          activeId: id,
        }));
        return id;
      },

      removeProfile: (id) =>
        set((s) => {
          const progress = { ...s.progress };
          delete progress[id];
          return {
            profiles: s.profiles.filter((p) => p.id !== id),
            activeId: s.activeId === id ? null : s.activeId,
            progress,
          };
        }),

      setActive: (id) => set({ activeId: id }),

      recordUnit: (key, stars) =>
        set((s) => {
          if (!s.activeId) return s;
          const mine = s.progress[s.activeId] ?? {};
          const prev = mine[key];
          return {
            progress: {
              ...s.progress,
              [s.activeId]: {
                ...mine,
                [key]: {
                  stars: Math.max(prev?.stars ?? 0, stars),
                  completions: (prev?.completions ?? 0) + 1,
                  lastPlayed: Date.now(),
                },
              },
            },
          };
        }),

      resetProgress: (profileId) =>
        set((s) => ({ progress: { ...s.progress, [profileId]: {} } })),

      setSetting: (key, value) => set((s) => ({ settings: { ...s.settings, [key]: value } })),
    }),
    {
      name: "grademap-v1",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Rehydrated in <StoreHydrator> after mount so the first client render
      // matches the prerendered HTML.
      skipHydration: true,
      partialize: (s) => ({
        profiles: s.profiles,
        activeId: s.activeId,
        progress: s.progress,
        settings: s.settings,
      }),
    },
  ),
);

/** True once saved progress has been loaded from this device. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useStore.persist.onFinishHydration(onChange),
    () => useStore.persist.hasHydrated(),
    () => false,
  );
}

export function useActiveProfile(): Profile | undefined {
  return useStore((s) => s.profiles.find((p) => p.id === s.activeId));
}

const EMPTY: Record<string, UnitProgress> = {};

export function useActiveProgress(): Record<string, UnitProgress> {
  return useStore((s) => (s.activeId ? s.progress[s.activeId] ?? EMPTY : EMPTY));
}
