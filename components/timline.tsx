"use client"
import React, { useRef, useState, useEffect } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  animate,
} from "framer-motion"
interface TimelineItem {
  title: string
  company: string
  timeframe: string
  description: string
}
const timelineData: TimelineItem[] = [
  {
    title: "Freelancing Fullstack Web Developer",
    company: "Self-employed",
    timeframe: "01.2022 - Present",
    description:
      "Providing full-stack web development services, including frontend and backend solutions. Specializing in modern frameworks such as ReactJS, NextJS, and NestJS.",
  },
  {
    title: "Intern - Application Development",
    company: "Unternehmen.online",
    timeframe: "05.2021 - 08.2021",
    description:
      "Gained practical experience in application development. Focused on modern web technologies and best practices.",
  },
  {
    title: "Self-study: Web Development",
    company: "Self-initiated",
    timeframe: "05.2019 - 05.2021",
    description:
      "Dedicated self-study in web development, mastering frontend and backend frameworks, databases, and deployment tools.",
  },
]
export default function Timeline() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  // UseScroll for the overall section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })
  // Map scroll progress to scale for the line
  const rawLineScale = useTransform(scrollYProgress, [0, 1], [0, 1])
  const lineScale = useSpring(rawLineScale, {
    stiffness: 150,
    damping: 20,
    mass: 1.5,
  })
  // Refs for each timeline item so we can detect intersection
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const timelineLineRef = useRef<HTMLDivElement | null>(null)
  // Track which items are "activated" (the line has hit them)
  const [activatedIndices, setActivatedIndices] = useState<
    Record<number, boolean>
  >({})
  const [dotActivatedIndices, setDotActivatedIndices] = useState<
    Record<number, boolean>
  >({})
  // Intersection logic: the line is pinned at center, so we check each item’s bounding box
  useEffect(() => {
    function handleScroll() {
      const centerY = window.innerHeight / 2 // Center of the viewport
      const lineRect = timelineLineRef.current?.getBoundingClientRect()
      itemRefs.current.forEach((ref, idx) => {
        if (!ref || !lineRect) return
        const itemRect = ref.getBoundingClientRect()
        const dotRect = {
          top: itemRect.top + itemRect.height / 2 - 3, // Dot center (adjust as needed)
          bottom: itemRect.top + itemRect.height / 2 + 3, // Dot center + some range
          left: lineRect.left,
          right: lineRect.right,
        }
        const isIntersecting =
          dotRect.top <= lineRect.bottom && dotRect.bottom >= lineRect.top
        // Update dot activation
        setDotActivatedIndices((prev) => ({
          ...prev,
          [idx]: isIntersecting,
        }))
        // Update card activation (as before), but with threshhold, so it doesn't flicker and stays active longer
        const isCardIntersecting =
          itemRect.top <= centerY && itemRect.bottom >= centerY - 150
        setActivatedIndices((prev) => ({
          ...prev,
          [idx]: isCardIntersecting,
        }))
      })
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial check
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  // Dot, and Timeframe variants
  const dotVariants = {
    hidden: { scale: 0, opacity: 0 },
    show: { scale: 1, opacity: 1 },
  }
  const timeframeVariants = (isEven: boolean) => ({
    hidden: { opacity: 0, x: isEven ? 80 : -80 },
    show: { opacity: 1, x: 0 },
  })
  return (
    <section
      id="Timeline"
      ref={containerRef}
      className="   relative flex flex-col md:px-20 py-16 mt-24
                 bg-gradient-to-r from-white via-gray-100 to-gray-50 
                 dark:from-gray-800 dark:via-gray-900 dark:to-black"
    >
      {/* The background, absolutely covering the entire section */}
      {/* <div className="absolute inset-0">
        <HexGridBackground />
      </div> */}
      {/* Heading */}
      <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-12">
        Carreer
      </h2>
      {/* Sticky timeline line pinned in the center of the viewport */}
      <motion.div
        ref={timelineLineRef}
        className="pointer-events-none bg-gradient-to-b from-blue-300 to-purple-300 w-1 absolute left-[calc(50%-2px)] -translate-x-1/2"
        style={{
          position: "sticky",
          top: "12%", // pin at vertical center
          transform: "translate(-50%, -50%)", // center horizontally and vertically
          height: "100vh", // shorter so you don't have to scroll too far
          scaleY: lineScale,
          transformOrigin: "top center",
        }}
      />
      {/* Timeline Items */}
      <div className="relative max-w-4xl mx-auto mt-16 space-y-24 mb-32">
        {timelineData.map((item, idx) => {
          const ie = itemRefs.current[idx]
          const isEven = idx % 2 === 0
          const isActive = !!activatedIndices[idx] // has the line "hit" this item?
          const isDotActive = !!dotActivatedIndices[idx] // has the line "hit" this item's dot?
          return (
            <motion.div
              key={idx}
              ref={(el) => {
                itemRefs.current[idx] = el
              }} // store ref
              className={`relative flex flex-col md:flex-row items-start md:items-center md:justify-stretch justify-center   ${
                isEven ? "md:flex-row  " : "md:flex-row-reverse  "
              }`}
              initial={{ opacity: 0 }}
              animate={
                isActive && activatedIndices[idx]
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0 } // fade out if not active
              }
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* The Dot in the center line */}
              <motion.div
                className="absolute left-[calc(50%-0.75rem)]  w-6 h-6 rounded-full
                           bg-white border-4 border-blue-500 shadow-md -z-0"
                variants={dotVariants}
                initial="hidden"
                animate={isDotActive ? "show" : "hidden"}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              />
              {/* Timeframe (desktop), on opposite side */}
              <motion.div
                className={`hidden md:block absolute top-1/2 -translate-y-1/2 ${
                  isEven ? "right-[2.5rem]" : "left-[2.5rem]"
                }`}
                variants={timeframeVariants(isEven)}
                initial="hidden"
                animate={isActive ? "show" : "hidden"}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  delay: idx * 0.1,
                }}
              >
                <span className="text-xl dark:text-gray-400 uppercase tracking-wide">
                  {item.timeframe}
                </span>
              </motion.div>
              {/* Card */}
              <div
                className={`relative md:w-1/2 mt-8 md:mt-0 transition-size duration-500 p-5 ${
                  isEven ? "md:ml-10" : "md:mr-10"
                }${isDotActive ? " scale-[100%]" : " scale-[80%]"} `}
              >
                <motion.div
                  className="bg-white/40 dark:bg-gray-800/60 
                             backdrop-blur-sm p-6 md:rounded-xl 
                             shadow-lg hover:shadow-2xl 
                             transition-shadow duration-300"
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {item.title}
                  </h3>
                  <h4 className="text-base font-medium text-gray-600 dark:text-gray-300 mb-4">
                    {item.company}
                  </h4>
                  {/* Timeframe in the card for mobile */}
                  <span className="text-sm text-gray-500 dark:text-gray-400 mb-4 block uppercase tracking-wide md:hidden">
                    {item.timeframe}
                  </span>
                  <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
