import Image from "next/image";
import Link from "next/link";
import NaslovStrani from "@/components/NaslovStrani";
import ObrazecPovprasevanje from "@/components/ObrazecPovprasevanje";

export const metadata = {
  title: "Private label",
  description:
    "Pritrdila pod vašo blagovno znamko: razvoj, hladno kovanje, brizganje plastike, lastna orodjarna in avtomatsko pakiranje v vašo embalažo.",
  alternates: { canonical: "/private-label" },
};

const koraki = [
  ["Povpraševanje in risba", "Pošljete vzorec, risbo ali samo opis vgradnje. Skupaj določimo dimenzije, material in zahtevano nosilnost."],
  ["Orodje", "Orodje izdelamo in vzdržujemo v lastni orodjarni v Bistrici ob Sotli. Spremembe so zato hitre in ne gredo prek zunanjih dobaviteljev."],
  ["Vzorci in potrditev", "Izdelamo vzorčno serijo. Po potrditvi pripravimo tehnično dokumentacijo in dogovorimo dinamiko dobav."],
  ["Proizvodnja", "Hladno kovanje jekla in brizganje plastike na lastnem strojnem parku, s kontrolo kakovosti med procesom."],
  ["Pakiranje v vašo embalažo", "Popolnoma avtomatizirano pakiranje v vrečke ali škatle z vašim logotipom in celostno podobo."],
  ["Dobava", "Odprema iz visokoregalnega skladišča v Šmarju pri Jelšah, v 19 držav."],
];

export default function PrivateLabel() {
  return (
    <>
      <NaslovStrani
        oznaka="Za blagovne znamke"
        naslov="Private label"
        opis="Pritrdila pod vašo znamko — od prve risbe do zapakirane police."
      />

      <section className="sec">
        <div className="w">
          <div className="qua" style={{ alignItems: "center" }}>
            <div>
              <div className="st">
                <span>Kaj to pomeni</span>
                <h2>Vaš logotip, naša proizvodnja</h2>
                <p>
                  Za evropske blagovne znamke pokrivamo celotno pot izdelka:
                  razvoj, izdelavo orodja, hladno kovanje, brizganje plastike in
                  avtomatsko pakiranje v embalažo naročnika.
                </p>
                <p style={{ marginTop: 12 }}>
                  Ker so vsi koraki pri nas, se izognemo posrednikom — kar pomeni
                  krajše roke, boljši nadzor kakovosti in fleksibilnost pri
                  spremembah.
                </p>
              </div>
            </div>
            <div className="foto">
              <Image
                src="/slike/skatla-private-label.jpg"
                alt="Škatla v embalaži naročnika"
                fill
                sizes="(max-width: 1000px) 100vw, 560px"
                style={{ objectFit: "contain", mixBlendMode: "multiply" }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="sec grey">
        <div className="w">
          <div className="st">
            <span>Potek</span>
            <h2>Šest korakov do vašega izdelka</h2>
          </div>
          <div className="kats">
            {koraki.map(([naziv, opis], i) => (
              <div key={naziv} className="k" style={{ padding: "26px 24px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 30,
                    fontWeight: 800,
                    color: "var(--color-line)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 style={{ marginTop: 6 }}>{naziv}</h3>
                <p style={{ marginTop: 10 }}>{opis}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="w">
          <div className="qua" style={{ alignItems: "flex-start" }}>
            <div>
              <div className="st">
                <span>Povpraševanje</span>
                <h2>Povejte, kaj potrebujete</h2>
                <p>
                  Zanima nas vrsta izdelka, letne količine, zahtevani certifikati
                  in kakšno embalažo želite. Na podlagi tega pripravimo predlog
                  in oceno.
                </p>
              </div>
              <div style={{ position: "relative", aspectRatio: "1 / 1", maxWidth: 320 }}>
                <Image
                  src="/slike/vrecka-your-brand.jpg"
                  alt="Vrečka z znamko naročnika"
                  fill
                  sizes="320px"
                  style={{ objectFit: "contain", mixBlendMode: "multiply" }}
                />
              </div>
            </div>
            <ObrazecPovprasevanje vir="private-label" naslov="Povpraševanje private label" />
          </div>
        </div>
      </section>

      <div className="cta">
        <div className="w">
          <div>
            <h2>Iščete tudi izdelke pod znamko ASfix?</h2>
            <p>Poleg private label programa ponujamo tudi lastno blagovno znamko.</p>
          </div>
          <Link className="b b-w" href="/asfix">
            Program ASfix →
          </Link>
        </div>
      </div>
    </>
  );
}
