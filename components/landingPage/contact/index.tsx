import { motion, useMotionValue, useSpring } from "framer-motion"
import { ArrowUpRight, Copy, Check } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

const EMAIL = "webdevislife2021@gmail.com"

const Contact = () => {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  // Magnetic button
  const btnRef = useRef<HTMLButtonElement>(null)
  const btnX = useMotionValue(0)
  const btnY = useMotionValue(0)
  const springX = useSpring(btnX, { stiffness: 180, damping: 18 })
  const springY = useSpring(btnY, { stiffness: 180, damping: 18 })

  useEffect(() => {
    setMounted(true)
  }, [])

  const resolvedTheme = theme === "system" ? systemTheme : theme
  const isLightMode = mounted ? resolvedTheme === "light" : false

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!btnRef.current) return
      const rect = btnRef.current.getBoundingClientRect()
      btnX.set((e.clientX - (rect.left + rect.width / 2)) * 0.12)
      btnY.set((e.clientY - (rect.top + rect.height / 2)) * 0.12)
    },
    [btnX, btnY],
  )

  const handleMouseLeave = useCallback(() => {
    btnX.set(0)
    btnY.set(0)
  }, [btnX, btnY])

  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    toast({
      duration: 2000,
      title: "Email copied!",
      description: "You can now paste it anywhere.",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.section
      id="Contact"
      className="relative flex flex-col items-center justify-center px-6 md:px-16 py-28 mt-24 mb-8 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Availability badge */}
        <motion.div
          className="inline-flex items-center gap-2 mb-8"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span
            className={cn(
              "text-[11px] font-mono tracking-[0.2em] uppercase",
              isLightMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            Available for new projects
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          className={cn(
            "text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6",
            isLightMode ? "text-gray-900" : "text-white",
          )}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          viewport={{ once: true }}
          suppressHydrationWarning
        >
          Let&apos;s work
          <span
            className={cn(
              "block font-mono text-2xl md:text-3xl mt-3 font-normal",
              isLightMode ? "text-indigo-600" : "text-indigo-400",
            )}
            suppressHydrationWarning
          >
            together.
          </span>
        </motion.h2>

        {/* One-liner */}
        <motion.p
          className={cn(
            "text-base md:text-lg leading-relaxed mb-12 max-w-md mx-auto",
            isLightMode ? "text-gray-500" : "text-gray-400",
          )}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          viewport={{ once: true }}
        >
          Have an idea, a project, or just want to say hi? Drop me a line — I
          typically reply within a day.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Primary — magnetic email button */}
          <motion.button
            ref={btnRef}
            onClick={() =>
              (window.location.href = `mailto:${EMAIL}`)
            }
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: springX, y: springY }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-semibold transition-all duration-300 cursor-pointer select-none",
              isLightMode
                ? "bg-gray-900 text-white shadow-lg shadow-gray-900/10 hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-500/20"
                : "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30 hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-500/20",
            )}
            suppressHydrationWarning
          >
            Send an email
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </motion.button>

          {/* Secondary — copy email */}
          <motion.button
            onClick={copyEmail}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border text-sm font-medium transition-all duration-300 cursor-pointer select-none",
              isLightMode
                ? "border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50"
                : "border-gray-800 text-gray-500 hover:border-indigo-500/30 hover:text-indigo-400 hover:bg-indigo-950/30",
            )}
            suppressHydrationWarning
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span className="font-mono text-xs">
              {copied ? "Copied!" : EMAIL}
            </span>
          </motion.button>
        </motion.div>

        {/* Feedback link */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <a
            href="/feedback"
            className={cn(
              "text-xs font-mono tracking-wide transition-colors",
              isLightMode
                ? "text-gray-400 hover:text-indigo-600"
                : "text-gray-600 hover:text-indigo-400",
            )}
          >
            Using one of my products? → Leave feedback
          </a>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default Contact
