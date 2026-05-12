import { getBlogPosts } from "@/lib/blog"
import { BlogPostsList } from "@/components/BlogPostsList"
import SiteConfig from "@/config/site"

export const metadata = {
  title: "Laravel, Filament and AI Development Blog",
  description:
    "Practical guides on Laravel, Filament plugins, AI chatbots, RAG, workflow automation, and modern web development.",
  alternates: {
    canonical: `${SiteConfig.url}/blog`,
  },
  openGraph: {
    title: "Laravel, Filament and AI Development Blog",
    description:
      "Practical guides on Laravel, Filament plugins, AI chatbots, RAG, workflow automation, and modern web development.",
    url: `${SiteConfig.url}/blog`,
    siteName: "Heiner Giehl",
    type: "website",
  },
}

export default async function BlogPage() {
  const posts = getBlogPosts()

  return <BlogPostsList posts={posts} />
}
