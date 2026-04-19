
import { Inter as FontSans } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"
import { Toaster } from "@/components/ui/toaster"
import NavBar from "@/components/NavBar"
import SiteFooter from "@/components/SiteFooter"
import { PageTransitionShell } from "@/components/PageTransitionShell"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const GA_ID = process.env.GOOGLE_ANALYTICS
  return (
    <html
      lang="en"
      className="scroll-smooth"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body
        className={cn(
          "min-h-screen min-w-screen bg-background font-sans antialiased flex flex-col",
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
          <PageTransitionShell>
            <div className="flex-1 flex flex-col min-h-0">{children}</div>
          </PageTransitionShell>
          <SiteFooter />
          <Toaster />
        </ThemeProvider>
        {GA_ID && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <Script id="google-analytics">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
