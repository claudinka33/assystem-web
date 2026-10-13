import Image from "next/image";
import Link from "next/link";
import ObrazecPovprasevanje from "@/components/ObrazecPovprasevanje";
import { KogaPoklicem, TerenKomercialisti, KontaktiOddelki, Lokacije } from "@/components/KontaktBloki";
import { site } from "@/lib/site";

export const metadata = {
  title: "Kontakt",
  description:
    "Kontakt AS system d.o.o.: telefon 03 800 70 00, info@as-system.si. Komercialisti po regijah, kontakti po oddelkih in lokaciji v Šmarju pri Jelšah in Bistrici ob Sotli.",
  alternates: { canonical: "/kontakt" },
};

const druzbena = [
  ["Facebook", site.druzbena.facebook],
  ["Instagram", site.druzbena.instagram],
  ["YouTube", site.druzbena.youtube],
  ["TikTok", site.druzbena.tiktok],
];

export default async function Kontakt({ searchParams }) {
  const params = await searchParams;
  const izdelek = params?.izdelek ?? null;
  const vir = params?.vir ?? (izdelek ? "izdelek" : "kontakt");
  const p = site.podjetje;

  return (
    <>
      {/* Glava */}
      <section className="zn-hero antracit kt-hero">
        <div className="w">
          <div>
            <nav className="drobtine">
              <Link href="/">Domov</Link> / Kontakt
            </nav>
            <span className="zn-oznaka" style={{ marginTop: 0 }}>Kontakt</span>
            <h1>Pišite nam ali pokličite</h1>
            <p>
              Pošljite dimenzije, količino ali samo fotografijo vgradnje.
              Odgovorimo v enem delovnem dnevu — običajno prej.
            </p>
            <div className="kt-hitro">
              <a href={`tel:${site.telefonRaw}`}>
                <small>Telefon</small>
                <b>{site.telefon}</b>
              </a>
              <a href={`mailto:${site.email}`}>
                <small>E-pošta</small>
                <b>{site.email}</b>
              </a>
              <div>
                <small>Delovni čas</small>
                <b>pon–pet 7.00–15.00</b>
              </div>
            </div>
          </div>
          <div className="kt-hero-foto">
            <Image
              src="/slike/proizvodnja/smarje-pri-jelsah.jpg"
              alt="Sedež AS system v Šmarju pri Jelšah"
              fill
              priority
              sizes="(max-width: 1000px) 100vw, 640px"
            />
            <span>Obrtniška ulica 14, Šmarje pri Jelšah</span>
          </div>
        </div>
      </section>

      {/* Obrazec + podatki */}
      <section className="sec" id="obrazec">
        <div className="w">
          <div className="kt-glavno">
            <div className="kt-obrazec">
              <div className="st">
                <span>Povpraševanje</span>
                <h2>{izdelek ? `Povpraševanje — ${izdelek}` : "Pošljite povpraševanje"}</h2>
              </div>
              <ObrazecPovprasevanje vir={vir} izdelek={izdelek} />
            </div>

            <aside className="kt-podatki">
              <div className="kt-kartica temna">
                <small>Hitro do prave osebe</small>
                <ul className="kt-usmeri">
                  <li><b>Trgovci</b><a href="#teren">komercialist v vaši regiji →</a></li>
                  <li><b>Distributerji</b><a href="#koga">Špela Sedminek →</a></li>
                  <li><b>Vijaki po naročilu</b><a href="#koga">Špela Sedminek →</a></li>
                  <li><b>Private label</b><a href="#koga">Manja Part · Špela Sedminek →</a></li>
                  <li><b>Reklamacije</b><Link href="/reklamacije">prijava reklamacije →</Link></li>
                </ul>
              </div>

              <div className="kt-kartica">
                <small>Podatki podjetja</small>
                <strong>{p.polnoIme}</strong>
                <dl className="kt-dl">
                  <div><dt>Sedež</dt><dd>{p.naslov}</dd></div>
                  <div><dt>Matična št.</dt><dd>{p.maticna}</dd></div>
                  <div><dt>ID za DDV</dt><dd>{p.davcna}</dd></div>
                  <div><dt>Splošno</dt><dd><a href={`mailto:${site.email}`}>{site.email}</a></dd></div>
                </dl>
                <div className="kt-druzbena">
                  {druzbena.map(([n, u]) => (
                    <a key={n} href={u} target="_blank" rel="noopener noreferrer">{n}</a>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <KogaPoklicem />
      <TerenKomercialisti />
      <KontaktiOddelki />
      <Lokacije />
    </>
  );
}
