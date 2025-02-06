"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FaGithub, FaYoutube } from "react-icons/fa"
import Image from "next/image"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/** A small reusable Tooltip wrapper, so we don't repeat Tooltip + Trigger + Content everywhere */
function ReusableTooltip({
  content,
  children,
}: {
  content: string
  children: React.ReactNode
}) {
  return (
    <Tooltip delayDuration={400}>
      {/* "asChild" means the TooltipTrigger passes hover/focus to its child directly */}
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export const Socials = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev)
  }

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ height: isExpanded ? "180px" : "60px" }}
        // These calls mean you expand/collapse on hover + click (can adjust as you prefer)
        onClick={toggleExpand}
        onTapCancel={toggleExpand}
        onHoverStart={toggleExpand}
        onHoverEnd={toggleExpand}
        className="z-30 fixed left-[76%] md:left-[95%] top-[50%] 
                   md:w-[60px] w-[100px] rounded-full 
                   flex flex-col items-center justify-center 
                   overflow-hidden cursor-pointer 
                   transition-all duration-300 
                   bg-white dark:bg-slate-900
                   drop-shadow-[0px_0px_5px_rgba(79,_70,_229,_1)]"
      >
        {/* Shiny Blurry Border */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none blur-md 
                     bg-gradient-to-br from-pink-500/50 via-purple-500/20 to-transparent 
                     dark:from-purple-700/50 dark:via-black/40 dark:to-transparent"
        ></div>

        {/* "Socials" label when closed */}
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

        {/* Icons when expanded */}
        {isExpanded && (
          <motion.div
            className="flex flex-col items-center justify-center gap-3 h-full w-full 
                       opacity-100 transition-opacity duration-300 delay-200"
            animate={{
              opacity: isExpanded ? 1 : 0,
            }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            {/* Old GitHub */}
            <ReusableTooltip content="This is my old GitHub account. Lost access due to phone & 2FA changes😿">
              <motion.a
                whileHover={{ scale: 1.3, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-black dark:text-white text-xl"
                href="https://github.com/thebeautyofcoding"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub size={20} />
              </motion.a>
            </ReusableTooltip>

            {/* New GitHub */}
            <ReusableTooltip content="My new GitHub account. Actively using this one🤩">
              <motion.a
                whileHover={{ scale: 1.3, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-black dark:text-white text-xl"
                href="https://github.com/heinergiehl"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub size={27} />
              </motion.a>
            </ReusableTooltip>

            {/* YouTube */}
            <ReusableTooltip content="My YouTube Channel">
              <motion.a
                href="https://www.youtube.com/@codingislove3707"
                whileHover={{ scale: 1.3, rotate: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-black dark:text-white text-xl"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube size={27} />
              </motion.a>
            </ReusableTooltip>

            {/* Upwork */}
            <ReusableTooltip content="Hire me on Upwork">
              <motion.a
                href="https://www.upwork.com/freelancers/~01e359856bc8297a0f"
                whileHover={{ scale: 1.3, rotate: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-black dark:text-white text-xl"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/upwork.svg" width={27} height={27} alt="Upwork" />
              </motion.a>
            </ReusableTooltip>
          </motion.div>
        )}
      </motion.div>
    </TooltipProvider>
  )
}
