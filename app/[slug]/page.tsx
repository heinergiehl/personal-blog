// app/projects/[slug]/page.tsx
import { notFound } from "next/navigation"
import { ProjectDetail } from "@/components/ProjectDetail"
import { projects } from "../data/projects"

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug)
  if (!project) return notFound()
  return <ProjectDetail {...project} />
}
