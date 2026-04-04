import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import "@/app/globals.css"





const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "HeinerDevelops-Portfolio/Blog",
  description: "Personal blog and portfolio of Heiner Giehl",
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
