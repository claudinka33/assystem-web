import Link from "next/link";
import NaslovStrani from "@/components/NaslovStrani";
import { kategorije } from "@/lib/site";

export const metadata = {
  title: "Prodajni program",
  description:
    "Pritrdila za beton, vijačno blago, zidni vložki, kemična pritrditev in pritrdila za izolacijo iz programa AS system.",
  alternates: { canonical: "/program" },
};

export default function Program() {
  return (
    <>
      <NaslovStrani
        oznaka="Program"
        naslov="Prodajni program"
        opis="Enajst skupin pritrdil za beton, opeko, mavčne plošče, izolacijo in inštalacije."
      />
      <section className="mx-auto max-w-[1240px] px-5 py-20">
        <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {kategorije.map((k) => (
            <li key={k.slug}>
              <Link
                href={`/program/${k.slug}`}
                className="group block h-full bg-paper p-6 transition-colors hover:bg-ink"
              >
                <h2 className="text-xl group-hover:text-paper">{k.naziv}</h2>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-muted group-hover:text-paper/70">
                  {k.opis}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
