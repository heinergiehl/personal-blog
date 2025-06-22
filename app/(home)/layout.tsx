import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import "@/app/globals.css"
import { cn } from "@/lib/utils"
import NavBar from "@/components/NavBar"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"
import { Toaster } from "@/components/ui/toaster"
import Head from "next/head"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "HeinerDevelops-Portfolio/Blog",
  description: "Personal blog and portfolio of Heiner Giehl",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <NavBar />

      {children}
    </>
  )
}
