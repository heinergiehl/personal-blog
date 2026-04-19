import { MetadataRoute } from "next"
import fs from "fs"
import path from "path"

import { projects } from "@/app/data/projects"
import SiteConfig from "@/config/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SiteConfig.url.replace(/\/$/, "")

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/feedback`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ]

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${base}/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    // Product pages rank higher — they're the commercial landing pages
    priority: p.product ? 0.95 : 0.7,
  }))

  const contentDir = path.join(process.cwd(), "content")
  let blogRoutes: MetadataRoute.Sitemap = []
  if (fs.existsSync(contentDir)) {
    const filenames = fs.readdirSync(contentDir)
    blogRoutes = filenames
      .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
      .map((filename) => {
        const slug = filename.replace(/\.mdx?$/, "")
        return {
          url: `${base}/blog/${slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly" as const,
          priority: 0.65,
        }
      })
  }

  return [...staticRoutes, ...projectRoutes, ...blogRoutes]
}
