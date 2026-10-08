import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Runs as a normal Next.js server (pages are still pre-rendered where possible)
  // so the sync, account and billing APIs can live alongside the site.
  trailingSlash: true,
  images: { unoptimized: true },
  serverExternalPackages: ["@libsql/client", "libsql"],
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
