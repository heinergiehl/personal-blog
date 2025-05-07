import { useRef, useEffect, useCallback } from "react"
import { motion, useMotionTemplate, useMotionValue } from "motion/react"
import Image from "next/image"
import { useTheme } from "next-themes"

interface CardProps {
  children?: React.ReactNode
  className?: string
  gradientSize?: number

  gradientOpacity?: number
  gradientFrom?: string
  gradientTo?: string
  cardCSS?: string
  title: string
  description?: string
  image?: string
  images?: string[]
  techStackList?: string[]
  link?: string
}

/**
 * BentoCard: a "magic card" that shows a radial gradient under
 * the mouse cursor, at maximum intensity when the mouse is near,
 * and fades out away from the card.
 */
function BentoCard({
  gradientSize = 200,

  gradientOpacity = 0.8,
  gradientFrom = "#4f16eb",
  gradientTo = "#4b0358",
  image,
  images,
  title,
  description,
  techStackList,
  cardCSS = "col-span-3 row-span-12 rounded-lg transition-all duration-300  relative",
  link,
}: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(-gradientSize)
  const mouseY = useMotionValue(-gradientSize)

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (cardRef.current) {
        const { left, top } = cardRef.current.getBoundingClientRect()
        const clientX = e.clientX
        const clientY = e.clientY
        mouseX.set(clientX - left)
        mouseY.set(clientY - top)
      }
    },
    [mouseX, mouseY]
  )

  const handleMouseOut = useCallback(
    (e: MouseEvent) => {
      if (!e.relatedTarget) {
        document.removeEventListener("mousemove", handleMouseMove)
        mouseX.set(-gradientSize)
        mouseY.set(-gradientSize)
      }
    },
    [handleMouseMove, mouseX, gradientSize, mouseY]
  )

  const handleMouseEnter = useCallback(() => {
    document.addEventListener("mousemove", handleMouseMove)
    mouseX.set(-gradientSize)
    mouseY.set(-gradientSize)
  }, [handleMouseMove, mouseX, gradientSize, mouseY])

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseout", handleMouseOut)
    document.addEventListener("mouseenter", handleMouseEnter)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseout", handleMouseOut)
      document.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [handleMouseEnter, handleMouseMove, handleMouseOut])

  useEffect(() => {
    mouseX.set(-gradientSize)
    mouseY.set(-gradientSize)
  }, [gradientSize, mouseX, mouseY])
  const theme = useTheme()
  const gradientColor =
    theme.resolvedTheme === "dark" ? "#50505044" : "#ffffff4e"
  return (
    <motion.div
      ref={cardRef}
      className={`group rounded-lg transition-all duration-300 relative z-10 ${cardCSS}`}
    >
      <div className="absolute inset-px z-10 rounded-xl bg-slate-300 dark:bg-slate-900" />
      {/* Gradient Layer (radial) */}
      <motion.div
        className="pointer-events-none absolute inset-px z-40 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}, transparent 100%)
          `,
          opacity: gradientOpacity,
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
              ${gradientFrom}, 
              ${gradientTo}, 
              transparent 100%
            )
          `,
        }}
      />

      <div className="h-full rounded-lg relative z-30">
        {/* Card Image(s) */}
        {image && (
          <div className="relative flex items-center justify-center m-1">
            <Image
              className="rounded-t-lg object-cover w-full"
              src={image}
              alt={title}
              width={300}
              height={300}
            />
          </div>
        )}
        {images && images.length > 1 && (
          <div className="relative flex items-center justify-center m-1">
            <Image
              className="rounded-t-lg w-full h-[200px]   first:rounded-r-none"
              src={images[0]}
              alt={title}
              width={300}
              height={300}
            />
            <Image
              className="rounded-t-lg object-cover w-[300px] h-[200px] last:rounded-l-none first:rounded-r-md"
              src={images[1]}
              alt={title}
              width={300}
              height={300}
            />
          </div>
        )}

        {/* Card Content */}
        <div className="p-4">
          <h3 className="text-lg font-bold">
            {link ? (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {title}
              </a>
            ) : (
              title
            )}
          </h3>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
          {techStackList && (
            <ul className="mt-2 flex flex-wrap gap-2">
              {techStackList.map((tech) => (
                <li
                  key={tech}
                  className="bg-indigo-500 text-white px-2 py-1 rounded"
                >
                  {tech}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default BentoCard
