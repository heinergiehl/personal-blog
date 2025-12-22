import { useRef, useEffect, useCallback, useState } from "react"
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react"
import Image from "next/image"
import { useTheme } from "next-themes"
import Link from "next/link"
import { COLOR_ONE, COLOR_TWO } from "@/config"

interface CardProps {
  children?: React.ReactNode
  className?: string
  gradientSize?: number
  gradientOpacity?: number
  gradientFrom?: string
  gradientTo?: string
  cardCSS?: string
  title: string
  image?: string
  link?: string
}

/**
 * ProjectCard: An enhanced card with smooth animations, 3D tilt effect,
 * radial gradient tracking, and improved hover states
 */
function ProjectCard({
  gradientSize = 250,
  gradientOpacity = 0.8,
  gradientFrom = COLOR_ONE,
  gradientTo = COLOR_TWO,
  image,
  title,
  cardCSS = "w-[400px] h-auto rounded-xl transition-all duration-300 relative",
  link,
}: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const { theme, systemTheme } = useTheme()
  
  // Mouse position for gradient effect
  const mouseX = useMotionValue(-gradientSize)
  const mouseY = useMotionValue(-gradientSize)
  
  // 3D tilt effect with smooth springs
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springRotateX = useSpring(rotateX, { stiffness: 150, damping: 20 })
  const springRotateY = useSpring(rotateY, { stiffness: 150, damping: 20 })

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (cardRef.current) {
        const { left, top, width, height } = cardRef.current.getBoundingClientRect()
        const clientX = e.clientX
        const clientY = e.clientY
        
        // Set mouse position for gradient
        mouseX.set(clientX - left)
        mouseY.set(clientY - top)
        
        // Calculate 3D tilt
        const centerX = left + width / 2
        const centerY = top + height / 2
        const rotateXValue = ((clientY - centerY) / height) * -10
        const rotateYValue = ((clientX - centerX) / width) * 10
        
        rotateX.set(rotateXValue)
        rotateY.set(rotateYValue)
      }
    },
    [mouseX, mouseY, rotateX, rotateY]
  )

  const handleMouseLeave = useCallback(() => {
    mouseX.set(-gradientSize)
    mouseY.set(-gradientSize)
    rotateX.set(0)
    rotateY.set(0)
    setIsHovered(false)
  }, [mouseX, mouseY, rotateX, rotateY, gradientSize])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    card.addEventListener("mousemove", handleMouseMove)
    card.addEventListener("mouseleave", handleMouseLeave)
    card.addEventListener("mouseenter", handleMouseEnter)

    return () => {
      card.removeEventListener("mousemove", handleMouseMove)
      card.removeEventListener("mouseleave", handleMouseLeave)
      card.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [handleMouseMove, handleMouseLeave, handleMouseEnter])

  const resolvedTheme = theme === 'system' ? systemTheme : theme
  const isLightMode = resolvedTheme === 'light'
  
  const gradientColor = isLightMode ? "#ffffff80" : "#50505080"
  return (
    <motion.div
      ref={cardRef}
      className={`group rounded-xl transition-all duration-300 relative ${cardCSS}`}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ 
        scale: 1.05,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Base background with border */}
      <div className={`
        absolute inset-px z-10 rounded-xl backdrop-blur-sm border-2
        ${isLightMode 
          ? 'bg-gradient-to-br from-white/95 via-purple-50/90 to-violet-50/95 border-purple-200/50' 
          : 'bg-gradient-to-br from-slate-900/95 via-purple-950/90 to-slate-900/95 border-purple-500/30'
        }
      `} />
      
      {/* Subtle inner gradient on hover */}
      <motion.div
        className="pointer-events-none absolute inset-px z-20 rounded-xl transition-opacity duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}, transparent 70%)
          `,
          opacity: isHovered ? gradientOpacity : 0,
        }}
      />
      
      {/* Outer purple gradient border effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
              ${gradientFrom}, 
              ${gradientTo}, 
              transparent 100%
            )
          `,
        }}
      />
      
      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: isLightMode
            ? `0 0 30px ${COLOR_ONE}40, 0 0 60px ${COLOR_TWO}20`
            : `0 0 30px ${COLOR_ONE}60, 0 0 60px ${COLOR_TWO}40`,
        }}
        animate={{
          boxShadow: isHovered ? [
            `0 0 20px ${COLOR_ONE}40`,
            `0 0 40px ${COLOR_TWO}60`,
            `0 0 20px ${COLOR_ONE}40`,
          ] : `0 0 0px transparent`,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="rounded-xl w-[400px] h-[300px] relative z-30 overflow-hidden">
        {/* Card Image with hover zoom */}
        {image && (
          <div className="p-1 overflow-hidden rounded-t-xl">
            <div className="relative overflow-hidden rounded-t-lg">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full h-full"
              >
                <Image
                  className="rounded-t-lg object-cover w-[400px] h-[200px]"
                  width={400}
                  height={200}
                  src={image}
                  alt={title}
                />
              </motion.div>
              
              {/* Overlay gradient on image hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none"
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Card Content with enhanced typography */}
        <div className="p-4">
          <h3 className={`
            text-lg font-bold transition-colors duration-300
            ${isLightMode ? 'text-slate-900' : 'text-white'}
          `}>
            {link ? (
              <Link 
                href={link} 
                className="group/link inline-flex items-center gap-2 hover:gap-3 transition-all duration-300"
              >
                <motion.span
                  className={`
                    transition-all duration-300
                    ${isLightMode 
                      ? 'group-hover/link:text-transparent group-hover/link:bg-clip-text group-hover/link:bg-gradient-to-r group-hover/link:from-purple-600 group-hover/link:to-violet-600' 
                      : 'group-hover/link:text-transparent group-hover/link:bg-clip-text group-hover/link:bg-gradient-to-r group-hover/link:from-purple-400 group-hover/link:to-violet-400'
                    }
                  `}
                >
                  {title}
                </motion.span>
                <motion.span
                  className={`
                    inline-block transition-all duration-300
                    ${isLightMode 
                      ? 'text-purple-600 group-hover/link:text-violet-600' 
                      : 'text-purple-400 group-hover/link:text-violet-400'
                    }
                  `}
                  animate={{
                    x: [0, 3, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  →
                </motion.span>
              </Link>
            ) : (
              title
            )}
          </h3>
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectCard
