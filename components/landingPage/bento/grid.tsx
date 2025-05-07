import React, { ReactNode } from "react"

interface GridContainerProps {
  children: ReactNode
  gridCSS?: string
}

const GridContainer = ({
  children,
  gridCSS = "grid max-w-6xl md:w-full overflow-hidden  grid-cols-12 md:gap-8  gap-2 md:p-40",
}: GridContainerProps) => {
  return <div className={`relative mx-auto ${gridCSS}`}>{children}</div>
}

export default GridContainer
