import Link from "next/link"
import siteConfig from "@/config/site"

const footerLinks = [
  { href: "/impressum", label: "Impressum" },
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/cookie-policy", label: "Cookies" },
] as const

const SiteFooter = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full flex justify-center pb-8 pt-4 px-4 mt-auto">
      <div className="w-full max-w-[900px] border border-border bg-background/70 backdrop-blur-md rounded-xl px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-muted-foreground">
        <p className="text-center sm:text-left font-mono tracking-tight">
          © {year}{" "}
          <span className="text-foreground/90">{siteConfig.ownerName}</span>
          <span className="mx-1.5 text-border">·</span>
          <span className="hidden sm:inline">Portfolio</span>
        </p>
        <nav
          aria-label="Legal"
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-end"
        >
          {footerLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-150"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}

export default SiteFooter
