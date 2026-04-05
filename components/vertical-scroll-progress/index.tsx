import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { useEffect, useState, FC } from "react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

// --- Helpers ---
const formatLabel = (id: string) =>
  id.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

// --- Types ---
interface Section {
  id: string
  offsetTop: number
}
interface SectionMarkerProps {
  isCurrent: boolean
  onClick: () => void
  label: string
  isLightMode: boolean
}

// --- Minimal Marker with clean tooltip ---
const SectionMarker: FC<SectionMarkerProps> = ({
  isCurrent,
  onClick,
  label,
  isLightMode,
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
        className="z-10 rounded-full"
        animate={{
          width: isCurrent ? 8 : isHovered ? 7 : 5,
          height: isCurrent ? 8 : isHovered ? 7 : 5,
          backgroundColor: isCurrent
            ? isLightMode
              ? "#4f46e5"
              : "#818cf8"
            : isHovered
              ? isLightMode
                ? "#94a3b8"
                : "#64748b"
              : isLightMode
                ? "#cbd5e1"
                : "#374151",
          boxShadow: isCurrent
            ? isLightMode
              ? "0 0 8px 2px rgba(79,70,229,0.35)"
              : "0 0 8px 2px rgba(129,140,248,0.35)"
            : "none",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        suppressHydrationWarning
      />

      {/* Clean tooltip */}
      <motion.div
        className={cn(
          "absolute left-[calc(50%+14px)] whitespace-nowrap text-[10px] font-semibold tracking-wide px-2.5 py-1 rounded-md pointer-events-none",
          isLightMode
            ? "bg-slate-900 text-white"
            : "bg-white/10 text-white backdrop-blur-sm",
        )}
        style={{
          boxShadow: isLightMode
            ? "0 4px 12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)"
            : "0 4px 12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
        }}
        initial={{ opacity: 0, x: -6 }}
        animate={{
          opacity: showLabel ? 1 : 0,
          x: showLabel ? 0 : -6,
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        suppressHydrationWarning
      >
        {label}
        {/* Arrow pointing left */}
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 -left-[3px] w-[5px] h-[5px] rotate-45",
            isLightMode
              ? "bg-slate-900"
              : "bg-white/10",
          )}
          style={{
            backdropFilter: isLightMode ? undefined : "blur(8px)",
          }}
        />
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
  const { theme, systemTheme } = useTheme()

  const resolvedTheme = theme === "system" ? systemTheme : theme
  const isLightMode = mounted ? resolvedTheme === "light" : false

  // Accent color
  const accentColor = isLightMode ? "#4f46e5" : "#818cf8"

  const smoothProg = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 30,
  })
  const percent = useTransform(smoothProg, [0, 1], ["0%", "100%"])

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      if (window.scrollY > 100) setHasScrolled(true)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const calc = () => {
      const els = Array.from(
        document.querySelectorAll("section"),
      ) as HTMLElement[]
      const docHeight = document.documentElement.scrollHeight
      if (docHeight <= 0) return

      setSections(
        els
          .filter((el) => el.id && el.id.trim() !== "")
          .map((el) => ({
            id: el.id,
            offsetTop:
              ((el.offsetTop + el.offsetHeight / 2) / docHeight) * 100,
          })),
      )
    }

    calc()
    window.addEventListener("resize", calc)

    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.find((e) => e.isIntersecting)
        if (vis && vis.target.id) setCurrentSection(vis.target.id)
      },
      { rootMargin: "-40% 0px -60% 0px" },
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
      className="hidden fixed top-[20vh] left-6 bottom-20 w-20 md:flex flex-col items-center z-40 overflow-visible"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="relative flex-1 w-full py-4">
        {/* Thin base track */}
        <div
          className="absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 rounded-full"
          style={{
            background: isLightMode
              ? "rgba(203,213,225,0.5)"
              : "rgba(55,65,81,0.5)",
          }}
        />

        {/* Progress fill */}
        <motion.div
          className="absolute left-1/2 top-0 w-[1.5px] -translate-x-1/2 rounded-full"
          style={{
            height: percent,
            background: accentColor,
          }}
        />

        {/* Scroll head — small glowing dot */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
          style={{ top: percent }}
          suppressHydrationWarning
        >
          <div
            className="w-[7px] h-[7px] rounded-full"
            style={{
              background: isLightMode ? "#4f46e5" : "#a5b4fc",
              boxShadow: isLightMode
                ? "0 0 8px 2px rgba(79,70,229,0.4)"
                : "0 0 8px 2px rgba(165,180,252,0.35)",
            }}
          />
        </motion.div>

        {/* Section markers */}
        <div className="relative h-full w-full">
          {sections.map(({ id, offsetTop }, index) => (
            <div
              key={`section-${id}-${index}`}
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-full flex items-center justify-center"
              style={{ top: `${offsetTop}%` }}
            >
              <SectionMarker
                isCurrent={currentSection === id}
                onClick={() => goTo(id)}
                label={formatLabel(id)}
                isLightMode={isLightMode}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default LivingAuraScrollIndicator
