import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/siteConstants";
import { toCanonicalAbsoluteUrl } from "../lib/seoMetadata";

export default function robots(): MetadataRoute.Robots {
  return {
    host: SITE_URL,
    rules: {
      allow: "/",
      disallow: "/api",
      userAgent: "*",
    },
    sitemap: toCanonicalAbsoluteUrl("/sitemap.xml"),
  };
}
