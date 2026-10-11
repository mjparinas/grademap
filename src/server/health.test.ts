import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

process.env.DATABASE_URL = `file:${join(mkdtempSync(join(tmpdir(), "grademap-health-")), "test.db")}`;

afterEach(() => {
  vi.doUnmock("@/server/db");
  vi.restoreAllMocks();
  vi.resetModules();
});

describe("GET /api/health", () => {
  it("answers 200 with a passing database check, uncached", async () => {
    const { GET } = await import("@/app/api/health/route");
    const res = await GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("no-store");
    const body = await res.json();
    expect(body.status).toBe("ok");
    expect(body.checks.database).toBe(true);
  });

  it("answers 503 and logs the reason when the database fails", async () => {
    vi.resetModules();
    vi.doMock("@/server/db", () => ({ query: vi.fn().mockRejectedValue(new Error("EROFS: read-only file system")) }));
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const { GET } = await import("@/app/api/health/route");
    const res = await GET();
    expect(res.status).toBe(503);
    expect(res.headers.get("cache-control")).toBe("no-store");
    const body = await res.json();
    expect(body.status).toBe("degraded");
    expect(body.checks.database).toBe(false);
    expect(error).toHaveBeenCalledWith("[health] database check failed", "EROFS: read-only file system");
  });
});
