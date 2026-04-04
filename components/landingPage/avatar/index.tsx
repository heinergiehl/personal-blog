"use client";

import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useState, useRef, useCallback } from "react";
import { useTheme } from "next-themes";

// Minimal loading state — just a subtle pulse, no spinner circus
const LoadingSpinner = () => (
  <div className="w-full h-full flex items-center justify-center min-h-[400px] lg:min-h-[600px]">
    <motion.div
      className="w-2 h-2 rounded-full bg-indigo-500/60"
      animate={{ scale: [1, 2.5, 1], opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

const ParticleAvatar = dynamic(() => import("./ParticleAvatar"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

// Roles to cycle through
const ROLES = [
  "Full-Stack Developer",
  "UI/UX Enthusiast",
  "API Architect",
  "Creative Coder",
];

const Avatar = () => {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      const mobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth < 768;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Cycle roles
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const resolvedTheme = theme === "system" ? systemTheme : theme;
  const isLightMode = mounted ? resolvedTheme === "light" : false;

  // Stagger animation for text lines
  const textLines = [
    { text: "Heiner", delay: 0.3 },
    { text: "Giehl", delay: 0.5 },
  ];

  return (
    <>
      {!isLoaded && (
        <section className="min-h-screen relative flex items-center justify-center bg-gray-50 dark:bg-gray-950">
          <LoadingSpinner />
        </section>
      )}
      <section
        ref={sectionRef}
        id="Header"
        className="min-h-screen relative flex items-center justify-center overflow-hidden"
        style={{ display: isLoaded ? "flex" : "none" }}
      >
        {/* Particle Background — full bleed */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <ParticleAvatar
            key={`particle-avatar-${mounted && isLightMode ? "light" : "dark"}`}
            imageUrl="/heiner-profile.png"
            particleCount={isMobile ? 8100 : 100000}
            particleSize={isMobile ? 5.0 : 3.0}
            formationSpeed={isMobile ? 0.02 : 0.012}
            mouseInfluence={isMobile ? 0 : 1}
            isMobile={isMobile}
            onLoad={() => setIsLoaded(true)}
            faceOffset={isMobile ? [0, 1.5, 0] : [-6.5, 0, 0]}
            faceScale={isMobile ? 0.6 : 0.45}
          />
        </div>

        {/* Content Layer */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 min-h-screen flex flex-col justify-end pb-24 lg:pb-0 lg:justify-center lg:flex-row lg:items-center pointer-events-none">
          {/* Spacer for particle face on desktop */}
          <div className="hidden lg:block lg:flex-1" />

          {/* Content — raw, no glass card */}
          <motion.div
            className="w-full lg:flex-1 max-w-2xl ml-auto pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.1 }}
          >
            <div className="flex flex-col gap-6 md:gap-8">

              {/* Status chip — minimal */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex items-center gap-3 w-fit px-3 py-1.5 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-sm"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gray-700 dark:text-gray-200">
                  Open to opportunities
                </span>
              </motion.div>

              {/* Name — big, bold, split into two lines for impact */}
              <div className="space-y-1">
                {textLines.map(({ text, delay }, i) => (
                  <div key={text} className="overflow-hidden">
                    <motion.h1
                      className={`text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter leading-[0.9] ${
                        i === 0
                          ? "text-gray-900 dark:text-white"
                          : "text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500"
                      }`}
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      transition={{
                        delay,
                        duration: 0.8,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      {text}
                    </motion.h1>
                  </div>
                ))}
              </div>

              {/* Cycling role — with crossfade */}
              <div className="h-8 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={roleIndex}
                    className="absolute text-base sm:text-lg font-mono text-gray-300 dark:text-gray-300 tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -24, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    {"// "}
                    <span className="text-indigo-400 dark:text-indigo-300">
                      {ROLES[roleIndex]}
                    </span>
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Thin separator */}
              <motion.div
                className="w-16 h-px bg-gradient-to-r from-indigo-500 to-transparent"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              />

              {/* Description — conversational, not corporate */}
              <motion.p
                className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-md font-light"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                I craft{" "}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  performant
                </span>{" "}
                and{" "}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  beautiful
                </span>{" "}
                web experiences — from pixel-perfect interfaces to robust backends.
              </motion.p>

              {/* CTA row — asymmetric, one bold + one text link */}
              <motion.div
                className="flex items-center gap-6 pt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
              >
                <motion.a
                  href="#Contact"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold shadow-lg shadow-gray-900/10 dark:shadow-white/10 overflow-hidden transition-shadow hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 group-hover:text-white transition-colors">Let&apos;s talk</span>
                  <svg className="relative z-10 w-4 h-4 group-hover:translate-x-0.5 transition-transform group-hover:text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </motion.a>

                <motion.a
                  href="#Projects"
                  whileHover={{ x: 4 }}
                  className="group inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <span>View work</span>
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </motion.a>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator — minimal line */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 cursor-pointer text-gray-400 dark:text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={() =>
            window.scrollBy({ top: window.innerHeight, behavior: "smooth" })
          }
        >
          <motion.div
            className="w-px h-10 bg-gradient-to-b from-gray-400 to-transparent dark:from-gray-600"
            animate={{ scaleY: [0.3, 1, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ originY: 0 }}
          />
        </motion.div>
      </section>
    </>
  );
};

export default Avatar;
