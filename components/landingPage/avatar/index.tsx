"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { COLOR_ONE, COLOR_TWO } from "@/config";

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
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
          delay: 0,
        }}
      />
      {/* Inner pulsing circle */}
      <motion.div
        className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
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
);

// Dynamic import to avoid SSR issues with Three.js - with immediate loading state
const ParticleAvatar = dynamic(() => import("./ParticleAvatar"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

const Avatar = () => {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Detect mobile devices
    const checkMobile = () => {
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        ) || window.innerWidth < 768;
      setIsMobile(isMobileDevice);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Resolve the actual theme (handle 'system' theme)
  const resolvedTheme = theme === "system" ? systemTheme : theme;
  const isLightMode = mounted ? resolvedTheme === "light" : false;

  useEffect(() => {
    if (isMobile) return; // Disable mouse tracking on mobile

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  return (
    <>
      {!isLoaded && (
        <section className="min-h-screen relative flex items-center justify-center py-12 px-4 bg-gray-50 dark:bg-gray-950">
          <LoadingSpinner />
        </section>
      )}
      <section
        id="Header"
        className="min-h-screen relative flex items-center justify-center overflow-hidden"
        style={{ display: isLoaded ? "flex" : "none" }}
      >
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 dark:opacity-20"
            style={{
              backgroundColor: isLightMode ? "#4F46E5" : "#7C3AED", // Indigo / Violet
            }}
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-30 dark:opacity-20"
            style={{
              backgroundColor: isLightMode ? "#06B6D4" : "#2563EB", // Cyan / Blue
            }}
            animate={{
              scale: [1, 1.1, 1],
              x: [0, -30, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Full Screen Particle Background */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <ParticleAvatar
            key={`particle-avatar-${mounted && isLightMode ? "light" : "dark"}`}
            imageUrl="/heiner-profile.png"
            particleCount={isMobile ? 12500 : 100000}
            particleSize={isMobile ? 4.5 : 3.}
            formationSpeed={isMobile ? 0.02 : 0.012}
            mouseInfluence={isMobile ? 0 : 1}
            isMobile={isMobile}
            onLoad={() => setIsLoaded(true)}
            faceOffset={isMobile ? [0, 1.5, 0] : [-6.5, 0, 0]} 
            faceScale={isMobile ? 0.6 : 0.45}
          />
        </div>

        {/* Content Container - Glass Card Layout */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-screen flex flex-col justify-end pb-20 lg:pb-0 lg:justify-center lg:flex-row lg:items-center pointer-events-none">
          
          {/* Left Spacer (Desktop) to balance the face */}
          <div className="hidden lg:block lg:flex-1" />

          {/* Right Content (Card) */}
          <motion.div
            className="w-full lg:flex-1 max-w-xl ml-auto pointer-events-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/20 dark:border-gray-800 bg-white/10 dark:bg-black/40 backdrop-blur-xl shadow-2xl p-8 md:p-10 lg:p-12">
              
              {/* Decorative gradient blob inside card */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col space-y-6">
                
                {/* Intro Tag */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center space-x-2"
                >
                   <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                   </span>
                   <span className="text-sm font-medium tracking-wider uppercase text-gray-600 dark:text-gray-400">Available for work</span>
                </motion.div>

                {/* Main Heading */}
                <div className="space-y-2">
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Hello! <span className="inline-block origin-bottom-right animate-wave ml-1 text-4xl lg:text-6xl">👋</span>
                  </h1>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-100">
                    I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500">Heiner</span>
                  </h2>
                </div>

                {/* Description */}
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-light">
                  A passionate <span className="font-semibold text-gray-900 dark:text-white">Full-Stack Developer</span> building exceptional digital experiences with modern web technologies.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <motion.a
                    href="#Contact"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex justify-center items-center px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-shadow"
                  >
                    Get in Touch
                  </motion.a>
                  
                  <motion.a
                    href="#Projects"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex justify-center items-center px-8 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-black/50 hover:bg-white dark:hover:bg-gray-900 text-gray-900 dark:text-white font-medium backdrop-blur-sm transition-colors"
                  >
                    View Projects
                  </motion.a>
                </div>

              </div>
            </div>
          </motion.div>

        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-400 dark:text-gray-500 flex flex-col items-center gap-2 cursor-pointer hidden md:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
          onClick={() => window.scrollBy({ top: window.innerHeight, behavior: "smooth" })}
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-400 to-transparent dark:via-gray-600" />
        </motion.div>
      </section>
    </>
  );
};

export default Avatar;
