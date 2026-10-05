import Link from "next/link";
import { notFound } from "next/navigation";
import { pridobiIzdelek } from "@/lib/podatki";
import TabelaArtiklov from "@/components/TabelaArtiklov";
import GalerijaIzdelka from "@/components/GalerijaIzdelka";
import IgraIzdelka from "@/components/IgraIzdelka";

export const revalidate = 60;

const oznakeTipov = {
  eta: "ETA",
  dop: "DoP",
  certifikat: "Certifikat",
  letak: "Letak",
  katalog: "Katalog",
  navodila: "Navodila",
  risba: "Risba",
};

export async function generateMetadata({ params }) {
  const { kategorija, izdelek } = await params;
  const i = await pridobiIzdelek(izdelek);
  if (!i) return {};
  return {
    title: i.seo_naslov ?? i.naziv,
    description: i.seo_opis ?? i.kratek_opis ?? undefined,
    alternates: { canonical: `/program/${kategorija}/${izdelek}` },
  };
}

// Lastnosti, ki so pri vseh artiklih enake, gredo nad tabelo kot oznake.
// Tiste, ki se razlikujejo, dobijo svoj stolpec v tabeli.
function razdeliLastnosti(artikli) {
  const kljuci = [];
  for (const a of artikli) {
    for (const k of Object.keys(a.lastnosti ?? {})) if (!kljuci.includes(k)) kljuci.push(k);
  }
  const skupne = [];
  const stolpci = [];
  for (const k of kljuci) {
    const vrednosti = new Set(artikli.map((a) => (a.lastnosti ?? {})[k] ?? ""));
    if (vrednosti.size === 1 && !vrednosti.has("")) skupne.push([k, [...vrednosti][0]]);
    else stolpci.push(k);
  }
  return { skupne, stolpci };
}

export default async function StranIzdelka({ params }) {
  const { kategorija, izdelek } = await params;
  const i = await pridobiIzdelek(izdelek);
  if (!i) notFound();

  const artikli = (i.artikli ?? [])
    .filter((a) => a.objavljeno)
    .sort((a, b) => (a.premer ?? 0) - (b.premer ?? 0) || (a.dolzina ?? 0) - (b.dolzina ?? 0));
  const dokumenti = i.dokumenti ?? [];
  const galerija = Array.isArray(i.galerija) ? i.galerija : [];
  const slike = [i.slika_url, ...galerija].filter(Boolean).slice(0, 8);
  const { skupne, stolpci } = razdeliLastnosti(artikli);
  const naziviRazlicni = new Set(artikli.map((a) => a.naziv)).size > 1;
  const povprasevanje = `/kontakt?izdelek=${encodeURIComponent(i.naziv)}&vir=izdelek`;

  return (
    <section className="izd">
      <div className="w izd-w">
        <nav className="drobtine">
          <Link href="/">Domov</Link> / <Link href="/program">Program</Link> /{" "}
          <Link href={`/program/${kategorija}`}>{i.kategorije?.naziv ?? "Kategorija"}</Link> /{" "}
          {i.naziv}
        </nav>

        <div className="izd-grid">
          {/* Levo: slika, prednosti, dokumenti, povpraševanje — ostane na mestu ob skrolanju */}
          <aside className="izd-levo">
            <GalerijaIzdelka slike={slike} naziv={i.naziv} />

            {i.prednosti?.length > 0 && (
              <ul className="izd-pred">
                {i.prednosti.map((p) => (
                  <li key={p}>
                    <span>✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            )}

            <Link className="b b-r" href={povprasevanje} style={{ display: "block", textAlign: "center" }}>
              Pošlji povpraševanje
            </Link>

            {dokumenti.length > 0 && (
              <div className="izd-dok">
                <p className="izd-mali">Dokumentacija</p>
                {dokumenti.map((d) => (
                  <a key={d.id} href={d.datoteka_url} target="_blank" rel="noreferrer">
                    <b>{oznakeTipov[d.tip] ?? d.tip}</b>
                    <span>{d.naziv}</span>
                    <em>PDF · {d.jezik?.toUpperCase()}</em>
                  </a>
                ))}
              </div>
            )}
          </aside>

          {/* Desno: naslov, lastnosti, tabela, opis */}
          <div className="izd-desno">
            <p className="izd-kat">{i.kategorije?.naziv}</p>
            <h1 className="izd-h1">{i.naziv}</h1>
            {i.znamka && <span className="znamka">{i.znamka} program</span>}
            {i.kratek_opis && <p className="izd-kratko">{i.kratek_opis}</p>}

            {(skupne.length > 0 || i.eta_stevilka) && (
              <div className="izd-oznake">
                {i.eta_stevilka && (
                  <span className="izd-oz izd-oz-r">
                    <em>ETA</em>
                    {i.eta_stevilka}
                  </span>
                )}
                {skupne.map(([k, v]) => (
                  <span key={k} className="izd-oz">
                    <em>{k}</em>
                    {v}
                  </span>
                ))}
              </div>
            )}

            {artikli.length > 0 && (
              <div className="izd-tab">
                <div className="izd-tab-gl">
                  <h2>Dimenzije in šifre</h2>
                  <span>{artikli.length} {artikli.length === 1 ? "artikel" : artikli.length < 5 ? "artikli" : "artiklov"}</span>
                </div>
                <TabelaArtiklov artikli={artikli} stolpci={stolpci} naziviRazlicni={naziviRazlicni} embalaza={i.embalaza ?? []} izdelek={{ naziv: i.naziv, pot: `/program/${kategorija}/${izdelek}` }} />
                <p className="izd-opomba">
                  Cene so maloprodajne z DDV, za pakiranje v stolpcu »Kos v pak.«. Za večje količine in podjetja <Link href={povprasevanje}>pošljite povpraševanje</Link>.
                </p>
              </div>
            )}

            {(i.opis || i.tehnicni_opis || i.uporaba?.length > 0) && (
              <div className="izd-opis">
                {(i.opis || i.tehnicni_opis) && (
                  <div>
                    <h2>O izdelku</h2>
                    {(i.opis ?? "").split("\n").filter(Boolean).map((odstavek, n) => (
                      <p key={n}>{odstavek}</p>
                    ))}
                    {i.tehnicni_opis && (
                      <div className="izd-teh">
                        <p className="izd-mali">Tehnični podatki in vgradnja</p>
                        {i.tehnicni_opis.split("\n").filter(Boolean).map((odstavek, n) => (
                          <p key={n}>{odstavek}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {i.uporaba?.length > 0 && (
                  <div>
                    <h2>Kje se vgrajuje</h2>
                    <ul className="izd-upo">
                      {i.uporaba.map((u) => (
                        <li key={u}>{u}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <IgraIzdelka slug={izdelek} />
      </div>
    </section>
  );
}
