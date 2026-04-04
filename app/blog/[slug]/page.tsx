import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import React from "react"
import fs from "fs"
import path from "path"
import { Metadata, ResolvingMetadata } from "next"
import { MDXRemote } from "next-mdx-remote/rsc"
import matter from "gray-matter"
import dynamic from "next/dynamic"

// Dynamic import for CodeSandbox to avoid SSR issues with some browser-only APIs
const CodeSandbox = dynamic(() => import("@/components/CodeSandbox"), {
  ssr: false,
})

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
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

function getPostContent(slug: string) {
  const folder = "content"
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

export default async function BlogPage({ params }: Props) {
  const post = getPostContent(params.slug)

  if (!post) {
    return (
      <MaxWidthWrapper>
        <div className="py-20 text-center">
          <h1>Post not found</h1>
        </div>
      </MaxWidthWrapper>
    )
  }

  return (
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
  )
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = getPostContent(params.slug)
  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.metadata.title} - HeinerDevelops`,
    description: post.metadata.description || post.metadata.summary,
  }
}
