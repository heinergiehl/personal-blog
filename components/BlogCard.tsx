import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CalendarDays, FileText } from "lucide-react"

import type { BlogPost } from "@/lib/blog"
import { cn, formatDate } from "@/lib/utils"

interface BlogCardProps extends BlogPost {
  index: number
}

function formatDateOrNull(input?: string) {
  if (!input) return null

  const time = new Date(input).getTime()
  if (Number.isNaN(time)) return null

  return formatDate(input)
}

function PlaceholderThumbnail({ title }: { title: string }) {
  const initials = title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()

  return (
    <div className="flex h-full w-full flex-col justify-between bg-slate-100 p-5 dark:bg-slate-950">
      <div className="flex items-center justify-between">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          <FileText className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="rounded-md border border-slate-300 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:border-slate-700 dark:text-slate-400">
          Guide
        </span>
      </div>
      <div>
        <div className="text-5xl font-black tracking-tight text-slate-300 dark:text-slate-800">
          {initials || "HG"}
        </div>
        <div className="mt-4 h-2 w-28 rounded-full bg-indigo-500/60" />
        <div className="mt-2 h-2 w-40 rounded-full bg-cyan-500/45" />
      </div>
    </div>
  )
}

export function BlogCard({
  slug,
  title,
  summary,
  publishedAt,
  imageUrl,
  readingTime,
  index,
}: BlogCardProps) {
  const formattedDate = formatDateOrNull(publishedAt)

  return (
    <Link
      href={`/blog/${slug}`}
      transitionTypes={["nav-forward"]}
      className="group block h-full"
    >
      <article
        className={cn(
          "flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10 dark:bg-card/70 dark:hover:border-indigo-500/50",
          index === 0 && "lg:col-span-2",
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden border-b border-border bg-slate-50 dark:bg-slate-950",
            index === 0 ? "aspect-[16/7] lg:aspect-[21/8]" : "aspect-video",
          )}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${title} thumbnail`}
              fill
              sizes={
                index === 0
                  ? "(min-width: 1024px) 768px, 100vw"
                  : "(min-width: 1024px) 384px, (min-width: 768px) 50vw, 100vw"
              }
              className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <PlaceholderThumbnail title={title} />
          )}
        </div>

        <div className="flex flex-1 flex-col p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              {formattedDate ? (
                <time dateTime={publishedAt}>{formattedDate}</time>
              ) : (
                <span>Article</span>
              )}
            </span>
            <span aria-hidden="true">/</span>
            <span>{readingTime} min read</span>
          </div>

          <h2 className="mt-4 text-xl font-bold leading-tight tracking-tight text-foreground transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-300 md:text-2xl">
            {title}
          </h2>

          <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
            {summary}
          </p>

          <div className="mt-auto pt-6">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition-colors group-hover:text-cyan-600 dark:text-indigo-300 dark:group-hover:text-cyan-200">
              Read article
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
