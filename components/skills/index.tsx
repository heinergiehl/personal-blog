import { Card } from "../landingPage/card/card"
import Spotlight from "../landingPage/card/spotlight"
import { skillsData } from "./data"
import { motion } from "framer-motion"
import { COLOR_ONE, COLOR_TWO } from "@/config"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

const Skills = () => {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Resolve the actual theme (handle 'system' theme)
  const resolvedTheme = theme === 'system' ? systemTheme : theme
  const isLightMode = mounted ? resolvedTheme === 'light' : false

  return (
  <section
    id="Skills"
    className="relative min-h-screen py-16 mt-24 overflow-hidden"
  >
    {/* Animated gradient background */}
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/70 via-white to-blue-50/80 dark:from-gray-950 dark:via-blue-950/20 dark:to-gray-900" />
      <motion.div
        className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
        style={{ background: mounted && isLightMode ? '#06b6d4' : COLOR_TWO }}
        animate={{
          x: [0, -100, 0],
          y: [0, 80, 0],
          scale: [1, 1.4, 1],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        suppressHydrationWarning
      />
      <motion.div
        className="absolute bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
        style={{ background: mounted && isLightMode ? '#4f46e5' : COLOR_ONE }}
        animate={{
          x: [0, 100, 0],
          y: [0, -80, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
        suppressHydrationWarning
      />
    </div>

    {/* Content */}
    <div className="relative z-10">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center bg-gradient-to-r from-indigo-600 via-blue-700 to-cyan-700 dark:from-purple-400 dark:via-purple-300 dark:to-purple-500 bg-clip-text text-transparent">
        Skills
      </h2>
      <p className="text-center text-pretty text-sm text-gray-500 mt-2">
        I love to work with powerful, highly-customizable tools to build Apps that
        exactly meet the customers disire and needs.
      </p>

      <Spotlight className="h-full max-w-xl mx-auto grid gap-6 grid-cols-1 lg:grid-cols-3 items-start lg:max-w-none group lg:p-20">
        {skillsData.map(
          ({ title, descriptionHeader, description, technologies }) => (
            <Card
              key={title}
              title={title}
              descriptionHeader={descriptionHeader}
              description={description}
              technologies={technologies}
            />
          )
        )}
      </Spotlight>
    </div>
  </section>
  )
}

export default Skills
