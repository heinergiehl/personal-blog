import { COLOR_ONE, COLOR_TWO } from "@/config"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { useEffect, useState, FC } from "react"

// --- Helpers ---
/** turn "my-section_id" → "My Section Id" */
const formatLabel = (id: string) =>
  id.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

// --- Type Definitions ---
interface Section {
  id: string
  offsetTop: number
}
interface SectionMarkerProps {
  isCurrent: boolean
  onClick: () => void
  label: string
}

// --- Redesigned Marker with Polished Label ---
const SectionMarker: FC<SectionMarkerProps> = ({
  isCurrent,
  onClick,
  label,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const showLabel = isCurrent || isHovered

  return (
    <div
      className="relative flex items-center justify-center h-full w-full cursor-pointer group"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dot */}
      <motion.div
        className="z-10 h-3.5 w-3.5 rounded-full border-2 backdrop-blur-sm"
        animate={{
          scale: showLabel ? 1.4 : 1,
          borderColor: isCurrent ? COLOR_ONE : "rgba(255,255,255,0.6)",
          backgroundColor: isCurrent 
            ? COLOR_ONE 
            : isHovered 
            ? "rgba(255,255,255,0.3)" 
            : "rgba(255,255,255,0.1)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <motion.div
          className="h-full w-full rounded-full"
          animate={{
            boxShadow: isCurrent
              ? `0 0 20px 4px ${COLOR_ONE}, 0 0 10px 2px ${COLOR_TWO}`
              : isHovered
              ? `0 0 12px 3px rgba(255,255,255,0.5)`
              : "0 0 0 0px rgba(0,0,0,0)",
          }}
          transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
        />
      </motion.div>

      {/* Polished Tooltip Label */}
      <motion.div
        className="absolute left-[75%] whitespace-nowrap text-xs font-bold text-white px-4 py-1.5 rounded-full backdrop-blur-md border pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${COLOR_ONE}, ${COLOR_TWO})`,
          borderColor: "rgba(255,255,255,0.2)",
          boxShadow: `0 4px 12px ${COLOR_ONE}40`,
        }}
        initial={{ opacity: 0, x: -10, scale: 0.9 }}
        animate={{
          opacity: showLabel ? 1 : 0,
          x: showLabel ? 0 : -10,
          scale: showLabel ? 1 : 0.9,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 22 }}
      >
        {label}
      </motion.div>
    </div>
  )
}

// --- Main Scroll Indicator ---
const LivingAuraScrollIndicator: FC = () => {
  const [sections, setSections] = useState<Section[]>([])
  const [currentSection, setCurrentSection] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const { scrollYProgress } = useScroll()

  // smooth raw 0→1 scroll progress
  const smoothProg = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 40,
  })

  // map 0–1 to 0%–100%
  const percent = useTransform(smoothProg, [0, 1], ["0%", "100%"])

  useEffect(() => {
    setMounted(true)
    
    // Only show after user scrolls a bit
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setHasScrolled(true)
      }
    }
    
    handleScroll() // Check initial scroll position
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const calc = () => {
      const els = Array.from(
        document.querySelectorAll("section")
      ) as HTMLElement[]
      const docHeight = document.documentElement.scrollHeight
      if (docHeight <= 0) return

      // **Place each dot at the center of its section, relative to the full doc height**
      // Filter out sections without IDs to prevent duplicate empty keys
      setSections(
        els
          .filter((el) => el.id && el.id.trim() !== "")
          .map((el) => {
            const midOfSection = el.offsetTop + el.offsetHeight / 2
            return {
              id: el.id,
              offsetTop: (midOfSection / docHeight) * 100,
            }
          })
      )
    }

    calc()
    window.addEventListener("resize", calc)

    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.find((e) => e.isIntersecting)
        if (vis && vis.target.id) setCurrentSection(vis.target.id)
      },
      { rootMargin: "-40% 0px -60% 0px" }
    )
    document.querySelectorAll("section[id]").forEach((s) => obs.observe(s))

    const onScroll = () => {
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2
      if (atBottom && sections.length)
        setCurrentSection(sections[sections.length - 1].id)
    }
    window.addEventListener("scroll", onScroll)

    return () => {
      window.removeEventListener("resize", calc)
      window.removeEventListener("scroll", onScroll)
      document.querySelectorAll("section[id]").forEach((s) => obs.unobserve(s))
    }
  }, [sections.length])

  const goTo = (id: string) =>
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" })

  if (!mounted || !hasScrolled) return null

  return (
    <motion.div
      className="hidden fixed top-[20vh] left-6 bottom-20 w-28 md:flex flex-col items-center z-40 overflow-visible"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative flex-1 w-full py-4">
        {/* Subtle background glow */}
        <motion.div
          className="absolute inset-0 left-1/2 -translate-x-1/2 w-12 blur-3xl pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, ${COLOR_ONE}20, ${COLOR_TWO}20)`,
          }}
          animate={{ opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Base Gradient Track */}
        <div
          className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 rounded-full"
          style={{
            background: `linear-gradient(to bottom, ${COLOR_ONE}, ${COLOR_TWO})`,
            opacity: 0.3,
            boxShadow: `0 0 6px 1px ${COLOR_ONE}40`,
          }}
        />

        {/* Scroll-Fill (progress) */}
        <motion.div
          className="absolute left-1/2 top-0 w-1 -translate-x-1/2 rounded-full"
          style={{
            height: percent,
            background: `linear-gradient(to bottom, ${COLOR_ONE}, ${COLOR_TWO})`,
            boxShadow: `0 0 10px 2px ${COLOR_ONE}50`,
          }}
        />

        {/* Enhanced Comet Head */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            top: percent,
            width: "6px",
            height: "80px",
          }}
        >
          {/* Core bright spot */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
            style={{
              background: "rgba(255,255,255,0.95)",
              boxShadow: `0 0 15px 3px ${COLOR_ONE}, 0 0 8px 2px ${COLOR_TWO}`,
            }}
          />
          {/* Glow trail */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `linear-gradient(to bottom, ${COLOR_ONE}90, ${COLOR_TWO}40, transparent)`,
              filter: "blur(10px)",
            }}
          />
        </motion.div>

        {/* 5) Section Markers + Labels */}
        <div className="relative h-full w-full">
          {sections.map(({ id, offsetTop }, index) => (
            <div
              key={`section-${id}-${index}`}
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-full flex items-center justify-center"
              style={{ top: `${offsetTop}%` }}
            >
              <SectionMarker
                isCurrent={currentSection === id}
                onClick={() => goTo(id)}
                label={formatLabel(id)}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default LivingAuraScrollIndicator
