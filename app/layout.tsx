import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import NavBar from "@/components/NavBar"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"
import { Toaster } from "@/components/ui/toaster"
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
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className=" scroll-smooth">
      <body
        className={cn(
          "min-h-screen min-w-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NavBar />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS}"
      />
      <Script id="google-analytics">
        {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${"${process.env.GOOGLE_ANALYTICS}"}');
          `}
      </Script>
    </html>
  )
}
