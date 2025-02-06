import { motion } from "framer-motion"

import CopyEmailButton from "../copy-email-button"

const AboutMe = () => {
  return (
    <motion.section
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, threshold: 1, once: false }}
      id="About Me"
      className="
    
      
       min-h-[50vh] flex flex-col items-center justify-center p-8 mt-24 bg-gradient-to-r from-white via-gray-100 to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-black rounded-lg shadow-lg"
    >
      <motion.h2
        className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6"
        initial="hidden"
        whileInView="visible"
        variants={{
          hidden: { opacity: 0, y: -20 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.8, delay: 0.1 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        About Me
      </motion.h2>
      <motion.p
        className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-5xl"
        initial="hidden"
        whileInView="visible"
        variants={{
          hidden: { opacity: 0, x: -30 },
          visible: { opacity: 1, x: 0 },
        }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true, amount: 0.3 }}
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
      <motion.p
        className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-5xl"
        initial="hidden"
        whileInView="visible"
        variants={{
          hidden: { opacity: 0, x: -30 },
          visible: { opacity: 1, x: 0 },
        }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        I am currently available for{" "}
        <span className="font-semibold text-indigo-600 dark:text-indigo-400  ">
          freelance work, internship for full stack development or a part-time /
          full-time job as a frontend / backend / full-stack developer
        </span>
        .
      </motion.p>
      <CopyEmailButton email="webdevislife2021@gmail.com" />
    </motion.section>
  )
}

export default AboutMe
