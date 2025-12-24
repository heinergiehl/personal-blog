"use client"

import React, { useState, useRef, useLayoutEffect, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import LoadingBar from "react-top-loading-bar"
import { ModeToggle } from "./theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import MobileNav from "./mobile-nav"
import { Menu } from "lucide-react"
import { Button } from "./ui/button"

/* ───────────────────────────── Nav items ─────────────────────────────── */
export const navItems = [
  { name: "About", href: "#About Me" },
  { name: "Timeline", href: "#Timeline" },
  { name: "Skills", href: "#Skills" },
  { name: "Projects", href: "#Projects" },
  { name: "Contact", href: "#Contact" },
]

/* ───────────────────────────── Constants ─────────────────────────────── */
const HPAD = 8 // horizontal pill padding
const VPAD = 4 // vertical pill padding

const linkVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.12 },
  pulse: {
    // one-off celebration
    scale: [1, 1.15, 1, 1.15, 1],
    rotate: [0, -10, 0, 10, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      times: [0, 0.5, 0.7, 0.9, 1],
    },
  },
}

/* ───────────────────────────── Component ─────────────────────────────── */
const NavBar: React.FC = () => {
  /* loading bar -------------------------------------------------------- */
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()
  useEffect(() => {
    setProgress(30)
    const t1 = setTimeout(() => setProgress(70), 100)
    const t2 = setTimeout(() => setProgress(100), 800)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [pathname])
  useEffect(() => {
    const t = setTimeout(() => setProgress(0), 900)
    return () => clearTimeout(t)
  }, [])

  /* mobile sheet ------------------------------------------------------- */
  const [sheetOpen, setSheetOpen] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)")
    const handler = (e: MediaQueryListEvent) => e.matches && setSheetOpen(false)
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [])

  /* sliding pill ------------------------------------------------------- */
  const [activeHref, setActiveHref] = useState(navItems[0].href)
  const [animatingHref, setAnimatingHref] = useState<string | null>(null) // <- NEW
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [pill, setPill] = useState({ left: 0, top: 0, width: 0, height: 0 })

  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const navListRef = useRef<HTMLUListElement | null>(null)

  const movePillToIdx = (idx: number) => {
    const linkEl = linkRefs.current[idx]
    const listEl = navListRef.current
    if (!linkEl || !listEl) return
    const { left: lX, top: lY, width, height } = linkEl.getBoundingClientRect()
    const { left: listX, top: listY } = listEl.getBoundingClientRect()
    setPill({
      left: lX - listX - HPAD,
      top: lY - listY - VPAD,
      width: width + HPAD * 2,
      height: height + VPAD * 2,
    })
  }

  useLayoutEffect(() => {
    if (hoveredIdx !== null) movePillToIdx(hoveredIdx)
  }, [hoveredIdx])
  useEffect(() => {
    const onResize = () => {
      if (hoveredIdx !== null) movePillToIdx(hoveredIdx)
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [hoveredIdx])

  /* helper to trigger one-shot pulse ----------------------------------- */
  const handleClick = (href: string) => {
    setActiveHref(href) // normal “active” text style
    setAnimatingHref(href) // flag to play pulse once
  }

  /* ───────────────────────────── JSX ─────────────────────────────── */
  return (
    <nav className="w-full sticky top-5 flex justify-center z-30">
      <LoadingBar
        color="#6028ff"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        height={3}
        shadow={false}
        containerStyle={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 9999,
        }}
      />
      <div className="w-full md:max-w-[800px] border border-gray-700 bg-background/60 backdrop-blur md:rounded-lg px-[50px] py-2 flex items-center justify-between gap-x-4 overflow-hidden">
        {/* logo + nav + theme toggle */}
        <div className="flex items-center justify-between md:justify-start space-x-4 w-full">
          <div className="text-lg font-bold md:text-xl">
            <Link href="/">HeinerDevelops</Link>
          </div>

          {/* desktop nav */}
          <ul
            ref={navListRef}
            className="hidden md:flex relative flex-1 justify-end space-x-4 text-sm"
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {/* pill */}
            <AnimatePresence>
              {hoveredIdx !== null && (
                <motion.div
                  key="pill"
                  className="absolute dark:bg-white/10 bg-slate-200 rounded-md z-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, ...pill }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </AnimatePresence>

            {/* links */}
            {navItems.map((item, i) => (
              <li key={item.href} className="relative z-10">
                <a
                  ref={(el) => {
                    linkRefs.current[i] = el
                  }}
                  href={item.href}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onClick={() => handleClick(item.href)}
                  className={`relative px-3 py-1 rounded-md cursor-pointer ${
                    activeHref === item.href
                      ? "dark:text-white text-gray-900"
                      : "text-gray-700 dark:text-gray-200"
                  }`}
                >
                  <motion.span
                    initial={false}
                    animate={animatingHref === item.href ? "pulse" : "rest"}
                    whileHover="hover"
                    variants={linkVariants}
                    onAnimationComplete={() => {
                      if (animatingHref === item.href) setAnimatingHref(null)
                    }}
                    style={{ display: "inline-block" }}
                  >
                    {item.name}
                  </motion.span>
                </a>
              </li>
            ))}
          </ul>

          <ModeToggle />
        </div>

        {/* mobile nav trigger */}
        <div className="md:hidden flex items-start justify-end">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[40%]">
              <MobileNav />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
