"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { COLOR_ONE, COLOR_TWO } from "@/config"

// Beautiful loading spinner component
const LoadingSpinner = () => (
  <div className="w-full h-full flex items-center justify-center min-h-[400px] lg:min-h-[600px]">
    <div className="relative">
      {/* Outer ring */}
      <motion.div
        className="w-32 h-32 rounded-full border-4 border-indigo-500/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 0 }}
      />
      {/* Middle ring */}
      <motion.div
        className="absolute inset-0 w-32 h-32 rounded-full border-4 border-transparent border-t-indigo-500 border-r-cyan-500"
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0 }}
      />
      {/* Inner pulsing circle */}
      <motion.div
        className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ duration: 2, repeat: Infinity, delay: 0 }}
      />
      {/* Center dot */}
      <div className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-white dark:bg-gray-900" />
    </div>
    {/* Loading text */}
    <motion.div
      className="absolute mt-48 text-indigo-500 dark:text-purple-400 font-semibold"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
    >
      Loading experience...
    </motion.div>
  </div>
)

// Dynamic import to avoid SSR issues with Three.js - with immediate loading state
const ParticleAvatar = dynamic(
  () => import("./ParticleAvatar"),
  { 
    ssr: false, 
    loading: () => <LoadingSpinner />
  }
)

