import Link from "next/link";
import NaslovStrani from "@/components/NaslovStrani";
import { pridobiDokumente } from "@/lib/podatki";

export const revalidate = 60;

export const metadata = {
  title: "Kakovost in certifikati",
  description:
    "Evropske tehnične ocene ETA, izjave o lastnostih in navodila za vgradnjo za pritrdila ASfix.",
  alternates: { canonical: "/kakovost" },
};

const oznake = {
  eta: "ETA",
  dop: "DoP",
  certifikat: "Certifikat",
  letak: "Letak",
  katalog: "Katalog",
  navodila: "Navodila",
  risba: "Risba",
};

const pojasnila = [
  ["ETA", "Evropska tehnična ocena. Neodvisna ocena nosilnosti sidra po evropskih smernicah — osnova za projektiranje in za dokazovanje ustreznosti na gradbišču."],
  ["CE", "Oznaka skladnosti. Pomeni, da izdelek ustreza zahtevam evropske zakonodaje za gradbene proizvode."],
  ["DoP", "Izjava o lastnostih. Dokument, ki ga izvajalec priloži dokumentaciji objekta."],
  ["ISO 9001", "Sistem vodenja kakovosti. Zagotavlja, da so postopki v proizvodnji nadzorovani in ponovljivi."],
];

export default async function Kakovost() {
  const dokumenti = await pridobiDokumente();

  return (
    <>
      <NaslovStrani
        oznaka="Dokumentacija"
        naslov="Kakovost in certifikati"
        opis="Je kakovost pomembna? Za nas je najpomembnejša."
      />

      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Kaj pomenijo oznake</span>
            <h2>Dokazila, ki jih projekt zahteva</h2>
            <p>
              Nosilna sidra niso navaden vijak. Projektant in nadzornik zahtevata
              dokazila, zato jih imamo pripravljena za prenos, v slovenščini in
              angleščini.
            </p>
          </div>

          <div className="kats">
            {pojasnila.map(([kratica, opis]) => (
              <div key={kratica} className="k" style={{ padding: "26px 24px" }}>
                <span className="kick">{kratica}</span>
                <p style={{ marginTop: 14 }}>{opis}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec grey">
        <div className="w">
          <div className="st">
            <span>Prenosi</span>
            <h2>Dokumenti za prenos</h2>
          </div>

          {dokumenti.length === 0 ? (
            <div className="priprava" style={{ background: "#fff", padding: "24px 22px" }}>
              <h2>Arhiv pripravljamo</h2>
              <p>
                Certifikate in izjave o lastnostih trenutno urejamo. Do takrat
                vam dokumentacijo za konkreten izdelek pošljemo po e-pošti.
              </p>
              <Link className="more" href="/kontakt?vir=kakovost" style={{ display: "inline-block", marginTop: 14 }}>
                Zaprosite za dokumentacijo →
              </Link>
            </div>
          ) : (
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
                    <span className="kick">{oznake[d.tip] ?? d.tip}</span>
                    <h3 style={{ marginTop: 12 }}>{d.naziv}</h3>
                    <p>
                      {d.izdelki?.naziv ? `${d.izdelki.naziv} · ` : ""}PDF ·{" "}
                      {d.jezik?.toUpperCase()}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
