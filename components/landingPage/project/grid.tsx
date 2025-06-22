import React, { ReactNode } from "react"

interface GridContainerProps {
  children: ReactNode
  gridCSS?: string
}

const GridContainer = ({
  children,
  gridCSS = "flex flex-wrap max-w-6xl md:w-full overflow-hidden  md:gap-8 justify-center gap-2",
}: GridContainerProps) => {
  return <div className={`relative mx-auto ${gridCSS}`}>{children}</div>
}

export default GridContainer
