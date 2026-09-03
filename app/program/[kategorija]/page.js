import Image from "next/image";
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

export default async function Kategorija({ params }) {
  const { kategorija } = await params;
  const k = await pridobiKategorijo(kategorija);
  const r = rezervne.find((x) => x.slug === kategorija);

  if (!k && !r) notFound();

  const izdelki = k ? await pridobiIzdelke(k.id) : [];
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
