"use client"

import dynamic from "next/dynamic"

// ssr:false is only valid inside a Client Component
const CodeSandbox = dynamic(() => import("./CodeSandbox"), { ssr: false })

export default CodeSandbox
