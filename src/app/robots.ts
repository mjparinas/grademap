import type { MetadataRoute } from "next";
import { absolute } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    // The kids' app, parent area and API are private and personal; the public pages are for search.
    rules: { userAgent: "*", allow: "/", disallow: ["/play/", "/parents/", "/api/", "/account/", "/shared/", "/teachers/"] },
    sitemap: absolute("/sitemap.xml"),
  };
}
