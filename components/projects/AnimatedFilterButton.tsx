"use client"

import { useState, MouseEvent, useEffect, ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"

interface Ripple {
  key: number
  x: number
  y: number
}

export interface AnimatedFilterButtonProps {
  /** Text label shown inside the button */
  category: string
  isActive: boolean
  onClick: () => void
  /** Controls padding / font size */
  size?: "xs" | "sm" | "md" | "lg"
  /** Controls border-radius */
  rounded?: "lg" | "xl" | "2xl" | "full"
  /** Override inner label with custom children (icons etc.) */
  children?: ReactNode
  /** Unique layoutId for the shared active-fill animation */
  layoutId?: string
  /** Render as <a> instead of <button> */
  href?: string
}

const COLOR_ONE = "#4f46e5"
const COLOR_TWO = "#7c3aed"

const sizeClasses: Record<string, string> = {
  xs: "px-3 py-1.5 text-xs font-medium",
  sm: "px-5 py-2.5 text-sm font-medium",
  md: "px-6 py-3 text-sm font-semibold",
  lg: "px-7 py-3.5 text-base font-semibold",
}

const roundedClasses: Record<string, string> = {
  full: "rounded-full",
  "2xl": "rounded-2xl",
  xl:   "rounded-xl",
  lg:   "rounded-lg",
}

const borderRadiusValues: Record<string, number> = {
  full: 9999,
  "2xl": 16,
  xl:   12,
  lg:   8,
}

export function AnimatedFilterButton({
  category,
  isActive,
  onClick,
  size = "sm",
  rounded = "full",
  children,
  layoutId = "active-pill",
  href,
}: AnimatedFilterButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  const isLight = resolvedTheme === "light"
  const br = borderRadiusValues[rounded] ?? 9999

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setRipples((prev) => [
      ...prev,
      { key: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top },
    ])
    onClick()
  }

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const base = [
    "relative overflow-hidden transition-colors duration-300 ease-in-out",
    "focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer select-none",
    "inline-flex items-center justify-center gap-2",
    sizeClasses[size],
    roundedClasses[rounded],
  ].join(" ")

  const activeCls = "text-white shadow-lg shadow-indigo-400/30"
  const inactiveCls = isLight
    ? "bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
    : "bg-slate-800 text-slate-400 hover:text-slate-100"
  const focusCls = isLight
    ? "focus:ring-indigo-500 focus:ring-offset-white"
    : "focus:ring-indigo-500 focus:ring-offset-slate-900"

  const hoverGlow = {
    background: isLight
      ? `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, #4f46e51A, transparent 60%)`
      : `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, ${COLOR_ONE}4D, transparent 60%)`,
  }

  const inner = (
    <>
      {/* Inactive hover glow */}
      <AnimatePresence>
        {!isActive && (
          <motion.div
            className="absolute inset-0 z-0"
            style={hoverGlow}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Label */}
      <span className="relative z-20 inline-flex items-center gap-2">
        {children ?? category}
      </span>

      {/* Ripples */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {ripples.map((r) => (
            <motion.span
              key={r.key}
              className="absolute rounded-full bg-white/60"
              style={{ left: r.x, top: r.y, transform: "translate(-50%, -50%)" }}
              initial={{ scale: 0, opacity: 0.6, width: 80, height: 80 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              onAnimationComplete={() =>
                setRipples((prev) => prev.filter((x) => x.key !== r.key))
              }
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Active gradient fill — shared layoutId for smooth pill movement */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            layoutId={layoutId}
            className="absolute inset-0 z-0"
            style={{
              background: `linear-gradient(135deg, ${COLOR_ONE}, ${COLOR_TWO})`,
              borderRadius: br,
            }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        )}
      </AnimatePresence>
    </>
  )

  const className = `${base} ${isActive ? activeCls : inactiveCls} ${focusCls}`

  if (href) {
    return (
      <motion.a
        href={href}
        layout
        onClick={handleClick as any}
        onMouseMove={handleMouseMove as any}
        className={className}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        {inner}
      </motion.a>
    )
  }

  return (
    <motion.button
      layout
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      className={className}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {inner}
    </motion.button>
  )
}
