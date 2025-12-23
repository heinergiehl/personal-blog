import Image from "next/image"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"

// Dynamic import to avoid SSR issues with Three.js
const ParticleAvatar = dynamic(
  () => import("./ParticleAvatar"),
  { ssr: false, loading: () => (
    <div className="w-[750px] h-[750px] rounded-full bg-gradient-to-br from-purple-500/20 to-violet-500/20 animate-pulse" />
  )}
)

const Avatar = () => {
  return (
    <section
      id="Header"
      className="min-h-screen relative flex flex-col items-center justify-center py-12 px-4 overflow-visible"
    >
      {/* Main Content Container */}
      <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
        
        {/* Avatar Section */}
        <motion.div
          className="relative z-10 flex-shrink-0"
          initial={{ scale: 0.8, opacity: 0, x: -50 }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <ParticleAvatar
            imageUrl="/heiner-profile.jpg"
            particleCount={75000}
            particleSize={4.0}
            formationSpeed={0.012}
            mouseInfluence={100}
          />
          <div className="absolute bottom-8 right-8 w-7 h-7 bg-green-500 rounded-full border-4 border-white dark:border-gray-900 shadow-lg z-20">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
          </div>
        </motion.div>

        {/* Hero Text Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="flex flex-col space-y-6 max-w-2xl text-center lg:text-left"
        >
          {/* Greeting */}
          <div className="flex items-center space-x-4 justify-center lg:justify-start">
            <motion.div
              className="text-5xl"
              animate={{
                rotate: [0, 25, -25, 20, -20, 15, -15, 10, -10, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: 2,
                ease: "easeInOut",
              }}
            >
              👋
            </motion.div>
            <motion.h1
              className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 dark:from-white dark:via-purple-300 dark:to-white bg-clip-text text-transparent"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Hello!
            </motion.h1>
          </div>

          {/* Main Heading */}
          <motion.h2
            className="text-3xl lg:text-5xl font-bold text-gray-800 dark:text-gray-100 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">Heiner</span>
          </motion.h2>

          {/* Subheading */}
          <motion.p
            className="text-2xl lg:text-3xl font-semibold text-gray-700 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            A passionate{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-400 font-bold">
                Full-Stack Developer
              </span>
              <span className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 -z-10" />
            </span>
          </motion.p>

          {/* Description */}
          <motion.p
            className="text-xl lg:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Building exceptional digital experiences with modern web technologies
          </motion.p>

          {/* Availability Badge */}
          <motion.div
            className="inline-flex items-center justify-center lg:justify-start"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="flex items-center space-x-3 px-6 py-3 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/20 dark:border-green-400/30 backdrop-blur-sm">
              <div className="relative">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
              </div>
              <span className="text-lg font-semibold text-green-700 dark:text-green-400">
                Available for work
              </span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <a
              href="#contact"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Get in Touch
            </a>
            <a
              href="#projects"
              className="px-8 py-4 bg-transparent border-2 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 font-semibold rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transform hover:scale-105 transition-all duration-300"
            >
              View Projects
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1, repeat: Infinity, repeatType: "reverse" }}
      >
        <div className="flex flex-col items-center space-y-2 text-gray-400 dark:text-gray-600">
          <span className="text-sm font-medium">Scroll to explore</span>
          <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </motion.div>
    </section>
  )
}

export default Avatar
