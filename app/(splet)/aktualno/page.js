import Image from "next/image";
import Link from "next/link";
import NaslovStrani from "@/components/NaslovStrani";
import VPripravi from "@/components/VPripravi";
import { pridobiNovice } from "@/lib/podatki";
import { datumSlo } from "@/lib/pomoc";

export const revalidate = 60;

export const metadata = {
  title: "Aktualno",
  description: "Novosti iz proizvodnje, novi izdelki in obvestila podjetja AS system.",
  alternates: { canonical: "/aktualno" },
};

export default async function Aktualno() {
  const novice = await pridobiNovice();

  return (
    <>
      <NaslovStrani
        oznaka="Novice"
        naslov="Aktualno"
        opis="Novosti iz proizvodnje, novi izdelki in obvestila o poslovanju."
      />
      {novice.length === 0 ? (
        <VPripravi kaj="Prvi zapisi bodo objavljeni v kratkem." />
      ) : (
        <section className="sec">
          <div className="w">
            <div className="kats">
              {novice.map((n) => (
                <Link key={n.slug} className="k" href={`/aktualno/${n.slug}`}>
                  <div className={n.slika_url ? "im" : "im prazna"}>
                    {n.slika_url && (
                      <Image
                        src={n.slika_url}
                        alt={n.naslov}
                        fill
                        sizes="300px"
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </div>
                  <div className="tx">
                    <p style={{ color: "var(--color-red)", fontWeight: 700, marginBottom: 6 }}>
                      {datumSlo(n.objavljeno_dne)}
                    </p>
                    <h2>{n.naslov}</h2>
                    <p>{n.povzetek}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
