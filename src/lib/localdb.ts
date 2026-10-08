"use client";

import type { AppEvent } from "./model";

// The on-device database (IndexedDB). Everything works offline from here;
// the sync engine copies unsynced events to the server when it can.
// Falls back to memory if IndexedDB is unavailable (e.g. some private modes).

const DB_NAME = "grademap";
const VERSION = 1;

export interface StoredEvent {
  event: AppEvent;
  id: string;
  profileId: string;
  /** 0 = waiting to upload, 1 = on the server. */
  synced: 0 | 1;
}

let dbPromise: Promise<IDBDatabase | null> | null = null;
const memory = { kv: new Map<string, unknown>(), events: new Map<string, StoredEvent>() };

function open(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === "undefined") return Promise.resolve(null);
  dbPromise ??= new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB_NAME, VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains("kv")) db.createObjectStore("kv");
        if (!db.objectStoreNames.contains("events")) {
          const store = db.createObjectStore("events", { keyPath: "id" });
          store.createIndex("profileId", "profileId");
          store.createIndex("synced", "synced");
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
      req.onblocked = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
  return dbPromise;
}

function tx<T>(store: string, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T> | void): Promise<T | undefined> {
  return open().then(
    (db) =>
      new Promise((resolve, reject) => {
        if (!db) return resolve(undefined);
        const t = db.transaction(store, mode);
        const req = fn(t.objectStore(store));
        t.oncomplete = () => resolve(req ? req.result : undefined);
        t.onerror = () => reject(t.error);
        t.onabort = () => reject(t.error);
      }),
  );
}

export async function getKV<T>(key: string): Promise<T | undefined> {
  const db = await open();
  if (!db) return memory.kv.get(key) as T | undefined;
  return tx<T>("kv", "readonly", (s) => s.get(key) as IDBRequest<T>);
}

export async function setKV(key: string, value: unknown): Promise<void> {
  const db = await open();
  if (!db) {
    memory.kv.set(key, value);
    return;
  }
  await tx("kv", "readwrite", (s) => {
    s.put(value, key);
  });
}

export async function putEvents(events: AppEvent[], synced: 0 | 1 = 0): Promise<void> {
  if (!events.length) return;
  const db = await open();
  const rows: StoredEvent[] = events.map((event) => ({ event, id: event.id, profileId: event.profileId, synced }));
  if (!db) {
    for (const r of rows) {
      const existing = memory.events.get(r.id);
      memory.events.set(r.id, existing ? { ...existing, synced: (existing.synced || synced) as 0 | 1 } : r);
    }
    return;
  }
  await tx("events", "readwrite", (s) => {
    for (const r of rows) {
      if (synced) s.put(r);
      else {
        // Don't downgrade an event that's already synced.
        const get = s.get(r.id);
        get.onsuccess = () => {
          if (!get.result) s.put(r);
        };
      }
    }
  });
}

export async function allEvents(): Promise<AppEvent[]> {
  const db = await open();
  if (!db) return [...memory.events.values()].map((r) => r.event);
  const rows = (await tx<StoredEvent[]>("events", "readonly", (s) => s.getAll() as IDBRequest<StoredEvent[]>)) ?? [];
  return rows.map((r) => r.event);
}

export async function unsyncedEvents(limit = 500): Promise<AppEvent[]> {
  const db = await open();
  if (!db) return [...memory.events.values()].filter((r) => !r.synced).slice(0, limit).map((r) => r.event);
  const rows =
    (await tx<StoredEvent[]>("events", "readonly", (s) => s.index("synced").getAll(0, limit) as IDBRequest<StoredEvent[]>)) ?? [];
  return rows.map((r) => r.event);
}

export async function markSynced(ids: string[]): Promise<void> {
  const db = await open();
  if (!db) {
    for (const id of ids) {
      const r = memory.events.get(id);
      if (r) r.synced = 1;
    }
    return;
  }
  await tx("events", "readwrite", (s) => {
    for (const id of ids) {
      const get = s.get(id);
      get.onsuccess = () => {
        if (get.result) s.put({ ...get.result, synced: 1 });
      };
    }
  });
}

export async function deleteProfileEvents(profileId: string): Promise<void> {
  const db = await open();
  if (!db) {
    for (const [id, r] of memory.events) if (r.profileId === profileId) memory.events.delete(id);
    return;
  }
  await tx("events", "readwrite", (s) => {
    const req = s.index("profileId").openCursor(IDBKeyRange.only(profileId));
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };
  });
}

export async function clearAll(): Promise<void> {
  memory.kv.clear();
  memory.events.clear();
  const db = await open();
  if (!db) return;
  await tx("kv", "readwrite", (s) => {
    s.clear();
  });
  await tx("events", "readwrite", (s) => {
    s.clear();
  });
}
