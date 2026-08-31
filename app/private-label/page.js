import NaslovStrani from "@/components/NaslovStrani";
import VPripravi from "@/components/VPripravi";

export const metadata = {
  title: "Private label",
  description: "Pritrdila pod vašo znamko: razvoj, orodje, proizvodnja, certifikat in pakiranje na enem mestu.",
  alternates: { canonical: "/private-label" },
};

export default function Stran() {
  return (
    <>
      <NaslovStrani
        oznaka="Za blagovne znamke"
        naslov="Private label"
        opis="Pritrdila pod vašo znamko: razvoj, orodje, proizvodnja, certifikat in pakiranje na enem mestu."
      />
      <VPripravi kaj="Pripravljamo opis poteka sodelovanja, referenčne primere embalaže in pogoje za minimalne količine." />
    </>
  );
}
