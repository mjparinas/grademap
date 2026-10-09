import { query } from "@/server/db";

// Uptime check. Returns 200 when the app and its database answer, 503 otherwise.
// Public and cheap: one `SELECT 1`, no user data, never cached. Point an external monitor
// or .github/workflows/uptime.yml at /api/health/ (the trailing slash matters).

export const dynamic = "force-dynamic";

const HEADERS = { "Cache-Control": "no-store", "Content-Type": "application/json" };

export async function GET() {
  const started = Date.now();
  let database = false;
  try {
    const rows = await query<{ ok: number }>("SELECT 1 AS ok");
    database = Number(rows[0]?.ok) === 1;
  } catch {
    database = false;
  }
  const ok = database;
  return new Response(JSON.stringify({ status: ok ? "ok" : "degraded", checks: { database }, ms: Date.now() - started }), {
    status: ok ? 200 : 503,
    headers: HEADERS,
  });
}

export const HEAD = GET;
