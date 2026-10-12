import Image from "next/image";
import Link from "next/link";

/* --------------------------------------------------------------
   Skupna glava strani blagovne znamke (ASfix, ASco).
   Enaka postavitev za obe znamki — razlikujeta se podlaga
   (ASfix rdeča, ASco antracit), logotip in fotografija embalaže.
   Logotip: na rdeči bela različica, na antracitu negativ (CGP 2026).
   -------------------------------------------------------------- */

export default function ZnamkaHero({
  podlaga = "antracit",
  logo,
  ime,
  oznaka,
  naslov,
  opis,
  slika,
  slikaAlt,
  slikaW = 1100,
  slikaH = 654,
  gumbi = [],
  znacke = [],
}) {
  return (
    <section className={`zn-hero ${podlaga}`}>
      <div className="w">
        <div className="zn-tx">
          <nav className="drobtine">
            <Link href="/">Domov</Link> / {ime}
          </nav>
          <Image className="zn-logo" src={logo} alt={ime} width={800} height={300} priority />
          {oznaka && <span className="zn-oznaka">{oznaka}</span>}
          <h1>{naslov}</h1>
          {opis && <p>{opis}</p>}
          {znacke.length > 0 && (
            <ul className="zn-znacke">
              {znacke.map((z) => (
                <li key={z}>{z}</li>
              ))}
            </ul>
          )}
          {gumbi.length > 0 && (
            <div className="zn-gumbi">
              {gumbi.map((g) => (
                <Link key={g.href} className={`b ${g.cls || "b-w"}`} href={g.href}>
                  {g.naziv}
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="zn-slika">
          <Image
            src={slika}
            alt={slikaAlt || ime}
            width={slikaW}
            height={slikaH}
            sizes="(max-width: 1000px) 100vw, 720px"
            priority
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      </div>
    </section>
  );
}
