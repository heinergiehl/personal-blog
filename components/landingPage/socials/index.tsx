"use client"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import { FaGithub, FaYoutube } from "react-icons/fa"
import Image from "next/image"
import { useTheme } from "next-themes"
import { COLOR_ONE, COLOR_TWO } from "@/config"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
/** Reusable tooltip wrapper with enhanced styling. */
function ReusableTooltip({
  content,
  children,
}: {
  content: string
  children: React.ReactNode
}) {
  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent 
        alignOffset={-150} 
        align="start" 
        side="left"
        className="bg-gradient-to-r from-purple-600 to-violet-600 dark:from-purple-500 dark:to-violet-500 
                   border-purple-400 dark:border-purple-600 text-white font-medium px-4 py-2 
                   shadow-lg shadow-purple-500/50"
      >
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  )
}

interface SocialLink {
  href: string
  icon: React.ReactNode
  tooltip: string
  color: string
  size?: number
}
export const Socials = () => {
  const { theme, systemTheme } = useTheme()
  const [isExpanded, setIsExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const resolvedTheme = theme === 'system' ? systemTheme : theme
  const isLightMode = mounted ? resolvedTheme === 'light' : false

  // Mouse position for gradient effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setIsExpanded(true)
  }

  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setIsExpanded(false)
      closeTimerRef.current = null
    }, 150)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  const socialLinks: SocialLink[] = [
    {
      href: "https://github.com/thebeautyofcoding",
      icon: <FaGithub size={20} />,
      tooltip: "Old GitHub account lost due to 2FA issues 😿",
      color: "#6e5494",
      size: 20,
    },
    {
      href: "https://github.com/heinergiehl",
      icon: <FaGithub size={28} />,
      tooltip: "My new GitHub account (actively used) 🤩",
      color: "#2dba4e",
      size: 28,
    },
    {
      href: "https://www.youtube.com/@codingislove3707",
      icon: <FaYoutube size={28} />,
      tooltip: "My YouTube channel",
      color: "#ff0000",
      size: 28,
    },
    {
      href: "https://www.upwork.com/freelancers/~01e359856bc8297a0f",
      icon: <Image src="/upwork.svg" width={28} height={28} alt="Upwork" />,
      tooltip: "Hire me on Upwork",
      color: "#6fda44",
      size: 28,
    },
  ]
  return (
    <TooltipProvider>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, x: 100 }}
        animate={{ 
          opacity: 1, 
          x: 0,
          height: isExpanded ? "280px" : "64px",
          width: isExpanded ? "64px" : "64px",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          opacity: { duration: 0.5, delay: 0.2 }
        }}
        className="fixed right-6 top-1/2 -translate-y-1/2 z-50
                   rounded-full overflow-hidden cursor-pointer
                   backdrop-blur-xl border-2"
        style={{
          background: mounted && isLightMode
            ? "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(249,247,253,0.95))"
            : "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,27,75,0.95))",
          borderColor: mounted && isLightMode ? "rgba(168,85,247,0.3)" : "rgba(168,85,247,0.4)",
          boxShadow: isExpanded
            ? (mounted && isLightMode
              ? `0 0 40px rgba(168,85,247,0.4), 0 0 80px rgba(139,92,246,0.2)`
              : `0 0 40px rgba(168,85,247,0.5), 0 0 80px rgba(139,92,246,0.3)`)
            : (mounted && isLightMode
              ? `0 4px 20px rgba(168,85,247,0.25)`
              : `0 4px 20px rgba(168,85,247,0.35)`),
        }}
        suppressHydrationWarning
      >
        {/* Animated gradient border effect */}
        <motion.div
          className="absolute inset-0 rounded-full opacity-60"
          style={{
            background: `radial-gradient(circle at ${mouseX}px ${mouseY}px, ${COLOR_ONE}40, transparent 60%)`,
          }}
          animate={{
            opacity: isExpanded ? 0.6 : 0.3,
          }}
        />

        {/* Pulsing glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              `0 0 20px ${COLOR_ONE}40`,
              `0 0 40px ${COLOR_TWO}40`,
              `0 0 20px ${COLOR_ONE}40`,
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* "Socials" label */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center font-bold text-sm
                     bg-gradient-to-r from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400
                     bg-clip-text text-transparent"
          animate={{
            opacity: isExpanded ? 0 : 1,
            scale: isExpanded ? 0.7 : 1,
            rotate: isExpanded ? -90 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          Socials
        </motion.div>

        {/* Social Icons */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              key="icon-list"
              className="flex flex-col items-center justify-evenly h-full w-full py-4 relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {socialLinks.map((link, index) => (
                <ReusableTooltip key={index} content={link.tooltip}>
                  <motion.a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{
                      delay: index * 0.08,
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    whileHover={{ 
                      scale: 1.4, 
                      rotate: 10,
                      transition: { type: "spring", stiffness: 400, damping: 15 }
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {/* Glow effect on hover */}
                    <motion.div
                      className="absolute inset-0 rounded-full blur-lg opacity-0 group-hover:opacity-70"
                      style={{
                        background: link.color,
                      }}
                      transition={{ duration: 0.2 }}
                    />
                    
                    {/* Icon container with color */}
                    <motion.div
                      className="relative z-10"
                      style={{
                        color: mounted && isLightMode ? "#1e293b" : "#f8fafc",
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                      }}
                      suppressHydrationWarning
                      whileHover={{
                        color: link.color,
                        filter: `drop-shadow(0 4px 8px ${link.color}60)`,
                      }}
                    >
                      {link.icon}
                    </motion.div>
                  </motion.a>
                </ReusableTooltip>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </TooltipProvider>
  )
}
