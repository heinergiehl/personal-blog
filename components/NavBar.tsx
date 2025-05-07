"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { ModeToggle } from "./theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import LoadingBar from "react-top-loading-bar"
import { usePathname } from "next/navigation"
import MobileNav from "./mobile-nav"
import { Menu } from "lucide-react"
import { Button } from "./ui/button"

export const navItems = [
  { name: "About", href: "#About Me" },
  { name: "Timeline", href: "#Timeline" },
  { name: "Skills", href: "#Skills" },
  { name: "Projects", href: "#Projects" },
  { name: "Contact", href: "#Contact" },
]

const NavBar = () => {
  const [progress, setProgress] = useState(0)
  const [sheetOpen, setSheetOpen] = useState(false)
  const pathname = usePathname()

  // Loading bar on page‐change
  useEffect(() => {
    setProgress(30)
    setTimeout(() => setProgress(70), 100)
    setTimeout(() => setProgress(100), 800)
  }, [pathname])

  // Reset bar after mount
  useEffect(() => {
    setTimeout(() => setProgress(0), 900)
  }, [])

  // Listen for crossing the md breakpoint (768px)
  useEffect(() => {
    if (typeof window === "undefined") return

    const mql = window.matchMedia("(min-width: 768px)")
    // if we’re now “md or larger”, close the sheet
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setSheetOpen(false)
    }

    // set initial state if you want
    if (mql.matches) setSheetOpen(false)

    mql.addEventListener("change", onChange)
    return () => {
      mql.removeEventListener("change", onChange)
    }
  }, [])

  return (
    <nav className="w-full  sticky top-0    flex items-center justify-center z-30 ">
      <div className="w-full md:max-w-[1000px]  backdrop-blur bg-background/60 md:rounded-lg  px-[50px] py-4 flex items-center justify-between gap-x-4">
        <LoadingBar
          color="#6028ff"
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />

        <div className="flex justify-between space-x-4 w-full">
          <div className="text-lg font-bold md:text-xl">
            <Link href={"/"}>HeinerDevelops</Link>
          </div>

          <ul className="hidden md:flex w-full justify-end items-end space-x-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <a href={item.href}>{item.name}</a>
              </li>
            ))}
          </ul>

          <ModeToggle />
        </div>

        {/* mobile sheet, now controlled */}
        <div className=" md:hidden flex items-start justify-end">
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
