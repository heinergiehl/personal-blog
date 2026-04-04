"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Check, ChevronDown, Send, ArrowLeft } from "lucide-react"
import Link from "next/link"

const PRODUCTS = [
  {
    id: "image-studio-pro",
    name: "Image Studio Pro",
    description: "In-panel image editor for Filament",
    url: "https://filamentphp.com/plugins/heiner-giehl-image-studio-pro",
  },
  {
    id: "rag-chatbot",
    name: "RAG Chatbot",
    description: "AI chatbot management for Laravel + Filament",
    url: "https://filamentphp.com/plugins/heiner-giehl-rag-chatbot",
  },
]

const CATEGORIES = [
  { id: "bug", label: "Bug Report", emoji: "🐛" },
  { id: "feature", label: "Feature Request", emoji: "💡" },
  { id: "question", label: "Question", emoji: "❓" },
  { id: "other", label: "Other", emoji: "💬" },
]

export default function FeedbackForm() {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [product, setProduct] = useState("")
  const [category, setCategory] = useState("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [step, setStep] = useState(1)

  useEffect(() => {
    setMounted(true)
  }, [])

  const resolvedTheme = theme === "system" ? systemTheme : theme
  const isLightMode = mounted ? resolvedTheme === "light" : false

  const canSubmit = product && category && message.trim().length > 10

  const handleSubmit = () => {
    if (!canSubmit) return

    const productName = PRODUCTS.find((p) => p.id === product)?.name ?? product
    const categoryLabel =
      CATEGORIES.find((c) => c.id === category)?.label ?? category

    const subject = encodeURIComponent(
      `[${productName}] ${categoryLabel}: Feedback`,
    )
    const body = encodeURIComponent(
      `Product: ${productName}\nCategory: ${categoryLabel}\n\n---\n\n${message}`,
    )

    window.location.href = `mailto:webdevislife2021@gmail.com?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center text-center py-20"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mb-6",
            isLightMode ? "bg-emerald-50" : "bg-emerald-950/40",
          )}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <Check
            className={cn(
              "w-8 h-8",
              isLightMode ? "text-emerald-600" : "text-emerald-400",
            )}
          />
        </motion.div>
        <h2
          className={cn(
            "text-2xl font-bold mb-3",
            isLightMode ? "text-gray-900" : "text-white",
          )}
          suppressHydrationWarning
        >
          Your email client should open now
        </h2>
        <p
          className={cn(
            "text-sm mb-8",
            isLightMode ? "text-gray-500" : "text-gray-400",
          )}
        >
          If it didn&apos;t, send your feedback directly to{" "}
          <span className="font-mono text-indigo-600 dark:text-indigo-400">
            webdevislife2021@gmail.com
          </span>
        </p>
        <Link
          href="/"
          className={cn(
            "inline-flex items-center gap-2 text-sm font-medium transition-colors",
            isLightMode
              ? "text-indigo-600 hover:text-indigo-700"
              : "text-indigo-400 hover:text-indigo-300",
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to portfolio
        </Link>
      </motion.div>
    )
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-10">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => {
                if (s === 1 || (s === 2 && product) || (s === 3 && product && category))
                  setStep(s)
              }}
              className={cn(
                "w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all duration-300",
                step >= s
                  ? isLightMode
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-500 text-white"
                  : isLightMode
                    ? "bg-gray-100 text-gray-400"
                    : "bg-gray-800 text-gray-600",
              )}
              suppressHydrationWarning
            >
              {step > s ? <Check className="w-3.5 h-3.5" /> : s}
            </button>
            {s < 3 && (
              <div
                className={cn(
                  "w-12 h-px",
                  step > s
                    ? isLightMode
                      ? "bg-indigo-600"
                      : "bg-indigo-500"
                    : isLightMode
                      ? "bg-gray-200"
                      : "bg-gray-800",
                )}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Product */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <h3
              className={cn(
                "text-lg font-bold mb-1",
                isLightMode ? "text-gray-900" : "text-white",
              )}
              suppressHydrationWarning
            >
              Which product?
            </h3>
            <p
              className={cn(
                "text-sm mb-6",
                isLightMode ? "text-gray-400" : "text-gray-500",
              )}
            >
              Select the plugin your feedback is about.
            </p>
            <div className="grid gap-3">
              {PRODUCTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setProduct(p.id)
                    setStep(2)
                  }}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all duration-200",
                    product === p.id
                      ? isLightMode
                        ? "border-indigo-400 bg-indigo-50/60 ring-1 ring-indigo-400/30"
                        : "border-indigo-500/50 bg-indigo-950/30 ring-1 ring-indigo-500/20"
                      : isLightMode
                        ? "border-gray-200 bg-white hover:border-gray-300"
                        : "border-gray-800 bg-gray-900/50 hover:border-gray-700",
                  )}
                  suppressHydrationWarning
                >
                  <div
                    className={cn(
                      "font-semibold text-sm",
                      isLightMode ? "text-gray-900" : "text-white",
                    )}
                    suppressHydrationWarning
                  >
                    {p.name}
                  </div>
                  <div
                    className={cn(
                      "text-xs mt-0.5",
                      isLightMode ? "text-gray-400" : "text-gray-500",
                    )}
                  >
                    {p.description}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Category */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <h3
              className={cn(
                "text-lg font-bold mb-1",
                isLightMode ? "text-gray-900" : "text-white",
              )}
              suppressHydrationWarning
            >
              What kind of feedback?
            </h3>
            <p
              className={cn(
                "text-sm mb-6",
                isLightMode ? "text-gray-400" : "text-gray-500",
              )}
            >
              This helps me prioritize and route your message.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCategory(c.id)
                    setStep(3)
                  }}
                  className={cn(
                    "text-left p-4 rounded-xl border transition-all duration-200",
                    category === c.id
                      ? isLightMode
                        ? "border-indigo-400 bg-indigo-50/60 ring-1 ring-indigo-400/30"
                        : "border-indigo-500/50 bg-indigo-950/30 ring-1 ring-indigo-500/20"
                      : isLightMode
                        ? "border-gray-200 bg-white hover:border-gray-300"
                        : "border-gray-800 bg-gray-900/50 hover:border-gray-700",
                  )}
                  suppressHydrationWarning
                >
                  <span className="text-lg">{c.emoji}</span>
                  <div
                    className={cn(
                      "font-medium text-sm mt-1",
                      isLightMode ? "text-gray-900" : "text-white",
                    )}
                    suppressHydrationWarning
                  >
                    {c.label}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Message */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <h3
              className={cn(
                "text-lg font-bold mb-1",
                isLightMode ? "text-gray-900" : "text-white",
              )}
              suppressHydrationWarning
            >
              Tell me more
            </h3>
            <p
              className={cn(
                "text-sm mb-6",
                isLightMode ? "text-gray-400" : "text-gray-500",
              )}
            >
              Describe the issue, idea, or question in detail.
            </p>

            {/* Context chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-mono",
                  isLightMode
                    ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                    : "bg-indigo-950/40 text-indigo-300 border border-indigo-500/30",
                )}
                suppressHydrationWarning
              >
                {PRODUCTS.find((p) => p.id === product)?.name}
              </span>
              <span
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-mono",
                  isLightMode
                    ? "bg-gray-50 text-gray-600 border border-gray-200"
                    : "bg-gray-800/60 text-gray-400 border border-gray-700",
                )}
                suppressHydrationWarning
              >
                {CATEGORIES.find((c) => c.id === category)?.emoji}{" "}
                {CATEGORIES.find((c) => c.id === category)?.label}
              </span>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe what happened, what you expected, or what you'd like to see..."
              rows={6}
              className={cn(
                "w-full rounded-xl border px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 transition-all duration-200",
                isLightMode
                  ? "border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:ring-indigo-500/30 focus:border-indigo-400"
                  : "border-gray-800 bg-gray-900/50 text-white placeholder-gray-600 focus:ring-indigo-500/30 focus:border-indigo-500/50",
              )}
              suppressHydrationWarning
            />

            {/* Destination email (read-only) */}
            <div className="mt-4">
              <label
                className={cn(
                  "text-[11px] font-mono tracking-wide uppercase mb-2 block",
                  isLightMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Feedback will be sent to
              </label>
              <input
                type="email"
                value="webdevislife2021@gmail.com"
                readOnly
                tabIndex={-1}
                className={cn(
                  "w-full rounded-lg border px-4 py-2.5 text-sm cursor-not-allowed select-all opacity-70",
                  isLightMode
                    ? "border-gray-200 bg-gray-50 text-gray-600"
                    : "border-gray-800 bg-gray-900/70 text-gray-400",
                )}
                suppressHydrationWarning
              />
            </div>

            {/* Submit */}
            <motion.button
              onClick={handleSubmit}
              disabled={!canSubmit}
              whileTap={canSubmit ? { scale: 0.97 } : undefined}
              className={cn(
                "mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300",
                canSubmit
                  ? isLightMode
                    ? "bg-gray-900 text-white hover:bg-indigo-600 shadow-md hover:shadow-lg cursor-pointer"
                    : "bg-white text-gray-900 hover:bg-indigo-500 hover:text-white shadow-md hover:shadow-lg cursor-pointer"
                  : isLightMode
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-800 text-gray-600 cursor-not-allowed",
              )}
              suppressHydrationWarning
            >
              <Send className="w-4 h-4" />
              Send feedback
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
