"use client"

import Link, { LinkProps } from "next/link"
import React from "react"

interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode
  href: string
  className: string
}

function TransitionLink({ href, children, ...props }: TransitionLinkProps) {
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  )
}

export default TransitionLink
