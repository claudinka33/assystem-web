import Link from "next/link";

export default function NaslovStrani({ oznaka, naslov, opis }) {
  return (
    <section className="pgh">
      <div className="w">
        <nav className="drobtine">
          <Link href="/">Domov</Link> / {naslov}
        </nav>
        <div className="st" style={{ marginBottom: 0 }}>
          {oznaka && <span>{oznaka}</span>}
          <h1>{naslov}</h1>
          {opis && <p>{opis}</p>}
        </div>
      </div>
    </section>
  );
}
