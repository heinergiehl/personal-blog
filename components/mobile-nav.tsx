"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { navItems } from "./NavBar"

const MobileNav = () => {
  const pathname = usePathname()

  const getTransitionTypes = (href: string) => {
    if (href === "/feedback") return ["nav-forward"]
    if (href === "/" || (href.startsWith("/#") && pathname !== "/")) {
      return ["nav-back"]
    }
    return undefined
  }

  return (
    <div>
      <ul className="flex flex-col gap-4">
        {navItems.map((item) => (
          <li key={item.name}>
            {item.href.startsWith("/") ? (
              <Link
                href={item.href}
                transitionTypes={getTransitionTypes(item.href)}
              >
                {item.name}
              </Link>
            ) : (
              <a href={item.href}>{item.name}</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MobileNav
