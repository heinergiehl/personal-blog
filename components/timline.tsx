"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { dot } from "node:test/reporters";
import { COLOR_ONE, COLOR_TWO } from "@/config";

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
    stiffness: 150,
    damping: 20,
    mass: 1.5,
  });

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
      transition: { duration: 0.1, ease: "easeOut" },
    },
    show: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
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
      className="h-[calc(100vh+1100px)] relative flex flex-col md:px-20 py-16 mt-24
                   bg-gradient-to-r from-white via-gray-100 to-gray-50
                   dark:from-gray-800 dark:via-gray-900 dark:to-black"
    >
      <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-12">
        Career
      </h2>

      {/* Sticky gradient line */}
      <motion.div
        ref={timelineLineRef}
        className="pointer-events-none w-1 absolute left-[calc(50%-2px)] -translate-x-1/2"
        style={{
          position: "sticky",
          top: "12%",
          transform: "translate(-50%, -50%)",
          height: "100vh",
          scaleY: lineScale,
          transformOrigin: "top center",
          background: `linear-gradient(to bottom, ${COLOR_ONE}, ${COLOR_TWO})`,
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
              initial={{ opacity: 0, y: 20 }}
              animate={showCard ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* Dot */}
              <motion.div
                className={cn(`absolute top-1/2 left-[calc(50%-0.75rem)]
             -translate-y-1/2 w-6 h-6 rounded-full
             bg-white border-4  shadow-md -z-0`)}
                variants={dotVariants}
                initial="hidden"
                animate={showDot ? "show" : "hidden"}
                style={{
                  borderColor: COLOR_ONE,
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
              >
                <span className="text-xl dark:text-gray-400 uppercase tracking-wide">
                  {item.timeframe}
                </span>
              </motion.div>

              {/* Card */}
              <div
                className={`relative md:w-1/2 mt-8 md:mt-0 transition-size duration-500 p-5 ${
                  isEven ? "md:ml-10" : "md:mr-10"
                }`}
                style={{
                  scale: showDot ? 1 : showCard ? 0.9 : 0.9,
                }}
              >
                <motion.div
                  className={cn(
                    `bg-white/40 dark:bg-gray-800/60
                       backdrop-blur-sm p-6 md:rounded-xl
                       shadow-lg hover:shadow-2xl
                       transition-shadow duration-300`,
                  )}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {item.title}
                  </h3>
                  <h4 className="text-base font-medium text-gray-600 dark:text-gray-300 mb-4">
                    {item.company}
                  </h4>
                  <span className="text-sm text-gray-500 dark:text-gray-400 mb-4 block uppercase tracking-wide md:hidden">
                    {item.timeframe}
                  </span>
                  <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
