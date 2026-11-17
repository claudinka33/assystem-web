import Link from "next/link";
import ZnamkaZnak from "@/components/ZnamkaZnak";
import { notFound } from "next/navigation";
import { pridobiIzdelek, pridobiPonudbo, pridobiSorodne, pridobiDrevoPrograma } from "@/lib/podatki";
import HitriProgram from "@/components/HitriProgram";
import TabelaArtiklov from "@/components/TabelaArtiklov";
import TabelaGosta from "@/components/TabelaGosta";
import { SLIKE_VREDNOSTI } from "@/lib/slike-vrednosti";
import GalerijaIzdelka from "@/components/GalerijaIzdelka";
import IgraIzdelka from "@/components/IgraIzdelka";
import KarticeIzdelkov from "@/components/KarticeIzdelkov";
import NazadnjeOgledano from "@/components/NazadnjeOgledano";
import KajSePonujamo from "@/components/KajSePonujamo";
import SilvermateVsebina from "@/components/SilvermateVsebina";
import { SILVERMATE_IZDELKI, SILVERMATE_MEDIJI } from "@/lib/silvermate";
import MedijiBanner from "@/components/MedijiBanner";
import { VIDEI_IZDELKOV } from "@/lib/videi";
import { prevedenaStran, prevediMetadata } from "@/lib/i18n/streznik";

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

