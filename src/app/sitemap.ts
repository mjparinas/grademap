import type { MetadataRoute } from "next";
import { allCurriculumPaths } from "@/components/site/curriculum";
import { allGuidePaths } from "@/components/site/guides";
import { FRAMEWORKS } from "@/content/frameworks";
import { absolute } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/report-cards/", priority: 0.6 },
    { path: "/pricing/", priority: 0.7 },
    { path: "/help/", priority: 0.6 },
    { path: "/contact/", priority: 0.4 },
    { path: "/privacy/", priority: 0.3 },
    { path: "/terms/", priority: 0.3 },
    ...FRAMEWORKS.map((f) => ({ path: `/report-cards/${f.slug}/`, priority: 0.9 })),
    ...allGuidePaths(),
    ...allCurriculumPaths().map((path) => ({ path, priority: Math.max(0.5, 0.9 - (path.split("/").length - 3) * 0.1) })),
  ];
  return pages.map((p) => ({ url: absolute(p.path), changeFrequency: "monthly", priority: Number(p.priority.toFixed(1)) }));
}
