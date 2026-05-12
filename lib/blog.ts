import fs from "fs"
import path from "path"
import matter from "gray-matter"

export interface BlogPost {
  slug: string
  title: string
  summary: string
  publishedAt?: string
  imageUrl?: string
  readingTime: number
}

function estimateReadingTime(content: string) {
  const words = content
    .replace(/---[\s\S]*?---/, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]+>/g, "")
    .split(/\s+/)
    .filter(Boolean).length

  return Math.max(1, Math.ceil(words / 220))
}

function getSortTime(date?: string) {
  if (!date) return 0

  const time = new Date(date).getTime()
  return Number.isNaN(time) ? 0 : time
}

export function getBlogPosts(): BlogPost[] {
  const contentDir = path.join(process.cwd(), "content")
  if (!fs.existsSync(contentDir)) return []

  const files = fs.readdirSync(contentDir)

  const posts = files
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .map((file) => {
      const filePath = path.join(contentDir, file)
      const content = fs.readFileSync(filePath, "utf-8")
      const { data } = matter(content)
      const slug = file.replace(/\.mdx?$/, "")
      const publishedAt = data.publishedAt ?? data.date

      return {
        slug,
        title: data.title,
        summary: data.summary ?? data.description ?? "",
        publishedAt,
        imageUrl: data.imageUrl,
        readingTime: estimateReadingTime(content),
      } as BlogPost
    })
    .sort((a, b) => getSortTime(b.publishedAt) - getSortTime(a.publishedAt))

  return posts
}
