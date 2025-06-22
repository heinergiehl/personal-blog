"use client"

import { useState, MouseEvent, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"

// Define the shape of a single ripple
interface Ripple {
  key: number
  x: number
  y: number
}

interface AnimatedFilterButtonProps {
  category: string
  isActive: boolean
  onClick: () => void
}

// Define the new gradient colors for easy access
const GRADIENT_FROM = "#4f16eb" // Primary purple
const GRADIENT_TO = "#4b0358" // Darker purple/pink

export function AnimatedFilterButton({
  category,
  isActive,
  onClick,
}: AnimatedFilterButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { resolvedTheme } = useTheme()
  const isLightMode = resolvedTheme === "light"
  const [mounted, setMounted] = useState(false)
  // Ensure the component is mounted before checking the theme
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return null // Prevent rendering until mounted

  const handleCreateRipple = (event: MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget
    const rect = button.getBoundingClientRect()

    const newRipple: Ripple = {
      key: Date.now(),
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
    setRipples((prev) => [...prev, newRipple])

    onClick()
  }

  const handleMouseMove = (event: MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    setMousePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
  }

  // --- Dynamic Styles based on Light/Dark Mode ---
  const buttonBaseClasses = `
    relative px-5 py-2.5 text-sm font-medium rounded-full overflow-hidden
    transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2
  `

  const activeClasses = isLightMode
    ? "text-gray-900 shadow-lg shadow-purple-300/40" // Stronger shadow for active pill in light mode
    : "text-white" // Active text white for dark mode

  const inactiveClasses = isLightMode
    ? "bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 shadow-sm" // Clean white, subtle border/shadow, clear hover
    : "bg-slate-800 text-slate-400 hover:text-slate-100" // Existing dark mode styles

  const focusRingClasses = isLightMode
    ? "focus:ring-purple-500 focus:ring-offset-white" // Use a more brand-aligned purple for focus, white offset
    : "focus:ring-purple-500 focus:ring-offset-slate-900" // Existing dark mode focus

  // Hover glow for inactive buttons
  const inactiveHoverGlowStyle = isLightMode
    ? {
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, #8b5cf61A, transparent 60%)`, // Light purple with low opacity (Tailwind's purple-400 with 10% opacity)
        boxShadow: `0px 2px 8px rgba(0,0,0,0.05)`, // Add a very subtle general shadow on hover
      }
    : {
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, ${GRADIENT_FROM}4D, transparent 60%)`,
      }

  // Ripple color
  const rippleColorClass = isLightMode
    ? "bg-purple-500 shadow-md shadow-purple-300/60" // A more vibrant purple ripple with a soft purple shadow
    : "bg-white shadow-lg shadow-purple-500/50" // Existing white ripple

  return (
    <motion.button
      layout
      key={category}
      onClick={handleCreateRipple}
      onMouseMove={handleMouseMove}
      className={`${buttonBaseClasses} ${
        isActive ? activeClasses : inactiveClasses
      } ${focusRingClasses}`}
    >
      {/* ===== HOVER GLOW EFFECT (FOR INACTIVE BUTTONS) ===== */}
      <AnimatePresence>
        {!isActive && (
          <motion.div
            className="absolute inset-0 z-0"
            style={inactiveHoverGlowStyle} // Apply dynamic style object
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Text content - Always on top */}
      <span className="relative z-20">{category}</span>

      {/* ===== RIPPLE EFFECT CONTAINER ===== */}
      <div className="absolute inset-0 z-10">
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.key}
              className={`absolute rounded-full ${rippleColorClass}`} // Use dynamic ripple class
              style={{
                left: ripple.x,
                top: ripple.y,
                transform: "translate(-50%, -50%)",
              }}
              initial={{ scale: 0, opacity: 0.7, width: 80, height: 80 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              onAnimationComplete={() => {
                setRipples((prev) => prev.filter((r) => r.key !== ripple.key))
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* ===== ACTIVE STATE GRADIENT PILL ===== */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            layoutId="active-pill"
            className={`absolute inset-0 z-0 bg-gradient-to-r from-[${GRADIENT_FROM}] to-[${GRADIENT_TO}]`}
            style={{ borderRadius: 9999 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  )
}
