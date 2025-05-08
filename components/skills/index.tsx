import { FaCode, FaDatabase } from "react-icons/fa"
import { Card } from "../landingPage/card/card"
import Spotlight from "../landingPage/card/spotlight"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { GoalIcon } from "lucide-react"
const Skills = () => {
  return (
    <section
      id="Skills"
      className="min-h-screen bg-gradient-to-r from-white via-gray-100 to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-black rounded-lg shadow-lg mt-16"
    >
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-center p-8 ">
        Skills
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
          description="I specialize in backend technologies like Python (Flask), Node.js, and Laravel. From Websockets to Task Scheduling, I deliver robust server-side solutions. Familiar with RESTful APIs, GraphQL, and database management (PostgreSQL, MongoDB)."
        />
        <Card
          icon={<GoalIcon height={40} width={40} />}
          title="Goals"
          descriptionHeader="Things I want to get better at"
          description="Currently learning continuous integration and continuous deployment practices to automate the software delivery process using GitHub-Actions. I am currently experimenting with my own little Hostinger VPS. I also want to level up my skills in Docker and Kubernetes. Last but not least, I am always trying to improve my skills in JavaScript, CSS, especially CSS, because there is always something new to learn, and for me, it is hard to master. In general, I am always trying to improve my code🙂"
        />
      </Spotlight>
    </section>
  )
}
export default Skills
