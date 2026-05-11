import type { MetadataRoute } from "next"

import SiteConfig from "@/config/site"

export default function robots(): MetadataRoute.Robots {
  const base = SiteConfig.url.replace(/\/$/, "")

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/impressum", "/cookie-policy", "/privacy-policy", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
