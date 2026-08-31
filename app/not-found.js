import Link from "next/link";

export const metadata = { title: "Stran ne obstaja" };

export default function NiNajdeno() {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-28">
      <span className="eyebrow">Napaka 404</span>
      <h1 className="mt-5 text-[clamp(2.25rem,5vw,4rem)]">Te strani ni</h1>
      <p className="mt-6 text-lg text-muted">
        Povezava je zastarela ali napačno vnesena.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block bg-red px-7 py-3.5 font-semibold uppercase tracking-wide text-paper hover:bg-red-dark"
      >
        Nazaj na domačo stran
      </Link>
    </section>
  );
}
