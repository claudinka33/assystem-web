import Image from "next/image";
import Link from "next/link";
import NaslovStrani from "@/components/NaslovStrani";
import { isci } from "@/lib/podatki";

export const metadata = {
  title: "Iskanje",
  robots: { index: false, follow: true },
};

export default async function Iskanje({ searchParams }) {
  const params = await searchParams;
  const niz = (params?.q ?? "").trim();
  const { izdelki, artikli } = await isci(niz);
  const skupaj = izdelki.length + artikli.length;

  return (
    <>
      <NaslovStrani
        oznaka="Iskanje"
        naslov={niz ? `Rezultati za „${niz}“` : "Iskanje"}
        opis={
          niz
            ? `Najdenih ${skupaj} zadetkov med izdelki in šiframi artiklov.`
            : "Vpišite šifro artikla, EAN kodo ali naziv izdelka."
        }
      />

      <section className="sec">
        <div className="w">
          <form action="/iskanje" className="obr" style={{ maxWidth: 640, marginBottom: 40 }}>
            <div className="obr-polje" style={{ marginBottom: 0 }}>
              <label htmlFor="q">Šifra, EAN ali naziv</label>
              <div style={{ display: "flex", gap: 10 }}>
                <input id="q" name="q" type="text" defaultValue={niz} placeholder="npr. TXH7 ali M10x90" />
                <button className="b b-r" type="submit" style={{ flex: "none" }}>
                  Išči
                </button>
              </div>
            </div>
          </form>

          {niz && skupaj === 0 && (
            <div className="priprava">
              <h2>Ni zadetkov</h2>
              <p>
                Poskusite s krajšim nizom ali samo z delom šifre. Če izdelka ne
                najdete, nam pišite — večino programa imamo tudi izven spletnega
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
                <h2>{izdelki.length} zadetkov</h2>
              </div>
              <div className="kats" style={{ marginBottom: 50 }}>
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
                <h2>{artikli.length} zadetkov po šifri</h2>
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
                              href={`/program/${a.izdelki.kategorije?.slug ?? "program"}/${a.izdelki.slug}`}
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
