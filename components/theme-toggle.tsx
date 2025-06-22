"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { SunIcon, MoonIcon } from "@radix-ui/react-icons"

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    // we’re now on the client
    setMounted(true)
  }, [])
  if (!mounted) {
    // prevents hydration mismatch
    return null
  }
  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <motion.button
      onClick={handleToggle}
      aria-label="Toggle theme"
      className="
        relative
        w-10 h-8
        rounded-lg
        overflow-hidden
        flex items-center justify-center
       
     
        focus:outline-none focus:ring-1 focus:ring-offset-0
       
      "
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <MoonIcon style={{ width: "1rem", height: "1rem" }} />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, opacity: 0, scale: 0 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <SunIcon style={{ width: "1rem", height: "1rem" }} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
