"use client"

import React, { useState, useRef, useLayoutEffect, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ModeToggle } from "./theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import MobileNav from "./mobile-nav"
import { Menu } from "lucide-react"
import { Button } from "./ui/button"

/* ───────────────────────────── Nav items ─────────────────────────────── */
export const navItems = [
  { name: "About", href: "/#About Me" },
  { name: "Timeline", href: "/#Timeline" },
  { name: "Skills", href: "/#Skills" },
  { name: "Projects", href: "/#Projects" },
  { name: "Plugins", href: "/filament-plugins" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/#Contact" },
  { name: "Feedback", href: "/feedback" },
]

/* ───────────────────────────── Constants ─────────────────────────────── */
const HPAD = 8 // horizontal pill padding
const VPAD = 4 // vertical pill padding

const linkVariants = {
  rest: { y: 0, scale: 1 },
  hover: { y: 0, scale: 1 },
  pulse: {
    // one-off celebration
    y: [0, -4, 0, -4, 0],
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      times: [0, 0.5, 0.7, 0.9, 1],
    },
  },
}

/* ───────────────────────────── Component ─────────────────────────────── */
const NavBar: React.FC = () => {
  const pathname = usePathname()
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

  const getTransitionTypes = (href: string) => {
    if (
      href === "/feedback" ||
      href === "/filament-plugins" ||
      href === "/blog"
    )
      return ["nav-forward"]
    if (href === "/" || (href.startsWith("/#") && pathname !== "/")) {
      return ["nav-back"]
    }
    return undefined
  }

  /* ───────────────────────────── JSX ─────────────────────────────── */
  return (
    <nav
      className="w-full sticky top-5 flex justify-center z-30"
      style={{ viewTransitionName: "site-header" }}
    >
      {/* Single-level flex row: logo | links (desktop) | toggle | hamburger (mobile) */}
      <div className="w-full md:max-w-[900px] border border-border bg-background/70 backdrop-blur-md md:rounded-xl px-4 py-2 mx-4 flex items-center gap-3">
        {/* Logo */}
        <Link
          href="/"
          transitionTypes={pathname === "/" ? undefined : ["nav-back"]}
          className="shrink-0 flex items-center gap-2 group select-none"
        >
          {/* </> badge */}
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 dark:from-indigo-500 dark:to-violet-500 shadow-sm shadow-indigo-600/20 group-hover:from-indigo-500 group-hover:to-violet-500 transition-all duration-200">
            <span className="text-white font-black text-[11px] leading-none font-mono tracking-tighter">
              &lt;/&gt;
            </span>
          </span>
          {/* Two-tone wordmark */}
          <span className="text-sm font-bold tracking-tight leading-none">
            <span className="text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
              Heiner
            </span>
            <span className="text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-300 transition-colors duration-200">
              Develops
            </span>
          </span>
        </Link>

        {/* Desktop nav — expands to fill remaining space, links right-aligned */}
        <ul
          ref={navListRef}
          className="hidden md:flex relative flex-1 justify-end items-center gap-0.5 text-sm"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          {/* Sliding pill highlight */}
          <AnimatePresence>
            {hoveredIdx !== null && (
              <motion.div
                key="pill"
                className="absolute bg-black/5 dark:bg-white/10 rounded-md z-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, ...pill }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </AnimatePresence>

          {navItems.map((item, i) => (
            <li key={item.href} className="relative z-10">
              {item.href.startsWith("/") ? (
                <Link
                  ref={(el) => {
                    linkRefs.current[i] = el
                  }}
                  href={item.href}
                  transitionTypes={getTransitionTypes(item.href)}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onClick={() => handleClick(item.href)}
                  className={`relative px-3 py-1.5 rounded-md cursor-pointer whitespace-nowrap text-sm transition-colors duration-150 select-none ${
                    activeHref === item.href
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <motion.span
                    initial={false}
                    animate={animatingHref === item.href ? "pulse" : "rest"}
                    variants={linkVariants}
                    onAnimationComplete={() => {
                      if (animatingHref === item.href) setAnimatingHref(null)
                    }}
                    style={{ display: "inline-block" }}
                  >
                    {item.name}
                  </motion.span>
                </Link>
              ) : (
                <a
                  ref={(el) => {
                    linkRefs.current[i] = el
                  }}
                  href={item.href}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onClick={() => handleClick(item.href)}
                  className={`relative px-3 py-1.5 rounded-md cursor-pointer whitespace-nowrap text-sm transition-colors duration-150 select-none ${
                    activeHref === item.href
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <motion.span
                    initial={false}
                    animate={animatingHref === item.href ? "pulse" : "rest"}
                    variants={linkVariants}
                    onAnimationComplete={() => {
                      if (animatingHref === item.href) setAnimatingHref(null)
                    }}
                    style={{ display: "inline-block" }}
                  >
                    {item.name}
                  </motion.span>
                </a>
              )}
            </li>
          ))}
        </ul>

        {/* Spacer on mobile so logo stays left and toggle+hamburger stay right */}
        <div className="flex-1 md:hidden" />

        {/* Dark-mode toggle — always visible */}
        <ModeToggle />

        {/* Mobile hamburger */}
        <div className="md:hidden shrink-0">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[60vw]">
              <MobileNav />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
