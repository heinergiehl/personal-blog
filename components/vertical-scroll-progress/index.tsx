import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const ScrollIndicatorWithSections = () => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [currentSection, setCurrentSection] = useState<string | null>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  let scrollTimeout: NodeJS.Timeout
  // Calculate scroll progress based on vertical scroll
  const handleScroll = () => {
    setIsScrolling(true)
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop
    const scrollHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight
    const progress = (scrollTop / scrollHeight) * 100
    setScrollProgress(progress)
    // Clear any existing timeout and start a new one
    clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(() => {
      setIsScrolling(false)
    }, 400) // Hide after 1 second of no scrolling
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(scrollTimeout) // Cleanup on unmount
    }
  }, [])
  // Track which section is currently in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.id)
          }
        })
      },
      {
        threshold: 0.25, // Trigger when 25% of the section is visible
      }
    )
    const sections = document.querySelectorAll("section")
    sections.forEach((section) => observer.observe(section))
    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [])
  return (
    <>
      <div
        className="fixed top-0 mt-[70px] left-0 w-1 bg-gray-300 opacity-20 z-40 ml-4 
      "
      />
      {/* Scroll Progress Bar */}
      <motion.div
        className={cn([
          "  drop-shadow-[0px_0px_2px_rgba(79,_170,_229,_1)] fixed mt-[70px] top-0 left-0 w-1 bg-gradient-to-b from-indigo-500/10 via-indigo-500/40 to-indigo-500/100 z-50 ml-4 flex justify-center",
        ])}
        style={{ height: `${scrollProgress}%` }}
        initial={{ height: 0 }}
        animate={{
          height: `${scrollProgress - 10}%`,
          opacity: isScrolling ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          style={{ top: `${scrollProgress > 2 ? scrollProgress - 2 : 0}%` }}
          className={cn([
            "fixed flex w-4 h-4 bg-indigo-600 rounded-full z-50 mt-[70px]",
            scrollProgress > 90 ? "mt-[0px]" : "mt-[70px]",
          ])}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {currentSection && (
            <motion.h2
              className="fixed  text-sm font-semibold ml-4 left-6 transform"
              initial={{ opacity: 0 }}
              animate={{ opacity: isScrolling ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {currentSection}
            </motion.h2>
          )}
        </motion.div>
      </motion.div>
    </>
  )
}

export default ScrollIndicatorWithSections
