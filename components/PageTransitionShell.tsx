"use client"

import { ViewTransition } from "react"

export function PageTransitionShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ViewTransition
      default="page-fade"
      enter={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "page-fade",
      }}
      exit={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "page-fade",
      }}
    >
      {children}
    </ViewTransition>
  )
}
