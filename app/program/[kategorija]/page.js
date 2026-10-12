import Image from "next/image";
import ZnamkaZnak from "@/components/ZnamkaZnak";
import Link from "next/link";
import { notFound } from "next/navigation";
import NaslovStrani from "@/components/NaslovStrani";
import VPripravi from "@/components/VPripravi";
import {
  pridobiIzdelke,
  pridobiKategorijo,
  pridobiKategorije,
  pridobiPodkategorije,
} from "@/lib/podatki";
import { kategorije as rezervne } from "@/lib/site";
import { ZNAMKE, ZNAMKE_INFO, normZnamka } from "@/lib/znamke";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { kategorija } = await params;
  const k = await pridobiKategorijo(kategorija);
  const r = rezervne.find((x) => x.slug === kategorija);

  const naziv = k?.naziv ?? r?.naziv;
  if (!naziv) return {};

  return {
    title: k?.seo_naslov ?? naziv,
    description: k?.seo_opis ?? k?.opis ?? r?.opis,
    alternates: { canonical: `/program/${kategorija}` },
  };
}

export default async function Kategorija({ params, searchParams }) {
  const { kategorija } = await params;
  const izbrana = normZnamka((await searchParams)?.znamka);
  const k = await pridobiKategorijo(kategorija);
  const r = rezervne.find((x) => x.slug === kategorija);

  if (!k && !r) notFound();

  const vsi = k ? await pridobiIzdelke(k.id) : [];
  // Filter po znamki — gumbi samo, če sta v skupini vsaj dve znamki.
  const prisotne = ZNAMKE.filter((z) => vsi.some((i) => i.znamka === z));
  const izdelki = izbrana ? vsi.filter((i) => i.znamka === izbrana) : vsi;
  const podkategorije = k ? await pridobiPodkategorije(k.id) : [];

  return (
    <>
      <NaslovStrani
        oznaka="Prodajni program"
        naslov={k?.naziv ?? r.naziv}
        opis={k?.opis ?? r.opis}
      />

      {podkategorije.length > 0 && (
        <section className="sec" style={{ paddingBottom: 0 }}>
          <div className="w">
            <div className="st">
              <span>Podskupine</span>
            </div>
            <div className="kats">
              {podkategorije.map((p) => (
                <Link key={p.slug} className="k" href={`/program/${p.slug}`}>
                  <div className={p.slika_url ? "im" : "im prazna"}>
                    {p.slika_url && (
                      <Image
                        src={p.slika_url}
                        alt={p.naziv}
                        fill
                        sizes="300px"
                        style={{ objectFit: "contain", padding: 18, mixBlendMode: "multiply" }}
                      />
                    )}
                  </div>
                  <div className="tx">
                    <h2>{p.naziv}</h2>
                    <p>{p.opis}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {izdelki.length > 0 ? (
        <section className="sec">
          <div className="w">
            {prisotne.length > 1 && (
              <nav className="zn-filter" aria-label="Filter po znamki">
                <span>Znamka:</span>
                <Link href={`/program/${kategorija}`} className={!izbrana ? "on" : undefined}>
                  Vse <em>{vsi.length}</em>
                </Link>
                {prisotne.map((z) => (
                  <Link key={z} href={`/program/${kategorija}?znamka=${encodeURIComponent(z)}`} className={izbrana === z ? "on" : undefined}>
                    {ZNAMKE_INFO[z].ime} <em>{vsi.filter((i) => i.znamka === z).length}</em>
                  </Link>
                ))}
              </nav>
            )}
            <div className="kats">
              {izdelki.map((i) => (
                <Link
                  key={i.slug}
                  className="k"
                  href={`/program/${kategorija}/${i.slug}`}
                >
                  <div className={i.slika_url ? "im" : "im prazna"}>
                    {i.slika_url && (
                      <Image
                        src={i.slika_url}
                        alt={i.naziv}
                        fill
                        sizes="300px"
                        style={{ objectFit: "contain", padding: 18, mixBlendMode: "multiply" }}
                      />
                    )}
                  </div>
                  <div className="tx">
                    <ZnamkaZnak znamka={i.znamka} />
                    <h2>{i.naziv}</h2>
                    <p>{i.kratek_opis}</p>
                    {i.eta_stevilka && (
                      <p style={{ color: "var(--color-red)", fontWeight: 700, marginTop: 6 }}>
                        {i.eta_stevilka}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <VPripravi kaj="Izdelke te kategorije skupaj s šiframi, dimenzijami in tehničnimi listi vnašamo v urejevalnik vsebin." />
      )}
    </>
  );
}
