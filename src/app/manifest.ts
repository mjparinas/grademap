import type { MetadataRoute } from "next";
import { APP_NAME } from "@/lib/brand";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_NAME,
    short_name: APP_NAME,
    description: "Curriculum practice, learning games and trophies for Kindergarten to Grade 12.",
    id: "/play/",
    start_url: "/play/",
    scope: "/",
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
