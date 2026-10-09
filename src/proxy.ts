import { NextResponse, type NextRequest } from "next/server";
import { noncePolicy } from "@/lib/csp.mjs";

// Shared reports are rendered on every request, so they can't be hashed at build time like the
// other pages. Next.js reads the nonce from the request's policy and puts it on its own scripts.
export function proxy(request: NextRequest) {
  if (process.env.NODE_ENV === "development") return NextResponse.next(); // next.config.ts sets a dev policy
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const policy = noncePolicy(nonce);
  const headers = new Headers(request.headers);
  headers.set("Content-Security-Policy", policy);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set("Content-Security-Policy", policy);
  return response;
}

export const config = { matcher: "/shared/:path*" };
