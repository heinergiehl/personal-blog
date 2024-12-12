import Image from "next/image"
import React, { useRef, useState, useEffect, ReactNode, RefObject } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
interface GridContainerProps {
  children: ReactNode
  gridCSS?: string
}

interface MousePositionProps {
  mousePosition: { x: number; y: number }
}

const GridContainer = ({
  children,
  gridCSS = "grid max-w-6xl grid-flow-dense grid-cols-12 gap-8 p-8 grid-rows-3 p-40 ",
}: GridContainerProps) => {
  const gridRef = useRef<HTMLDivElement>(null)
  const mousePosition = useMousePosition(gridRef) // Use custom hook
  return (
    <div ref={gridRef} className={`relative mx-auto ${gridCSS} `}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { mousePosition })
          : child
      )}
    </div>
  )
}

interface CardProps {
  mousePosition: { x: number; y: number }
  cardCSS?: string
  title: string
  description?: string
  image?: string
  images?: string[]
  techStackList?: string[]
  link?: string
}

const Card = ({
  mousePosition,
  image,
  images,
  title,
  description,
  techStackList,
  cardCSS = "col-span-3 row-span-12 rounded-lg transition-all duration-300 hover:shadow-lg relative",
  link,
}: CardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  useEffect(() => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      const relativeX = mousePosition.x - rect.left
      const relativeY = mousePosition.y - rect.top
      setGradientPosition({ x: relativeX, y: relativeY })
    }
  }, [mousePosition])
  const handleHoverStart = () => setIsHovered(true)
  const handleHoverEnd = () => setIsHovered(false)
  return (
    <motion.div
      ref={cardRef}
      className={`cursor-pointer rounded-lg transition-all duration-300 relative z-10 ${cardCSS}`}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
   
      initial={{ opacity: 0, y: 50 }} // Animation for initial load
      animate={{ opacity: 1, y: 0 }} // Bring to normal position
      exit={{ opacity: 0, y: 50 }} // Exit animation
      transition={{ type: "spring", stiffness: 300, damping: 20 }} // Smooth transition
    >
      {/* Gradient Layer */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          filter: isHovered ? "blur(10px)" : "blur(20px)",
        }}
        animate={{
          background: `radial-gradient(circle at ${gradientPosition.x}px ${gradientPosition.y}px, rgba(0, 255, 117, 0.8), rgba(55, 0, 255, 0.5))`,
          opacity: isHovered ? 1 : 0.4,
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
      />
      {/* Card Content */}
      <div className="h-full w-full dark:bg-slate-900 bg-slate-300 rounded-lg transition-all duration-200 hover:scale-[0.98] z-10">
        {/* Card Image */}
        <div
          className={cn([
            "relative  w-full flex items-center justify-center",
            image && "h-[200px]",
            images && "h-[300px] w-full ",
          ])}
        >
          {image && (
            <Image
              className="absolute rounded-t-lg h-[200px] w-full object-cover"
              src={image}
              alt="Picture of the author"
              width={300}
              height={300}
            />
          )}
          {images && (
            <div className="absolute h-[300px] w-[600px]">
              <div className="flex gap-1 w-full h-full justify-center items-center ">
                {images.map((img) => (
                  <Image
                    className=" h-[300px] w-[400px] object-fit first:rounded-l-lg last:rounded-r-lg"
                    src={img}
                    alt="Picture of the author"
                    width={400}
                    height={300}
                  />
                ))}
              </div>
            </div>
          )}
          {/* Animated Title */}
          {image || images ? (
            <motion.a
              className="border-2 border-slate-400  text-2xl font-bold bg-gradient-to-b from-transparent to-black rounded-lg p-4 z-20"
              initial={{ opacity: 0, y: 20 }} // Start hidden below the center
              animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} // Slide up on hover, hide otherwise
              transition={{ duration: 0.4 }}
              href={link}
            >
              {title}
            </motion.a>
          ) : (
            <div
              className="  text-2xl font-bold black:bg-gradient-to-b black:from-transparent black:to-black rounded-lg p-4 z-20
            "
            >
              {title}
            </div>
          )}
        </div>
        {/* Card Description */}
        {description && <div className="p-4 ">{description}</div>}
        {/* Tech Stack */}
        {techStackList && (
          <div className="p-4 ">
            <ul className="flex flex-wrap gap-2">
              {techStackList.map((tech) => (
                <li
                  className="bg-accent text-accent-foreground rounded-md px-2 py-1"
                  key={tech}
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  )
}

interface MousePosition {
  x: number
  y: number
}

export default function useMousePosition(
  containerRef: RefObject<HTMLElement>
): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  })
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const relativeX = event.clientX - rect.left
        const relativeY = event.clientY - rect.top
        setMousePosition({ x: relativeX, y: relativeY })
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove)
      }
    }
  }, [containerRef])
  return mousePosition
}

export { GridContainer, Card }
