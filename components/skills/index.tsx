import { Card } from "../landingPage/card/card"
import Spotlight from "../landingPage/card/spotlight"
import { skillsData } from "./data"

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
        ({ title, descriptionHeader, description, technologies }) => (
          <Card
            key={title}
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
