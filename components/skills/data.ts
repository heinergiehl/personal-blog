export interface SkillGroup {
  category: string
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    category: "Fullstack Frameworks",
    items: ["Next.js", "Nuxt", "Laravel"],
  },
  {
    category: "Frontend",
    items: ["React", "Vue.js", "Tailwind CSS", "HTML/CSS", "Framer Motion"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express.js", "NestJS", "PHP", "Python"],
  },
  {
    category: "Databases",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Redis"],
  },
  {
    category: "DevOps & Tools",
    items: ["Docker", "Git", "Nginx", "Vercel", "Linux"],
  },
]
