import { getBlogPosts } from "@/lib/blog"
import { BlogPostsList } from "@/components/BlogPostsList"

export const metadata = {
    title: "Blog - HeinerDevelops",
    description: "Thoughts on development, design, and tech.",
}

export default async function BlogPage() {
    const posts = getBlogPosts()

    return (
        <BlogPostsList posts={posts} />
    )
}