async function generateMetadataSl({ params }) {
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

async function StranIzdelka({ params }) {
  const { kategorija, izdelek } = await params;
  const i = await pridobiIzdelek(izdelek);
  if (!i) notFound();

  const artikli = (i.artikli ?? [])
    .filter((a) => a.objavljeno)
    .sort((a, b) => (a.premer ?? 0) - (b.premer ?? 0) || (a.dolzina ?? 0) - (b.dolzina ?? 0));
  const dokumenti = i.dokumenti ?? [];
  // Pas VIDEO · LETAK · CERTIFIKAT: Silvermate ima svoje gradivo, drugi izdelki iz dokumentov
  const dokLetak = dokumenti.find((d) => d.tip === "letak" || d.tip === "katalog");
  const dokEta = dokumenti.find((d) => d.tip === "eta" || d.tip === "certifikat" || d.tip === "dop");
  const mediji =
    i.znamka === "Silvermate"
      ? { ...SILVERMATE_MEDIJI, ...(dokEta ? { certifikat: { ...SILVERMATE_MEDIJI.certifikat, url: dokEta.datoteka_url, opis: "Odprite PDF ↓" } } : {}) }
      : {
          video: i.videi?.[0] ?? VIDEI_IZDELKOV[izdelek] ?? null,
          letak: dokLetak ? { url: dokLetak.datoteka_url, naziv: dokLetak.naziv } : null,
          certifikat: dokEta
            ? { oznaka: i.eta_stevilka ?? oznakeTipov[dokEta.tip] ?? "ETA", url: dokEta.datoteka_url, naslov: dokEta.naziv, opis: "Odprite PDF ↓" }
            : i.eta_stevilka
              ? { oznaka: i.eta_stevilka, url: `/kontakt?izdelek=${encodeURIComponent(i.eta_stevilka + " " + i.naziv)}&vir=certifikat`, opis: "Pošljemo na zahtevo →" }
              : null,
        };
  const galerija = Array.isArray(i.galerija) ? i.galerija : [];
  const slike = [...new Set([i.slika_url, ...galerija].filter(Boolean))].slice(0, 8);
  const { skupne, stolpci } = razdeliLastnosti(artikli);
  const naziviRazlicni = new Set(artikli.map((a) => a.naziv)).size > 1;
  const sorodni = await pridobiSorodne(i, kategorija);
  const ponudba = await pridobiPonudbo(i, sorodni.map((x) => x.id));
  const trenutni = {
    slug: i.slug,
    naziv: i.naziv,
    kratek_opis: i.kratek_opis ?? null,
    slika_url: i.slika_url ?? null,
    znamka: i.znamka ?? null,
    href: `/program/${kategorija}/${izdelek}`,
  };
  const povprasevanje = `/kontakt?izdelek=${encodeURIComponent(i.naziv)}&vir=izdelek`;
  const drevo = await pridobiDrevoPrograma();
  // prejšnji / naslednji izdelek v isti kategoriji
  const najdi = (vozli) => {
    for (const v of vozli) {
      const idx = v.izdelki.findIndex((x) => x.href.endsWith(`/${izdelek}`));
      if (idx >= 0) return { v, idx };
      const r = najdi(v.otroci);
      if (r) return r;
    }
    return null;
  };
  const mesto = najdi(drevo);
  const prejsnji = mesto && mesto.idx > 0 ? mesto.v.izdelki[mesto.idx - 1] : null;
  const naslednji = mesto && mesto.idx < mesto.v.izdelki.length - 1 ? mesto.v.izdelki[mesto.idx + 1] : null;
  // Gosti (data-dense) prikaz — zaenkrat za Silvermate, nato za vse izdelke
  const gosto = i.znamka === "Silvermate";
  const trenutnaPot = mesto ? mesto.v.izdelki[mesto.idx].href : `/program/${kategorija}/${izdelek}`;

  return (
    <>
    <section className="izd">
      <div className={`w izd-w${drevo.length > 0 ? " izd-okvir" : ""}`}>
        {drevo.length > 0 && (
          <aside className="izd-program">
            <HitriProgram drevo={drevo} trenutni={trenutnaPot} />
          </aside>
        )}
        <div className="izd-glavno">
        <nav className="drobtine">
          <Link href="/">Domov</Link> / <Link href="/program">Program</Link> /{" "}
          <Link href={`/program/${kategorija}`}>{i.kategorije?.naziv ?? "Kategorija"}</Link> /{" "}
          {i.naziv}
        </nav>

        {gosto && (
          <div className="g-vrh">
            <div className="g-gal">
              <GalerijaIzdelka slike={slike} naziv={i.naziv} />
            </div>
            <div className="g-vrh-tx">
              <p className="g-vrh-kat">{i.kategorije?.naziv}</p>
              <h1 className="g-vrh-h1">{i.naziv} <ZnamkaZnak znamka={i.znamka} /></h1>
              {i.kratek_opis && <p className="g-vrh-opis">{i.kratek_opis}</p>}
              <div className="g-vrh-oz">
                {i.eta_stevilka && <span className="g-oz r"><em>ETA</em>{i.eta_stevilka}</span>}
                {skupne.map(([k, v]) => <span key={k} className="g-oz"><em>{k}</em>{v}</span>)}
              </div>
              {i.prednosti?.length > 0 && (
                <ul className="g-vrh-pred">{i.prednosti.map((p) => <li key={p}>{p}</li>)}</ul>
              )}
            </div>
            <div className="g-vrh-gumbi">
              <Link className="g-gumb r" href={povprasevanje}>Povpraševanje</Link>
              {(mediji?.video || mediji?.certifikat) && <a className="g-gumb" href="#mediji">Video in certifikat</a>}
              {dokumenti.slice(0, 3).map((d) => (
                <a key={d.id} className="g-gumb" href={d.datoteka_url} target="_blank" rel="noreferrer">{oznakeTipov[d.tip] ?? d.tip} · PDF</a>
              ))}
            </div>
          </div>
        )}

        {!gosto && (
        <div className="izd-grid">
          {/* Levo: slika, prednosti, dokumenti, povpraševanje — ostane na mestu ob skrolanju */}
          <aside className="izd-levo">
            <GalerijaIzdelka slike={slike} naziv={i.naziv} />

          </aside>

          {/* Desno: naslov, lastnosti, tabela, opis */}
          <div className="izd-desno">
            <p className="izd-kat">{i.kategorije?.naziv}</p>
            <h1 className="izd-h1">{i.naziv}</h1>
            <ZnamkaZnak znamka={i.znamka} velik />
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

            <div className="izd-hitro">
              <Link className="b b-r" href={povprasevanje}>Pošljite povpraševanje</Link>
              {artikli.length > 0 && <a className="b b-o" href="#artikli">Dimenzije in cene ↓</a>}
            </div>

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

          </div>
        </div>
        )}

        {/* Tabela in opis čez celo širino */}
    {artikli.length > 0 && (
      <div className="izd-tab izd-tab-siroka" id="artikli">
        <div className="izd-tab-gl">
          <h2>Dimenzije in šifre</h2>
          {(prejsnji || naslednji) && (
            <nav className="izd-sosedi">
              {prejsnji && <Link href={prejsnji.href}>← {prejsnji.naziv}</Link>}
              {naslednji && <Link href={naslednji.href}>{naslednji.naziv} →</Link>}
            </nav>
          )}
        </div>
        {gosto ? (
          <TabelaGosta artikli={artikli} stolpci={stolpci} izdelek={{ naziv: i.naziv, pot: `/program/${kategorija}/${izdelek}`, slika: i.slika_url ?? null, znamka: i.znamka ?? null }} />
        ) : (
        <TabelaArtiklov artikli={artikli} stolpci={stolpci} naziviRazlicni={naziviRazlicni} embalaza={i.embalaza ?? []} izdelek={{ naziv: i.naziv, pot: `/program/${kategorija}/${izdelek}`, slika: i.slika_url ?? null, znamka: i.znamka ?? null }} slikeVrednosti={SLIKE_VREDNOSTI[izdelek] ?? null} />
        )}
        <p className="izd-opomba">
          Cene so maloprodajne z DDV, za pakiranje v stolpcu »Kos v pak.«. Za večje količine in podjetja <Link href={povprasevanje}>pošljite povpraševanje</Link>.
        </p>
      </div>
    )}

    {/* Video in certifikat pod tabelo */}
    <div className="izd-mediji-spodaj" id="mediji"><MedijiBanner {...mediji} /></div>

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

        <IgraIzdelka slug={izdelek} />
        </div>
      </div>
    </section>

    {i.znamka === "Silvermate" && (
      <SilvermateVsebina mediji={false} glava={Object.keys(SILVERMATE_IZDELKI).find((k) => SILVERMATE_IZDELKI[k].slug === izdelek) ?? null} />
    )}

    <section className="izd" style={i.znamka === "Silvermate" ? undefined : { paddingTop: 0 }}>
      <div className="w izd-w">

        <KarticeIzdelkov oznaka="Iz iste skupine" naslov="Sorodni izdelki" izdelki={sorodni} />
        <KajSePonujamo izdelki={ponudba} />
        <NazadnjeOgledano trenutni={trenutni} />
      </div>
    </section>
    </>
  );
}

export default prevedenaStran(StranIzdelka);

export async function generateMetadata(props) {
  return prevediMetadata(await generateMetadataSl(props));
}
