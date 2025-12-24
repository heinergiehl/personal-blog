import { motion } from "framer-motion"
import { Mail, MessageSquare, Send, Sparkles } from "lucide-react"
import CopyEmailButton from "@/components/copy-email-button"
import { COLOR_ONE, COLOR_TWO } from "@/config"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

const Contact = () => {
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
      transition={{ duration: 0.5 }}
      id="Contact"
      className="relative min-h-[60vh] flex flex-col items-center justify-center p-8 md:p-16 mt-24 mb-16 overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/70 via-white to-blue-50/60 dark:from-gray-950 dark:via-violet-950/30 dark:to-gray-900" />
        <motion.div
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
          style={{ background: mounted && isLightMode ? '#4f46e5' : COLOR_ONE }}
          animate={{
            x: [0, 100, 0],
            y: [0, 80, 0],
            scale: [1, 1.4, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          suppressHydrationWarning
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
          style={{ background: mounted && isLightMode ? '#06b6d4' : COLOR_TWO }}
          animate={{
            x: [0, -100, 0],
            y: [0, -80, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          suppressHydrationWarning
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Decorative sparkle */}
        <motion.div
          className="flex justify-center mb-4"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="relative">
            <Sparkles className="w-12 h-12 text-indigo-600 dark:text-purple-400" />
            <motion.div
              className="absolute inset-0 blur-xl opacity-50"
              style={{ background: mounted && isLightMode ? '#4f46e5' : COLOR_ONE }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              suppressHydrationWarning
            />
          </div>
        </motion.div>

        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-blue-700 to-cyan-700 dark:from-purple-400 dark:via-purple-300 dark:to-purple-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Let's Create Something Amazing
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          Have a project in mind? Whether it's a new venture or an existing product that needs a refresh, 
          I'd love to hear about it. Let's collaborate and bring your vision to life.
        </motion.p>

        {/* Feature cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {[
            { icon: MessageSquare, title: "Quick Response", desc: "I typically respond within 24 hours" },
            { icon: Mail, title: "Direct Contact", desc: "Reach me directly via email" },
            { icon: Send, title: "Let's Connect", desc: "Start your project today" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-indigo-200/50 dark:border-purple-800/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
              whileHover={{ y: -5, scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + idx * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col items-center gap-3">
                <div
                  className="p-3 rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${COLOR_ONE}20, ${COLOR_TWO}20)`,
                  }}
                >
                  <item.icon className="w-6 h-6 text-indigo-700 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Email button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <CopyEmailButton email="webdevislife2021@gmail.com" />
        </motion.div>

        {/* Decorative line */}
        <motion.div
          className="mt-12 flex items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Open to opportunities
          </p>
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </motion.div>
      </div>
    </motion.section>
  )
}

export default Contact
