import React, { ReactNode } from "react"

interface GridContainerProps {
  children: ReactNode
  gridCSS?: string
}

const GridContainer = ({
  children,
  gridCSS = "grid max-w-6xl md:w-full overflow-hidden grid-flow-dense grid-cols-12 md:gap-8 grid-rows-3 gap-2 h-full md:p-40",
}: GridContainerProps) => {
  return <div className={`relative mx-auto ${gridCSS}`}>{children}</div>
}

export default GridContainer
