// components/ProjectDetail.tsx
"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ViewTransition } from "react"
import { useState, type CSSProperties, type MouseEvent, type ReactNode } from "react"
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ExternalLink,
  Layers,
  Package,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  TerminalSquare,
  Zap,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import type { Project } from "@/app/data/projects"
import { projects as allProjects } from "@/app/data/projects"

export type { Project }

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
}

function GlowPanel({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty(
      "--mouse-x",
      `${event.clientX - rect.left}px`
    )
    event.currentTarget.style.setProperty(
      "--mouse-y",
      `${event.clientY - rect.top}px`
    )
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-indigo-200/30 bg-white/70 shadow-[0_20px_70px_rgba(79,70,229,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/55 dark:shadow-[0_24px_90px_rgba(0,0,0,0.42)]",
        className
      )}
      style={{ "--mouse-x": "50%", "--mouse-y": "50%" } as CSSProperties}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      custom={delay}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(460px circle at var(--mouse-x) var(--mouse-y), rgba(99,102,241,0.22), rgba(6,182,212,0.09), transparent 58%)",
        }}
      />
      <div className="pointer-events-none absolute inset-px rounded-[inherit] bg-gradient-to-br from-white/60 via-transparent to-cyan-400/10 dark:from-white/[0.08] dark:to-violet-500/[0.08]" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

function ActionButton({
  href,
  children,
  icon: Icon,
  variant = "primary",
}: {
  href: string
  children: ReactNode
  icon: LucideIcon
  variant?: "primary" | "secondary" | "ghost"
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200",
        variant === "primary" &&
          "bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 hover:shadow-indigo-500/40",
        variant === "secondary" &&
          "border border-indigo-300/40 bg-white/70 text-slate-950 hover:border-indigo-400 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10",
        variant === "ghost" &&
          "px-2 text-indigo-700 hover:text-cyan-700 dark:text-indigo-200 dark:hover:text-cyan-200"
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {children}
    </a>
  )
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <motion.div
      className="mb-8 max-w-3xl"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
    >
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-600 dark:text-indigo-300">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
          {description}
        </p>
      )}
    </motion.div>
  )
}

