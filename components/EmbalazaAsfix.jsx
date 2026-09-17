import Image from "next/image";

/* Koncept embalaže — več tipov pakiranja na isto skupino izdelkov. */

const TIPI = [
  {
    slika: "/polica/vrecka-rdeca.png",
    naziv: "Vrečka z izveskom",
    kolicina: "10 – 100 kos",
    opis: "Za samopostrežno polico in perforirano steno. Izvesek z eno luknjo, vidna dimenzija in šifra.",
  },
  {
    slika: "/polica/vrecka-doypack.png",
    naziv: "Stoječa vrečka",
    kolicina: "100 – 200 kos",
    opis: "Doypack z zadrgo, ki stoji na polici in se po odprtju zapre. Fotografija vgradnje na sprednji strani.",
  },
  {
    slika: "/polica/skatla.png",
    naziv: "Škatla AFR41",
    kolicina: "50 – 200 kos",
    opis: "Kartonska škatla za pult in skladišče. Šifra, dimenzija in število kosov na čelni ploskvi.",
  },
  {
    slika: "/polica/skatla-private.png",
    naziv: "Private label",
    kolicina: "po dogovoru",
    opis: "Ista embalaža z vašim logotipom in celostno podobo. Brez sledi ASfix na izdelku.",
  },
  {
    slika: "/polica/paleta.png",
    naziv: "Paletna enota",
    kolicina: "cela paleta",
    opis: "Za trgovske centre in večje odjeme. Enotno označene škatle, pripravljene za regal.",
  },
];

const ETIKETA = [
  ["Šifra in EAN", "Enolična oznaka za naročanje in blagajno."],
  ["Dimenzija v velikem tisku", "Berljiva z razdalje, brez iskanja drobnega tiska."],
  ["Piktogrami podlage", "Beton, opeka, votlak, mavčna plošča — brez jezikovne ovire."],
  ["Število kosov", "Jasno na sprednji strani, ne samo na hrbtni."],
];

export default function EmbalazaAsfix() {
  return (
    <>
      <div className="embalaza">
        {TIPI.map((t) => (
          <div key={t.naziv} className="embalaza-kartica">
            <div className="embalaza-slika">
              <Image
                src={t.slika}
                alt={t.naziv}
                fill
                sizes="240px"
                style={{ objectFit: "contain" }}
              />
            </div>
            <h3>{t.naziv}</h3>
            <span className="embalaza-kolicina">{t.kolicina}</span>
            <p>{t.opis}</p>
          </div>
        ))}
      </div>

      <div className="etiketa">
        <div>
          <span className="eyebrow">Etiketa</span>
          <h3>Kaj mora kupec videti v treh sekundah</h3>
          <p>
            Embalaža ni samo zaščita izdelka, ampak prodajno mesto. Na polici
            odloča, ali kupec vzame izdelek v roke ali gre naprej.
          </p>
        </div>
        <dl>
          {ETIKETA.map(([naziv, opis]) => (
            <div key={naziv}>
              <dt>{naziv}</dt>
              <dd>{opis}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}
