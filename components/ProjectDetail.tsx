// components/ProjectDetail.tsx
"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ViewTransition } from "react"
import { useState } from "react"

import type { Project } from "@/app/data/projects"
import { projects as allProjects } from "@/app/data/projects"

export type { Project }

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-6 py-5 text-left group"
        aria-expanded={open}
      >
        <span className="font-medium text-foreground text-sm leading-relaxed">
          {question}
        </span>
        <span
          className={`shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-45" : ""
          }`}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-muted-foreground leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function ProjectDetail(project: Project) {
  const { slug, title, description, image, liveUrl, techStack, product } =
    project

  const relatedProducts = allProjects.filter(
    (p) => p.product && p.slug !== slug
  )

  const currencySymbol =
    product?.offer.priceCurrency === "EUR" ? "€" : "$"

  return (
    <main className="min-h-screen w-full">
      {/* ── Hero ─────────────────────────────── */}
      <section className="w-full max-w-6xl mx-auto px-6 pt-24 pb-16">
        <motion.div
          className="mb-4"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
        >
          <span className="inline-block text-[11px] font-semibold tracking-[0.14em] uppercase text-indigo-500 dark:text-indigo-400">
            {product ? "Filament Plugin" : "Project"}
          </span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Copy column */}
          <div>
            <ViewTransition name={`project-title-${slug}`} enter="page-fade">
              <motion.h1
                className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-5 leading-tight"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={1}
              >
                {title}
              </motion.h1>
            </ViewTransition>

            <motion.p
              className="text-base text-muted-foreground leading-relaxed mb-8 max-w-lg"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
            >
              {product ? product.subtitle : description}
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap gap-3 mb-10"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={3}
            >
              {product ? (
                <>
                  <a
                    href={product.buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white transition-colors duration-150"
                  >
                    {product.buyLabel}
                    <span className="text-indigo-200" aria-hidden="true">
                      →
                    </span>
                  </a>
                  {product.demoUrl && (
                    <a
                      href={product.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm border border-border text-foreground hover:bg-muted transition-colors duration-150"
                    >
                      Live demo
                    </a>
                  )}
                  {product.docsUrl && (
                    <a
                      href={product.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                    >
                      Documentation
                    </a>
                  )}
                </>
              ) : liveUrl ? (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white transition-colors duration-150"
                >
                  Visit Live →
                </a>
              ) : null}
            </motion.div>

            {/* Tech stack */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={4}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-3">
                Tech stack
              </p>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech, i) => (
                  <motion.span
                    key={tech}
                    className="px-3 py-1 text-xs font-medium rounded-md bg-muted text-muted-foreground border border-border"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 + i * 0.04 }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Hero image */}
          <ViewTransition name={`project-hero-${slug}`} share="project-morph">
            <motion.div
              className="relative rounded-xl overflow-hidden border border-border shadow-xl"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={image}
                alt={`${title} screenshot`}
                width={900}
                height={560}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                className="object-cover w-full h-auto"
                priority={Boolean(product)}
              />
            </motion.div>
          </ViewTransition>
        </div>
      </section>

      {product && (
        <>
          {/* ── Compare note ── */}
          {product.compareNote && (
            <section className="w-full max-w-6xl mx-auto px-6 mb-14">
              <p className="text-sm text-muted-foreground border-l-2 border-indigo-500/60 dark:border-indigo-500/50 pl-4 leading-relaxed">
                {product.compareNote}
              </p>
            </section>
          )}

          {/* ── What you gain + Built for ── */}
          <section className="w-full max-w-6xl mx-auto px-6 mb-16">
            <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
              <div>
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-5">
                  What you gain
                </h2>
                <ul className="space-y-3.5">
                  {product.outcomes.map((line) => (
                    <li key={line} className="flex gap-3 items-start">
                      <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                      <span className="text-sm text-foreground/80 leading-relaxed">
                        {line}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-5">
                  Built for
                </h2>
                <ul className="space-y-3.5">
                  {product.whoItsFor.map((line) => (
                    <li key={line} className="flex gap-3 items-start">
                      <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                      <span className="text-sm text-foreground/80 leading-relaxed">
                        {line}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ── Feature highlights ── */}
          <section className="w-full max-w-6xl mx-auto px-6 mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 tracking-tight">
              What&apos;s included
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {product.highlights.map((block) => (
                <div
                  key={block.title}
                  className="rounded-xl border border-border bg-card/50 dark:bg-card/30 p-6 backdrop-blur-sm"
                >
                  <h3 className="font-semibold text-[15px] text-foreground mb-4 leading-snug">
                    {block.title}
                  </h3>
                  <ul className="space-y-2.5">
                    {block.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 items-start text-sm text-muted-foreground"
                      >
                        <span className="mt-[7px] w-1 h-1 rounded-full bg-indigo-500/70 shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* ── Requirements + Pricing ── */}
          <section className="w-full max-w-6xl mx-auto px-6 mb-16">
            <div className="grid sm:grid-cols-2 gap-8 items-start">
              <div>
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-5">
                  Requirements
                </h2>
                <ul className="space-y-2">
                  {product.requirements.map((req) => (
                    <li key={req} className="text-sm text-foreground/80">
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-border bg-card/50 dark:bg-card/30 p-7 backdrop-blur-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2">
                  One-time purchase
                </p>
                <p className="text-4xl font-bold text-foreground tabular-nums">
                  {currencySymbol}
                  {product.offer.price}
                </p>
                <p className="text-xs text-muted-foreground mt-1 mb-6">
                  + applicable taxes · Composer access included
                </p>
                <a
                  href={product.buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white transition-colors duration-150 mb-3"
                >
                  {product.buyLabel}
                </a>
                <a
                  href={product.filamentListingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center text-xs text-muted-foreground hover:text-foreground transition-colors duration-150"
                >
                  View on Filament PHP →
                </a>
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          {product.faqs.length > 0 && (
            <section className="w-full max-w-6xl mx-auto px-6 mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6 tracking-tight">
                Frequently asked questions
              </h2>
              <div className="max-w-3xl border-t border-border">
                {product.faqs.map((faq) => (
                  <FAQItem key={faq.question} {...faq} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* ── Related products ── */}
      {relatedProducts.length > 0 && (
        <section className="w-full max-w-6xl mx-auto px-6 mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-5">
            More Filament plugins
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {relatedProducts.map((p) => (
              <Link
                key={p.slug}
                href={`/${p.slug}`}
                transitionTypes={["nav-forward"]}
                className="group rounded-xl border border-border p-5 hover:border-indigo-500/50 hover:bg-muted/30 transition-colors duration-150"
              >
                <p className="font-semibold text-sm text-foreground group-hover:text-indigo-400 dark:group-hover:text-indigo-400 transition-colors duration-150 mb-1.5">
                  {p.title}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {p.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Back link ── */}
      <div className="w-full max-w-6xl mx-auto px-6 pb-20">
        <Link
          href="/#Projects"
          transitionTypes={["nav-back"]}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
        >
          ← Back to Projects
        </Link>
      </div>
    </main>
  )
}

export default ProjectDetail
