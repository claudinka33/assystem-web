import Image from "next/image";
import Link from "next/link";
import NaslovStrani from "@/components/NaslovStrani";
import ObrazecPrijava from "@/components/ObrazecPrijava";
import { pridobiDelovnaMesta } from "@/lib/podatki";
import { pridobiVsebine, v } from "@/lib/vsebine";

export const revalidate = 60;

export const metadata = {
  title: "Zaposlitev",
  description:
    "Odprta delovna mesta v podjetju AS system d.o.o. — proizvodnja pritrdilne tehnike v Šmarju pri Jelšah in Bistrici ob Sotli. Oddajte prijavo prek spleta.",
  alternates: { canonical: "/zaposlitev" },
};

const razlogi = [
  ["Stabilno podjetje", "Družinsko podjetje s tridesetletno tradicijo in lastno proizvodnjo na dveh lokacijah."],
  ["Konkretno delo", "Izdelek, ki ga naredimo, se vidi in drži. Brez neskončnih sestankov in dolgih hierarhij."],
  ["Znanje ostane doma", "Orodja, razvoj in proizvodnjo obvladujemo sami — tu se je mogoče veliko naučiti."],
  ["Priložnost za mlade", "Podeljujemo kadrovske štipendije in omogočamo prakso z zaposlitvijo po šolanju."],
];

export default async function Zaposlitev() {
  const [mesta, b] = await Promise.all([pridobiDelovnaMesta(), pridobiVsebine("zaposlitev")]);

  return (
    <>
      <NaslovStrani
        oznaka="Kariera"
        naslov={v(b, "zaposlitev.uvod.naslov", "naslov", "Pridružite se nam")}
        opis={v(
          b,
          "zaposlitev.uvod.besedilo",
          "besedilo",
          "Strast, predanost, dobri medsebojni odnosi in delovni izzivi. S temi besedami zaposleni opišejo delo v AS systemu."
        )}
      />

      {/* Odprta mesta */}
      <section className="sec">
        <div className="w">
          <div className="st row">
            <div>
              <span>Odprta mesta</span>
              <h2>{mesta.length > 0 ? `Trenutno iščemo ${mesta.length} sodelavcev` : "Trenutno ni odprtih mest"}</h2>
              <p>
                Kliknite na delovno mesto za podroben opis nalog in pogojev. Prijavo
                oddate kar prek spleta — z življenjepisom v prilogi.
              </p>
            </div>
            <a className="more" href="#prijava">
              Na prijavnico →
            </a>
          </div>

          {mesta.length > 0 ? (
            <div className="kats">
              {mesta.map((m) => (
                <Link key={m.id} className="k" href={`/zaposlitev/${m.slug}`}>
                  <div className={m.slika_url ? "im" : "im prazna"}>
                    {m.slika_url && (
                      <Image
                        src={m.slika_url}
                        alt={m.naziv}
                        fill
                        sizes="300px"
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </div>
                  <div className="tx">
                    <h3>{m.naziv}</h3>
                    <p style={{ color: "var(--color-red)", fontWeight: 600, marginTop: 6 }}>
                      {[m.lokacija, m.vrsta].filter(Boolean).join(" · ")}
                    </p>
                    {m.kratek_opis && <p style={{ marginTop: 8 }}>{m.kratek_opis}</p>}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="priprava">
              <h2>Odprtih mest trenutno ni</h2>
              <p>
                Kljub temu sprejemamo splošne prijave. Življenjepise hranimo in vas
                kontaktiramo, ko se odpre ustrezno mesto.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Zakaj pri nas */}
      <section className="sec grey">
        <div className="w">
          <div className="st">
            <span>Zakaj pri nas</span>
            <h2>{v(b, "zaposlitev.zakaj.naslov", "naslov", "Zakaj pri nas")}</h2>
            <p>
              {v(
                b,
                "zaposlitev.zakaj.besedilo",
                "besedilo",
                "Nismo posredniki, ampak proizvajalci. Delo je konkretno, rezultat je viden, odločitve pa se sprejemajo hitro, ker ni dolgih hierarhij."
              )}
            </p>
          </div>
          <div className="kats">
            {razlogi.map(([naziv, opis]) => (
              <div key={naziv} className="k" style={{ padding: "26px 24px" }}>
                <h3>{naziv}</h3>
                <p style={{ marginTop: 10 }}>{opis}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prijava */}
      <section className="sec" id="prijava">
        <div className="w">
          <div className="qua" style={{ alignItems: "flex-start" }}>
            <div>
              <div className="st">
                <span>Prijava</span>
                <h2>{v(b, "zaposlitev.prijava.naslov", "naslov", "Oddajte prijavo")}</h2>
                <p>
                  {v(
                    b,
                    "zaposlitev.prijava.besedilo",
                    "besedilo",
                    "Če med odprtimi mesti ni pravega, oddajte splošno prijavo. Življenjepise hranimo in vas kontaktiramo, ko se odpre ustrezno mesto."
                  )}
                </p>
              </div>

              <dl className="stik">
                <div>
                  <dt>Prijave sprejemamo na</dt>
                  <dd>
                    <a href="mailto:zaposlitev@as-system.si">zaposlitev@as-system.si</a>
                  </dd>
                </div>
                <div>
                  <dt>Lokaciji</dt>
                  <dd style={{ fontWeight: 400, fontSize: 15 }}>
                    Šmarje pri Jelšah · Bistrica ob Sotli
                  </dd>
                </div>
              </dl>
            </div>

            <ObrazecPrijava delovnaMesta={mesta} />
          </div>
        </div>
      </section>
    </>
  );
}
