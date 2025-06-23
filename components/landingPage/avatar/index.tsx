import Image from "next/image"
import { motion } from "framer-motion"
import ThreeBackground from "@/components/landingPage/3dBackground"

const Avatar = () => {
  return (
    <section
      id="Header"
      className=" min-h-[50vh] relative flex flex-col items-center justify-center p-6 mt-24  rounded-lg  shadow-lg mb-24 z-10"
    >
      <motion.div
        className="relative z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 1 }}
      >
        <Image
          width={300}
          height={300}
          src="/heiner-profile.jpg"
          alt="Your Avatar"
          className="text-white w-24 h-24 rounded-full border-4 border-gray-300 dark:border-gray-700 shadow-lg object-cover"
        />
        <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full   border-2 border-white dark:border-gray-800 animate-pulse" />
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
      <div className="absolute inset-0">
        <ThreeBackground />
      </div>
    </section>
  )
}

export default Avatar
