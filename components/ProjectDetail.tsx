// components/ProjectDetail.tsx
"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

// --- Color Palette & Type ---
const ACCENT = "from-indigo-500 to-purple-600"
const BG_LIGHT = "bg-gradient-to-br from-indigo-50 to-white"
const BG_DARK = "dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800"
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, ease: "easeOut" },
  }),
}

export interface Project {
  slug: string
  title: string
  description: string
  image: string
  liveUrl?: string
  techStack: string[]
}

export function ProjectDetail({
  title,
  description,
  image,
  liveUrl,
  techStack,
}: Omit<Project, "slug">) {
  return (
    <div
      className={`${BG_LIGHT} ${BG_DARK} min-h-screen flex flex-col items-center py-24 px-6`}
    >
      {/* Hero */}
      <motion.h1
        className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        custom={0}
      >
        {title}
      </motion.h1>

      <motion.p
        className="max-w-2xl text-center text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        custom={1}
      >
        {description}
      </motion.p>

      {/* Call-to-Action */}
      <motion.a
        href={liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`
          inline-block px-8 py-3 rounded-full font-semibold
          bg-gradient-to-r ${ACCENT} text-white shadow-lg
          hover:scale-105 hover:shadow-2xl transform transition
        `}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        custom={2}
      >
        Visit Live →
      </motion.a>

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-12 mt-16">
        {/* Image Panel with 3D Hover & LQIP */}
        <motion.div
          className="relative rounded-2xl overflow-hidden shadow-2xl"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={3}
          whileHover={{ scale: 1.03, rotateX: 2, rotateY: -2 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <Image
            src={image}
            alt={`${title} screenshot`}
            width={800}
            height={500}
            placeholder="blur"
            blurDataURL="/placeholder.png"
            className="object-cover w-full h-full"
          />
          {/* subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
        </motion.div>

        {/* Tech Stack Pills */}
        <motion.div
          className="flex flex-wrap gap-x-1 items-center justify-center md:justify-start"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={4}
        >
          {techStack.map((tech, i) => (
            <motion.span
              key={tech}
              className={`
                flex items-center px-4 py-2 rounded-full text-sm font-medium
                bg-white/80 dark:bg-slate-700/80 backdrop-blur
                border border-transparent hover:border-indigo-400
                transition-all
              `}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Back Link */}
      <AnimatePresence>
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link
            href="/#Projects"
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            ← Back to Projects
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default ProjectDetail
