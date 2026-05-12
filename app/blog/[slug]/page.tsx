import React from "react"
import fs from "fs"
import path from "path"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import matter from "gray-matter"
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  UserRound,
} from "lucide-react"

import CodeSandbox from "@/components/CodeSandboxClient"
import SiteConfig from "@/config/site"
import { cn, formatDate } from "@/lib/utils"

function textFromNode(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node)
  }

  if (Array.isArray(node)) {
    return node.map(textFromNode).join("")
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return textFromNode(node.props.children)
  }

  return ""
}

function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .replace(/[`*_~]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

function estimateReadingTime(content: string) {
  const words = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]+>/g, "")
    .split(/\s+/)
    .filter(Boolean).length

  return Math.max(1, Math.ceil(words / 220))
}

function cleanMarkdownHeading(value: string) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*_#]/g, "")
    .trim()
}

function extractHeadings(content: string) {
  return [...content.matchAll(/^##\s+(.+)$/gm)]
    .map((match) => cleanMarkdownHeading(match[1]))
    .filter(Boolean)
    .map((title) => ({
      title,
      id: slugifyHeading(title),
    }))
}

function stripLeadingArticleTitle(content: string) {
  const lines = content.split(/\r?\n/)
  const firstContentIndex = lines.findIndex((line) => line.trim().length > 0)

  if (firstContentIndex === -1) return content

  const firstLine = lines[firstContentIndex].trim()
  if (!firstLine.startsWith("# ")) return content

  return [
    ...lines.slice(0, firstContentIndex),
    ...lines.slice(firstContentIndex + 1),
  ].join("\n")
}

function BlogMarkdownLink({ href = "", children }: any) {
  const className =
    "font-medium text-indigo-600 underline decoration-indigo-300 underline-offset-4 transition-colors hover:text-cyan-600 dark:text-indigo-300 dark:decoration-indigo-500/50 dark:hover:text-cyan-200"

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className} transitionTypes={["nav-forward"]}>
        {children}
      </Link>
    )
  }

  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  )
}

const components = {
  CodeSandbox,
  h1: ({ children, ...props }: any) => (
    <h2
      className="mt-14 text-3xl font-bold tracking-tight text-slate-950 dark:text-white"
      {...props}
    >
      {children}
    </h2>
  ),
  h2: ({ children, ...props }: any) => {
    const id = slugifyHeading(textFromNode(children))

    return (
      <h2
        id={id}
        className="scroll-mt-28 pt-10 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl"
        {...props}
      >
        {children}
      </h2>
    )
  },
  h3: ({ children, ...props }: any) => (
    <h3
      className="pt-8 text-xl font-semibold tracking-tight text-slate-950 dark:text-white"
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ children, ...props }: any) => (
    <p
      className="mt-5 text-[17px] leading-8 text-slate-700 dark:text-slate-300"
      {...props}
    >
      {children}
    </p>
  ),
  a: BlogMarkdownLink,
  strong: ({ children, ...props }: any) => (
    <strong className="font-semibold text-slate-950 dark:text-white" {...props}>
      {children}
    </strong>
  ),
  ul: ({ children, ...props }: any) => (
    <ul className="mt-5 space-y-3 pl-6 text-[17px] leading-8" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="mt-5 space-y-3 pl-6 text-[17px] leading-8" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li
      className="pl-2 text-slate-700 marker:text-indigo-500 dark:text-slate-300"
      {...props}
    >
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: any) => (
    <blockquote
      className="my-8 border-l-4 border-indigo-500 bg-indigo-50/70 px-5 py-4 text-slate-800 dark:bg-indigo-500/10 dark:text-slate-200"
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({ className, children, ...props }: any) => {
    const isBlock = className?.includes("language-")

    return (
      <code
        className={cn(
          !isBlock &&
            "rounded-md border border-border bg-muted px-1.5 py-0.5 text-[0.9em] font-semibold text-slate-900 dark:text-slate-100",
          className,
        )}
        {...props}
      >
        {children}
      </code>
    )
  },
  pre: ({ children, ...props }: any) => (
    <pre
      className="my-7 overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-5 text-sm leading-7 text-slate-100 shadow-sm"
      {...props}
    >
      {children}
    </pre>
  ),
  table: ({ children, ...props }: any) => (
    <div className="my-8 overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[640px] text-left text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: any) => (
    <th
      className="border-b border-border bg-muted px-4 py-3 font-semibold"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td
      className="border-b border-border px-4 py-3 text-slate-700 dark:text-slate-300"
      {...props}
    >
      {children}
    </td>
  ),
  hr: (props: any) => <hr className="my-10 border-border" {...props} />,
  img: ({ src, alt, ...props }: any) => (
    <img
      src={src}
      alt={alt ?? ""}
      className="my-8 rounded-lg border border-border shadow-sm"
      loading="lazy"
      {...props}
    />
  ),
}

type Props = {
  params: Promise<{ slug: string }>
}

function getContentSlugs() {
  const folder = path.join(process.cwd(), "content")
  if (!fs.existsSync(folder)) return []

  return fs
    .readdirSync(folder)
    .filter((filename) => filename.endsWith(".md") || filename.endsWith(".mdx"))
    .map((filename) => ({
      slug: filename.replace(/\.mdx?$/, ""),
    }))
}

function getPostContent(slug: string) {
  const folder = path.join(process.cwd(), "content")
  const mdxPath = path.join(folder, `${slug}.mdx`)
  const mdPath = path.join(folder, `${slug}.md`)

  let filePath = ""
  if (fs.existsSync(mdxPath)) {
    filePath = mdxPath
  } else if (fs.existsSync(mdPath)) {
    filePath = mdPath
  } else {
    return null
  }

  const fileContent = fs.readFileSync(filePath, "utf-8")
  const { data, content } = matter(fileContent)
  return { metadata: data, content }
}

function absoluteUrl(pathname: string) {
  const base = SiteConfig.url.replace(/\/$/, "")
  return `${base}${pathname.startsWith("/") ? pathname : `/${pathname}`}`
}

export function generateStaticParams() {
  return getContentSlugs()
}

function ArticleJsonLd({
  slug,
  metadata,
}: {
  slug: string
  metadata: Record<string, any>
}) {
  const publishedAt = metadata.publishedAt ?? metadata.date
  const articleJson = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: metadata.title,
    description: metadata.description ?? metadata.summary,
    datePublished: publishedAt,
    dateModified: publishedAt,
    author: {
      "@type": "Person",
      name: "Heiner Giehl",
      url: SiteConfig.url,
    },
    mainEntityOfPage: absoluteUrl(`/blog/${slug}`),
    image: metadata.imageUrl ? absoluteUrl(metadata.imageUrl) : undefined,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJson) }}
    />
  )
}

export default async function BlogPage({ params }: Props) {
  const { slug } = await params
  const post = getPostContent(slug)

  if (!post) {
    notFound()
  }

  const title = String(post.metadata.title ?? slug)
  const description = String(
    post.metadata.description ?? post.metadata.summary ?? "",
  )
  const publishedAt = post.metadata.publishedAt ?? post.metadata.date
  const articleContent = stripLeadingArticleTitle(post.content)
  const headings = extractHeadings(articleContent)
  const readingTime = estimateReadingTime(articleContent)
  const imageUrl = post.metadata.imageUrl as string | undefined

  return (
    <>
      <ArticleJsonLd slug={slug} metadata={post.metadata} />
      <main className="min-h-screen w-full">
        <section className="border-b border-border/60 bg-background/55 backdrop-blur-sm">
          <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-24 sm:px-6 lg:px-8">
            <Link
              href="/blog"
              transitionTypes={["nav-back"]}
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-indigo-600 dark:hover:text-indigo-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to blog
            </Link>

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,760px)_260px]">
              <div>
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-600 dark:text-indigo-300">
                  Laravel / Filament / AI
                </p>
                <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
                  {title}
                </h1>
                {description && (
                  <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                    {description}
                  </p>
                )}
                <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted-foreground">
                  {publishedAt && (
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      <time dateTime={publishedAt}>
                        {formatDate(publishedAt)}
                      </time>
                    </span>
                  )}
                  <span className="inline-flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {readingTime} min read
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <UserRound className="h-4 w-4" />
                    Heiner Giehl
                  </span>
                </div>
              </div>

              <aside className="hidden border-l border-border pl-5 lg:block">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Article
                </p>
                <dl className="mt-5 space-y-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Focus</dt>
                    <dd className="mt-1 font-semibold text-foreground">
                      Laravel plugins
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Format</dt>
                    <dd className="mt-1 font-semibold text-foreground">
                      Implementation guide
                    </dd>
                  </div>
                </dl>
              </aside>
            </div>
          </div>
        </section>

        {imageUrl && (
          <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-slate-50 shadow-sm dark:bg-slate-950">
              <Image
                src={imageUrl}
                alt={`${title} cover image`}
                fill
                priority
                sizes="(min-width: 1024px) 1152px, 100vw"
                className="object-contain"
              />
            </div>
          </section>
        )}

        <section className="mx-auto grid w-full max-w-6xl gap-12 px-4 pb-16 pt-4 sm:px-6 lg:grid-cols-[minmax(0,760px)_260px] lg:px-8">
          <article className="min-w-0">
            <MDXRemote
              source={articleContent}
              components={components}
              options={{
                parseFrontmatter: true,
                mdxOptions: {
                  // Add plugins here if needed (e.g., rehype-pretty-code)
                  // remarkPlugins: [],
                  // rehypePlugins: [[rehypePrettyCode, ...]]
                },
              }}
            />
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-28 border-l border-border pl-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                On this page
              </p>
              {headings.length > 0 ? (
                <nav className="mt-4 space-y-3">
                  {headings.map((heading) => (
                    <a
                      key={heading.id}
                      href={`#${heading.id}`}
                      className="block text-sm leading-6 text-muted-foreground transition-colors hover:text-indigo-600 dark:hover:text-indigo-300"
                    >
                      {heading.title}
                    </a>
                  ))}
                </nav>
              ) : (
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  A short read with no section navigation.
                </p>
              )}
            </div>
          </aside>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Building with Laravel and Filament?
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Compare the commercial plugin options and related implementation
                guides.
              </p>
            </div>
            <Link
              href="/filament-plugins"
              transitionTypes={["nav-forward"]}
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition-colors hover:text-cyan-600 dark:text-indigo-300 dark:hover:text-cyan-200"
            >
              Browse plugins
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostContent(slug)
  if (!post) {
    return {
      title: "Post Not Found",
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const title = post.metadata.title
  const description = post.metadata.description || post.metadata.summary
  const image = post.metadata.imageUrl
    ? absoluteUrl(post.metadata.imageUrl)
    : undefined

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(`/blog/${slug}`),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/blog/${slug}`),
      siteName: "Heiner Giehl",
      type: "article",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}
