import Link from "next/link";

// Zacasna vsebina, dokler stran ne dobi pravih besedil in fotografij.
export default function VPripravi({ kaj }) {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-20">
      <div className="border-l-[3px] border-red pl-6">
        <h2 className="text-2xl">Vsebina je v pripravi</h2>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
          {kaj} Do takrat vam informacije posreduje naša prodaja.
        </p>
        <Link
          href="/kontakt"
          className="mt-6 inline-block font-semibold text-red hover:text-red-dark"
        >
          Pošljite povpraševanje
        </Link>
      </div>
    </section>
  );
}
