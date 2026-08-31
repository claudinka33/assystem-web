import NaslovStrani from "@/components/NaslovStrani";
import VPripravi from "@/components/VPripravi";

export const metadata = {
  title: "ASfix",
  description: "Naša lastna znamka pritrdilne tehnike — od posamezne vrečke do polne police v trgovini.",
  alternates: { canonical: "/asfix" },
};

export default function Stran() {
  return (
    <>
      <NaslovStrani
        oznaka="Blagovna znamka"
        naslov="ASfix"
        opis="Naša lastna znamka pritrdilne tehnike — od posamezne vrečke do polne police v trgovini."
      />
      <VPripravi kaj="Pripravljamo predstavitev asortimana ASfix, embalaže in prodajnih displejev." />
    </>
  );
}
