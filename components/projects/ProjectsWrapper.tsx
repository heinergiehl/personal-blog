"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { ProjectsList } from "./index"
import { ProjectFilters } from "./ProjectsFilters"
import { projects as allProjects } from "@/app/data/projects"

// Define only the main categories statically
const mainCategories = ["All", "Fullstack", "Frontend", "Tool"]

export function ProjectsWrapper() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [activeTech, setActiveTech] = useState("All")

  // 1. DYNAMICALLY generate the list of available tech filters
  const availableTechs = useMemo(() => {
    if (activeCategory === "All") {
      // If "All" is selected, show all unique techs from all projects
      const allTechs = allProjects.flatMap((project) => project.techStack)
      return ["All", ...Array.from(new Set(allTechs))]
    }

    // Get all techs from projects within the selected category
    const techsInCategory = allProjects
      .filter((project) => project.category === activeCategory)
      .flatMap((project) => project.techStack)

    // Return unique tech names, always including "All"
    return ["All", ...Array.from(new Set(techsInCategory))]
  }, [activeCategory]) // This dependency array ensures it only recalculates when the category changes

  // 2. IMPROVED filtering logic (it's the same, but now more efficient with the dynamic techs)
  const filteredProjects = allProjects
    .filter((project) => {
      if (activeCategory === "All") return true
      return project.category === activeCategory
    })
    .filter((project) => {
      if (activeTech === "All") return true
      return project.techStack.includes(activeTech)
    })

  // 3. Handle category change to reset the tech filter
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    setActiveTech("All") // Reset tech filter when category changes
  }

  return (
    <section
      className="relative min-h-screen py-16 mt-24 overflow-hidden"
      id="Projects"
    >
      {/* Content */}
      <div className="relative z-10">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-600 via-blue-700 to-cyan-700 dark:from-indigo-400 dark:via-violet-300 dark:to-indigo-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Projects
        </motion.h2>

        <div className="flex flex-col items-center gap-6 mb-12 max-w-screen-lg justify-center mx-auto">
          {/* Main Category Filters */}
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Categories
            </h3>

            <ProjectFilters
              categories={mainCategories}
              activeFilter={activeCategory}
              onFilterChange={handleCategoryChange} // Use the new handler
            />
          </div>

          {/* Dynamic Technology Filters - will only appear if there are techs to show */}

          <div className="flex flex-col items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Technologies
            </h3>

            <ProjectFilters
              categories={availableTechs}
              activeFilter={activeTech}
              onFilterChange={setActiveTech}
            />
          </div>
        </div>

        <ProjectsList projects={filteredProjects} />
      </div>
    </section>
  )
}
