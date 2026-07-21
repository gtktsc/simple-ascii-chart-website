import type { MetadataRoute } from "next";
import { DOCUMENTATION_VERSIONS } from "../lib/documentationVersions.mjs";
import {
  documentationSurfaceRoute,
  documentationVersionRoute,
  examplesVersionRoute,
  playgroundVersionRoute,
  SITE_ROUTES,
} from "../lib/siteConstants";
import { toCanonicalAbsoluteUrl } from "../lib/seoMetadata";

const routes = [
  { path: SITE_ROUTES.home, priority: 1 },
  { path: SITE_ROUTES.usage, priority: 0.8 },
  { path: SITE_ROUTES.examples, priority: 0.8 },
  { path: SITE_ROUTES.documentation, priority: 0.8 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...routes.map((route) => ({
      changeFrequency: "monthly" as const,
      priority: route.priority,
      url: toCanonicalAbsoluteUrl(route.path),
    })),
    ...DOCUMENTATION_VERSIONS.flatMap(({ id: version, surfaces }) => [
      {
        changeFrequency: "monthly" as const,
        priority: 0.8,
        url: toCanonicalAbsoluteUrl(documentationVersionRoute(version)),
      },
      {
        changeFrequency: "monthly" as const,
        priority: 0.7,
        url: toCanonicalAbsoluteUrl(examplesVersionRoute(version)),
      },
      {
        changeFrequency: "monthly" as const,
        priority: 0.7,
        url: toCanonicalAbsoluteUrl(playgroundVersionRoute(version)),
      },
      ...surfaces.map((surface) => ({
        changeFrequency: "monthly" as const,
        priority: 0.7,
        url: toCanonicalAbsoluteUrl(
          documentationSurfaceRoute(version, surface),
        ),
      })),
    ]),
  ];
}