const Avatar = () => {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Detect mobile devices
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768
      setIsMobile(isMobileDevice)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Resolve the actual theme (handle 'system' theme)
  const resolvedTheme = theme === 'system' ? systemTheme : theme
  const isLightMode = mounted ? resolvedTheme === 'light' : false

  useEffect(() => {
    if (isMobile) return // Disable mouse tracking on mobile
    
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 20
      setMousePosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isMobile])

  return (
    <>
      {!isLoaded && (
        <section className="min-h-screen relative flex items-center justify-center py-12 px-4">
          <LoadingSpinner />
        </section>
      )}
      <section
        id="Header"
        className="min-h-screen relative flex flex-col items-center justify-center py-12 px-4 overflow-visible"
        style={{ display: isLoaded ? 'flex' : 'none' }}
      >
      {/* Animated Background Gradients */}
      <motion.div
        className="absolute inset-0 -z-10 overflow-hidden"
        style={!isMobile ? { x: mousePosition.x, y: mousePosition.y } : {}}
        transition={!isMobile ? { type: "spring", stiffness: 50, damping: 20 } : {}}
      >
        <motion.div
          className="absolute top-1/4 -left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: mounted && isLightMode ? 'rgba(79, 70, 229, 0.2)' : 'rgba(168, 85, 247, 0.3)' }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          suppressHydrationWarning
        />
        <motion.div
          className="absolute bottom-1/4 -right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: mounted && isLightMode ? 'rgba(6, 182, 212, 0.2)' : 'rgba(99, 102, 241, 0.3)' }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          suppressHydrationWarning
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ backgroundColor: mounted && isLightMode ? 'rgba(79, 70, 229, 0.1)' : 'rgba(139, 92, 246, 0.2)' }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          suppressHydrationWarning
        />
      </motion.div>

      {/* Main Content Container */}
      <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-16">
        
        {/* Avatar Section - Smaller on mobile for better performance */}
        <div
          className="relative z-10 flex-shrink-0 w-full lg:w-auto flex items-center justify-center"

        >
          <div className="relative max-w-[350px] sm:max-w-[450px] lg:max-w-[600px] w-full aspect-square">
            <ParticleAvatar
              key={`particle-avatar-${mounted && isLightMode ? 'light' : 'dark'}`}
              imageUrl="/heiner-profile.jpg"
              particleCount={isMobile ? 2500 : 35000}
              particleSize={isMobile ? 4.5 : 4.0}
              formationSpeed={isMobile ? 0.02 : 0.012}
              mouseInfluence={isMobile ? 0 : 100}
              isMobile={isMobile}
              onLoad={() => setIsLoaded(true)}
            />

          </div>
        </div>

        {/* Hero Text Section */}
        <motion.div
          initial={{ opacity: 0.8, x: isMobile ? 0 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9], delay: 0.1 }}
          className="flex flex-col space-y-3 lg:space-y-6 max-w-2xl text-center lg:text-left"
        >
          {/* Greeting */}
          <div className="flex items-center space-x-3 lg:space-x-4 justify-center lg:justify-start">
            <motion.div
              className="text-3xl lg:text-5xl"
              animate={!isMobile ? {
                rotate: [0, 25, -25, 20, -20, 15, -15, 10, -10, 0],
              } : {}}
              transition={!isMobile ? {
                duration: 1.5,
                repeat: 2,
                ease: "easeInOut",
              } : {}}
            >
        
            </motion.div>
            <h1 className="text-3xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 dark:from-purple-400 dark:via-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Hello!
            </h1>
          </div>

          {/* Main Heading with typing effect */}
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-800 dark:text-gray-100 leading-tight">
              I'm <motion.span 
                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 dark:from-purple-400 dark:via-violet-400 dark:to-indigo-400"
                initial={{ backgroundPosition: "0% 50%" }}
                animate={!isMobile ? { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] } : {}}
                transition={!isMobile ? { duration: 5, repeat: Infinity, ease: "linear" } : {}}
                style={{ backgroundSize: "200% auto" }}
              >
                Heiner
              </motion.span>
            </h2>
          </div>

          {/* Subheading with animated underline */}
          <div>
            <p className="text-lg sm:text-xl lg:text-3xl font-semibold text-gray-700 dark:text-gray-300">
              A passionate{" "}
              <span className="relative inline-block">
                <motion.span 
                  className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 dark:from-indigo-400 dark:via-purple-400 dark:to-violet-400 font-bold"
                  animate={!isMobile ? { 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  } : {}}
                  transition={!isMobile ? { duration: 4, repeat: Infinity, ease: "linear" } : {}}
                  style={{ backgroundSize: "200% auto" }}
                >
                  Full-Stack Developer
                </motion.span>
                <motion.span 
                  className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-indigo-500/30 to-cyan-500/30 -z-10 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  style={{ originX: 0 }}
                />
              </span>
            </p>
          </div>

          {/* Description with stagger effect */}
          <p className="text-base sm:text-lg lg:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed">
            <span>
              Building exceptional digital experiences
            </span>
            <br />
            <span>
              with modern web technologies
            </span>
          </p>

          {/* Availability Badge with pulse */}
          <div className="inline-flex items-center justify-center lg:justify-start">
            <motion.div 
              className="flex items-center space-x-3 px-6 py-3 rounded-full bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 border-2 border-green-500/30 dark:border-green-400/40 backdrop-blur-sm shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(34, 197, 94, 0.2)" }}
              animate={{ 
                borderColor: ["rgba(34, 197, 94, 0.3)", "rgba(34, 197, 94, 0.6)", "rgba(34, 197, 94, 0.3)"],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="relative">
                <motion.div 
                  className="w-3 h-3 bg-green-500 rounded-full"
                  animate={{ boxShadow: ["0 0 0 0 rgba(34, 197, 94, 0.4)", "0 0 0 8px rgba(34, 197, 94, 0)"] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
              <span className="text-base lg:text-lg font-semibold text-green-700 dark:text-green-400">
                Available for work
              </span>
            </motion.div>
          </div>

          {/* CTA Buttons with hover effects */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
            <motion.a
              href="#Contact"
              className="relative px-8 py-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg overflow-hidden group"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(79, 70, 229, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600"
                initial={{ x: "100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">Get in Touch</span>
            </motion.a>
            <motion.a
              href="#Projects"
              className="relative px-8 py-4 bg-transparent border-2 border-indigo-600 dark:border-purple-400 text-indigo-600 dark:text-purple-400 font-semibold rounded-xl overflow-hidden group"
              whileHover={{ scale: 1.05, borderColor: "rgb(79, 70, 229)" }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-indigo-600/10 dark:bg-purple-400/10"
                initial={{ y: "100%" }}
                whileHover={{ y: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">View Projects</span>
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator with bounce */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:flex">
        <motion.div 
          className="flex flex-col items-center space-y-2 text-gray-500 dark:text-gray-500 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.1 }}
          onClick={() => window.scrollBy({ top: window.innerHeight, behavior: "smooth" })}
        >
          <span className="text-sm font-medium">Scroll to explore</span>
          <motion.svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </motion.svg>
        </motion.div>
      </div>
    </section>
    </>
  )
}

export default Avatar
