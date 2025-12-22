import { SpotlightCard } from "./spotlight"
import { motion, Variants, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

import { DoubleCircuit } from "./DoubleCircuit"
import React, { useRef, useMemo, useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { COLOR_ONE, COLOR_TWO } from "@/config"

type CardProps = {
  className?: string
  title: string
  descriptionHeader: string
  description: string
  technologies?: string[]
}

// Animation constants for better maintainability
const ANIMATION_CONFIG = {
  staggerDelay: 0.3,
  contentDuration: 0.5,
  textBlockDuration: 0.6,
  techBadgeDelay: 0.08,
  hoverScale: 1.02,
  techHoverScale: 1.2,
  techHoverRotate: 6,
  // Smoother, more fluid spring physics
  springStiffness: 150,
  springDamping: 20,
  // Tighter springs for mouse tracking
  mouseSpringStiffness: 200,
  mouseSpringDamping: 25,
  techSpringStiffness: 400,
  techSpringDamping: 10,
  // Rotation limits for natural feel
  maxRotation: 8,
  // Magnetic attraction distance
  magneticDistance: 50,
} as const

// Z-index scale for consistent layering
const Z_INDEX = {
  background: 0,
  glow: 10,
  content: 20,
  circuit: 15,
} as const

// Normalize technology identifiers to valid devicon class names
const normalizeTech = (t: string): string => {
  if (t.startsWith("devicon-")) return t
  const map: Record<string, string> = {
    react: "devicon-react-original",
    next: "devicon-nextjs-original",
    nextjs: "devicon-nextjs-original",
    typescript: "devicon-typescript-plain",
    javascript: "devicon-javascript-plain",
    node: "devicon-nodejs-plain",
    nodejs: "devicon-nodejs-plain",
    tailwind: "devicon-tailwindcss-plain",
    tailwindcss: "devicon-tailwindcss-plain",
    css: "devicon-css3-plain",
    html: "devicon-html5-plain",
    mysql: "devicon-mysql-original",
    postgres: "devicon-postgresql-plain",
    postgresql: "devicon-postgresql-plain",
    prisma: "devicon-prisma-original",
    docker: "devicon-docker-plain",
    git: "devicon-git-plain",
    github: "devicon-github-original",
    vercel: "devicon-vercel-original",
    aws: "devicon-amazonwebservices-plain",
    php: "devicon-php-plain",
    laravel: "devicon-laravel-original",
    python: "devicon-python-plain",
    django: "devicon-django-plain",
  }
  return map[t.toLowerCase()] || t
}

// Animation variants - moved outside component
const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      staggerChildren: ANIMATION_CONFIG.staggerDelay,
      duration: ANIMATION_CONFIG.contentDuration,
    },
  },
}

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: ANIMATION_CONFIG.contentDuration, 
      ease: "easeOut" 
    },
  },
}

const textBlockVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: ANIMATION_CONFIG.textBlockDuration, 
      ease: "easeOut" 
    },
  },
}

// Reduced motion variants for accessibility
const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
}

