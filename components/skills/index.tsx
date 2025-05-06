import { FaCode, FaDatabase } from "react-icons/fa"
import { Card } from "../landingPage/card/card"
import Spotlight from "../landingPage/card/spotlight"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
const Skills = () => {
  return (
    <section
      id="Skills"
      className="min-h-screen bg-gradient-to-r from-white via-gray-100 to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-black rounded-lg shadow-lg mt-16"
    >
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-center p-8 ">
        Areas Of Expertise
      </h2>
      <Spotlight className="max-w-xl mx-auto grid gap-6 grid-cols-1 lg:grid-cols-3 items-start lg:max-w-none group lg:p-20">
        <Card
          icon={<FaCode size={40} />}
          title="Frontend Proficiency"
          descriptionHeader="Expertise in Frontend Development"
          description="Creating dynamic, user-friendly interfaces with React, Next.js, and Vue.js is my passion. I blend creativity with technical expertise to craft modern applications."
        />
        <Card
          icon={<FaDatabase size={40} />}
          title="Backend Proficiency"
          descriptionHeader="Expertise in Backend Development"
          description="I specialize in backend technologies like Python (Flask), Node.js, and Laravel. From Websockets to Task Scheduling, I deliver robust server-side solutions."
        />
        <Card
          icon={<GitHubLogoIcon height={40} width={40} />}
          title="CI/CD"
          descriptionHeader="Currently learning CI/CD"
          description="Currently learning continuous integration and continuous deployment practices to automate the software delivery process using GitHub-Actions."
        />
      </Spotlight>
    </section>
  )
}
export default Skills
