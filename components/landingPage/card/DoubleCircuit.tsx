import React, { useLayoutEffect, useRef, useState } from "react"
import { animate, motion, useMotionValue, useTransform } from "framer-motion"
import { GRADIENT_FROM, GRADIENT_TO } from "@/config" // Assuming these can be adjusted for light mode or are dynamically swapped

interface DoubleCircuitProps {
  cardRef: React.RefObject<HTMLDivElement>
  isLightMode: boolean // Add a prop to indicate if it's light mode
}

export const DoubleCircuit: React.FC<DoubleCircuitProps> = ({
  cardRef,
  isLightMode,
}) => {
  // —————————————————————————————————————————————
  // 1) Your “perfect S” path definition
  // —————————————————————————————————————————————
  const d =
    "M1.00002 0.5L1.00001 29.5862C1 36.2136 6.37259 41.5862 13 41.5862H115C121.627 41.5862 127 46.9588 127 53.5862L127 75"

  // —————————————————————————————————————————————
  // 2) One shared cycle from 0→1 over 8s, looping forever
  // —————————————————————————————————————————————
  const cycle = useMotionValue(0)
  useLayoutEffect(() => {
    const ctrls = animate(cycle, 1, {
      duration: 8,
      ease: "linear",
      repeat: Infinity,
    })

    return ctrls.stop
  }, [cycle])

  // —————————————————————————————————————————————
  // 3) Measure path length & vertical span before first paint
  // —————————————————————————————————————————————
  const topRef = useRef<SVGPathElement>(null)
  const bottomRef = useRef<SVGPathElement>(null)
  const [topLen, setTopLen] = useState(0)
  const [botLen, setBotLen] = useState(0)
  const [yOffset, setYOffset] = useState(200) // vertical offset for the bottom circuit
  const [xOffset, setXOffset] = useState(0) // horizontal offset for the bottom circuit

  useLayoutEffect(() => {
    if (topRef.current) {
      const L = topRef.current.getTotalLength()
      setTopLen(L)
    }
    if (bottomRef.current) {
      setBotLen(bottomRef.current.getTotalLength())
    }
    // use top and bottom refs, card height, card width to calculate the yOffset and xOffset
    let cardWidth = 0
    let cardHeight = 0
    if (cardRef.current) {
      cardWidth = cardRef.current.clientWidth
      cardHeight = cardRef.current.clientHeight
    }
    // place the bottom circuit exactly below the top one, both should be horizontally centered, and be at top and bottom, so that they fit completly with their height on card
    const yOffset = cardHeight - 75 // 75 is the height of the circuit, so we need to offset it by that much
    const xOffset = cardWidth / 2 - 64 // 64 is half the width of the circuit, so we need to offset it by that much
    setYOffset(yOffset)
    setXOffset(xOffset)
  }, [cardRef]) // Added cardRef to dependency array

  // —————————————————————————————————————————————
  // 4) Split cycle: 0→.5 drives top, .5→1 drives bottom
  // —————————————————————————————————————————————
  const topProg = useTransform(cycle, (p) => Math.min(1, p * 2))
  const botProg = useTransform(cycle, (p) => Math.max(0, (p - 0.5) * 2))

  // beam draw styles
  const topStyle = { pathLength: topProg }
  const botStyle = { pathLength: botProg }

  // —————————————————————————————————————————————
  // 5) Orb coordinates: sample the correct path + apply yOffset on bottom
  // —————————————————————————————————————————————
  const orbX = useTransform(cycle, (p) => {
    if (p <= 0.5) {
      const lp = p * 2
      // Subtract 128 pixels when on top circuit to shift it left
      return (topRef.current?.getPointAtLength(lp * topLen).x ?? 0) - 128
    } else {
      const lp = (p - 0.5) * 2
      // Bottom circuit fits perfectly, no offset needed
      return bottomRef.current?.getPointAtLength(lp * botLen).x ?? 0
    }
  })
  const orbY = useTransform(cycle, (p) => {
    if (p <= 0.5) {
      const lp = p * 2
      return topRef.current?.getPointAtLength(lp * topLen).y ?? 0
    } else {
      const lp = (p - 0.5) * 2
      // add the exact vertical span so it sits right below the top end
      return (bottomRef.current?.getPointAtLength(lp * botLen).y ?? 0) + yOffset
    }
  })

  // --- Light Mode Specific Colors ---
  // These colors are chosen to contrast well with a light background,
  // similar to the vibrant blues/purples in the provided image.
  const lightModeBeamGradientStart = "#6A1B9A" // Darker purple
  const lightModeBeamGradientMid = "#4A148C" // Even darker purple
  const lightModeBeamGradientEnd = "#303F9F" // Dark blue

  // A very subtle, almost transparent light gray for the background path in light mode
  const lightModeBacklightStroke = "#E0E0E0" // Lighter gray for more subtlety

  // Determine colors based on `isLightMode` prop
  const beamGradientStart = isLightMode ? lightModeBeamGradientStart : "#001AFF"
  const beamGradientMid = isLightMode ? lightModeBeamGradientMid : "#6DD4F5"
  const beamGradientEnd = isLightMode ? lightModeBeamGradientEnd : "#6DD4F5"

  const backlightStrokeColor = isLightMode
    ? lightModeBacklightStroke
    : GRADIENT_FROM

  // REDUCED OPACITY FOR LIGHT MODE BACKLIGHT
  const backlightOpacity = isLightMode ? 0.1 : 0.25 // Significantly reduced for light mode

  // Use GRADIENT_FROM and GRADIENT_TO from config, assuming they are defined for both modes or dynamically handled.
  // If not, you might want to define light mode specific values here too.
  const orbGradientFrom = isLightMode ? "#7E57C2" : GRADIENT_FROM // A contrasting purple for orb
  const orbGradientTo = isLightMode ? "#42A5F5" : GRADIENT_TO // A contrasting blue for orb

  return (
    <motion.svg
      width={128}
      height={75 + yOffset} // enough height for both circuits
      viewBox={`0 -5 128 ${75 + yOffset + 5}`}
      fill="none"
      overflow="visible"
      // Adjust className for light mode: removed mix-blend-screen.
      // Adjusted text color: text-neutral-800 for light mode, text-neutral-200 for dark mode.
      className={`absolute left-1/2 -translate-x-[90%] -top-2 ${
        isLightMode ? "text-neutral-800" : "text-neutral-200"
      }`}
    >
      <defs>
        {/* beam gradient - dynamically set colors */}
        <linearGradient
          id="gradient-2"
          x1="81.32627%"
          y1="73.19365%"
          x2="97.59153%"
          y2="97.59153%"
        >
          <stop offset="0%" stopColor={beamGradientStart} stopOpacity={1} />
          <stop offset="50%" stopColor={beamGradientMid} stopOpacity={1} />
          <stop offset="100%" stopColor={beamGradientEnd} stopOpacity={1} />
        </linearGradient>

        {/* bloom filter */}
        {/* The bloom filter should still work well, regardless of mode, as it adds a blur and then merges. */}
        <filter id="bloom">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* orb radial gradient - dynamically set colors */}
        <radialGradient id="orb-grad">
          <stop offset="0%" stopColor="#FFF" stopOpacity="1" />{" "}
          {/* White core for brightness */}
          <stop offset="40%" stopColor={orbGradientFrom} stopOpacity="1" />
          <stop offset="100%" stopColor={orbGradientTo} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* — Top Circuit */}
      {/* subtle backlight - dynamically set stroke and opacity */}
      <path
        d={d}
        stroke={backlightStrokeColor}
        strokeWidth={2}
        strokeLinecap="round"
        filter="url(#bloom)"
        opacity={backlightOpacity} // Reduced opacity here
      />
      {/* animated draw */}
      <motion.path
        ref={topRef}
        d={d}
        stroke="url(#gradient-2)"
        strokeWidth={2}
        strokeLinecap="round"
        style={topStyle}
        filter="url(#bloom)"
      />

      {/* — Bottom Circuit (just translated down by yOffset) */}
      <g transform={`translate(128, ${yOffset})`}>
        <path
          d={d}
          stroke={backlightStrokeColor}
          strokeWidth={2}
          strokeLinecap="round"
          filter="url(#bloom)"
          opacity={backlightOpacity} // Reduced opacity here
        />
        <motion.path
          ref={bottomRef}
          d={d}
          stroke="url(#gradient-2)"
          strokeWidth={2}
          strokeLinecap="round"
          style={botStyle}
          filter="url(#bloom)"
        />
      </g>

      {/* — Single Orb (always visible, always moving downwards) */}
      <motion.circle
        cx={orbX}
        cy={orbY}
        r={6}
        transform={`translate(128, 0)`}
        fill="url(#orb-grad)"
        filter="url(#bloom)"
        // Removed style={{ mixBlendMode: "screen" }} for light mode
        style={isLightMode ? {} : { mixBlendMode: "screen" }} // Apply mixBlendMode only in dark mode
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.svg>
  )
}
