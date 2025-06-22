import { useRef } from "react"
import { useMotionValue, useSpring, useMotionTemplate } from "motion/react"

interface UseHoverGradientOptions {
  size: number
  opacity: number
  from: string
  to: string
}

export function useHoverGradient({
  size,
  opacity,
  from,
  to,
}: UseHoverGradientOptions) {
  const ref = useRef<HTMLDivElement>(null)

  // raw coords, start off-size so it’s hidden
  const rawX = useMotionValue(-size)
  const rawY = useMotionValue(-size)

  // spring-smooth them
  const springConfig = { stiffness: 300, damping: 30 }
  const smoothX = useSpring(rawX, springConfig)
  const smoothY = useSpring(rawY, springConfig)

  // combined radial style (inner highlight + color glow)
  const gradientStyle = {
    background: useMotionTemplate`
      radial-gradient(${size * 0.3}px circle at ${smoothX}px ${smoothY}px,
        rgba(255,255,255,0.4),
        transparent 60%
      ),
      radial-gradient(${size}px circle at ${smoothX}px ${smoothY}px,
        ${from},
        ${to},
        transparent 100%
      )
    `,
    opacity,
  }

  const handlers = {
    onMouseMove(e: React.MouseEvent) {
      if (!ref.current) return
      const { left, top } = ref.current.getBoundingClientRect()
      rawX.set(e.clientX - left)
      rawY.set(e.clientY - top)
    },
    onMouseLeave() {
      rawX.set(-size)
      rawY.set(-size)
    },
  }

  return { ref, gradientStyle, handlers }
}
