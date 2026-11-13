import { stevilo, DOKUMENT } from "@/lib/sklanjanje";
import Link from "next/link";
import NaslovStrani from "@/components/NaslovStrani";
import { pridobiDokumente } from "@/lib/podatki";

export const revalidate = 60;

export const metadata = {
  title: "Katalogi in prenosi",
  description:
    "Dokumentacija za pritrdila ASfix: evropske tehnične ocene ETA, letaki in druga gradiva za prenos ali na zahtevo.",
  alternates: { canonical: "/katalogi" },
};

const skupine = [
  ["katalog", "Katalogi", "Celoten prodajni program v enem dokumentu."],
  ["letak", "Letaki", "Predstavitve posameznih izdelkov in skupin."],
  ["eta", "Evropske tehnične ocene", "Dokazila o nosilnosti sider (ETA)."],
  ["dop", "Izjave o lastnostih", "Dokumenti za dokumentacijo objekta (DoP)."],
  ["certifikat", "Certifikati", "Ostala potrdila in certifikati."],
  ["navodila", "Navodila za vgradnjo", "Kako izdelek pravilno vgraditi."],
  ["risba", "Tehnične risbe", "Dimenzijske risbe izdelkov."],
];

export default async function Katalogi() {
  const vsi = await pridobiDokumente();
  // Opis našteje samo skupine, ki dejansko imajo dokumente
  const prisotne = skupine.filter(([tip]) => vsi.some((d) => d.tip === tip)).map(([, n]) => n.toLowerCase());
  const opisStrani =
    prisotne.length > 0
      ? `Za prenos: ${prisotne.join(", ")}. Ostalo dokumentacijo (izjave o lastnostih, navodila) pošljemo na zahtevo.`
      : "Dokumentacijo za konkreten izdelek pošljemo na zahtevo.";

  return (
    <>
      <NaslovStrani
        oznaka="Gradiva"
        naslov="Katalogi in prenosi"
        opis={opisStrani}
      />

      {vsi.length === 0 ? (
        <section className="sec">
          <div className="w">
            <div className="priprava">
              <h2>Arhiv pripravljamo</h2>
              <p>
                Kataloge in certifikate trenutno urejamo. Do takrat vam
                dokumentacijo za konkreten izdelek pošljemo po e-pošti.
              </p>
              <Link className="more" href="/kontakt?vir=katalogi" style={{ display: "inline-block", marginTop: 14 }}>
                Zaprosite za gradivo →
              </Link>
            </div>
          </div>
        </section>
      ) : (
        skupine.map(([tip, naslov, opis], i) => {
          const dokumenti = vsi.filter((d) => d.tip === tip);
          if (dokumenti.length === 0) return null;

          return (
            <section key={tip} className={i % 2 === 1 ? "sec grey" : "sec"}>
              <div className="w">
                <div className="st">
                  <span>{stevilo(dokumenti.length, DOKUMENT)}</span>
                  <h2>{naslov}</h2>
                  <p>{opis}</p>
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
                        <h3>{d.naziv}</h3>
                        <p>
                          {d.izdelki?.naziv ? `${d.izdelki.naziv} · ` : ""}PDF ·{" "}
                          {d.jezik?.toUpperCase()}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </section>
          );
        })
      )}

      <div className="cta">
        <div className="w">
          <div>
            <h2>Ne najdete pravega dokumenta?</h2>
            <p>Napišite, kateri izdelek vas zanima, in ga pošljemo po e-pošti.</p>
          </div>
          <Link className="b b-w" href="/kontakt?vir=katalogi">
            Pošljite povpraševanje →
          </Link>
        </div>
      </div>
    </>
  );
}
