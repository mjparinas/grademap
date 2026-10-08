import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: the whole site is plain HTML/CSS/JS, so it can be hosted
  // anywhere and later wrapped with Capacitor for the app stores.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    // This app lives in a subfolder of the repo, next to another app's lockfile.
    root: path.join(__dirname),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
