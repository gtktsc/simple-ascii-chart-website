import type { MetadataRoute } from "next";
import { SITE_ROUTES } from "../lib/siteConstants";
import { toCanonicalAbsoluteUrl } from "../lib/seoMetadata";

const routes = [
  { path: SITE_ROUTES.home, priority: 1 },
  { path: SITE_ROUTES.usage, priority: 0.8 },
  { path: SITE_ROUTES.examples, priority: 0.8 },
  { path: SITE_ROUTES.documentation, priority: 0.8 },
  { path: SITE_ROUTES.playground, priority: 0.7 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    changeFrequency: "monthly",
    priority: route.priority,
    url: toCanonicalAbsoluteUrl(route.path),
  }));
}
