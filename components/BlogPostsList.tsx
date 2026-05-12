import { BlogCard } from "@/components/BlogCard"
import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import type { BlogPost } from "@/lib/blog"

export function BlogPostsList({ posts }: { posts: BlogPost[] }) {
  return (
    <main className="min-h-screen py-24">
      <MaxWidthWrapper className="my-0 px-4 sm:px-6 lg:px-8">
        <section className="mb-12 border-b border-border pb-10">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-600 dark:text-indigo-300">
            Engineering notes
          </p>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,760px)_1fr] lg:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl">
                Laravel, Filament and AI guides
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
                Practical notes on Filament plugins, Laravel admin panels, AI
                chatbots, RAG systems, workflow automation, and production web
                development.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card/60 p-4 text-sm text-muted-foreground dark:bg-card/30">
              <span className="font-semibold text-foreground">
                {posts.length} articles
              </span>{" "}
              covering product decisions, implementation tradeoffs, and
              operational details.
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <BlogCard key={post.slug} index={i} {...post} />
          ))}
        </section>
      </MaxWidthWrapper>
    </main>
  )
}
