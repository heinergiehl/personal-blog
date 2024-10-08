import { MetadataRoute } from "next"
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://heinerdevelops.tech/"
  // get the filenames fro the content directory and remove the .md extension and use this as the url
  const fs = require("fs")
  const path = require("path")
  const contentDir = path.join(process.cwd(), "content")
  const filenames = fs.readdirSync(contentDir)
  const sitemapEntries = filenames.map((filename: string) => {
    return {
      url: `${baseUrl}${filename.replace(".md", "")}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }
  })
  return sitemapEntries
}
