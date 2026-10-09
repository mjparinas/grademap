import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { addPolicyMeta, DEV_POLICY, HEADER_POLICY, inlineHashes, noncePolicy, pagePolicy } from "./csp.mjs";

const hash = (s: string) => `'sha256-${createHash("sha256").update(s, "utf8").digest("base64")}'`;

const PAGE =
  '<!DOCTYPE html><html><head><meta charSet="utf-8"/><meta name="viewport" content="width=device-width"/>' +
  '<script src="/_next/a.js" async=""></script>' +
  '<script type="application/ld+json">{"a":1}</script>' +
  '<script>self.__next_f.push([1,"<div style=\\"color:red\\">"])</script>' +
  '</head><body><div style="height:10px;background:url(&quot;x.png&quot;)">hi</div><p style="">x</p>' +
  '<style>:root{--a:1}</style></body></html>';

describe("inlineHashes", () => {
  const found = inlineHashes(PAGE);

  it("hashes inline scripts only, not external scripts or JSON-LD", () => {
    expect(found.scripts).toEqual([hash('self.__next_f.push([1,"<div style=\\"color:red\\">"])')]);
  });

  it("hashes <style> elements", () => {
    expect(found.styles).toEqual([hash(":root{--a:1}")]);
  });

  it("hashes style attributes after decoding entities, and ignores markup inside script text", () => {
    expect(found.styleAttrs).toContain(hash('height:10px;background:url("x.png")'));
    expect(found.styleAttrs).not.toContain(hash("color:red"));
  });
});

describe("pagePolicy", () => {
  it("never allows unsafe-inline or unsafe-eval", () => {
    expect(pagePolicy(inlineHashes(PAGE))).not.toMatch(/unsafe-inline|unsafe-eval/);
  });

  it("blocks style attributes when a page has none", () => {
    expect(pagePolicy({ scripts: [], styles: [], styleAttrs: [] })).toContain("style-src-attr 'none'");
  });
});

describe("addPolicyMeta", () => {
  it("puts the tag straight after the charset, before any script", () => {
    const out = addPolicyMeta(PAGE);
    expect(out.indexOf("Content-Security-Policy")).toBeGreaterThan(out.indexOf("charSet"));
    expect(out.indexOf("Content-Security-Policy")).toBeLessThan(out.indexOf("<script"));
  });

  it("is safe to run twice", () => {
    const once = addPolicyMeta(PAGE);
    expect(addPolicyMeta(once)).toBe(once);
    expect(once.match(/http-equiv="Content-Security-Policy"/g)).toHaveLength(1);
  });

  it("does not hash its own tag", () => {
    expect(inlineHashes(addPolicyMeta(PAGE))).toEqual(inlineHashes(PAGE));
  });
});

describe("header and dynamic policies", () => {
  it("keeps frame-ancestors in the header, where a <meta> tag can't set it", () => {
    expect(HEADER_POLICY).toContain("frame-ancestors 'none'");
  });

  it("leaves script control to the page, so the header can't override its hashes", () => {
    expect(HEADER_POLICY).not.toMatch(/default-src|script-src|style-src/);
  });

  it("uses a nonce, not unsafe-inline, for dynamic pages", () => {
    const p = noncePolicy("abc");
    expect(p).toContain("'nonce-abc'");
    expect(p).not.toMatch(/unsafe-inline/);
  });

  it("only the development policy is permissive", () => {
    expect(DEV_POLICY).toContain("'unsafe-inline'");
  });
});
