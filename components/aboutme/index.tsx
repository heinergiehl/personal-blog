import { motion } from "framer-motion"

const AboutMe = () => {
  return (
    <section
      id="about-me"
      className="flex justify-center items-center flex-col p-8 bg-gradient-to-r from-white via-gray-100 to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-black rounded-lg shadow-lg mt-16"
    >
      <motion.h2
        className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        About Me
      </motion.h2>
      <motion.p
        className="text-lg text-gray-600 dark:text-gray-300 mb-4 "
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Hi, I’m{" "}
        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
          Heiner Giehl
        </span>
        , a passionate Full-Stack Developer with a knack for creating modern and
        interactive applications. My journey as a self-taught developer has
        equipped me with deep expertise and enthusiasm for delivering impactful
        projects.
      </motion.p>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Expertise in Backend Development
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            I specialize in backend technologies like Python (Flask), Node.js,
            and Laravel. From Websockets to Task Scheduling, I deliver robust
            server-side solutions.
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Frontend Proficiency
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Creating dynamic, user-friendly interfaces with React, Next.js, and
            Vue.js is my passion. I blend creativity with technical expertise to
            craft modern applications.
          </p>
        </div>
      </motion.div>
    </section>
  )
}

export default AboutMe
