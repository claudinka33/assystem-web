import Link from "next/link";
import { kategorije, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="ftr">
      <div className="w">
        <div>
          <b>{site.ime}</b>
          {site.lokacije[0].naslov}
          <br />
          Slovenija
          <br />
          <br />
          <a href={`tel:${site.telefonRaw}`}>{site.telefon}</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </div>

        <div>
          <b>Program</b>
          {kategorije.slice(0, 5).map((k) => (
            <Link key={k.slug} href={`/program/${k.slug}`}>
              {k.naziv}
            </Link>
          ))}
        </div>

        <div>
          <b>Podjetje</b>
          <Link href="/o-nas">O nas</Link>
          <Link href="/proizvodnja">Proizvodnja</Link>
          <Link href="/kakovost">Kakovost</Link>
          <Link href="/aktualno">Aktualno</Link>
          <Link href="/zaposlitev">Zaposlitev</Link>
        </div>

        <div>
          <b>Za partnerje</b>
          <Link href="/distributerji">Postanite distributer</Link>
          <Link href="/private-label">Private label</Link>
          <Link href="/katalogi">Katalogi in prenosi</Link>
          <Link href="/kontakt">Kontakt</Link>
        </div>
      </div>

      <div className="fb">
        <div className="w">
          <span>© {new Date().getFullYear()} {site.ime} · Vse pravice pridržane</span>
          <span>ASfix®</span>
        </div>
      </div>
    </footer>
  );
}
