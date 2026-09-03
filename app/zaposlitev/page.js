import NaslovStrani from "@/components/NaslovStrani";
import ObrazecPrijava from "@/components/ObrazecPrijava";
import { pridobiDelovnaMesta } from "@/lib/podatki";

export const revalidate = 60;

export const metadata = {
  title: "Zaposlitev",
  description:
    "Odprta delovna mesta v podjetju AS system d.o.o. — proizvodnja pritrdilne tehnike v Šmarju pri Jelšah in Bistrici ob Sotli.",
  alternates: { canonical: "/zaposlitev" },
};

export default async function Zaposlitev() {
  const mesta = await pridobiDelovnaMesta();

  return (
    <>
      <NaslovStrani
        oznaka="Kariera"
        naslov="Zaposlitev"
        opis="Delo v stabilnem proizvodnem podjetju s tridesetletno tradicijo, na dveh lokacijah v Sloveniji."
      />

      {mesta.length > 0 && (
        <section className="sec">
          <div className="w">
            <div className="st">
              <span>Odprta mesta</span>
              <h2>Trenutno iščemo</h2>
            </div>
            <div className="who">
              {mesta.map((m) => (
                <div key={m.id}>
                  <b>{m.naziv}</b>
                  <p style={{ color: "var(--color-muted-2)", fontSize: 13.5, marginTop: 4 }}>
                    {[m.lokacija, m.vrsta].filter(Boolean).join(" · ")}
                  </p>
                  {m.opis && <p>{m.opis}</p>}
                  {m.rok_prijave && (
                    <p style={{ marginTop: 10, fontWeight: 600, fontSize: 13.5 }}>
                      Rok prijave: {m.rok_prijave}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={mesta.length > 0 ? "sec grey" : "sec"}>
        <div className="w">
          <div className="qua" style={{ alignItems: "flex-start" }}>
            <div>
              <div className="st">
                <span>Prijava</span>
                <h2>Pošljite prijavo</h2>
                <p>
                  Če med odprtimi mesti ni pravega, oddajte splošno prijavo.
                  Življenjepise hranimo in vas kontaktiramo, ko se odpre ustrezno
                  mesto.
                </p>
              </div>
            </div>
            <ObrazecPrijava delovnaMesta={mesta} />
          </div>
        </div>
      </section>
    </>
  );
}
