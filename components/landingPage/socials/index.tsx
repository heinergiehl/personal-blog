"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaGithub, FaYoutube } from "react-icons/fa"
import Image from "next/image"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/** Reusable tooltip wrapper (ShadCN/UI). */
function ReusableTooltip({
  content,
  children,
}: {
  content: string
  children: React.ReactNode
}) {
  return (
    <Tooltip delayDuration={400}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent alignOffset={-150} align="start" side="left">
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export const Socials = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  // A ref to store the timeout ID so we can cancel it if the user re-enters quickly
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /** Expand immediately on mouse enter (cancel any pending close). */
  const handleMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setIsExpanded(true)
  }

  /** When leaving, wait ~200ms before collapsing to avoid flicker. */
  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setIsExpanded(false)
      closeTimerRef.current = null
    }, 200)
  }

  return (
    <TooltipProvider>
      <motion.div
        /**
         * Parent container transitions from 60px -> 180px tall.
         * onMouseEnter/Leave handle the delayed toggle logic.
         */
        initial={{ opacity: 1 }}
        animate={{ height: isExpanded ? "240px" : "60px" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="z-30 fixed left-[76%] md:left-[95%] top-[50%] 
                   md:w-[60px] w-[100px] rounded-full
                   flex flex-col items-center justify-center
                   overflow-hidden cursor-pointer
                   bg-white dark:bg-slate-900
                   drop-shadow-[0px_0px_5px_rgba(79,_70,_229,_1)]
                   transition-all duration-300"
      >
        {/* Shiny/Blurry Border */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none blur-md
                     bg-gradient-to-br from-pink-500/50 via-purple-500/20 to-transparent
                     dark:from-purple-700/50 dark:via-black/40 dark:to-transparent"
        />

        {/*
          "Socials" label is always rendered. We fade/scale it out when expanded,
          so it won't flicker in/out abruptly.
        */}
        <motion.div
          className="absolute text-black dark:text-white text-sm font-bold"
          initial={{ opacity: 1, scale: 1 }}
          animate={{
            opacity: isExpanded ? 0 : 1,
            scale: isExpanded ? 0.8 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          Socials
        </motion.div>

        {/*
          Icons only appear while expanded.
          Using <AnimatePresence> for fade-in/out transitions.
        */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              key="icon-list"
              className="flex flex-col items-center justify-center gap-6
                         h-full w-full pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ReusableTooltip content="Old GitHub account lost due to 2FA issues 😿">
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

              <ReusableTooltip content="My new GitHub account (actively used) 🤩">
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

              <ReusableTooltip content="My YouTube channel">
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

              <ReusableTooltip content="Hire me on Upwork">
                <motion.a
                  href="https://www.upwork.com/freelancers/~01e359856bc8297a0f"
                  whileHover={{ scale: 1.3, rotate: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-black dark:text-white text-xl"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/upwork.svg"
                    width={27}
                    height={27}
                    alt="Upwork"
                  />
                </motion.a>
              </ReusableTooltip>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </TooltipProvider>
  )
}
