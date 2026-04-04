"use client"

import { Sandpack } from "@codesandbox/sandpack-react"
import { useTheme } from "next-themes"

interface CodeSandboxProps {
  files?: Record<string, string>
  template?: "react" | "react-ts" | "vanilla" | "vanilla-ts" | "node"
}

export default function CodeSandbox({
  files = {},
  template = "react",
}: CodeSandboxProps) {
  const { theme } = useTheme()

  return (
    <div className="my-8 rounded-xl overflow-hidden border border-border/50 shadow-2xl bg-[#151515]">
      {/* macOS Window Header */}
      <div className="flex items-center px-4 py-3 bg-[#1e1e1e] border-b border-white/5">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors" />
          <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors" />
        </div>
        <div className="ml-4 text-xs font-mono text-gray-400 opacity-60">
          Interactive Environment
        </div>
      </div>

      <Sandpack
        template={template}
        theme={theme === "dark" ? "dark" : "light"}
        files={files}
        options={{
          showNavigator: true,
          showTabs: true,
          showLineNumbers: true,
          externalResources: ["https://cdn.tailwindcss.com"],
          classes: {
            "sp-wrapper": "custom-wrapper",
            "sp-layout": "custom-layout",
            "sp-tab-button": "custom-tab",
          },
        }}
        customSetup={{
          dependencies: {
            "lucide-react": "latest",
            "clsx": "latest",
            "tailwind-merge": "latest"
          }
        }}
      />
    </div>
  )
}
