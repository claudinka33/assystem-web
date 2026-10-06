import NaslovStrani from "@/components/NaslovStrani";
import ResitveObjekt from "@/components/ResitveObjekt";
import { objekt, cone, vsiSlugi } from "@/lib/resitve";
import { pridobiIzdelkePoSlugih } from "@/lib/podatki";

export const revalidate = 300;

export const metadata = {
  title: "Rešitve — kje se uporabljajo pritrdila",
  description:
    "Interaktivni prikaz objekta: temelji, jeklena konstrukcija, skladišče, fasada, pisarne, sanitarije in ograja — kje se uporabljajo sidra, vložki in vijaki ASfix.",
  alternates: { canonical: "/resitve" },
};

export default async function Resitve() {
  const izdelki = await pridobiIzdelkePoSlugih(vsiSlugi());
  return (
    <>
      <NaslovStrani
        oznaka="Rešitve"
        naslov={objekt.naslov}
        opis="Poiščite pritrdilo po mestu uporabe — od temeljev do sanitarij."
      />
      <section className="sec res-sec">
        <div className="w">
          <ResitveObjekt objekt={objekt} cone={cone} izdelki={izdelki} />
        </div>
      </section>
    </>
  );
}
