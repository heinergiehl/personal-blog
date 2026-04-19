"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { formatDate } from "@/lib/utils"

interface BlogCardProps {
    slug: string
    title: string
    summary: string
    publishedAt: string
    index: number
}

export function BlogCard({ slug, title, summary, publishedAt, index }: BlogCardProps) {
    const { theme } = useTheme()
    const isLight = theme === "light"

    return (
        <Link href={`/blog/${slug}`} transitionTypes={["nav-forward"]}>
            <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={cn(
                    "group relative flex flex-col justify-between h-full p-6 md:p-8 rounded-2xl overflow-hidden border transition-all duration-300",
                    isLight
                        ? "bg-white/50 border-white/40 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10"
                        : "bg-slate-900/40 border-slate-800/60 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10"
                )}
            >
                {/* Glassmorphism Background */}
                <div className="absolute inset-0 backdrop-blur-sm -z-10" />

                {/* Gradient Blur Effect on Hover */}
                <div
                    className={cn(
                        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10",
                        isLight
                            ? "bg-gradient-to-br from-indigo-50/50 via-blue-50/30 to-purple-50/50"
                            : "bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-cyan-500/5"
                    )}
                />

                <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground/80">
                        <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
                        <span>•</span>
                        <span>5 min read</span>
                    </div>

                    <h2 className={cn(
                        "text-2xl font-bold tracking-tight transition-colors",
                        isLight ? "text-slate-800 group-hover:text-indigo-600" : "text-slate-100 group-hover:text-indigo-400"
                    )}>
                        {title}
                    </h2>

                    <p className={cn(
                        "leading-relaxed line-clamp-3",
                        isLight ? "text-slate-600" : "text-slate-400"
                    )}>
                        {summary}
                    </p>
                </div>

                <div className={cn(
                    "mt-6 flex items-center text-sm font-medium transition-colors",
                    isLight ? "text-indigo-600 group-hover:text-indigo-700" : "text-indigo-400 group-hover:text-indigo-300"
                )}>
                    Read Article
                    <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
            </motion.article>
        </Link>
    )
}
