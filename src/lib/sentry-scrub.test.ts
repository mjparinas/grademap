import type { ErrorEvent } from "@sentry/nextjs";
import { describe, expect, it } from "vitest";
import { scrubEvent, scrubText } from "./sentry-scrub";

describe("error report scrubbing", () => {
  it("removes emails and one-time tokens from text", () => {
    expect(scrubText("failed for maya.parent@example.com")).toBe("failed for [email]");
    expect(scrubText("/account/reset/?token=abc123&x=1")).toBe("/account/reset/?token=[removed]&x=1");
  });

  it("drops people, bodies, cookies and tap breadcrumbs", () => {
    const event = {
      type: undefined,
      user: { email: "a@b.co", ip_address: "1.2.3.4" },
      request: { url: "https://x.test/a?token=zzz", data: { name: "Maya" }, cookies: { gm_session: "s" }, headers: { cookie: "s" }, query_string: "token=zzz" },
      message: "oops a@b.co",
      exception: { values: [{ value: "bad token=zzz for a@b.co" }] },
      breadcrumbs: [
        { category: "ui.click", message: "button.Maya" },
        { category: "navigation", message: "to /parents/?token=zzz", data: { from: "x" } },
      ],
    } as unknown as ErrorEvent;
    const out = scrubEvent(event)!;
    expect(out.user).toBeUndefined();
    expect(out.request).toEqual({ url: "https://x.test/a?token=[removed]" });
    expect(out.message).toBe("oops [email]");
    expect(out.exception?.values?.[0].value).toBe("bad token=[removed] for [email]");
    expect(out.breadcrumbs).toEqual([{ category: "navigation", message: "to /parents/?token=[removed]", data: undefined }]);
  });
});
