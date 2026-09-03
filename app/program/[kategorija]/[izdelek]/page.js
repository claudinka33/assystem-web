import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pridobiIzdelek } from "@/lib/podatki";

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

export default async function StranIzdelka({ params }) {
  const { kategorija, izdelek } = await params;
  const i = await pridobiIzdelek(izdelek);
  if (!i) notFound();

  const artikli = (i.artikli ?? []).filter((a) => a.objavljeno);
  const dokumenti = i.dokumenti ?? [];

  return (
    <>
      {/* Glava izdelka */}
      <section className="sec" style={{ paddingBottom: 40 }}>
        <div className="w">
          <nav className="drobtine">
            <Link href="/">Domov</Link> / <Link href="/program">Program</Link> /{" "}
            <Link href={`/program/${kategorija}`}>{i.kategorije?.naziv ?? "Kategorija"}</Link> /{" "}
            {i.naziv}
          </nav>

          <div className="qua" style={{ alignItems: "flex-start" }}>
            <div style={{ position: "relative", aspectRatio: "4 / 3", background: "#fff", border: "1px solid var(--color-line)" }}>
              {i.slika_url && (
                <Image
                  src={i.slika_url}
                  alt={i.naziv}
                  fill
                  priority
                  sizes="(max-width: 1000px) 100vw, 620px"
                  style={{ objectFit: "contain", padding: 24, mixBlendMode: "multiply" }}
                />
              )}
            </div>

            <div>
              <div className="st">
                <span>{i.kategorije?.naziv}</span>
                <h1>{i.naziv}</h1>
                {i.kratek_opis && <p>{i.kratek_opis}</p>}
              </div>

              {i.eta_stevilka && (
                <p style={{ marginBottom: 18 }}>
                  <span className="kick">{i.eta_stevilka}</span>
                </p>
              )}

              {i.prednosti?.length > 0 && (
                <ul style={{ listStyle: "none", display: "grid", gap: 10, marginBottom: 24 }}>
                  {i.prednosti.map((p) => (
                    <li key={p} style={{ display: "flex", gap: 10, fontSize: 15 }}>
                      <span style={{ color: "var(--color-red)", fontWeight: 900 }}>✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
              )}

              <Link
                className="b b-r"
                href={`/kontakt?izdelek=${encodeURIComponent(i.naziv)}&vir=izdelek`}
              >
                Pošlji povpraševanje
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Opis in uporaba */}
      {(i.opis || i.uporaba?.length > 0 || i.tehnicni_opis) && (
        <section className="sec grey">
          <div className="w">
            <div className="qua" style={{ alignItems: "flex-start" }}>
              <div>
                {i.opis && (
                  <>
                    <div className="st">
                      <span>Opis</span>
                      <h2>O izdelku</h2>
                    </div>
                    {i.opis.split("\n").filter(Boolean).map((odstavek, n) => (
                      <p key={n} style={{ color: "var(--color-muted)", marginBottom: 12 }}>
                        {odstavek}
                      </p>
                    ))}
                  </>
                )}
                {i.tehnicni_opis && (
                  <p style={{ color: "var(--color-muted)", marginTop: 18 }}>{i.tehnicni_opis}</p>
                )}
              </div>

              {i.uporaba?.length > 0 && (
                <div>
                  <div className="st">
                    <span>Uporaba</span>
                    <h2>Kje se vgrajuje</h2>
                  </div>
                  <ul style={{ listStyle: "none", display: "grid", gap: 12 }}>
                    {i.uporaba.map((u) => (
                      <li
                        key={u}
                        style={{
                          background: "#fff",
                          padding: "14px 18px",
                          borderLeft: "3px solid var(--color-red)",
                          fontSize: 15,
                        }}
                      >
                        {u}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Tabela artiklov */}
      {artikli.length > 0 && (
        <section className="sec">
          <div className="w">
            <div className="st">
              <span>Program</span>
              <h2>Dimenzije in šifre</h2>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="adm-tab" style={{ minWidth: 640 }}>
                <thead>
                  <tr>
                    <th>Šifra</th>
                    <th>Naziv</th>
                    <th>Dimenzija</th>
                    <th>EAN</th>
                    <th>Pakiranje</th>
                    <th>Zaloga</th>
                  </tr>
                </thead>
                <tbody>
                  {artikli.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <b>{a.sifra}</b>
                      </td>
                      <td>{a.naziv}</td>
                      <td>{a.dimenzija ?? "—"}</td>
                      <td style={{ color: "var(--color-muted)" }}>{a.ean ?? "—"}</td>
                      <td>{a.pakiranje ? `${a.pakiranje} ${a.enota ?? "kos"}` : "—"}</td>
                      <td>
                        {a.zaloga === null || a.zaloga === undefined ? (
                          "—"
                        ) : a.zaloga > 0 ? (
                          <span style={{ color: "#1a7f3c", fontWeight: 700 }}>Na zalogi</span>
                        ) : (
                          <span style={{ color: "var(--color-muted)" }}>Po naročilu</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ marginTop: 16, color: "var(--color-muted)", fontSize: 14.5 }}>
              Za cene in razpoložljivost pošljite povpraševanje ali pokličite prodajo.
            </p>
          </div>
        </section>
      )}

      {/* Dokumenti */}
      {dokumenti.length > 0 && (
        <section className="sec grey">
          <div className="w">
            <div className="st">
              <span>Dokumentacija</span>
              <h2>Certifikati in gradiva</h2>
            </div>
            <div className="kats">
              {dokumenti.map((d) => (
                <a
                  key={d.id}
                  className="k"
                  href={d.datoteka_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ background: "#fff" }}
                >
                  <div className="tx">
                    <span className="kick">{oznakeTipov[d.tip] ?? d.tip}</span>
                    <h3 style={{ marginTop: 12 }}>{d.naziv}</h3>
                    <p>PDF · {d.jezik?.toUpperCase()}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Poziv */}
      <div className="cta">
        <div className="w">
          <div>
            <h2>Potrebujete ponudbo za {i.naziv}?</h2>
            <p>Pošljite dimenzije in količino, odgovorimo v enem delovnem dnevu.</p>
          </div>
          <Link
            className="b b-w"
            href={`/kontakt?izdelek=${encodeURIComponent(i.naziv)}&vir=izdelek`}
          >
            Pošlji povpraševanje →
          </Link>
        </div>
      </div>
    </>
  );
}