function TechPill({ tech, index }: { tech: string; index: number }) {
  return (
    <motion.span
      className="inline-flex items-center rounded-lg border border-indigo-300/30 bg-indigo-50/80 px-3 py-1.5 text-xs font-semibold text-indigo-950 shadow-sm shadow-indigo-500/5 dark:border-white/10 dark:bg-white/[0.06] dark:text-indigo-100"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={index + 4}
    >
      {tech}
    </motion.span>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-indigo-200/40 last:border-0 dark:border-white/10">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between gap-6 py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold leading-relaxed text-slate-950 dark:text-white">
          {question}
        </span>
        <ChevronDown
          className={cn(
            "mt-0.5 h-4 w-4 shrink-0 text-indigo-500 transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function ProjectDetail(project: Project) {
  const { slug, title, description, image, liveUrl, techStack, product, category } =
    project

  const currencySymbol = product?.offer.priceCurrency === "EUR" ? "€" : "$"
  const relatedProjects = allProjects
    .filter((p) => p.slug !== slug && (product ? p.product : true))
    .slice(0, 3)

  const heroStats = product
    ? [
        { label: "Price", value: `${currencySymbol}${product.offer.price}` },
        {
          label: "Use cases",
          value: String(product.searchUseCases?.length ?? product.highlights.length),
        },
        { label: "Stack", value: `${techStack.length} tools` },
      ]
    : [
        { label: "Category", value: category },
        { label: "Stack", value: `${techStack.length} tools` },
        { label: "Status", value: liveUrl ? "Live" : "Archived" },
      ]

  const showcaseTags = product
    ? product.highlights.map((highlight) => highlight.title).slice(0, 3)
    : [category, ...techStack].slice(0, 3)

  return (
    <main className="relative min-h-screen w-full overflow-hidden pt-20 text-slate-950 dark:text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-20 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="absolute right-[-8%] top-56 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <section className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl content-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:px-8">
        <div className="flex flex-col justify-center">
          <motion.p
            className="mb-4 text-[11px] font-bold uppercase tracking-[0.24em] text-indigo-600 dark:text-indigo-300"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            {product ? "Filament plugin" : category}
          </motion.p>

          <ViewTransition name={`project-title-${slug}`} enter="page-fade">
            <motion.h1
              className="max-w-3xl text-5xl font-black tracking-tight text-slate-950 dark:text-white sm:text-6xl lg:text-7xl"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              <span className="bg-gradient-to-r from-slate-950 via-indigo-700 to-cyan-700 bg-clip-text text-transparent dark:from-white dark:via-indigo-200 dark:to-cyan-200">
                {title}
              </span>
            </motion.h1>
          </ViewTransition>

          <motion.p
            className="mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            {product ? product.subtitle : description}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-3"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            {product ? (
              <>
                <ActionButton href={product.buyUrl} icon={ShoppingCart}>
                  {product.buyLabel}
                </ActionButton>
                {product.demoUrl && (
                  <ActionButton href={product.demoUrl} icon={ExternalLink} variant="secondary">
                    Live demo
                  </ActionButton>
                )}
                {product.docsUrl && (
                  <ActionButton href={product.docsUrl} icon={BookOpen} variant="ghost">
                    Docs
                  </ActionButton>
                )}
              </>
            ) : liveUrl ? (
              <ActionButton href={liveUrl} icon={ExternalLink}>
                Visit live
              </ActionButton>
            ) : null}
          </motion.div>

          <div className="mt-8 flex flex-wrap gap-2">
            {techStack.map((tech, index) => (
              <TechPill key={tech} tech={tech} index={index} />
            ))}
          </div>

          <motion.div
            className="mt-8 grid max-w-xl grid-cols-3 gap-2"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={5}
          >
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-indigo-200/40 bg-white/60 px-3 py-3 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04]"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-1 truncate text-sm font-bold text-slate-950 dark:text-white">
                  {stat.value}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="relative"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          <div className="absolute -inset-8 rounded-[2rem] bg-gradient-to-r from-indigo-500/20 via-violet-500/10 to-cyan-400/20 blur-3xl" />
          <GlowPanel className="p-2 sm:p-3">
            <div className="rounded-xl border border-white/60 bg-slate-950/95 p-2 shadow-2xl dark:border-white/10">
              <div className="mb-2 flex items-center justify-between px-2 py-1">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="h-1.5 w-28 rounded-full bg-white/10" />
              </div>
              <ViewTransition name={`project-hero-${slug}`} share="project-morph">
                <div className="relative overflow-hidden rounded-lg">
                  <Image
                    src={image}
                    alt={`${title} screenshot`}
                    width={1100}
                    height={720}
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                    className="aspect-[16/10] w-full object-cover"
                    priority={Boolean(product)}
                    loading="eager"
                    fetchPriority="high"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-white/10" />
                </div>
              </ViewTransition>
            </div>
          </GlowPanel>

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {showcaseTags.map((tag, index) => (
              <motion.div
                key={tag}
                className="rounded-xl border border-indigo-200/40 bg-white/70 px-3 py-3 text-xs font-semibold leading-relaxed text-slate-700 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60 dark:text-indigo-100"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={index + 4}
              >
                {tag}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {product && (
        <>
          {product.compareNote && (
            <section className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
              <GlowPanel className="p-5">
                <div className="flex gap-4">
                  <Sparkles className="mt-1 h-5 w-5 shrink-0 text-indigo-500" />
                  <p className="text-sm leading-7 text-slate-700 dark:text-slate-200">
                    {product.compareNote}
                  </p>
                </div>
              </GlowPanel>
            </section>
          )}

          {product.searchUseCases && product.searchUseCases.length > 0 && (
            <section className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
              <SectionHeader
                eyebrow="Use cases"
                title="Built for the workflows buyers actually test"
                description="Each path is written for a real Filament or Laravel team, not a generic AI feature grid."
              />
              <div className="grid gap-4 md:grid-cols-3">
                {product.searchUseCases.map((useCase, index) => (
                  <GlowPanel key={useCase.title} className="p-6" delay={index}>
                    <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-sm font-black text-white shadow-lg shadow-indigo-500/25">
                      0{index + 1}
                    </div>
                    <h3 className="text-base font-bold leading-snug text-slate-950 dark:text-white">
                      {useCase.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {useCase.description}
                    </p>
                  </GlowPanel>
                ))}
              </div>
            </section>
          )}

          <section className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="System"
              title="A Filament-native control room"
              description="The page now mirrors the product: operational, visual, and built around the plugin surface instead of generic marketing boxes."
            />
            <div className="grid gap-4 lg:grid-cols-3">
              {product.highlights.map((block, index) => {
                const icons = [Layers, Zap, ShieldCheck]
                const Icon = icons[index % icons.length]

                return (
                  <GlowPanel key={block.title} className="p-6" delay={index}>
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-200">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="text-base font-bold leading-snug text-slate-950 dark:text-white">
                        {block.title}
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {block.items.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300"
                        >
                          <Check className="mt-1 h-4 w-4 shrink-0 text-cyan-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </GlowPanel>
                )
              })}
            </div>
          </section>

          <section className="relative mx-auto grid max-w-7xl gap-4 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
            <GlowPanel className="p-7">
              <div className="mb-6 flex items-center gap-3">
                <Package className="h-5 w-5 text-indigo-500" />
                <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                  What you gain
                </h2>
              </div>
              <ul className="space-y-4">
                {product.outcomes.map((line) => (
                  <li key={line} className="flex gap-3 text-sm leading-7 text-slate-700 dark:text-slate-200">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-cyan-500" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </GlowPanel>

            <GlowPanel className="p-7">
              <div className="mb-6 flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-indigo-500" />
                <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                  Built for
                </h2>
              </div>
              <ul className="space-y-4">
                {product.whoItsFor.map((line) => (
                  <li key={line} className="flex gap-3 text-sm leading-7 text-slate-700 dark:text-slate-200">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-violet-500" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </GlowPanel>
          </section>

          <section className="relative mx-auto grid max-w-7xl gap-4 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.72fr] lg:px-8">
            <GlowPanel className="p-7">
              <div className="mb-6 flex items-center gap-3">
                <TerminalSquare className="h-5 w-5 text-cyan-500" />
                <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                  Requirements
                </h2>
              </div>
              <div className="overflow-hidden rounded-xl border border-indigo-200/40 bg-slate-950 p-4 font-mono text-sm text-indigo-100 shadow-inner dark:border-white/10">
                {product.requirements.map((req, index) => (
                  <div key={req} className="flex items-start gap-3 py-2">
                    <span className="select-none text-cyan-400">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </GlowPanel>

            <GlowPanel className="p-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">
                One-time purchase
              </p>
              <p className="mt-3 text-5xl font-black tracking-tight text-slate-950 dark:text-white">
                {currencySymbol}
                {product.offer.price}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Composer access, product updates, and the Filament listing flow stay tied to the official checkout.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <ActionButton href={product.buyUrl} icon={ShoppingCart}>
                  {product.buyLabel}
                </ActionButton>
                <ActionButton href={product.filamentListingUrl} icon={ExternalLink} variant="secondary">
                  View on Filament PHP
                </ActionButton>
              </div>
            </GlowPanel>
          </section>

          {product.faqs.length > 0 && (
            <section className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
              <SectionHeader eyebrow="FAQ" title="Decision details" />
              <GlowPanel className="p-2 sm:p-5">
                <div className="mx-auto max-w-4xl">
                  {product.faqs.map((faq) => (
                    <FAQItem key={faq.question} {...faq} />
                  ))}
                </div>
              </GlowPanel>
            </section>
          )}
        </>
      )}

      {relatedProjects.length > 0 && (
        <section className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <SectionHeader
              eyebrow={product ? "More plugins" : "More work"}
              title={product ? "Same portfolio, same system" : "Other builds from the same bench"}
            />
            {product && (
              <Link
                href="/filament-plugins"
                transitionTypes={["nav-forward"]}
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-cyan-600 dark:text-indigo-300 dark:hover:text-cyan-200"
              >
                Browse all plugins
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {relatedProjects.map((related, index) => (
              <Link
                key={related.slug}
                href={`/${related.slug}`}
                transitionTypes={["nav-forward"]}
              >
                <GlowPanel className="h-full p-5" delay={index}>
                  <p className="text-sm font-black text-slate-950 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-cyan-200">
                    {related.title}
                  </p>
                  <p className="mt-3 line-clamp-3 text-xs leading-6 text-slate-600 dark:text-slate-300">
                    {related.description}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                    Open project
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </GlowPanel>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-4 sm:px-6 lg:px-8">
        <Link
          href="/#Projects"
          transitionTypes={["nav-back"]}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-300 dark:hover:text-cyan-200"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to projects
        </Link>
      </div>
    </main>
  )
}

export default ProjectDetail
