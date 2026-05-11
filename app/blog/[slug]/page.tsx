import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import React from "react"
import fs from "fs"
import path from "path"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import matter from "gray-matter"
import CodeSandbox from "@/components/CodeSandboxClient"
import SiteConfig from "@/config/site"

// Define available components for MDX
const components = {
  CodeSandbox,
  h1: (props: any) => (
    <h1 className="font-medium pt-12 mb-0 fade-in" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="text-gray-800 font-medium mt-8 mb-3" {...props} />
  ),
  // Add other components as needed or reuse useMDXComponents
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

  return (
    <>
      <ArticleJsonLd slug={slug} metadata={post.metadata} />
      <MaxWidthWrapper className="prose dark:prose-invert max-w-none">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex-1 px-4 md:px-0">
            <h1 className="mb-8">{post.metadata.title}</h1>
            <MDXRemote
              source={post.content}
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
          </div>
          {/* <Onthispage /> logic would need to be re-implemented for MDXRemote if needed */}
        </div>
      </MaxWidthWrapper>
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
