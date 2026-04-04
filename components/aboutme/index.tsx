import { motion, useMotionValue, useSpring, useInView, useTransform, animate } from "framer-motion"
import CopyEmailButton from "../copy-email-button"
import { useTheme } from "next-themes"
import { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

const TECH_STACK = [
  "Next.js", "Nuxt", "React", "Vue.js",
  "Laravel", "Express.js", "NestJS", "Node.js",
  "TypeScript", "PHP", "PostgreSQL", "MongoDB",
]

// Animated counter – counts from 0 to target when scrolled into view
const AnimatedCounter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const controls = animate(count, target, {
      duration: 2,
      ease: "easeOut",
    })
    return controls.stop
  }, [isInView, count, target])

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => setDisplay(v as number))
    return unsubscribe
  }, [rounded])

  return <span ref={ref}>{display}{suffix}</span>
}

const AboutMe = () => {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [hoveredTech, setHoveredTech] = useState<string | null>(null)
  const btnRef = useRef<HTMLAnchorElement>(null)
  const btnX = useMotionValue(0)
  const btnY = useMotionValue(0)
  const springBtnX = useSpring(btnX, { stiffness: 200, damping: 20 })
  const springBtnY = useSpring(btnY, { stiffness: 200, damping: 20 })

  useEffect(() => {
    setMounted(true)
  }, [])

  const resolvedTheme = theme === "system" ? systemTheme : theme
  const isLightMode = mounted ? resolvedTheme === "light" : false

  const handleBtnMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!btnRef.current) return
      const rect = btnRef.current.getBoundingClientRect()
      btnX.set((e.clientX - (rect.left + rect.width / 2)) * 0.15)
      btnY.set((e.clientY - (rect.top + rect.height / 2)) * 0.15)
    },
    [btnX, btnY],
  )

  const handleBtnMouseLeave = useCallback(() => {
    btnX.set(0)
    btnY.set(0)
  }, [btnX, btnY])

  return (
    <motion.section
      id="About Me"
      className="relative min-h-[50vh] flex flex-col items-center justify-center px-6 md:px-16 py-20 mt-24 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, amount: 0.15 }}
    >
      {/* Subtle dot grid — no gradient blobs */}
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        {/* Section tag */}
        <motion.div
          className="flex items-center gap-3 mb-10"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
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
            About Me
          </span>
        </motion.div>

        <div className="grid md:grid-cols-[1.3fr_1fr] gap-10 md:gap-16 items-start">
          {/* Left — Bio */}
          <div className="space-y-6">
            <motion.h2
              className={cn(
                "text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.15]",
                isLightMode ? "text-gray-900" : "text-white",
              )}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              suppressHydrationWarning
            >
              Fullstack developer{" "}
              <span
                className={cn(
                  "block font-mono text-xl md:text-2xl lg:text-[1.75rem] mt-2 font-normal",
                  isLightMode ? "text-indigo-600" : "text-indigo-400",
                )}
                suppressHydrationWarning
              >
                who ships end-to-end.
              </span>
            </motion.h2>

            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <p
                className={cn(
                  "text-[15px] leading-[1.75]",
                  isLightMode ? "text-gray-600" : "text-gray-400",
                )}
              >
                I&apos;m{" "}
                <span
                  className={cn(
                    "font-semibold",
                    isLightMode ? "text-gray-900" : "text-white",
                  )}
                >
                  Heiner
                </span>{" "}
                — I build web apps from database schema to deploy button. Whether
                it&apos;s a Laravel monolith, a Next.js app with server
                components, or a Nuxt-powered storefront, I own the full picture.
              </p>
              <p
                className={cn(
                  "text-[15px] leading-[1.75]",
                  isLightMode ? "text-gray-600" : "text-gray-400",
                )}
              >
                My toolkit centers on{" "}
                <span
                  className={cn(
                    "font-medium",
                    isLightMode ? "text-gray-800" : "text-gray-200",
                  )}
                >
                  Laravel
                </span>
                ,{" "}
                <span
                  className={cn(
                    "font-medium",
                    isLightMode ? "text-gray-800" : "text-gray-200",
                  )}
                >
                  Next.js
                </span>
                ,{" "}
                <span
                  className={cn(
                    "font-medium",
                    isLightMode ? "text-gray-800" : "text-gray-200",
                  )}
                >
                  Nuxt
                </span>
                , and{" "}
                <span
                  className={cn(
                    "font-medium",
                    isLightMode ? "text-gray-800" : "text-gray-200",
                  )}
                >
                  Express.js
                </span>{" "}
                — I pick the right tool for the problem, not the hype.
              </p>
              <p
                className={cn(
                  "text-[15px] leading-[1.75]",
                  isLightMode ? "text-gray-600" : "text-gray-400",
                )}
              >
                Currently open to freelance work, internships, or full-time roles
                where I can build products that matter.
              </p>
            </motion.div>

            {/* CTA row */}
            <motion.div
              className="flex flex-wrap items-center gap-3 pt-3"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              {/* Primary — magnetic button */}
              <motion.a
                ref={btnRef}
                href="#Contact"
                style={{ x: springBtnX, y: springBtnY }}
                onMouseMove={handleBtnMouseMove}
                onMouseLeave={handleBtnMouseLeave}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "group relative inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer select-none",
                  isLightMode
                    ? "bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/25"
                    : "bg-white text-gray-900 shadow-md shadow-white/5 hover:bg-indigo-500 hover:text-white hover:shadow-lg hover:shadow-indigo-500/25",
                )}
                suppressHydrationWarning
              >
                Get in touch
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </motion.a>

              {/* Secondary — copy email */}
              <motion.div
                className={cn(
                  "inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border text-sm cursor-pointer transition-all duration-300",
                  isLightMode
                    ? "border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50"
                    : "border-gray-800 text-gray-500 hover:border-indigo-500/30 hover:text-indigo-400 hover:bg-indigo-950/30",
                )}
                whileTap={{ scale: 0.97 }}
                suppressHydrationWarning
              >
                <CopyEmailButton email="webdevislife2021@gmail.com" />
                <span className="font-mono text-xs hidden sm:inline">
                  email
                </span>
              </motion.div>
            </motion.div>
          </div>

          {/* Right — Tech stack & stats */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            viewport={{ once: true }}
          >
            {/* Tech pills */}
            <div>
              <h3
                className={cn(
                  "text-[11px] font-mono tracking-[0.25em] uppercase mb-4",
                  isLightMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {TECH_STACK.map((tech, i) => (
                  <motion.span
                    key={tech}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-[13px] font-mono border cursor-default transition-all duration-200",
                      hoveredTech === tech
                        ? isLightMode
                          ? "border-indigo-400/60 text-indigo-700 bg-indigo-50 shadow-sm"
                          : "border-indigo-500/40 text-indigo-300 bg-indigo-950/40 shadow-sm shadow-indigo-500/10"
                        : isLightMode
                          ? "border-gray-200 text-gray-500 bg-white/60"
                          : "border-gray-800 text-gray-500 bg-gray-900/40",
                    )}
                    onMouseEnter={() => setHoveredTech(tech)}
                    onMouseLeave={() => setHoveredTech(null)}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.3 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -3, scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    suppressHydrationWarning
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div
              className={cn(
                "pt-6 border-t",
                isLightMode ? "border-gray-100" : "border-gray-800/50",
              )}
            >
              <div className="grid grid-cols-3 gap-6">
                {[
                  { target: 5, suffix: "+", display: null, label: "Years" },
                  { target: 20, suffix: "+", display: null, label: "Projects" },
                  { target: null, suffix: "", display: "∞", label: "Curiosity" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + i * 0.08, duration: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <div
                      className={cn(
                        "text-2xl md:text-3xl font-bold tabular-nums",
                        isLightMode ? "text-gray-900" : "text-white",
                      )}
                      suppressHydrationWarning
                    >
                      {stat.target !== null ? (
                        <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                      ) : (
                        stat.display
                      )}
                    </div>
                    <div
                      className={cn(
                        "text-[10px] font-mono uppercase tracking-[0.2em] mt-1",
                        isLightMode ? "text-gray-400" : "text-gray-600",
                      )}
                    >
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default AboutMe
