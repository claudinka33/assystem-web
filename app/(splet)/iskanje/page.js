import { stevilo, najdenih, ZADETEK } from "@/lib/sklanjanje";
import Image from "next/image";
import ZnamkaZnak from "@/components/ZnamkaZnak";
import Link from "next/link";
import BeleziIskanje from "@/components/BeleziIskanje";
import { isci } from "@/lib/podatki";
import { prevedenaStran, prevediMetadata } from "@/lib/i18n/streznik";

const metadataSl = {
  title: "Iskanje",
  robots: { index: false, follow: true },
};

async function Iskanje({ searchParams }) {
  const params = await searchParams;
  const niz = (params?.q ?? "").trim();
  const { izdelki, artikli } = await isci(niz);
  const skupaj = izdelki.length + artikli.length;

  return (
    <>
      {niz && <BeleziIskanje q={niz} zadetki={skupaj} />}
      <section className="is-glava">
        <div className="w">
          <div className="is-glava-tx">
            <nav className="drobtine">
              <Link href="/">Domov</Link> / Iskanje
            </nav>
            <h1>{niz ? <>Rezultati za „{niz}“</> : "Iskanje"}</h1>
            <p>{niz ? `${najdenih(skupaj)} med izdelki in šiframi artiklov.` : "Vpišite šifro artikla, EAN kodo ali naziv izdelka."}</p>
          </div>
          <form action="/iskanje" className="is-obr">
            <input name="q" type="search" defaultValue={niz} placeholder="Šifra, EAN ali naziv (npr. TXH7 ali M10x90)" aria-label="Iskanje" autoFocus={!niz} />
            <button type="submit">Išči</button>
          </form>
        </div>
      </section>

      <section className="sec is-rez">
        <div className="w">
          {niz && skupaj === 0 && (
            <div className="priprava">
              <h2>Ni zadetkov</h2>
              <p>
                Poskusite s krajšim nizom ali samo z delom šifre. Če izdelka ne
                najdete, nam pišite: večino programa imamo tudi izven spletnega
                kataloga.
              </p>
              <Link className="more" href="/kontakt?vir=iskanje" style={{ display: "inline-block", marginTop: 14 }}>
                Pošljite povpraševanje →
              </Link>
            </div>
          )}

          {izdelki.length > 0 && (
            <>
              <div className="st">
                <span>Izdelki</span>
                <h2>{stevilo(izdelki.length, ZADETEK)}</h2>
              </div>
              <div className="kats is-kats" style={{ marginBottom: 44 }}>
                {izdelki.map((i) => (
                  <Link
                    key={i.id}
                    className="k"
                    href={`/program/${i.kategorije?.slug ?? "program"}/${i.slug}`}
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
                      <h3>{i.naziv}</h3>
                      <p>{i.kratek_opis}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {artikli.length > 0 && (
            <>
              <div className="st">
                <span>Artikli</span>
                <h2>{stevilo(artikli.length, ZADETEK)} po šifri</h2>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table className="adm-tab" style={{ minWidth: 640 }}>
                  <thead>
                    <tr>
                      <th style={{ width: 150 }}>Šifra</th>
                      <th>Naziv</th>
                      <th style={{ width: 120 }}>Dimenzija</th>
                      <th style={{ width: 110 }}>Pakiranje</th>
                      <th style={{ width: 120 }}></th>
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
                        <td>{a.pakiranje ?? "—"}</td>
                        <td style={{ textAlign: "right" }}>
                          {a.izdelki?.slug && (
                            <Link
                              className="more"
                              href={`/program/${a.izdelki.kategorije?.slug ?? "program"}/${a.izdelki.slug}?sifra=${encodeURIComponent(a.sifra)}`}
                            >
                              Odpri →
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default prevedenaStran(Iskanje);

export async function generateMetadata() {
  return prevediMetadata(metadataSl);
}
