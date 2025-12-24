import { motion } from "framer-motion"
import CopyEmailButton from "../copy-email-button"
import { COLOR_ONE, COLOR_TWO } from "@/config"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

const AboutMe = () => {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Resolve the actual theme (handle 'system' theme)
  const resolvedTheme = theme === 'system' ? systemTheme : theme
  const isLightMode = mounted ? resolvedTheme === 'light' : false

  return (
    <motion.section
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, threshold: 1, once: false }}
      id="About Me"
      className="relative min-h-[50vh] flex flex-col items-center justify-center p-8 md:p-16 mt-24 overflow-hidden"
    >
      {/* Animated gradient background with purple theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-white to-blue-50/30 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-900">
        <motion.div
          className="absolute top-0 -left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: mounted && isLightMode ? '#4f46e5' : COLOR_ONE }}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          suppressHydrationWarning
        />
        <motion.div
          className="absolute bottom-0 -right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: mounted && isLightMode ? '#06b6d4' : COLOR_TWO }}
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          suppressHydrationWarning
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-indigo-600 via-blue-700 to-cyan-700 dark:from-purple-400 dark:via-purple-300 dark:to-purple-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true, amount: 0.3 }}
          suppressHydrationWarning
        >
          About Me
        </motion.h2>

        <motion.div
          className="space-y-6 text-base md:text-lg text-gray-700 dark:text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <p className="leading-relaxed">
            Hi, I'm <span className="font-semibold text-indigo-700 dark:text-purple-400">Heiner</span>, 
            a passionate <span className="font-semibold">Full-Stack Developer</span> with a love for creating 
            exceptional digital experiences. I specialize in modern web technologies and take pride in 
            building applications that are not only functional but also visually stunning.
          </p>

          <p className="leading-relaxed">
            My journey in web development has been driven by curiosity and a commitment to continuous learning. 
            From crafting responsive frontends with <span className="font-semibold">React and Next.js</span> to 
            building robust backends with <span className="font-semibold">Node.js, NestJS, and Laravel</span>, 
            I bring a comprehensive skill set to every project.
          </p>

          <motion.p
            className="leading-relaxed text-indigo-700 dark:text-purple-300 font-medium"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true, amount: 0.3 }}
            suppressHydrationWarning
          >
            I'm currently seeking freelance opportunities, internships, or full-time positions where I can 
            contribute my expertise and continue growing as a developer. Let's build something amazing together!
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
          className="mt-10"
        >
          <CopyEmailButton email="webdevislife2021@gmail.com" />
        </motion.div>
      </div>
    </motion.section>
  )
}

export default AboutMe
