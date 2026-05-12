import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { projects } from "@/app/data/projects"
import SiteConfig from "@/config/site"

const pluginProjects = projects.filter((project) => project.product)

function absoluteUrl(path: string) {
  const base = SiteConfig.url.replace(/\/$/, "")
  return `${base}${path.startsWith("/") ? path : `/${path}`}`
}

export const metadata: Metadata = {
  title: "Filament Plugins for Laravel",
  description:
    "Commercial Filament plugins for Laravel: AI chatbots, RAG knowledge bases, workflow automation, and in-panel image editing by Heiner Giehl.",
  alternates: {
    canonical: absoluteUrl("/filament-plugins"),
  },
  openGraph: {
    title: "Filament Plugins for Laravel",
    description:
      "Explore commercial Filament plugins for AI chatbots, RAG knowledge bases, workflow automation, and image editing inside Laravel admin panels.",
    url: absoluteUrl("/filament-plugins"),
    siteName: "Heiner Giehl",
    images: [
      {
        url: absoluteUrl("/agentic-chatbot.webp"),
        width: 1200,
        height: 630,
        alt: "Filament plugins for Laravel admin panels",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Filament Plugins for Laravel",
    description:
      "AI chatbot, RAG, workflow automation, and image editing plugins for Laravel Filament applications.",
    images: [absoluteUrl("/agentic-chatbot.webp")],
  },
}

function JsonLd() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Premium Filament plugins by Heiner Giehl",
    itemListElement: pluginProjects.map((project, index) => {
      const product = project.product!

      return {
        "@type": "ListItem",
        position: index + 1,
        name: project.title,
        description: product.seoDescription,
        url: absoluteUrl(`/${project.slug}`),
      }
    }),
  }

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SiteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Filament Plugins",
        item: absoluteUrl("/filament-plugins"),
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
    </>
  )
}

export default function FilamentPluginsPage() {
  return (
    <>
      <JsonLd />
      <main className="min-h-screen w-full">
        <section className="w-full max-w-6xl mx-auto px-6 pt-24 pb-12">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-500 dark:text-indigo-400">
            Laravel Filament plugins
          </p>
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Premium Filament plugins for Laravel admin panels
            </h1>
            <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Build AI chatbots, RAG knowledge bases, workflow automation, and
              in-panel image editing directly inside Filament. Each plugin is
              built for Laravel teams that want production-ready admin tooling
              without creating every resource, widget, and operational screen
              from scratch.
            </p>
          </div>
        </section>

        <section className="w-full max-w-6xl mx-auto px-6 pb-16">
          <div className="grid gap-5 md:grid-cols-3">
            {pluginProjects.map((project) => {
              const product = project.product!
              const price = `${product.offer.price} ${product.offer.priceCurrency}`

              return (
                <article
                  key={project.slug}
                  className="rounded-lg border border-border bg-card/50 dark:bg-card/30 overflow-hidden"
                >
                  <Link href={`/${project.slug}`} className="block">
                    <Image
                      src={project.image}
                      alt={`${project.title} Filament plugin screenshot`}
                      width={900}
                      height={560}
                      className="aspect-[16/10] w-full object-cover border-b border-border"
                    />
                  </Link>
                  <div className="p-5">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {product.keywords.slice(0, 3).map((keyword) => (
                        <span
                          key={keyword}
                          className="rounded-md border border-border bg-muted px-2 py-1 text-[11px] text-muted-foreground"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">
                      <Link
                        href={`/${project.slug}`}
                        className="hover:text-indigo-500 transition-colors"
                      >
                        {project.title}
                      </Link>
                    </h2>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {product.seoDescription}
                    </p>
                    <div className="mt-5 flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold text-foreground">
                        {price}
                      </span>
                      <Link
                        href={`/${project.slug}`}
                        className="text-sm font-medium text-indigo-500 hover:text-indigo-400"
                      >
                        View plugin -&gt;
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="w-full max-w-6xl mx-auto px-6 pb-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Find a plugin by use case
              </h2>
              <div className="mt-6 grid gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Filament AI chatbot plugin
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Choose Agentic Chatbot when you need a Laravel AI assistant
                    with RAG, visual workflows, API calls, run tracing, and an
                    embeddable chat widget.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Laravel RAG chatbot for documentation and support
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Choose RAG Chatbot when your main goal is grounded Q&amp;A
                    over URLs, files, docs, and product knowledge with
                    citations.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Filament image editor and Media Library workflow
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Choose Image Studio Pro when users need to edit, template,
                    approve, and export images without leaving the Filament
                    panel.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card/50 dark:bg-card/30 p-6">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Marketplace trust, direct product pages, clean checkout
              </h2>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                The plugins are listed on the Filament marketplace for discovery
                and ecosystem trust. These pages add more search coverage for
                buyers who look for Laravel AI chatbot plugins, Filament RAG
                tools, or image editing inside an admin panel.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/agentic-chatbot"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                >
                  Start with Agentic Chatbot
                </Link>
                <Link
                  href="/blog/agentic-chatbot-vs-rag-chatbot"
                  className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
                >
                  Compare AI chatbot plugins
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
