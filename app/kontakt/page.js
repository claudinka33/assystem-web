import NaslovStrani from "@/components/NaslovStrani";
import ObrazecPovprasevanje from "@/components/ObrazecPovprasevanje";
import { site } from "@/lib/site";

export const metadata = {
  title: "Kontakt",
  description:
    "Pišite nam ali pokličite. AS system d.o.o., Šmarje pri Jelšah — pritrdilna tehnika ASfix.",
  alternates: { canonical: "/kontakt" },
};

export default async function Kontakt({ searchParams }) {
  const params = await searchParams;
  const izdelek = params?.izdelek ?? null;
  const vir = params?.vir ?? (izdelek ? "izdelek" : "kontakt");

  return (
    <>
      <NaslovStrani
        oznaka="Pišite nam"
        naslov="Kontakt"
        opis="Pošljite dimenzije, količino ali samo fotografijo vgradnje. Odgovorimo v enem delovnem dnevu."
      />

      <section className="sec">
        <div className="w">
          <div className="qua" style={{ alignItems: "flex-start" }}>
            <ObrazecPovprasevanje
              vir={vir}
              izdelek={izdelek}
              naslov={izdelek ? `Povpraševanje — ${izdelek}` : "Pošljite povpraševanje"}
            />

            <div>
              <div className="st">
                <span>Podatki</span>
                <h2>AS system d.o.o.</h2>
              </div>

              <dl className="stik">
                <div>
                  <dt>Telefon</dt>
                  <dd>
                    <a href={`tel:${site.telefonRaw}`}>{site.telefon}</a>
                  </dd>
                </div>
                <div>
                  <dt>Prodaja</dt>
                  <dd>
                    <a href={`mailto:${site.emailProdaja}`}>{site.emailProdaja}</a>
                  </dd>
                </div>
                <div>
                  <dt>Splošno</dt>
                  <dd>
                    <a href={`mailto:${site.email}`}>{site.email}</a>
                  </dd>
                </div>
                {site.lokacije.map((l) => (
                  <div key={l.naziv}>
                    <dt>{l.naziv}</dt>
                    <dd style={{ fontWeight: 400, fontSize: 15 }}>
                      {l.naslov}
                      <br />
                      <span style={{ color: "var(--color-muted)", fontSize: 14 }}>{l.vloga}</span>
                    </dd>
                  </div>
                ))}
                <div>
                  <dt>Delovni čas</dt>
                  <dd style={{ fontWeight: 400, fontSize: 15 }}>
                    Ponedeljek–petek, 7.00–15.00
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