export const Card = ({
  className = "",
  title,
  descriptionHeader,
  description,
  technologies = [],
}: CardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  // Mouse position for smooth inertia-based hover effects
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // Mouse position in pixels for glow effect
  const mouseXPixels = useMotionValue(0)
  const mouseYPixels = useMotionValue(0)
  
  // Magnetic translation values
  const magneticX = useMotionValue(0)
  const magneticY = useMotionValue(0)
  
  // Ultra smooth spring physics for rotation
  const springX = useSpring(mouseX, { 
    stiffness: ANIMATION_CONFIG.mouseSpringStiffness, 
    damping: ANIMATION_CONFIG.mouseSpringDamping,
    restDelta: 0.001 
  })
  const springY = useSpring(mouseY, { 
    stiffness: ANIMATION_CONFIG.mouseSpringStiffness, 
    damping: ANIMATION_CONFIG.mouseSpringDamping,
    restDelta: 0.001 
  })
  
  // Smooth springs for magnetic effect
  const magneticSpringX = useSpring(magneticX, { 
    stiffness: ANIMATION_CONFIG.springStiffness, 
    damping: ANIMATION_CONFIG.springDamping 
  })
  const magneticSpringY = useSpring(magneticY, { 
    stiffness: ANIMATION_CONFIG.springStiffness, 
    damping: ANIMATION_CONFIG.springDamping 
  })
  
  // Transform glow position based on mouse
  const glowX = useTransform(mouseXPixels, (value) => `${value}px`)
  const glowY = useTransform(mouseYPixels, (value) => `${value}px`)
  
  useEffect(() => {
    setMounted(true)
    
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Enhanced mouse move handler with magnetic effect and dynamic glow
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    // Calculate relative position (-1 to 1)
    const relativeX = (e.clientX - centerX) / (rect.width / 2)
    const relativeY = (e.clientY - centerY) / (rect.height / 2)
    
    // Clamp rotation values for natural feel
    const clampedX = Math.max(-1, Math.min(1, relativeX))
    const clampedY = Math.max(-1, Math.min(1, relativeY))
    
    // Apply smooth tilt with limited rotation
    mouseX.set(clampedX * ANIMATION_CONFIG.maxRotation)
    mouseY.set(clampedY * -ANIMATION_CONFIG.maxRotation)
    
    // Magnetic effect - slight translation toward mouse
    const distance = Math.sqrt(relativeX ** 2 + relativeY ** 2)
    if (distance < 1) {
      magneticX.set(relativeX * 8)
      magneticY.set(relativeY * 8)
    }
    
    // Mouse position for glow effect (relative to card)
    mouseXPixels.set(e.clientX - rect.left)
    mouseYPixels.set(e.clientY - rect.top)
  }
  
  const handleMouseEnter = () => {
    setIsHovered(true)
  }
  
  const handleMouseLeave = () => {
    setIsHovered(false)
    mouseX.set(0)
    mouseY.set(0)
    magneticX.set(0)
    magneticY.set(0)
  }

  // Resolve the actual theme (handle 'system' theme)
  const resolvedTheme = theme === 'system' ? systemTheme : theme
  const isLightMode = resolvedTheme === 'light'

  // Memoize theme-dependent styles with enhanced purple tones
  const themeStyles = useMemo(() => ({
    titleBadge: {
      backgroundColor: isLightMode 
        ? "rgba(255, 255, 255, 0.7)" 
        : "rgba(88, 28, 135, 0.3)",
      borderColor: isLightMode 
        ? "rgba(139, 92, 246, 0.25)" 
        : "rgba(168, 85, 247, 0.3)",
      boxShadow: isLightMode
        ? "0 4px 12px rgba(139, 92, 246, 0.1)"
        : "0 4px 12px rgba(168, 85, 247, 0.15)",
    },
    textBlock: {
      backgroundColor: isLightMode 
        ? "rgba(255, 255, 255, 0.6)" 
        : "rgba(30, 27, 75, 0.5)",
      borderColor: isLightMode 
        ? "rgba(139, 92, 246, 0.2)" 
        : "rgba(168, 85, 247, 0.2)",
      boxShadow: isLightMode
        ? "0 2px 8px rgba(139, 92, 246, 0.08)"
        : "0 2px 8px rgba(168, 85, 247, 0.1)",
    },
    techBadge: {
      background: `linear-gradient(135deg, ${COLOR_ONE}, ${COLOR_TWO})`,
      boxShadow: isLightMode
        ? "0 4px 12px rgba(139, 92, 246, 0.3)"
        : "0 4px 12px rgba(168, 85, 247, 0.4)",
    },
  }), [isLightMode])

  const descriptionTextColor = isLightMode ? "text-gray-800" : "text-purple-100"
  const headingTextColor = isLightMode ? "text-purple-900" : "text-purple-200"
  const variants = prefersReducedMotion ? reducedMotionVariants : cardVariants
  const contentVars = prefersReducedMotion ? reducedMotionVariants : contentVariants
  const textVars = prefersReducedMotion ? reducedMotionVariants : textBlockVariants

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <SpotlightCard cardRef={cardRef}>
        <article className="relative w-full h-full overflow-hidden rounded-[inherit]" suppressHydrationWarning>
          <div className="relative h-full p-4 sm:p-6 pb-6 sm:pb-8 rounded-[inherit] overflow-hidden flex flex-col justify-center items-center opacity-0" />
        </article>
      </SpotlightCard>
    )
  }

  return (
    <SpotlightCard cardRef={cardRef}>
      <article 
        className="relative w-full h-full overflow-hidden rounded-[inherit]"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        suppressHydrationWarning
      >
        <motion.div
          ref={cardRef}
          className={cn(
            "relative h-full p-4 sm:p-6 pb-6 sm:pb-8 rounded-[inherit] overflow-hidden",
            "flex flex-col justify-center items-center",
            "focus-within:ring-2 focus-within:ring-offset-2 transition-all duration-300",
            isLightMode
              ? "bg-gradient-to-br from-purple-50/95 via-white/90 to-violet-50/95 text-gray-900 focus-within:ring-purple-400"
              : "bg-gradient-to-br from-slate-900/95 via-purple-950/90 to-slate-900/95 text-white focus-within:ring-purple-500",
            "border border-purple-200/20",
            className
          )}
          style={{
            rotateX: springY,
            rotateY: springX,
            x: magneticSpringX,
            y: magneticSpringY,
            transformStyle: "preserve-3d",
            zIndex: Z_INDEX.content,
          }}
          variants={variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          animate={
            isHovered && !prefersReducedMotion
              ? { 
                  scale: ANIMATION_CONFIG.hoverScale,
                  transition: { 
                    type: "spring", 
                    stiffness: ANIMATION_CONFIG.springStiffness,
                    damping: ANIMATION_CONFIG.springDamping 
                  }
                }
              : { scale: 1 }
          }
        >
          {/* Dynamic mouse-following glow */}
          <motion.div
            className="absolute pointer-events-none rounded-full blur-[120px]"
            style={{ 
              zIndex: Z_INDEX.glow,
              left: glowX,
              top: glowY,
              width: "250px",
              height: "250px",
              translateX: "-50%",
              translateY: "-50%",
              background: isLightMode 
                ? `radial-gradient(circle, rgba(168, 85, 247, 0.25), rgba(139, 92, 246, 0.15), transparent 70%)`
                : `radial-gradient(circle, rgba(168, 85, 247, 0.4), ${COLOR_ONE}60, transparent 70%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1.2 : 0.8
            }}
            transition={{ duration: 0.3 }}
            aria-hidden="true"
          />

          {/* Decorative glow */}
          <div
            className="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none w-1/2 aspect-square"
            style={{ zIndex: Z_INDEX.glow }}
            aria-hidden="true"
          >
            <motion.div
              className={cn(
                "absolute inset-0 rounded-full blur-[80px]",
                isLightMode ? "bg-purple-200" : "bg-purple-900"
              )}
              animate={{
                opacity: isHovered ? 0.6 : 0.4
              }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Animated circuit lines */}
          <div style={{ zIndex: Z_INDEX.circuit }} className="absolute inset-0">
            <DoubleCircuit cardRef={cardRef} isLightMode={isLightMode} />
          </div>

          <div className="flex flex-col h-full items-center justify-center w-full max-w-lg mx-auto">
            <motion.div
              variants={contentVars}
              className="relative inline-flex flex-col items-center mb-6 w-full"
            >
              {/* Title badge */}
              <motion.div
                className={cn(
                  "py-2.5 z-20 px-4 sm:px-6 rounded-full mb-4 text-center border backdrop-blur-md",
                  "transition-all duration-300 max-w-full",
                  isLightMode ? "text-purple-900 font-semibold" : "text-purple-100 font-semibold"
                )}
                style={themeStyles.titleBadge}
                variants={contentVars}
                whileHover={{ scale: 1.02 }}
              >
                <h2 className="text-base sm:text-lg font-bold truncate px-2">{title}</h2>
              </motion.div>

              {/* Technology badges */}
              {technologies.length > 0 && (
                <div 
                  role="list" 
                  aria-label="Technologies used" 
                  className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4 max-w-full px-2"
                >
                  {technologies.map((tech, index) => (
                    <motion.span
                      key={`${tech}-${index}`}
                      role="listitem"
                      className={cn(
                        "inline-flex items-center justify-center p-1.5 sm:p-2",
                        "rounded-full shadow-lg text-white",
                        "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2",
                        "focus:ring-offset-slate-900"
                      )}
                      style={themeStyles.techBadge}
                      tabIndex={0}
                      whileHover={
                        prefersReducedMotion
                          ? undefined
                          : {
                              scale: ANIMATION_CONFIG.techHoverScale,
                              rotate: ANIMATION_CONFIG.techHoverRotate,
                              transition: {
                                type: "spring",
                                stiffness: ANIMATION_CONFIG.techSpringStiffness,
                                damping: ANIMATION_CONFIG.techSpringDamping,
                              },
                            }
                      }
                      whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: prefersReducedMotion ? 0 : index * ANIMATION_CONFIG.techBadgeDelay,
                      }}
                    >
                      <i
                        className={cn(
                          normalizeTech(tech), 
                          "colored inline-block leading-none",
                          "text-xl sm:text-2xl md:text-3xl"
                        )}
                        aria-label={tech}
                        title={tech}
                      />
                    </motion.span>
                  ))}
                </div>
              )}
            </motion.div>
            
            {/* Description section */}
            <motion.section
              variants={textVars}
              className={cn(
                "flex-1 w-full z-20 p-3 sm:p-4 rounded-xl border backdrop-blur-md",
                "transition-all duration-300",
                descriptionTextColor
              )}
              style={themeStyles.textBlock}
              whileHover={{ scale: 1.005 }}
            >
              <h3 className={cn(
                "text-lg sm:text-xl font-bold mb-2",
                headingTextColor
              )}>{descriptionHeader}</h3>
              <p className="text-sm sm:text-base leading-relaxed">{description}</p>
            </motion.section>
          </div>
        </motion.div>
      </article>
    </SpotlightCard>
  )
}
