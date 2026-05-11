// components/ProjectFilters.tsx
"use client";

import { AnimatedFilterButton } from "./AnimatedFilterButton";

interface ProjectFiltersProps {
  categories: string[];
  activeFilter: string;
  onFilterChange: (category: string) => void;
  layoutId: string;
}

export function ProjectFilters({
  categories,
  activeFilter,
  onFilterChange,
  layoutId,
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
              category === "Vue.js" ||
              category === "Tool" ||
              category === "Filament" ||
              category === "PHP" ||
              category === "Livewire",
          ) && (
            <AnimatedFilterButton
              key={category}
              category={category}
              isActive={activeFilter === category}
              onClick={() => onFilterChange(category)}
              layoutId={layoutId}
            />
          ),
      )}
    </div>
  );
}
