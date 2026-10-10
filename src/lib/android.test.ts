import { describe, expect, it } from "vitest";
import { ANDROID_PACKAGE, assetLinks, parseFingerprints } from "./android";

const A = Array.from({ length: 32 }, (_, i) => i.toString(16).padStart(2, "0").toUpperCase()).join(":");
const B = Array.from({ length: 32 }, () => "AB").join(":");

describe("android asset links", () => {
  it("keeps valid fingerprints, tidies case and spaces, drops the rest", () => {
    expect(parseFingerprints(` ${A.toLowerCase()} , nope, ${B}`)).toEqual([A, B]);
    expect(parseFingerprints(undefined)).toEqual([]);
  });
  it("is an empty list with no fingerprint, and a full statement with one", () => {
    expect(assetLinks([])).toEqual([]);
    const [link] = assetLinks([A, B]);
    expect(link.relation).toEqual(["delegate_permission/common.handle_all_urls"]);
    expect(link.target).toEqual({ namespace: "android_app", package_name: ANDROID_PACKAGE, sha256_cert_fingerprints: [A, B] });
  });
  it("uses the same package id as the Bubblewrap config", async () => {
    const { readFileSync } = await import("node:fs");
    const twa = JSON.parse(readFileSync("android/twa-manifest.json", "utf8"));
    expect(twa.packageId).toBe(ANDROID_PACKAGE);
  });
});
