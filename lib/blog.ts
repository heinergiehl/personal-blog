import fs from "fs"
import path from "path"
import matter from "gray-matter"

export interface BlogPost {
    slug: string
    title: string
    summary: string
    publishedAt: string
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

            return {
                slug,
                title: data.title,
                summary: data.summary,
                publishedAt: data.publishedAt,
            } as BlogPost
        })
        .sort((a, b) => (new Date(b.publishedAt) > new Date(a.publishedAt) ? 1 : -1))

    return posts
}
