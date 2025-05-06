import { motion } from "framer-motion"
import { useEffect, useState } from "react"
const ScrollIndicatorWithSections = () => {
  const [sections, setSections] = useState<HTMLElement[]>([])
  const [currentSection, setCurrentSection] = useState<string | null>(null)
  useEffect(() => {
    // Dynamically find all sections in the document
    const sectionElements = Array.from(document.querySelectorAll("section"))
    setSections(sectionElements)
    // Observer to track which section is in view
    const observer = new IntersectionObserver(
      (entries) => {
        // Filter for visible sections
        const visibleEntries = entries.filter((entry) => entry.isIntersecting)
        if (visibleEntries.length > 0) {
          // Prioritize section closest to the top of the viewport
          const nearestSection = visibleEntries.reduce((prev, curr) => {
            const prevTop = Math.abs(prev.boundingClientRect.top)
            const currTop = Math.abs(curr.boundingClientRect.top)
            return currTop < prevTop ? curr : prev
          })
          setCurrentSection(nearestSection.target.id)
        }
      },
      {
        threshold: 0.3,
      }
    )
    sectionElements.forEach((section) => observer.observe(section))
    return () => {
      sectionElements.forEach((section) => observer.unobserve(section))
    }
  }, [])
  return (
    <div className="hidden fixed top-20 left-0 h-[85vh] w-12 md:flex flex-col items-center justify-center z-50 ">
      {/* Full Height Vertical Line */}
      <div className="relative h-full w-1 bg-gray-300 rounded-lg flex justify-center">
        {/* Dynamic Section Indicators */}
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ scale: 0.8, opacity: 0.6 }}
            animate={{
              scale: currentSection === section.id ? 1.2 : 0.8,
              opacity: currentSection === section.id ? 1 : 0.6,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={`absolute w-4 h-4 rounded-full ${
              currentSection === section.id ? "bg-indigo-600" : "bg-gray-500"
            }`}
            style={{
              top: `${(index / (sections.length - 1)) * 97}%`, // Spread indicators evenly along the line
            }}
          >
            {/* Optional Label */}
            <span className="backdrop-blur-md bg-slate-300/40 absolute top-1/2 -translate-y-1/2 left-6 text-xs p-1 rounded-md text-slate-900 dark:text-slate-300 whitespace-nowrap">
              {section.id}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
export default ScrollIndicatorWithSections
