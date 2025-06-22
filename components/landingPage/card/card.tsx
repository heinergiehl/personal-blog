import Image from "next/image"
import { SpotlightCard } from "./spotlight"
import { motion, Variants } from "framer-motion"
import { cn } from "@/lib/utils"

import { DoubleCircuit } from "./DoubleCircuit"
import React, { useRef } from "react"
import { useTheme } from "next-themes"
import { COLOR_ONE, COLOR_TWO } from "@/config"

type CardProps = {
  className?: string
  title: string
  descriptionHeader: string
  description: string
  image?: string

  technologies?: string[]
}

// Define variants for the parent card container to orchestrate child animations
const cardVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
}

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }, // Added ease for smoother animation
  },
}

// New variants for staggered text content if needed, but contentVariants might suffice
const textBlockVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

export const Card = ({
  className = "",
  title,
  descriptionHeader,
  description,
  image,
  technologies = [],
}: CardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme() // Get the theme from next-themes
  const isLightMode = theme === "light" // Determine if it's light mode
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true) // Ensure the component is mounted before checking the theme
  }, [])
  if (!mounted) return null // Prevent rendering until mounted to avoid hydration issues

  // Define badge background colors based on theme
  const titleBadgeBgColor = isLightMode
    ? "rgba(255, 255, 255, 0.3)" // Semi-transparent white for light mode
    : "rgba(0, 0, 0, 0.4)" // Semi-transparent black for dark mode

  const titleBadgeBorderColor = isLightMode
    ? "rgba(0, 0, 0, 0.1)" // Subtle border for light mode
    : "rgba(255, 255, 255, 0.1)" // Subtle border for dark mode

  // New: Define text block background colors based on theme
  const textBlockBgColor = isLightMode
    ? "rgba(255, 255, 255, 0.2)" // Even more subtle white for light mode text block
    : "rgba(0, 0, 0, 0.3)" // Slightly less opaque black for dark mode text block

  const textBlockBorderColor = isLightMode
    ? "rgba(0, 0, 0, 0.05)" // Very subtle border for light mode
    : "rgba(255, 255, 255, 0.05)" // Very subtle border for dark mode

  // Text color for the main description section
  const descriptionTextColor = isLightMode ? "text-slate-700" : "text-slate-300"

  return (
    <SpotlightCard cardRef={cardRef}>
      <div className="relative w-full h-full overflow-hidden rounded-[inherit] text-pretty">
        <motion.div
          className={cn(
            "relative h-full p-6 pb-8 rounded-[inherit] z-20 overflow-hidden flex flex-col justify-center items-center", // Added flex utilities
            // Background colors are now dynamic based on isLightMode for consistency
            isLightMode
              ? "bg-slate-300 text-gray-800"
              : "bg-slate-900 text-white",
            className
          )}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* decorative glow */}
          <div
            className="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none -z-10 w-1/2 aspect-square"
            aria-hidden="true"
          >
            <div
              className={cn(
                "absolute inset-0 rounded-full blur-[80px]",
                isLightMode ? "bg-slate-100" : "bg-slate-800" // Adjusted glow color for light mode
              )}
            ></div>
          </div>

          {/* animated circuit lines - remains behind the main content (z-20 on parent div) */}
          {/* DoubleCircuit itself has `absolute` positioning and `z-index` control for its elements */}
          <DoubleCircuit cardRef={cardRef} isLightMode={isLightMode} />

          <div className="flex flex-col h-full items-center justify-center w-full">
            {" "}
            {/* Added w-full for text alignment */}
            <motion.div
              variants={contentVariants}
              className="relative inline-flex flex-col items-center mb-4" // Adjusted margin-bottom for spacing
            >
              <div
                className="w-[40%] h-[40%] absolute inset-0 m-auto -translate-y-[10%] blur-3xl -z-10 rounded-full bg-indigo-600"
                aria-hidden="true"
              />

              {/* Title in a semi-transparent badge */}
              <motion.div
                className={cn(
                  "py-2 px-4 rounded-full mb-4 text-center border", // Basic badge styling
                  isLightMode ? "text-gray-900" : "text-white", // Ensure title text is readable
                  "backdrop-blur-sm" // Apply blur effect
                )}
                style={{
                  backgroundColor: titleBadgeBgColor,
                  borderColor: titleBadgeBorderColor,
                }}
                variants={contentVariants}
              >
                <h3 className="text-lg font-bold whitespace-nowrap">{title}</h3>
              </motion.div>

              {/* Render technologies as badass badges */}
              {technologies.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 ">
                  {technologies.map((tech, index) => (
                    <motion.span
                      key={tech}
                      className="inline-flex items-center justify-center p-2 rounded-full shadow-lg text-white text-xl" // Tailwind classes for styling
                      style={{
                        background: `linear-gradient(90deg, ${COLOR_ONE}, ${COLOR_TWO})`, // Apply gradient
                        fontSize: "2rem", // Fixed size for badges
                      }}
                      // Framer Motion animations for each badge
                      whileHover={{
                        scale: 1.2,
                        rotate: 6,
                        transition: {
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        },
                      }}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: index * 0.08,
                      }} // Staggered appearance
                    >
                      <i className={tech}></i> {/* Devicon class */}
                    </motion.span>
                  ))}
                </div>
              )}
              {image && (
                <Image
                  className="inline-flex"
                  src={image}
                  width={200}
                  height={200}
                  alt={`${title} icon`}
                />
              )}
            </motion.div>
            {/* NEW: Description Header and Description in a semi-transparent box */}
            <motion.div
              variants={textBlockVariants} // Using a potentially new variant for slightly different animation timing
              className={cn(
                "grow   p-4 rounded-xl border", // Styling for the text block
                descriptionTextColor, // Dynamic text color for description
                "backdrop-blur-sm" // Apply blur effect
              )}
              style={{
                backgroundColor: textBlockBgColor,
                borderColor: textBlockBorderColor,
              }}
            >
              <h2 className="text-xl font-bold mb-1">{descriptionHeader}</h2>
              <p className="text-sm ">{description}</p>{" "}
              {/* Removed text-slate-500 as descriptionTextColor handles it */}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </SpotlightCard>
  )
}
