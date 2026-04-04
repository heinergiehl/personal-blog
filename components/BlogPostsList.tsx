"use client"

import { motion } from "framer-motion"
import { BlogCard } from "@/components/BlogCard"
import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { BlogPost } from "@/lib/blog"

export function BlogPostsList({ posts }: { posts: BlogPost[] }) {
    const { theme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])
    const isLight = mounted && theme === "light"

    return (
        <div className="relative min-h-screen py-24 overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-200/20 via-background to-background dark:from-indigo-950/20 dark:via-background dark:to-background" />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                    className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[100px]"
                />
            </div>

            <MaxWidthWrapper>
                {/* Header */}
                <div className="relative mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                            Writing & <span className="text-indigo-500 dark:text-indigo-400">Insights</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                            Exploring the intersection of design, engineering, and user experience.
                            Deep dives into modern web technologies.
                        </p>
                    </motion.div>
                </div>

                {/* Blog Grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post, i) => (
                        <BlogCard
                            key={post.slug}
                            index={i}
                            {...post}
                        />
                    ))}
                </div>
            </MaxWidthWrapper>
        </div>
    )
}
