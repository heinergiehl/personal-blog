import React, { useRef, useState, useEffect } from "react"
import useMousePosition from "@/utils/useMousePosition"
import { GRADIENT_FROM, GRADIENT_TO } from "@/config"
import { motion, useMotionTemplate } from "framer-motion"
type SpotlightProps = {
  children: React.ReactNode
  className?: string
}
export default function Spotlight({
  children,
  className = "bg-blue-500 ",
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mousePosition = useMousePosition()
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const containerSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 })
  const [boxes, setBoxes] = useState<Array<HTMLElement>>([])
  useEffect(() => {
    containerRef.current &&
      setBoxes(
        Array.from(containerRef.current.children).map((el) => el as HTMLElement)
      )
  }, [containerRef.current?.children])
  useEffect(() => {
    initContainer()
    window.addEventListener("resize", initContainer)
    return () => {
      window.removeEventListener("resize", initContainer)
    }
  }, [setBoxes, containerRef.current?.children])
  useEffect(() => {
    onMouseMove()
  }, [mousePosition])
  const initContainer = () => {
    if (containerRef.current) {
      containerSize.current.w = containerRef.current.offsetWidth
      containerSize.current.h = containerRef.current.offsetHeight
    }
  }
  const onMouseMove = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const { w, h } = containerSize.current
      const x = mousePosition.x - rect.left
      const y = mousePosition.y - rect.top

      mouse.current.x = x
      mouse.current.y = y
      boxes.forEach((box) => {
        const boxRect = box.getBoundingClientRect()
        // Calculate mouse position relative to each box
        const boxX = mousePosition.x - boxRect.left
        const boxY = mousePosition.y - boxRect.top
        box.style.setProperty("--mouse-x", `${boxX}px`)
        box.style.setProperty("--mouse-y", `${boxY}px`)
      })
    }
  }
  return (
    <div className={className} ref={containerRef} id="spotlight-container">
      {children}
    </div>
  )
}
type SpotlightCardProps = {
  children: React.ReactNode
  className?: string
  cardRef?: React.RefObject<HTMLDivElement>
}
export function SpotlightCard({
  children,
  cardRef,
  className = "",
}: SpotlightCardProps) {
  const gradientSize = 200
  const gradientOpacity = 0.6
  const gradientColor = "rgba(255, 255, 255, 0.4)"
  const gradientFrom = GRADIENT_FROM
  const gradientTo = GRADIENT_TO
  return (
    <div
      ref={cardRef}
      id="spotlight-card"
      style={
        {
          "--gradient-from": GRADIENT_FROM,
          "--gradient-to": GRADIENT_TO,
          "--blur": "160px",
        } as React.CSSProperties
      }
      className={`
        relative h-full  rounded-none lg:rounded-3xl p-px overflow-hidden 
        dark:bg-indigo-700 bg-opacity-50 bg-indigo-400
       
     
        ${className}
      `}
    >
      <motion.div
        className="pointer-events-none absolute inset-px z-30 blur-[100px] rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at var(--mouse-x) var(--mouse-y), ${gradientColor}, transparent 100%)
          `,
          opacity: gradientOpacity,
        }}
      />
      <motion.div
        className="pointer-events-none absolute  z-0 inset-[0px] rounded-xl duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at var(--mouse-x) var(--mouse-y),
              ${gradientFrom}, 
              ${gradientTo}, 
              transparent 100%
            )
          `,
        }}
      />
      {children}
    </div>
  )
}
