import { useState } from "react"
import { motion } from "framer-motion"
import { FaGithub, FaYoutube } from "react-icons/fa"
import Image from "next/image"
export const Socials = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev)
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ height: isExpanded ? "180px" : "60px" }}
      onClick={toggleExpand}
      onTapCancel={toggleExpand}
      onHoverStart={toggleExpand}
      onHoverEnd={toggleExpand}
      className="z-30 fixed left-[76%] md:left-[95%] top-[50%] md:w-[60px] w-[100px] rounded-full flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-all duration-300 
        bg-white dark:bg-slate-900 drop-shadow-[0px_0px_5px_rgba(79,_70,_229,_1)]"
    >
      {/* Shiny Blurry Border */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none blur-md 
        bg-gradient-to-br from-pink-500/50 via-purple-500/20 to-transparent dark:from-purple-700/50 dark:via-black/40 dark:to-transparent"
      ></div>
      {/* "Socials" Text */}

      {!isExpanded && (
        <motion.div
          className="absolute text-black dark:text-white text-sm font-bold transition-all duration-200"
          initial={{ scale: 1 }}
          animate={{
            scale: isExpanded ? 0.8 : 1,
            opacity: isExpanded ? 0 : 1,
          }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          Socials
        </motion.div>
      )}

      {/* Icons */}

      {isExpanded && (
        <motion.div
          className="flex flex-col items-center justify-center gap-3 h-full w-full opacity-100 transition-opacity duration-300 delay-200"
          animate={{
            opacity: isExpanded ? 1 : 0,
          }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          {/* Github Icon */}
          <motion.a
            whileHover={{ scale: 1.3, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-black dark:text-white text-xl"
            href={"https://github.com/heinergiehl"}
          >
            <FaGithub size={27} />
          </motion.a>
          {/* YouTube Icon */}
          <motion.a
            href={"https://www.youtube.com/@codingislove3707"}
            whileHover={{ scale: 1.3, rotate: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-black dark:text-white text-xl"
          >
            <FaYoutube size={27} />
          </motion.a>
          {/* Upwork Icon */}
          <motion.a
            href={"https://www.upwork.com/freelancers/~01e359856bc8297a0f"}
            whileHover={{ scale: 1.3, rotate: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-black dark:text-white text-xl"
          >
            <Image src="/upwork.svg" width={27} height={27} alt="SVG Logo" />
          </motion.a>
        </motion.div>
      )}
    </motion.div>
  )
}
