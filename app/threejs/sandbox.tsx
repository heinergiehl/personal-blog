"use client"
import React from "react"
import {
  SandpackProvider,
  SandpackPreview,
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPredefinedTemplate,
  SandpackConsole,
} from "@codesandbox/sandpack-react"

type DefaultEditorOptions = {
  showNavigator: boolean
  showInlineErrors: boolean
  showLineNumbers: boolean
  editorHeight: number
}

type Theme = {
  colors: {
    hover: string
    clickable: string
    accent: string
    errorSurface: string
    error: string
    surface3: string
    surface2: string
    surface1: string
  }

  syntax: {
    plain: string
    comment: {
      color: string
    }

    keyword: string
    tag: string
    punctuation: string
    definition: string
    property: string
    static: string
    string: string
  }

  font: {
    body: string
    mono: string
    size: string
    lineHeight: string
  }
}

const defaultEditorOptions: DefaultEditorOptions = {
  showNavigator: false,
  showInlineErrors: true,
  showLineNumbers: true,
  editorHeight: 520,
}

const theme: Theme = {
  colors: {
    hover: "var(--accent)",
    clickable: "var(--text-secondary)",
    accent: "var(--accent)",
    errorSurface: "var(--danger-emphasis)",
    error: "var(--danger)",
    surface3: "var(--emphasis)",
    surface2: "var(--border-color)",
    surface1: "var(--card-background)",
  },
  syntax: {
    plain: "var(--token-comment)",
    comment: {
      color: "var(--token-comment)",
    },
    keyword: "var(--token-keyword)",
    tag: "var(--token-symbol)",
    punctuation: "var(--token-punctuation)",
    definition: "var(--token-function)",
    property: "var(--token-function)",
    static: "var(--token-comment)",
    string: "var(--token-selector)",
  },
  font: {
    body: "var(--font-display)",
    mono: "var(--font-mono)",
    size: "14px",
    lineHeight: "26px",
  },
}

type DefaultFiles = Record<SandpackPredefinedTemplate, any>

const defaultFilesByTemplate: DefaultFiles = {
  react: {},
  "react-ts": "",
  vanilla: "",
  "vanilla-ts": "",
  angular: "",
  vue: "",
  vue3: "",
  "vue3-ts": "",
  svelte: "",
  solid: "",
  "test-ts": "",
}

interface SandpackProps {
  template: SandpackPredefinedTemplate
  files: Record<string, any>
  dependencies?: Record<string, string>
  autorun?: boolean
  defaultTab?: "preview" | "console"
}

/**
 * Sandpack Component for MDX files
 */
export function Sandpack({
  template,
  files,
  dependencies,
  autorun = true,
  defaultTab = "preview",
}: SandpackProps) {
  const [consoleKey, setConsoleKey] = React.useState(0)
  const [selectedTab, setSelectedTab] = React.useState<"preview" | "console">(
    defaultTab
  )

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg">
      <SandpackProvider
        template={template}
        theme={theme}
        files={{
          ...files,
          ...defaultFilesByTemplate[template],
        }}
        customSetup={{
          dependencies: dependencies || {},
        }}
        options={{
          autorun,
        }}
      >
        <SandpackLayout>
          <div className="flex flex-col w-full md:flex-row">
            <div className="flex flex-col w-full md:w-1/2 h-full">
              <PreviewTabs
                onClear={() => setConsoleKey(consoleKey + 1)}
                onTabSelect={(tab) =>
                  setSelectedTab(tab as "preview" | "console")
                }

                selectedTab={selectedTab}
              />
              <SandpackConsole
                key={consoleKey}
                showHeader
                className={`h-[${defaultEditorOptions.editorHeight - 40}px] ${
                  selectedTab === "console" ? "flex" : "hidden"
                }`}
              />
              <SandpackPreview
                showNavigator={defaultEditorOptions.showNavigator}
                showRefreshButton={false}
                showOpenInCodeSandbox={false}
                className={`h-[${defaultEditorOptions.editorHeight - 40}px] ${
                  selectedTab === "preview" ? "flex" : "hidden"
                }`}
              />
            </div>
            <SandpackCodeEditor
              {...defaultEditorOptions}
              showRunButton={false}
              className="border-l border-gray-600 h-full w-full md:w-1/2"
            />
          </div>
        </SandpackLayout>
      </SandpackProvider>
    </div>
  )
}

export default Sandpack
