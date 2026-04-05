"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import "react-github-calendar/tooltips.css";
import { cn } from "@/lib/utils";
import { AnimatedFilterButton } from "@/components/projects/AnimatedFilterButton";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Dynamic import to avoid SSR issues
import dynamic from "next/dynamic";

const GitHubCalendar = dynamic(
  () => import("react-github-calendar").then((mod) => mod.GitHubCalendar),
  { ssr: false, loading: () => <CalendarSkeleton /> }
);

const GITHUB_USERNAME = "heinergiehl";
const AVAILABLE_YEARS = [2024, 2025, 2026] as const;

function CalendarSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="flex gap-1">
        {Array.from({ length: 52 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1">
            {Array.from({ length: 7 }).map((_, j) => (
              <div
                key={j}
                className="w-[10px] h-[10px] rounded-sm bg-gray-200 dark:bg-gray-800"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GitHub() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);

  useEffect(() => {
    setMounted(true);
  }, []);

  const resolvedTheme = theme === "system" ? systemTheme : theme;
  const isDark = mounted ? resolvedTheme === "dark" : true;
  const isLightMode = !isDark;

  const customTheme = {
    light: ["#ebedf0", "#c7d2fe", "#818cf8", "#6366f1", "#4f46e5"],
    dark: ["#161b22", "#2e1065", "#5b21b6", "#7c3aed", "#8b5cf6"],
  };

  return (
    <motion.section
      id="GitHub"
      className="w-full max-w-5xl mx-auto py-16 md:py-24 px-4"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Section header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="flex items-center gap-3">
          <FaGithub className="w-6 h-6 text-gray-900 dark:text-white" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Contributions
          </h2>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-gray-200 dark:from-gray-800 to-transparent" />
        <motion.a
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          whileHover={{ x: 2 }}
        >
          @{GITHUB_USERNAME} →
        </motion.a>
      </div>

      {/* Calendar card */}
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border p-6 md:p-8",
          isLightMode
            ? "border-gray-200/60 bg-white/70 backdrop-blur-sm"
            : "border-gray-800/60 bg-gray-900/50 backdrop-blur-sm",
        )}
      >
        {/* Subtle top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

        {/* Year selector pills */}
        <div className="flex items-center justify-between mb-6">
          <span
            className={cn(
              "text-[11px] font-mono tracking-[0.2em] uppercase",
              isLightMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            {selectedYear ?? "Last 12 months"}
          </span>
          <div className="flex items-center gap-1.5">
            <AnimatedFilterButton
              category="Recent"
              isActive={selectedYear === undefined}
              onClick={() => setSelectedYear(undefined)}
              size="xs"
              rounded="lg"
              layoutId="github-year"
            />
            {AVAILABLE_YEARS.map((year) => (
              <AnimatedFilterButton
                key={year}
                category={year.toString()}
                isActive={selectedYear === year}
                onClick={() => setSelectedYear(year)}
                size="xs"
                rounded="lg"
                layoutId="github-year"
              />
            ))}
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
          {mounted && (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedYear ?? "recent"}
                initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
            <TooltipProvider delayDuration={100}>
              <GitHubCalendar
                key={selectedYear ?? "recent"}
                username={GITHUB_USERNAME}
                year={selectedYear}
                theme={customTheme}
                colorScheme={isDark ? "dark" : "light"}
                fontSize={12}
                blockSize={12}
                blockMargin={3}
                blockRadius={2}
                showWeekdayLabels={["mon", "wed", "fri"] as any}
                labels={{
                  totalCount: "{{count}} contributions in {{year}}",
                }}
                renderBlock={(block, activity) => (
                  <Tooltip key={activity.date}>
                    <TooltipTrigger asChild>
                      {block}
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-gray-900 border border-gray-800 text-white rounded px-3 py-1.5 text-xs font-medium shadow-md dark:bg-gray-900 drop-shadow-xl z-50">
                      {activity.count === 0 ? "No contributions" : `${activity.count} contributions`} on {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </TooltipContent>
                  </Tooltip>
                )}
              />
            </TooltipProvider>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Stats row */}
        <div
          className={cn(
            "mt-6 pt-5 border-t flex flex-wrap gap-6",
            isLightMode ? "border-gray-100" : "border-gray-800",
          )}
        >
          <Stat label="Primary language" value="TypeScript" />
          <Stat label="Focus" value="Full-Stack Web" />
          <Stat
            label="Profile"
            value={
              <a
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline underline-offset-2"
              >
                View on GitHub
              </a>
            }
          />
        </div>
      </div>
    </motion.section>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
        {label}
      </span>
      <span className="text-sm font-semibold text-gray-900 dark:text-white">
        {value}
      </span>
    </div>
  );
}
