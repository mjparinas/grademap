import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// next/link changes a hash-only href with history.pushState, which never fires "hashchange",
// so the hash router (src/lib/router.ts) doesn't notice and the tap seems to do nothing.
// Links to a hash route must be plain <a> tags.
describe("hash routes in the kids' and parent apps", () => {
  const dirs = ["play", "parents"].map((d) => join(__dirname, "..", d));
  const files = dirs.flatMap((dir) => readdirSync(dir).filter((f) => f.endsWith(".tsx") && !f.endsWith(".test.tsx")).map((f) => join(dir, f)));

  it.each(files)("%s has no next/link pointing at a #/ route", (file) => {
    const source = readFileSync(file, "utf8");
    const bad = [...source.matchAll(/<Link\b[^>]*?href=(?:\{`|")#\//g)];
    expect(bad).toHaveLength(0);
  });
});
