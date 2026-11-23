import Link from "next/link";
import Image from "next/image";

export default function NaslovStrani({ oznaka, naslov, opis, slika, slikaAlt = "" }) {
  return (
    <section className={`pgh${slika ? " pgh-s" : ""}`}>
      <div className="w">
        <div>
          <nav className="drobtine">
            <Link href="/">Domov</Link> / {naslov}
          </nav>
          <div className="st" style={{ marginBottom: 0 }}>
            {oznaka && <span>{oznaka}</span>}
            <h1>{naslov}</h1>
            {opis && <p>{opis}</p>}
          </div>
        </div>
        {slika && (
          <div className="pgh-slika">
            <Image src={slika} alt={slikaAlt} width={2000} height={1333} priority sizes="(max-width: 1000px) 90vw, 560px" />
          </div>
        )}
      </div>
    </section>
  );
}
