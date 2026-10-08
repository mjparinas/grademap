"use client";

import * as localdb from "./localdb";
import type { AppEvent, ChildSettings, FamilyInfo, Profile } from "./model";
import { useStore } from "./store";

// Offline-first sync. Everything is saved on the device first; whenever the
// device is online and a parent has signed in, unsent events go up and new
// ones (from other devices) come down. Safe to call as often as you like.

const BATCH = 500;
let running: Promise<void> | null = null;

interface SyncResponse {
  accepted: string[];
  cursor: number;
  more: boolean;
  events: AppEvent[];
  profiles: Profile[];
  settings: ChildSettings[];
  family?: FamilyInfo;
}

export function syncNow(): Promise<void> {
  running ??= doSync().finally(() => {
    running = null;
  });
  return running;
}

async function doSync(): Promise<void> {
  const store = useStore.getState();
  if (!store.ready) return;
  if (!store.family.account) {
    store.setSync({ status: "signed-out" });
    return;
  }
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    store.setSync({ status: "offline" });
    return;
  }
  store.setSync({ status: "syncing", error: undefined });
  try {
    for (let round = 0; round < 20; round++) {
      const state = useStore.getState();
      const events = await localdb.unsyncedEvents(BATCH);
      const res = await fetch("/api/sync/", {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          cursor: state.sync.cursor,
          events,
          profiles: state.profiles,
          settings: Object.values(state.settings),
        }),
      });
      if (res.status === 401) {
        state.setFamily({ account: undefined }, true);
        state.setSync({ status: "signed-out" });
        return;
      }
      if (!res.ok) throw new Error(`Sync failed (${res.status})`);
      const data = (await res.json()) as SyncResponse;
      await localdb.markSynced(data.accepted);
      useStore.getState().mergeRemote(data);
      useStore.getState().setSync({ cursor: data.cursor, lastSyncAt: Date.now(), dirtyProfiles: [], dirtyFamily: false });
      if (!data.more && events.length < BATCH) break;
    }
    useStore.getState().setSync({ status: "idle" });
  } catch (e) {
    useStore.getState().setSync({ status: navigator.onLine ? "error" : "offline", error: (e as Error).message });
  }
}

let started = false;

/** Keeps the device in sync in the background. */
export function startBackgroundSync() {
  if (started || typeof window === "undefined") return;
  started = true;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const soon = (ms = 4000) => {
    clearTimeout(timer);
    timer = setTimeout(() => void syncNow(), ms);
  };
  window.addEventListener("online", () => soon(500));
  window.addEventListener("offline", () => useStore.getState().setSync({ status: "offline" }));
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") soon(500);
    else void syncNow();
  });
  setInterval(() => void syncNow(), 120_000);
  // New progress gets uploaded a few seconds after it happens.
  useStore.subscribe((s, prev) => {
    if (s.events !== prev.events || s.profiles !== prev.profiles || s.settings !== prev.settings) soon();
  });
  soon(1000);
}
