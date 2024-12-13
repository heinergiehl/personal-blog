"use client"

import React, { useRef, useState, useEffect, ReactNode, RefObject } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

interface GridContainerProps {
  children: ReactNode
  gridCSS?: string
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

interface MousePosition {
  x: number
  y: number
}

const GridContainer = ({
  children,
  gridCSS = "grid max-w-6xl md:w-full overflow-hidden grid-flow-dense grid-cols-12 md:gap-8 grid-rows-3 gap-2 h-full md:p-40",
}: GridContainerProps) => {
  const gridRef = useRef<HTMLDivElement>(null)
  const mousePosition = useMousePosition(gridRef)

  return (
    <div
      ref={gridRef}
      className={`relative mx-auto ${gridCSS}`}
      id="bento-container"
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { mousePosition })
          : child
      )}
    </div>
  )
}

const Card = ({
  mousePosition,
  image,
  images,
  title,
  description,
  techStackList,
  cardCSS = "col-span-3 row-span-12 rounded-lg transition-all duration-300 hover:shadow-lg relative ",
  link,
}: CardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      const relativeX = mousePosition.x - rect.left
      const relativeY = mousePosition.y - rect.top
      setGradientPosition({ x: relativeX, y: relativeY })
    }
  }, [mousePosition])

  return (
    <motion.div
      ref={cardRef}
      className={`rounded-lg transition-all duration-300 relative z-10 ${cardCSS}`}
    >
      {/* Gradient Layer */}
      <div
        className="absolute inset-0 pointer-events-none z-[-1]"
        style={{
          background: `radial-gradient(circle at ${gradientPosition.x}px ${gradientPosition.y}px, rgba(0, 255, 117, 0.9), rgba(55, 0, 255, 0.9))`,
          filter: "blur(8px)",
          transition: "background 0.8s ease-out",
        }}
      ></div>

      <div className="h-full dark:bg-slate-900 bg-slate-300 rounded-lg">
        {/* Card Image */}
        {image && (
          <div className="relative flex items-center justify-center">
            <Image
              className="rounded-t-lg object-contain w-full"
              src={image}
              alt={title}
              width={300}
              height={300}
            />
          </div>
        )}
        {images && (
          <div className="relative flex items-center justify-center">
            <Image
              className="rounded-t-lg w-full h-[200px] first:rounded-t-md first:rounded-r-none"
              src={images[0]}
              alt={title}
              width={300}
              height={300}
            />
            <Image
              className="rounded-t-lg object-cover w-[300px] h-[200px] last:rounded-l-none first:rounded-r-md"
              src={images[1]}
              alt={title}
              width={300}
              height={300}
            />
          </div>
        )}

        {/* Card Content */}
        <div className="p-4">
          <h3 className="text-lg font-bold">
            {link ? (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {title}
              </a>
            ) : (
              title
            )}
          </h3>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
          {techStackList && (
            <ul className="mt-2 flex flex-wrap gap-2">
              {techStackList.map((tech) => (
                <li
                  key={tech}
                  className="bg-indigo-500 text-white px-2 py-1 rounded"
                >
                  {tech}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function useMousePosition(containerRef: RefObject<HTMLElement>): MousePosition {
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
