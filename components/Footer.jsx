import Image from "next/image";
import Link from "next/link";
import { PRAVNE } from "@/lib/pravno";
import { kategorije, site } from "@/lib/site";
import PrijavaNovice from "@/components/PrijavaNovice";
import PiskotkiGumb from "@/components/PiskotkiGumb";

const DRUZBENA = [
  ["Facebook", site.druzbena.facebook],
  ["Instagram", site.druzbena.instagram],
  ["YouTube", site.druzbena.youtube],
  ["TikTok", site.druzbena.tiktok],
];

export default function Footer({ kategorije: izBaze }) {
  const seznam = izBaze?.length ? izBaze : kategorije;
  return (
    <>
      <PrijavaNovice />
      <footer className="ftr">
        <div className="w">
          <div className="ftr-podjetje">
            {/* Na antracitu logotip stoji na beli ploskvi (CGP str. 10). */}
            <span className="logo-belo">
              <Image src="/logo-as-system.png" alt="AS system" width={336} height={159} />
            </span>
            <p className="ftr-naslov">
              {site.ime}
              <br />
              {site.lokacije[0].naslov}
            </p>
            <a className="ftr-tel" href={`tel:${site.telefonRaw}`}>{site.telefon}</a>
            <a className="ftr-mail" href={`mailto:${site.email}`}>{site.email}</a>
            <p className="ftr-cas">Pon–pet 7.00–15.00</p>
            <div className="ftr-druzbena">
              {DRUZBENA.map(([n, u]) => (
                <a key={n} href={u} target="_blank" rel="noopener noreferrer">{n}</a>
              ))}
            </div>
          </div>

          <div>
            <b>Izdelki</b>
            {seznam.slice(0, 6).map((k) => (
              <Link key={k.slug} href={`/program/${k.slug}`}>
                {k.naziv}
              </Link>
            ))}
            <Link href="/program" className="ftr-vec">Vse kategorije →</Link>
          </div>

          <div>
            <b>Podjetje</b>
            <Link href="/o-nas">O nas</Link>
            <Link href="/proizvodnja">Proizvodnja</Link>
            <Link href="/kakovost">Kakovost</Link>
            <Link href="/aktualno">Aktualno</Link>
            <Link href="/zaposlitev">Zaposlitev</Link>
            <Link href="/kontakt">Kontakt</Link>
          </div>

          <div>
            <b>Sodelovanje</b>
            <Link href="/b2b">B2B za podjetja</Link>
            <Link href="/za-trgovce">Za trgovce</Link>
            <Link href="/private-label">Private label</Link>
            <Link href="/vijaki-po-narocilu">Vijaki po naročilu</Link>
            <Link href="/distributerji">Postanite distributer</Link>
            <Link href="/katalogi">Katalogi in prenosi</Link>
          </div>
        </div>

        <div className="fb">
          <div className="w">
            <nav className="ftr-pravno" aria-label="Pravne informacije">
              {PRAVNE.map((x) => (
                <Link key={x.pot} href={x.pot}>{x.naziv}</Link>
              ))}
              <PiskotkiGumb className="ftr-piskotki" />
            </nav>
            <div className="fb-spodaj">
              <span>© {new Date().getFullYear()} {site.ime} · Vse pravice pridržane</span>
              <span className="fb-desno">
                <Link href="/admin" className="ftr-cms">Za zaposlene</Link>
                <Image src="/slike/znamke/asfix-logo-negativ.png" alt="ASfix" width={110} height={41} style={{ opacity: 0.9 }} />
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
