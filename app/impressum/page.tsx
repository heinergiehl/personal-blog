import type { Metadata } from "next"
import Link from "next/link"
import siteConfig from "@/config/site"

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum und rechtliche Angaben.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

const Impressum = () => {
  const { ownerName, addressLine1, postalCode, city, country, email, phone, url } =
    siteConfig

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 pb-24">
      <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-4">
        Rechtliches
      </p>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-10">
        Impressum
      </h1>

      <section className="space-y-8 text-sm leading-relaxed text-muted-foreground">
        <div>
          <h2 className="text-base font-semibold text-foreground mb-3">
            Angaben gemäß § 5 TMG
          </h2>
          <p className="whitespace-pre-line">
            {ownerName}
            {"\n"}
            {addressLine1}
            {"\n"}
            {postalCode} {city}
            {"\n"}
            {country}
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-3">
            Kontakt
          </h2>
          <p>
            E-Mail:{" "}
            <a
              href={`mailto:${email}`}
              className="text-indigo-600 dark:text-indigo-400 hover:underline underline-offset-2"
            >
              {email}
            </a>
          </p>
          {phone ? (
            <p className="mt-2">
              Telefon:{" "}
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="text-indigo-600 dark:text-indigo-400 hover:underline underline-offset-2"
              >
                {phone}
              </a>
            </p>
          ) : null}
          <p className="mt-2">
            Website:{" "}
            <a
              href={url}
              className="text-indigo-600 dark:text-indigo-400 hover:underline underline-offset-2"
            >
              {url.replace(/^https?:\/\//, "")}
            </a>
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-3">
            Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
          </h2>
          <p className="whitespace-pre-line">
            {ownerName}
            {"\n"}
            {addressLine1}
            {"\n"}
            {postalCode} {city}
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-3">
            Haftung für Inhalte
          </h2>
          <p>
            Als Diensteanbieter bin ich gemäß § 7 Abs. 1 TMG für eigene Inhalte
            auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
            §§ 8 bis 10 TMG bin ich als Diensteanbieter jedoch nicht
            verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
            überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
            Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der
            Nutzung von Informationen nach den allgemeinen Gesetzen bleiben
            unberührt. Eine diesbezügliche Haftung ist erst ab dem Zeitpunkt der
            Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden
            entsprechender Rechtsverletzungen werde ich diese Inhalte umgehend
            entfernen.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-3">
            Haftung für Links
          </h2>
          <p>
            Dieses Angebot enthält ggf. Links zu externen Websites Dritter, auf
            deren Inhalte ich keinen Einfluss habe. Deshalb kann ich für diese
            fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
            verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
            Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
            Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige
            Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine
            permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch
            ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar.
            Bei Bekanntwerden von Rechtsverletzungen werde ich derartige Links
            umgehend entfernen.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-3">
            Urheberrecht
          </h2>
          <p>
            Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen
            Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
            Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
            Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des
            jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite
            sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
            Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt
            wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden
            Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine
            Urheberrechtsverletzung aufmerksam werden, bitte ich um einen
            entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werde
            ich derartige Inhalte umgehend entfernen.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-3">
            Streitschlichtung
          </h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur
            Online-Streitbeilegung (OS) bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline underline-offset-2"
            >
              https://ec.europa.eu/consumers/odr
            </a>
            . Ich bin nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren
            vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </div>
      </section>

      <p className="mt-14 text-xs text-muted-foreground">
        <Link
          href="/"
          className="text-indigo-600 dark:text-indigo-400 hover:underline underline-offset-2"
        >
          ← Zur Startseite
        </Link>
      </p>
    </div>
  )
}

export default Impressum
