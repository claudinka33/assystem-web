import Image from "next/image";
import Link from "next/link";
import NaslovStrani from "@/components/NaslovStrani";
import { pridobiKategorije } from "@/lib/podatki";

export const revalidate = 60;

export const metadata = {
  title: "Prodajni program",
  description:
    "Pritrdila za beton, vijačno blago, zidni vložki, kemična pritrditev in pritrdila za izolacijo iz programa ASfix.",
  alternates: { canonical: "/program" },
};

export default async function Program() {
  const { seznam } = await pridobiKategorije();

  return (
    <>
      <NaslovStrani
        oznaka="Program ASfix"
        naslov="Prodajni program"
        opis="Pritrdila za beton, opeko, mavčne plošče, izolacijo, streho in inštalacije."
      />
      <section className="sec">
        <div className="w">
          <div className="kats">
            {seznam.map((k) => (
              <Link key={k.slug} className="k" href={`/program/${k.slug}`}>
                <div className={k.slika ? "im" : "im prazna"}>
                  {k.slika && (
                    <Image
                      src={k.slika}
                      alt={k.naziv}
                      fill
                      sizes="(max-width: 620px) 100vw, 300px"
                      style={{ objectFit: "contain", padding: 18, mixBlendMode: "multiply" }}
                    />
                  )}
                </div>
                <div className="tx">
                  <h2>{k.naziv}</h2>
                  <p>{k.opis}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
