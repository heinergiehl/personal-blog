"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { dot } from "node:test/reporters";
import { COLOR_ONE, COLOR_TWO } from "@/config";
import { useTheme } from "next-themes";

interface TimelineItem {
  title: string;
  company: string;
  timeframe: string;
  description: string;
}

const timelineData: TimelineItem[] = [
  {
    title: "Freelancing Fullstack Web Developer",
    company: "Self-employed",
    timeframe: "01.2022 - Present",
    description:
      "Providing full-stack web development services, including frontend and backend solutions. Specializing in modern frameworks such as ReactJS, NextJS, and NestJS, Laravel",
  },
  {
    title: "Intern - Application Development",
    company: "Unternehmen.online",
    timeframe: "05.2021 - 08.2021",
    description:
      "Gained practical experience in application development. Focused on modern web technologies, such as Laravel, and best practices.",
  },
  {
    title: "Self-study: Web Development",
    company: "Self-initiated",
    timeframe: "05.2019 - 05.2021",
    description: `Dedicated self-study in web development, including the basics of HTML, CSS, JavaScript, PHP, relational and non-relational databases. Developed a strong foundation in frontend and backend technologies.`,
  },
];

export default function Timeline() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timelineLineRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [cardActivated, setCardActivated] = useState<Record<number, boolean>>(
    {},
  );
  const [dotActivated, setDotActivated] = useState<Record<number, boolean>>({});

  const { scrollYProgress } = useScroll({
    target: containerRef,
    // --- START OF REVISED CHANGE FOR MIDDLE ITEM FIX ---
    // Use "start center" and "end center" to provide a more balanced scroll range
    // for scrollYProgress across the entire content.
    offset: ["start center", "end center"],
    // --- END OF REVISED CHANGE ---
  });

  const rawLineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const lineScale = useSpring(rawLineScale, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  });

  // Very subtle parallax effect for cards
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -10]);
  const parallaxYReverse = useTransform(scrollYProgress, [0, 1], [0, 10]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Resolve the actual theme (handle 'system' theme)
  const resolvedTheme = theme === 'system' ? systemTheme : theme;
  const isLightMode = mounted ? resolvedTheme === 'light' : false;

  useEffect(() => {
    function handleScroll() {
      if (!timelineLineRef.current) return;
      const lineBottom = timelineLineRef.current.getBoundingClientRect().bottom;

      const newCardActivated: Record<number, boolean> = {};
      const newDotActivated: Record<number, boolean> = {};

      itemRefs.current.forEach((ref, idx) => {
        if (!ref) return;
        const { top, height } = ref.getBoundingClientRect();
        const cardTop = top;
        const dotCenterY = top + height / 2;

        newCardActivated[idx] = lineBottom >= cardTop;
        newDotActivated[idx] = lineBottom >= dotCenterY;
      });

      setCardActivated(newCardActivated);
      setDotActivated(newDotActivated);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [
    timelineLineRef.current,
    itemRefs.current,
    scrollYProgress,
    containerRef.current,
  ]);

  const dotVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    show: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
    },
  };

  const timeframeVariants = (isEven: boolean) => ({
    hidden: { opacity: 0, x: isEven ? 80 : -80 },
    show: { opacity: 1, x: 0 },
  });

  return (
    <section
      id="Timeline"
      ref={containerRef}
      className="h-[calc(100vh+1100px)] relative flex flex-col md:px-20 py-16 mt-24"
    >
      {/* Enhanced background with animated gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/60 dark:from-gray-950 dark:via-indigo-950/30 dark:to-gray-900" />
        <motion.div
          className="absolute -top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
          style={{ background: COLOR_ONE }}
          animate={{
            x: [-50, 50, -50],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
          style={{ background: COLOR_TWO }}
          animate={{
            x: [50, -50, 50],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <h2 className="relative z-10 text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-12">
        Career
      </h2>

      {/* Sticky gradient line */}
      <motion.div
        ref={timelineLineRef}
        className="pointer-events-none w-1 absolute left-[calc(50%-2px)] -translate-x-1/2 will-change-transform rounded-full"
        style={{
          position: "sticky",
          top: "10%",
          height: "120vh",
          scaleY: lineScale,
          transformOrigin: "top center",
          background: `linear-gradient(to bottom, ${COLOR_ONE}, ${COLOR_TWO})`,
          boxShadow: `0 0 8px 2px ${COLOR_ONE}30`,
        }}
      />

      {/* Timeline Items */}
      <div className="absolute md:space-y-[150px] inset-0 max-w-4xl m-auto h-full md:my-[400px] mt-[420px]">
        {timelineData.map((item, idx) => {
          const isEven = idx % 2 === 0;
          const showCard = !!cardActivated[idx];
          const showDot = !!dotActivated[idx];

          return (
            <motion.div
              key={idx}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              className={`relative flex flex-col md:flex-row items-start md:items-center ${
                isEven ? "md:flex-row" : "md:flex-row-reverse"
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={showCard ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Dot */}
              <motion.div
                className={cn(`absolute top-1/2 left-[calc(50%-0.875rem)]
             -translate-y-1/2 w-7 h-7 rounded-full
             bg-white border-[5px] shadow-2xl z-0 blur-[1.5px]`)}
                variants={dotVariants}
                initial="hidden"
                animate={showDot ? "show" : "hidden"}
                style={{
                  borderColor: COLOR_ONE,
                  boxShadow: `0 0 20px 4px ${COLOR_ONE}70, 0 0 10px 2px ${COLOR_TWO}50`,
                }}
              />

              {/* Timeframe (desktop) */}
              <motion.div
                className={`hidden md:block absolute top-1/2 -translate-y-1/2 ${
                  isEven ? "right-[2.5rem]" : "left-[2.5rem]"
                }`}
                variants={timeframeVariants(isEven)}
                initial="hidden"
                animate={showCard ? "show" : "hidden"}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  delay: idx * 0.1,
                }}
                suppressHydrationWarning
              >
                <span className={cn(
                  "text-xl font-semibold uppercase tracking-wide",
                  mounted && (isLightMode ? "text-purple-600" : "text-purple-400")
                )}>
                  {item.timeframe}
                </span>
              </motion.div>

              {/* Card */}
              <div
                className={`relative md:w-1/2 mt-8 md:mt-0 transition-all duration-500 p-5 ${
                  isEven ? "md:ml-10" : "md:mr-10"
                }`}
                style={{
                  scale: showDot ? 1 : showCard ? 0.9 : 0.9,
                }}
                suppressHydrationWarning
              >
                <motion.div
                  className={cn(
                    `backdrop-blur-[2px] p-8 rounded-2xl border transition-all duration-300 overflow-hidden`,
                    mounted && isLightMode
                      ? "bg-gradient-to-br from-purple-50/70 via-white/60 to-violet-50/70 border-purple-200/30 shadow-lg shadow-purple-200/20"
                      : "bg-gradient-to-br from-slate-900/70 via-purple-950/60 to-slate-900/70 border-purple-500/20 shadow-lg shadow-purple-500/10",
                    !isEven ? "pl-12" : "pr-12"
                  )}
                  style={{
                    y: isEven ? parallaxY : parallaxYReverse,
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: mounted && isLightMode 
                      ? "0 20px 40px rgba(139, 92, 246, 0.2)" 
                      : "0 20px 40px rgba(168, 85, 247, 0.3)",
                    y: -5,
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  suppressHydrationWarning
                >
                  <motion.h3 
                    className={cn(
                      "text-2xl font-bold mb-2",
                      mounted && (isLightMode ? "text-purple-900" : "text-purple-100")
                    )}
                    initial={{ opacity: 0, y: 10 }}
                    animate={showCard ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    suppressHydrationWarning
                  >
                    {item.title}
                  </motion.h3>
                  <motion.h4 
                    className={cn(
                      "text-base font-semibold mb-4",
                      mounted && (isLightMode ? "text-purple-700" : "text-purple-300")
                    )}
                    initial={{ opacity: 0, y: 10 }}
                    animate={showCard ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    suppressHydrationWarning
                  >
                    {item.company}
                  </motion.h4>
                  <motion.span 
                    className={cn(
                      "text-sm mb-4 block uppercase tracking-wide font-medium md:hidden",
                      mounted && (isLightMode ? "text-purple-600" : "text-purple-400")
                    )}
                    initial={{ opacity: 0 }}
                    animate={showCard ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    suppressHydrationWarning
                  >
                    {item.timeframe}
                  </motion.span>
                  <motion.p 
                    className={cn(
                      "leading-relaxed text-sm",
                      mounted && (isLightMode ? "text-gray-700" : "text-gray-300")
                    )}
                    initial={{ opacity: 0, y: 10 }}
                    animate={showCard ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    suppressHydrationWarning
                  >
                    {item.description}
                  </motion.p>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
