import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pridobiNovico, pridobiNovice } from "@/lib/podatki";
import { datumSlo } from "@/lib/pomoc";
import { nazivVrste } from "@/lib/vrste-clankov";
import { site } from "@/lib/site";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const n = await pridobiNovico(slug);
  if (!n) return {};
  return {
    title: n.seo_naslov ?? n.naslov,
    description: n.seo_opis ?? n.povzetek ?? undefined,
    alternates: { canonical: `/aktualno/${slug}` },
    openGraph: n.slika_url ? { images: [n.slika_url] } : undefined,
  };
}

// Vsebina: prazna vrstica = nov odstavek; vrstica z »– « ali »- « = alineja;
// kratka vrstica brez pike na koncu = podnaslov.
function Vsebina({ besedilo }) {
  const vrstice = String(besedilo ?? "").split("\n").map((v) => v.trim()).filter(Boolean);
  const bloki = [];
  for (const v of vrstice) {
    const alineja = /^[–\-•]\s+/.test(v);
    if (alineja) {
      const zadnji = bloki[bloki.length - 1];
      const tx = v.replace(/^[–\-•]\s+/, "");
      if (zadnji?.tip === "ul") zadnji.el.push(tx);
      else bloki.push({ tip: "ul", el: [tx] });
    } else if (v.length < 70 && !/[.!:,;]$/.test(v)) {
      bloki.push({ tip: "h2", tx: v });
    } else {
      bloki.push({ tip: "p", tx: v });
    }
  }
  return (
    <div className="clanek-vsebina">
      {bloki.map((b, i) =>
        b.tip === "h2" ? (
          <h2 key={i}>{b.tx}</h2>
        ) : b.tip === "ul" ? (
          <ul key={i}>
            {b.el.map((x, j) => {
              // »Naslov alineje. Opis …« → naslov krepko
              const m = /^([^.]{3,60}\.)\s+(.*)$/.exec(x);
              return <li key={j}>{m ? <><b>{m[1]}</b> {m[2]}</> : x}</li>;
            })}
          </ul>
        ) : (
          <p key={i}>{b.tx}</p>
        )
      )}
    </div>
  );
}

export default async function Novica({ params }) {
  const { slug } = await params;
  const n = await pridobiNovico(slug);
  if (!n) notFound();
  const drugi = (await pridobiNovice(4)).filter((x) => x.slug !== slug).slice(0, 3);

  return (
    <article className="sec clanek">
      <div className="w">
        <nav className="drobtine">
          <Link href="/">Domov</Link> / <Link href="/aktualno">Aktualno</Link> / {n.naslov}
        </nav>

        <div className="clanek-mreza">
          <div className="clanek-glavni">
            <div className="clanek-nad">
              <span className="blog-oz">{nazivVrste(n.vrsta)}</span>
              <span>{datumSlo(n.objavljeno_dne)}</span>
            </div>
            <h1 className="clanek-naslov">{n.naslov}</h1>
            {n.povzetek && <p className="clanek-uvod">{n.povzetek}</p>}

            {n.slika_url && (
              <div className="clanek-slika">
                <Image src={n.slika_url} alt={n.naslov} fill sizes="(max-width: 1000px) 100vw, 780px" priority />
              </div>
            )}

            <Vsebina besedilo={n.vsebina} />

            <p style={{ marginTop: 36 }}>
              <Link className="more" href="/aktualno">
                ← Vsi članki
              </Link>
            </p>
          </div>

          <aside className="clanek-stran">
            {drugi.length > 0 && (
              <div className="clanek-box">
                <h3>Več člankov</h3>
                <div className="clanek-drugi">
                  {drugi.map((d) => (
                    <Link key={d.slug} href={`/aktualno/${d.slug}`} className="clanek-drugi-el">
                      <span className={`clanek-drugi-sl${d.slika_url ? "" : " prazna"}`}>
                        {d.slika_url && <Image src={d.slika_url} alt="" fill sizes="96px" />}
                      </span>
                      <span>
                        <em>{nazivVrste(d.vrsta)}</em>
                        <b>{d.naslov}</b>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="clanek-box temen">
              <h3>Naročite na spletu</h3>
              <p>Pritrdilna tehnika ASfix in vijačno blago ASco iz zaloge. Podjetja naročajo po svojih cenah v B2B portalu.</p>
              <Link className="b b-r" href="/program">Izdelki →</Link>
              <Link className="clanek-povezava" href="/b2b">B2B prijava za podjetja →</Link>
            </div>

            <div className="clanek-box">
              <h3>E-novice</h3>
              <p>Novosti, akcije in nasveti za montažo, največ enkrat mesečno.</p>
              <a className="clanek-povezava" href="#enov-naslov">Prijavite se na e-novice ↓</a>
            </div>

            <div className="clanek-box">
              <h3>Vprašanja?</h3>
              <p>
                <a href={`tel:${site.telefonRaw}`}>{site.telefon}</a>
                <br />
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
