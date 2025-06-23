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
      className="relative flex items-center justify-center h-full w-full cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dot */}
      <motion.div
        className="z-10 h-3 w-3 rounded-full border-2 border-white bg-transparent"
        animate={{
          scale: showLabel ? 1.5 : 1,
          backgroundColor: isCurrent ? "#fff" : "rgba(255,255,255,0.4)",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <motion.div
          className="h-full w-full rounded-full"
          animate={{
            boxShadow: isCurrent
              ? `0 0 20px 4px ${COLOR_ONE}`
              : isHovered
              ? `0 0 12px 3px rgba(255,255,255,0.7)`
              : "0 0 0 0px rgba(0,0,0,0)",
          }}
          transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
        />
      </motion.div>

      {/* Polished Tooltip Label */}
      <motion.div
        className="absolute left-[70%] whitespace-nowrap text-sm font-semibold text-white px-3 py-1 rounded-full shadow-lg pointer-events-none"
        style={{
          background: `linear-gradient(to right, ${COLOR_ONE}, ${COLOR_TWO})`,
        }}
        initial={{ opacity: 0, x: -10 }}
        animate={{
          opacity: showLabel ? 1 : 0,
          x: showLabel ? 0 : -10,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
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
  const { scrollYProgress } = useScroll()

  // smooth raw 0→1 scroll progress
  const smoothProg = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 40,
  })

  // map 0–1 to 0%–100%
  const percent = useTransform(smoothProg, [0, 1], ["0%", "100%"])

  useEffect(() => {
    const calc = () => {
      const els = Array.from(
        document.querySelectorAll("section")
      ) as HTMLElement[]
      const docHeight = document.documentElement.scrollHeight
      if (docHeight <= 0) return

      // **Place each dot at the center of its section, relative to the full doc height**
      setSections(
        els.map((el) => {
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
        if (vis) setCurrentSection(vis.target.id)
      },
      { rootMargin: "-40% 0px -60% 0px" }
    )
    document.querySelectorAll("section").forEach((s) => obs.observe(s))

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
      document.querySelectorAll("section").forEach((s) => obs.unobserve(s))
    }
  }, [sections.length])

  const goTo = (id: string) =>
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" })

  return (
    <motion.div
      className="hidden fixed top-0 left-6 h-screen w-28 md:flex flex-col items-center justify-center z-50 overflow-visible"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="relative flex-1 w-full py-8">
        {/* 1) Living Aura Pulse */}
        <motion.div
          className="absolute inset-0 left-1/2 -translate-x-1/2 w-8 blur-2xl"
          style={{
            background: `linear-gradient(to bottom, ${COLOR_ONE}, ${COLOR_TWO})`,
          }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* 2) Base Gradient Track (unused = brighter) */}
        <div
          className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 rounded-full"
          style={{
            background: `linear-gradient(to bottom, ${COLOR_ONE}, ${COLOR_TWO})`,
            filter: `brightness(1.4)`,
            boxShadow: `0 0 8px 1px ${COLOR_ONE}`,
          }}
        />

        {/* 3) Scroll-Fill (used = darker) */}
        <motion.div
          className="absolute left-1/2 top-0 w-1 -translate-x-1/2 rounded-full"
          style={{
            height: percent,
            background: `rgba(0, 0, 0, 0.3)`,
          }}
        />

        {/* 4) Comet Head */}
        <motion.div
          className="absolute left-1/2 w-4 h-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            top: percent,
            background: `radial-gradient(circle at center, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.1) 60%, transparent 100%)`,
            filter: `blur(8px)`,
          }}
          transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
        />

        {/* 5) Section Markers + Labels */}
        <div className="relative h-full w-full">
          {sections.map(({ id, offsetTop }) => (
            <div
              key={id}
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
