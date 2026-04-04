import { skillGroups } from "./data"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const Skills = () => {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const resolvedTheme = theme === "system" ? systemTheme : theme
  const isLightMode = mounted ? resolvedTheme === "light" : false

  return (
    <section
      id="Skills"
      className="relative py-20 mt-24 overflow-hidden"
    >
      {/* Dot grid background */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
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
            Skills
          </span>
        </motion.div>

        {/* Header row */}
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-6 mb-14">
          <motion.h2
            className={cn(
              "text-3xl md:text-4xl font-bold tracking-tight leading-[1.15]",
              isLightMode ? "text-gray-900" : "text-white",
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            suppressHydrationWarning
          >
            Tools I use{" "}
            <span
              className={cn(
                "block font-mono text-lg md:text-xl mt-2 font-normal",
                isLightMode ? "text-indigo-600" : "text-indigo-400",
              )}
              suppressHydrationWarning
            >
              to build things that work.
            </span>
          </motion.h2>
        </div>

        {/* Skill groups */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: gi * 0.06, duration: 0.4 }}
              viewport={{ once: true }}
            >
              <h3
                className={cn(
                  "text-[11px] font-mono tracking-[0.2em] uppercase mb-4",
                  isLightMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((tech, ti) => (
                  <motion.span
                    key={tech}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-[13px] font-mono border cursor-default transition-all duration-200",
                      isLightMode
                        ? "border-gray-200 text-gray-600 bg-white/60 hover:border-indigo-400/60 hover:text-indigo-700 hover:bg-indigo-50"
                        : "border-gray-800 text-gray-400 bg-gray-900/40 hover:border-indigo-500/40 hover:text-indigo-300 hover:bg-indigo-950/40",
                    )}
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: gi * 0.06 + ti * 0.03, duration: 0.3 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -2, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    suppressHydrationWarning
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
