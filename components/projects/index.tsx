// components/ProjectsList.tsx
"use client"

import { motion, AnimatePresence } from "framer-motion"

import type { Project } from "../ProjectDetail"

import { ProjectCard, ProjectGrid } from "../landingPage/project"

interface ProjectsListProps {
  projects: Project[]
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: { duration: 0.3, ease: "easeIn" },
  },
}

export function ProjectsList({ projects }: ProjectsListProps) {
  return (
    <ProjectGrid>
      <AnimatePresence>
        {projects.map((project) => (
          <motion.div
            key={project.slug}
            layout // This is the magic prop for re-ordering animations!
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ProjectCard
              title={project.title}
              image={project.image}
              link={`${project.slug}`} // Use the slug for the link
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </ProjectGrid>
  )
}
