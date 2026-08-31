import Link from "next/link";
import { kategorije, site } from "@/lib/site";

const ostalo = [
  { naziv: "O nas", pot: "/o-nas" },
  { naziv: "Proizvodnja in razvoj", pot: "/proizvodnja" },
  { naziv: "Kakovost in certifikati", pot: "/kakovost" },
  { naziv: "Katalogi in prenosi", pot: "/katalogi" },
  { naziv: "Aktualno", pot: "/aktualno" },
  { naziv: "Zaposlitev", pot: "/zaposlitev" },
  { naziv: "Splošni pogoji", pot: "/splosni-pogoji" },
  { naziv: "Varstvo osebnih podatkov", pot: "/zasebnost" },
];

export default function Footer() {
  return (
    <footer className="pattern-vijaki bg-ink text-paper">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-extrabold uppercase">
            AS system d.o.o.
          </p>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-paper/70">
            Razvoj in proizvodnja pritrdilne tehnike od {site.ustanovljeno}.
            Dobavljamo v {site.drzave} držav.
          </p>
          <p className="mt-5 text-[0.9375rem] text-paper/70">
            <a href={`tel:${site.telefonRaw}`} className="hover:text-paper">
              {site.telefon}
            </a>
            <br />
            <a href={`mailto:${site.email}`} className="hover:text-paper">
              {site.email}
            </a>
          </p>
        </div>

        <div>
          <h3 className="text-lg">Prodajni program</h3>
          <ul className="mt-4 space-y-2 text-[0.9375rem] text-paper/70">
            {kategorije.slice(0, 6).map((k) => (
              <li key={k.slug}>
                <Link href={`/program/${k.slug}`} className="hover:text-paper">
                  {k.naziv}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/program" className="font-semibold text-red">
                Celoten program
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg">Podjetje</h3>
          <ul className="mt-4 space-y-2 text-[0.9375rem] text-paper/70">
            {ostalo.map((el) => (
              <li key={el.pot}>
                <Link href={el.pot} className="hover:text-paper">
                  {el.naziv}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg">Lokaciji</h3>
          <ul className="mt-4 space-y-5 text-[0.9375rem] text-paper/70">
            {site.lokacije.map((l) => (
              <li key={l.naziv}>
                <span className="block font-semibold text-paper">{l.naziv}</span>
                {l.naslov}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex gap-4 text-[0.9375rem] text-paper/70">
            <a href={site.druzbena.facebook} className="hover:text-paper">
              Facebook
            </a>
            <a href={site.druzbena.instagram} className="hover:text-paper">
              Instagram
            </a>
            <a href={site.druzbena.youtube} className="hover:text-paper">
              YouTube
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-ink-line">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-2 px-5 py-5 text-[0.8125rem] text-paper/55 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {site.ime}. Vse pravice pridržane.
          </span>
          <span className="font-semibold text-red">ASfix®</span>
        </div>
      </div>
    </footer>
  );
}
