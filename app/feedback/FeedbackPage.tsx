"use client"

import FeedbackForm from "@/components/feedback/FeedbackForm"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function FeedbackPage() {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const resolvedTheme = theme === "system" ? systemTheme : theme
  const isLightMode = mounted ? resolvedTheme === "light" : false

  return (
    <div className="min-h-screen relative">
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 max-w-xl mx-auto px-6 py-20 md:py-28">
        {/* Back link */}
        <Link
          href="/"
          className={cn(
            "inline-flex items-center gap-1.5 text-sm font-medium mb-12 transition-colors",
            isLightMode
              ? "text-gray-400 hover:text-gray-600"
              : "text-gray-600 hover:text-gray-400",
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div
              className={cn(
                "h-px w-10",
                isLightMode ? "bg-gray-300" : "bg-gray-700",
              )}
            />
            <span
              className={cn(
                "text-[11px] font-mono tracking-[0.25em] uppercase",
                isLightMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              Feedback
            </span>
          </div>

          <h1
            className={cn(
              "text-3xl md:text-4xl font-bold tracking-tight mb-3",
              isLightMode ? "text-gray-900" : "text-white",
            )}
            suppressHydrationWarning
          >
            Help me improve
          </h1>
          <p
            className={cn(
              "text-sm leading-relaxed",
              isLightMode ? "text-gray-500" : "text-gray-400",
            )}
          >
            Report a bug, suggest a feature, or ask a question about one of my
            products.
          </p>
        </div>

        <FeedbackForm />
      </div>
    </div>
  )
}
