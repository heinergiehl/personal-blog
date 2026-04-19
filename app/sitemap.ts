import { MetadataRoute } from "next"
import fs from "fs"
import path from "path"

import { projects } from "@/app/data/projects"
import SiteConfig from "@/config/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = `${SiteConfig.url.replace(/\/$/, "")}/`

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    {
      url: `${baseUrl}about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}feedback`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ]

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${baseUrl}${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: p.product ? 0.95 : 0.75,
  }))

  const contentDir = path.join(process.cwd(), "content")
  const filenames = fs.readdirSync(contentDir)
  const blogRoutes: MetadataRoute.Sitemap = filenames.map((filename: string) => ({
    url: `${baseUrl}${filename.replace(".md", "")}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...projectRoutes, ...blogRoutes]
}
