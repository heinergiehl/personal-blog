// components/ProjectDetail.tsx
"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ViewTransition } from "react"

import type { Project } from "@/app/data/projects"
import { projects as allProjects } from "@/app/data/projects"

export type { Project }

// --- Color Palette & Type ---
const ACCENT = "from-indigo-600 via-blue-600 to-cyan-600"
const BG_LIGHT = "bg-gradient-to-br from-slate-50 via-white to-blue-50"
const BG_DARK =
  "dark:bg-gradient-to-br dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-900"
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, ease: "easeOut" },
  }),
}

const sectionTitle =
  "text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4"

export function ProjectDetail(project: Project) {
  const {
    slug,
    title,
    description,
    image,
    liveUrl,
    techStack,
    product,
  } = project

  const relatedProducts = allProjects.filter(
    (p) => p.product && p.slug !== slug
  )

  return (
    <div
      className={`${BG_LIGHT} ${BG_DARK} min-h-screen flex flex-col items-center py-24 px-6`}
    >
      <ViewTransition name={`project-title-${slug}`} enter="page-fade">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-700 to-cyan-700 dark:from-purple-400 dark:via-purple-300 dark:to-purple-500 mb-4 max-w-4xl"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={0}
        >
          {title}
        </motion.h1>
      </ViewTransition>

      {product ? (
        <>
          <motion.p
            className="max-w-3xl text-center text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-6 leading-relaxed"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            custom={1}
          >
            {product.subtitle}
          </motion.p>
          <motion.p
            className="max-w-2xl text-center text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-8"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            custom={1}
          >
            {description}
          </motion.p>
        </>
      ) : (
        <motion.p
          className="max-w-2xl text-center text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={1}
        >
          {description}
        </motion.p>
      )}

      {/* CTAs */}
      <motion.div
        className="flex flex-wrap items-center justify-center gap-3 mb-10"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        custom={2}
      >
        {product ? (
          <>
            <a
              href={product.buyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                inline-block px-8 py-3 rounded-full font-semibold
                bg-gradient-to-r ${ACCENT} text-white shadow-lg
                hover:scale-105 hover:shadow-2xl transform transition
              `}
            >
              {product.buyLabel} →
            </a>
            {product.demoUrl ? (
              <a
                href={product.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 rounded-full font-semibold border-2 border-indigo-600 dark:border-indigo-400 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition"
              >
                Live demo
              </a>
            ) : null}
            {product.docsUrl ? (
              <a
                href={product.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 rounded-full font-semibold text-slate-700 dark:text-slate-300 underline-offset-4 hover:underline"
              >
                Documentation
              </a>
            ) : null}
            <a
              href={product.filamentListingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 rounded-full font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              View on Filament
            </a>
          </>
        ) : liveUrl ? (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              inline-block px-8 py-3 rounded-full font-semibold
              bg-gradient-to-r ${ACCENT} text-white shadow-lg
              hover:scale-105 hover:shadow-2xl transform transition
            `}
          >
            Visit Live →
          </a>
        ) : null}
      </motion.div>

      {product?.compareNote ? (
        <motion.aside
          className="max-w-3xl mb-12 rounded-2xl border border-indigo-200/80 dark:border-indigo-500/30 bg-indigo-50/80 dark:bg-indigo-950/25 px-6 py-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={2}
        >
          {product.compareNote}
        </motion.aside>
      ) : null}

      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-12 mt-4">
        <ViewTransition name={`project-hero-${slug}`} share="project-morph">
          <motion.div
            className="relative rounded-2xl overflow-hidden shadow-2xl"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            custom={3}
            whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <Image
              src={image}
              alt={`${title} preview`}
              width={800}
              height={500}
              placeholder="blur"
              blurDataURL="/placeholder.png"
              className="object-cover w-full h-full"
              priority={Boolean(product)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          </motion.div>
        </ViewTransition>

        <motion.div
          className="flex flex-col gap-8"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={4}
        >
          <div>
            <h2 className={sectionTitle}>Tech stack</h2>
            <div className="flex flex-wrap gap-2">
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
            </div>
          </div>

          {product ? (
            <>
              <div>
                <h2 className={sectionTitle}>What you gain</h2>
                <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
                  {product.outcomes.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className={sectionTitle}>Ideal for</h2>
                <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
                  {product.whoItsFor.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : null}
        </motion.div>
      </div>

      {product ? (
        <div className="w-full max-w-5xl mt-16 space-y-16">
          <section>
            <h2 className={`${sectionTitle} text-center md:text-left`}>
              Feature highlights
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {product.highlights.map((block) => (
                <div
                  key={block.title}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/60 dark:bg-slate-900/40 p-6 shadow-sm"
                >
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-3">
                    {block.title}
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    {block.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-indigo-500 shrink-0">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className={sectionTitle}>Requirements</h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {product.requirements.map((req) => (
                <li
                  key={req}
                  className="rounded-xl bg-slate-100/80 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-800 dark:text-slate-200"
                >
                  {req}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className={sectionTitle}>Questions</h2>
            <div className="space-y-3 max-w-3xl">
              {product.faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/50 px-4 py-3 open:shadow-md transition-shadow"
                >
                  <summary className="cursor-pointer font-medium text-slate-900 dark:text-white list-none flex justify-between gap-4">
                    <span>{faq.question}</span>
                    <span className="text-indigo-500 group-open:rotate-180 transition-transform">
                      ▾
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {relatedProducts.length > 0 ? (
        <motion.section
          className="w-full max-w-5xl mt-20"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className={`${sectionTitle} text-center`}>
            More Filament plugins
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {relatedProducts.map((p) => (
              <Link
                key={p.slug}
                href={`/${p.slug}`}
                transitionTypes={["nav-forward"]}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors bg-white/50 dark:bg-slate-900/30"
              >
                <p className="font-semibold text-slate-900 dark:text-white mb-1">
                  {p.title}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                  {p.description}
                </p>
              </Link>
            ))}
          </div>
        </motion.section>
      ) : null}

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
            transitionTypes={["nav-back"]}
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
