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
      className="min-h-[50vh] relative flex flex-col items-center justify-center p-6 mt-24 rounded-lg shadow-lg mb-24 z-10 overflow-visible"
    >
      <motion.div
        className="relative z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.5 }}
      >
        <ParticleAvatar
          imageUrl="/heiner-profile.jpg"
          particleCount={50000}
          particleSize={3.5}
          formationSpeed={0.012}
          mouseInfluence={100}
        />
        <div className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse z-20" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        className="rounded-md flex flex-col space-y-2 mt-4  z-10 items-center backdrop-blur-md bg-slate-200/20 p-2"
      >
        <div className="flex items-center space-x-3">
          <motion.div
            className="text-4xl  z-10  "
            animate={{
              rotate: [0, 25, -25, 20, -20, 15, -15, 10, -10, 0],
              scale: [1.5, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: 2,
              ease: "easeInOut",
              stiffness: 260,
              damping: 20,
            }}
          >
            👋
          </motion.div>
          <motion.h2
            className="text-2xl font-semibold text-gray-700 dark:text-gray-100"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Hello!
          </motion.h2>
        </div>

        <motion.p
          className="text-lg text-gray-600 dark:text-gray-300 font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          I am Heiner and a{" "}
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">
            passionate Full-Stack Developer
          </span>
          .
        </motion.p>
        <motion.p
          className="text-lg text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          I'm available for work!
        </motion.p>
      </motion.div>
    </section>
  )
}

export default Avatar
