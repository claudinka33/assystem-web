// Temni pas z naslovom na vrhu podstrani.
export default function NaslovStrani({ oznaka, naslov, opis }) {
  return (
    <section className="pattern-vijaki bg-ink text-paper">
      <div className="mx-auto max-w-[1240px] px-5 py-16 lg:py-20">
        {oznaka && <span className="eyebrow">{oznaka}</span>}
        <h1 className="mt-5 text-[clamp(2.25rem,5vw,4rem)]">{naslov}</h1>
        {opis && (
          <p className="mt-6 text-lg leading-relaxed text-paper/75">{opis}</p>
        )}
      </div>
    </section>
  );
}
