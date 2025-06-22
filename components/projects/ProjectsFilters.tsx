// components/ProjectFilters.tsx
"use client"

import { AnimatedFilterButton } from "./AnimatedFilterButton"

interface ProjectFiltersProps {
  categories: string[]
  activeFilter: string
  onFilterChange: (category: string) => void
}

export function ProjectFilters({
  categories,
  activeFilter,
  onFilterChange,
}: ProjectFiltersProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 ">
      {categories.map(
        (category) =>
          Boolean(
            category === "Laravel" ||
              category === "Next.js" ||
              category === "React" ||
              category === "Express.js" ||
              category === "PostgreSQL" ||
              category === "Fullstack" ||
              category === "Frontend" ||
              category === "Backend" ||
              category === "All" ||
              category === "Vue.js"
          ) && (
            <AnimatedFilterButton
              key={category}
              category={category}
              isActive={activeFilter === category}
              onClick={() => onFilterChange(category)}
            />
          )
      )}
    </div>
  )
}
