import { FaCode, FaDatabase } from "react-icons/fa"
import { Card } from "../landingPage/card/card"
import Spotlight from "../landingPage/card/spotlight"
import { GitHubLogoIcon } from "@radix-ui/react-icons"

const skillsData = [
  {
    icon: <GitHubLogoIcon width={40} height={40} />, // A general fullstack icon
    title: "Fullstack Development",
    descriptionHeader: "Building Complete, Integrated Web Solutions",
    description:
      "I enjoy crafting smaller to medium-sized fullstack applications by working on all areas of expertise(backend and frontend). I use powerful, customizable tools and Fullstack frameworks to create applications that meet customer needs and desires. My focus is on delivering high-quality, user-friendly solutions that can solve complex problems and huge pain points.",
    technologies: [
      "devicon-nextjs-original-wordmark",
      "devicon-nuxtjs-plain",
      "devicon-laravel-plain",
    ],
  },
  {
    icon: <FaCode size={40} />,
    title: "Frontend Development",
    descriptionHeader: "Creating Engaging and Intuitive User Experiences",
    description:
      "Sometimes someone only wants to have a static web page or a beautiful, dynamic UI, which shall be integrating with an already existing backend or API. I can help here as well. I use the most famous frontend libraries and framworks out there, such as React, Vue, and Tailwind CSS.",
    technologies: [
      "devicon-react-original",
      "devicon-vuejs-plain",
      "devicon-css3-plain",
      "devicon-tailwindcss-plain",
      "devicon-html5-plain",
    ],
  },
  {
    icon: <FaDatabase size={40} />,
    title: "Backend Development",
    descriptionHeader: "Designing Robust and Scalable Server-Side Systems",
    description:
      "I have experience in building robust backend systems using various technologies. Whether it's a RESTful API, GraphQL, or a full-fledged backend application, I can help you design and implement the server-side logic that powers your applications. My expertise includes working with databases, such as MYSQL, PostgreSQL, MongoDB, authentication, and server-side frameworks like Express.js, Laravel, and Flask.",
    technologies: [
      "devicon-laravel-original",
      "devicon-nodejs-plain-wordmark", // Core for Node.js backends
      "devicon-python-plain", // Implies Flask/Django if not specified, or general scripting
      "devicon-graphql-plain",
      "devicon-mysql-plain",
      "devicon-postgresql-plain",
      "devicon-mongodb-plain", // If applicable for your NoSQL experience
    ],
  },
]

const Skills = () => (
  <section
    id="Skills"
    className="min-h-screen bg-gradient-to-r from-white via-gray-100 to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-black rounded-lg shadow-lg py-16 mt-24"
  >
    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100  text-center ">
      Skills
    </h2>
    <p className="text-center text-pretty text-sm text-gray-500">
      I love to work with powerful, highly-customizable tools to build Apps that
      exactly meet the customers disire and needs.
    </p>

    <Spotlight className="h-full max-w-xl mx-auto grid gap-6 grid-cols-1 lg:grid-cols-3 items-start lg:max-w-none group lg:p-20">
      {skillsData.map(
        ({ icon, title, descriptionHeader, description, technologies }) => (
          <Card
            key={title}
            icon={icon}
            title={title}
            descriptionHeader={descriptionHeader}
            description={description}
            technologies={technologies}
          />
        )
      )}
    </Spotlight>
  </section>
)

export default Skills
