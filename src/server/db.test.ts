import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const ENV_KEYS = ["DATABASE_URL", "DATABASE_AUTH_TOKEN", "TURSO_DATABASE_URL", "TURSO_AUTH_TOKEN"] as const;

function setEnv(values: Partial<Record<(typeof ENV_KEYS)[number], string>>) {
  for (const key of ENV_KEYS) {
    if (values[key] === undefined) vi.stubEnv(key, undefined as unknown as string);
    else vi.stubEnv(key, values[key]);
  }
}

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.doUnmock("@libsql/client");
  vi.restoreAllMocks();
});

describe("databaseConfig", () => {
  it("prefers DATABASE_URL with DATABASE_AUTH_TOKEN", async () => {
    setEnv({ DATABASE_URL: "libsql://a.turso.io", DATABASE_AUTH_TOKEN: "a-token", TURSO_DATABASE_URL: "libsql://b.turso.io", TURSO_AUTH_TOKEN: "b-token" });
    const { databaseConfig } = await import("./db");
    expect(databaseConfig()).toEqual({ url: "libsql://a.turso.io", authToken: "a-token" });
  });

  it("falls back to the Vercel Marketplace TURSO_* pair", async () => {
    setEnv({ TURSO_DATABASE_URL: "libsql://b.turso.io", TURSO_AUTH_TOKEN: "b-token" });
    const { databaseConfig, databaseUrl } = await import("./db");
    expect(databaseConfig()).toEqual({ url: "libsql://b.turso.io", authToken: "b-token" });
    expect(databaseUrl()).toBe("libsql://b.turso.io");
  });

  it("never sends the Turso token to a different DATABASE_URL", async () => {
    setEnv({ DATABASE_URL: "libsql://a.turso.io", TURSO_DATABASE_URL: "libsql://b.turso.io", TURSO_AUTH_TOKEN: "b-token" });
    const { databaseConfig } = await import("./db");
    expect(databaseConfig()).toEqual({ url: "libsql://a.turso.io", authToken: undefined });
  });

  it("treats empty values as unset", async () => {
    setEnv({ DATABASE_URL: "", DATABASE_AUTH_TOKEN: "", TURSO_DATABASE_URL: "libsql://b.turso.io", TURSO_AUTH_TOKEN: "" });
    const { databaseConfig } = await import("./db");
    expect(databaseConfig()).toEqual({ url: "libsql://b.turso.io", authToken: undefined });
  });

  it("uses the local file when nothing is set", async () => {
    setEnv({});
    const { databaseConfig } = await import("./db");
    expect(databaseConfig()).toEqual({ url: "file:./data/grademap.db" });
  });
});

describe("db", () => {
  function fakeClient(failFirst: number) {
    let calls = 0;
    return {
      execute: vi.fn(async (sql: unknown) => {
        calls++;
        if (calls <= failFirst) throw new Error("network down");
        return { rows: typeof sql === "string" && sql.startsWith("PRAGMA") ? [] : [{ ok: 1 }], rowsAffected: 0 };
      }),
    };
  }

  it("passes the Turso pair to the client", async () => {
    setEnv({ TURSO_DATABASE_URL: "libsql://b.turso.io", TURSO_AUTH_TOKEN: "b-token" });
    const createClient = vi.fn(() => fakeClient(0));
    vi.doMock("@libsql/client", () => ({ createClient }));
    const { db } = await import("./db");
    await db();
    expect(createClient).toHaveBeenCalledWith({ url: "libsql://b.turso.io", authToken: "b-token" });
  });

  it("retries setup on the next call after a failure, and logs why it failed", async () => {
    setEnv({ DATABASE_URL: "libsql://a.turso.io", DATABASE_AUTH_TOKEN: "a-token" });
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const createClient = vi.fn().mockReturnValueOnce(fakeClient(1)).mockReturnValueOnce(fakeClient(0));
    vi.doMock("@libsql/client", () => ({ createClient }));
    const { db } = await import("./db");

    await expect(db()).rejects.toThrow("network down");
    expect(error).toHaveBeenCalledWith(expect.stringContaining("[db] setup failed"), "network down");

    await expect(db()).resolves.toBeDefined();
    expect(createClient).toHaveBeenCalledTimes(2);
    await db();
    expect(createClient).toHaveBeenCalledTimes(2);
  });

  it("concurrent callers share one failed attempt and one retry", async () => {
    setEnv({ DATABASE_URL: "libsql://a.turso.io" });
    vi.spyOn(console, "error").mockImplementation(() => {});
    const createClient = vi.fn().mockReturnValueOnce(fakeClient(1)).mockReturnValueOnce(fakeClient(0));
    vi.doMock("@libsql/client", () => ({ createClient }));
    const { db } = await import("./db");

    const results = await Promise.allSettled([db(), db(), db()]);
    expect(results.every((r) => r.status === "rejected")).toBe(true);
    expect(createClient).toHaveBeenCalledTimes(1);

    await Promise.all([db(), db()]);
    expect(createClient).toHaveBeenCalledTimes(2);
  });

  it("says so in the logs when production falls back to the local file", async () => {
    setEnv({});
    vi.stubEnv("NODE_ENV", "production");
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.doMock("@libsql/client", () => ({ createClient: vi.fn(() => fakeClient(0)) }));
    const { db } = await import("./db");
    await db();
    expect(error).toHaveBeenCalledWith(expect.stringContaining("DATABASE_URL and TURSO_DATABASE_URL are both unset"));
  });
});
