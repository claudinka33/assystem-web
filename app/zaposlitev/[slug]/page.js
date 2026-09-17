import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ObrazecPrijava from "@/components/ObrazecPrijava";
import { pridobiDelovnoMesto } from "@/lib/podatki";
import { datumSlo } from "@/lib/pomoc";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const m = await pridobiDelovnoMesto(slug);
  if (!m) return {};
  return {
    title: m.seo_naslov ?? m.naziv,
    description: m.seo_opis ?? m.kratek_opis ?? undefined,
    alternates: { canonical: `/zaposlitev/${slug}` },
  };
}

function Seznam({ naslov, postavke }) {
  if (!postavke?.length) return null;
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 19, fontWeight: 700, textTransform: "uppercase", marginBottom: 12 }}>
        {naslov}
      </h2>
      <ul style={{ listStyle: "none", display: "grid", gap: 10 }}>
        {postavke.map((p) => (
          <li key={p} style={{ display: "flex", gap: 10, fontSize: 15.5 }}>
            <span style={{ color: "var(--color-red)", fontWeight: 800 }}>✓</span>
            <span style={{ color: "var(--color-muted)" }}>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function DelovnoMesto({ params }) {
  const { slug } = await params;
  const m = await pridobiDelovnoMesto(slug);
  if (!m) notFound();

  return (
    <>
      <section className="pgh">
        <div className="w">
          <nav className="drobtine">
            <Link href="/">Domov</Link> / <Link href="/zaposlitev">Zaposlitev</Link> / {m.naziv}
          </nav>
          <div className="st" style={{ marginBottom: 0 }}>
            <span>{[m.lokacija, m.vrsta].filter(Boolean).join(" · ")}</span>
            <h1>{m.naziv}</h1>
            {m.kratek_opis && <p>{m.kratek_opis}</p>}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="w">
          <div className="qua" style={{ alignItems: "flex-start" }}>
            <div>
              {m.slika_url && (
                <div style={{ position: "relative", aspectRatio: "16 / 10", marginBottom: 28 }}>
                  <Image src={m.slika_url} alt={m.naziv} fill sizes="620px" style={{ objectFit: "cover" }} />
                </div>
              )}

              {m.opis &&
                m.opis
                  .split("\n")
                  .filter(Boolean)
                  .map((odstavek, i) => (
                    <p key={i} style={{ color: "var(--color-muted)", marginBottom: 14, fontSize: 16 }}>
                      {odstavek}
                    </p>
                  ))}

              <div style={{ marginTop: 28 }}>
                <Seznam naslov="Naloge" postavke={m.naloge} />
                <Seznam naslov="Pričakujemo" postavke={m.pricakujemo} />
                <Seznam naslov="Ponujamo" postavke={m.ponujamo} />
              </div>

              {m.rok_prijave && (
                <p style={{ fontWeight: 600 }}>Rok prijave: {datumSlo(m.rok_prijave)}</p>
              )}

              <p style={{ marginTop: 20 }}>
                <Link className="more" href="/zaposlitev">
                  ← Vsa odprta mesta
                </Link>
              </p>
            </div>

            <div>
              <ObrazecPrijava delovnaMesta={[m]} izbrano={m.id} />
              <p style={{ marginTop: 14, fontSize: 13.5, color: "var(--color-muted)" }}>
                Prijavo lahko pošljete tudi po e-pošti na{" "}
                <a href="mailto:zaposlitev@as-system.si" style={{ color: "var(--color-red)" }}>
                  zaposlitev@as-system.si
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
