import React from "react"
import Link from "next/link"
import { Button, buttonVariants } from "./ui/button"
import { navItems } from "./NavBar"

const MobileNav = () => {
  return (
    <div>
      <ul className="flex flex-col gap-4">
        {navItems.map((item) => (
          <li key={item.name}>
            <a href={item.href}>{item.name}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MobileNav
