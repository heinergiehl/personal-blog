// app/[slug]/page.tsx
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ProjectDetail } from "@/components/ProjectDetail"
import SiteConfig from "@/config/site"
import { projects } from "../data/projects"

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

function absoluteUrl(path: string) {
  const base = SiteConfig.url.replace(/\/$/, "")
  return `${base}${path.startsWith("/") ? path : `/${path}`}`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) return {}

  const product = project.product
  const title = product?.seoTitle ?? `${project.title} | Heiner Giehl`
  const description = product?.seoDescription ?? project.description
  const keywords = product?.keywords
  const ogImage = absoluteUrl(project.image)

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: absoluteUrl(`/${project.slug}`),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/${project.slug}`),
      siteName: "Heiner Giehl",
      images: [{ url: ogImage, width: 1200, height: 630, alt: project.title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  }
}

function JsonLd({ project }: { project: (typeof projects)[number] }) {
  const product = project.product
  if (!product) return null

  const pageUrl = absoluteUrl(`/${project.slug}`)
  const sameAs = [
    product.filamentListingUrl,
    product.demoUrl,
    product.docsUrl,
  ].filter((url): url is string => Boolean(url))

  const softwareJson = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: product.seoDescription,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    sameAs,
    softwareRequirements: product.requirements,
    author: {
      "@type": "Person",
      name: "Heiner Giehl",
      url: SiteConfig.url,
    },
    offers: {
      "@type": "Offer",
      url: product.buyUrl,
      priceCurrency: product.offer.priceCurrency,
      price: product.offer.price,
      availability: "https://schema.org/InStock",
    },
    image: absoluteUrl(project.image),
  }

  const breadcrumbJson = {
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
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: pageUrl,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJson) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }}
      />
    </>
  )
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) return notFound()

  return (
    <>
      <JsonLd project={project} />
      <ProjectDetail {...project} />
    </>
  )
}
