import type { MetadataRoute } from "next";
import { allCurriculumPaths } from "@/components/site/curriculum";
import { FRAMEWORKS } from "@/content/frameworks";
import { absolute } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/report-cards/", priority: 0.6 },
    { path: "/privacy/", priority: 0.3 },
    { path: "/terms/", priority: 0.3 },
    ...FRAMEWORKS.map((f) => ({ path: `/report-cards/${f.slug}/`, priority: 0.9 })),
    ...allCurriculumPaths().map((path) => ({ path, priority: Math.max(0.5, 0.9 - (path.split("/").length - 3) * 0.1) })),
  ];
  return pages.map((p) => ({ url: absolute(p.path), changeFrequency: "monthly", priority: Number(p.priority.toFixed(1)) }));
}
