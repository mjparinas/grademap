import type { MetadataRoute } from "next";
import { APP_NAME } from "@/lib/brand";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${APP_NAME} · Grade 2 BC`,
    short_name: APP_NAME,
    description: "Friendly Grade 2 practice matched to the BC curriculum.",
    start_url: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#fffaf1",
    theme_color: "#fffaf1",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
