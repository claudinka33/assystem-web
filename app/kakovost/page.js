import NaslovStrani from "@/components/NaslovStrani";
import VPripravi from "@/components/VPripravi";

export const metadata = {
  title: "Kakovost in certifikati",
  description: "Evropske tehnične ocene ETA, izjave o lastnostih in navodila za vgradnjo.",
  alternates: { canonical: "/kakovost" },
};

export default function Stran() {
  return (
    <>
      <NaslovStrani
        oznaka="Dokumentacija"
        naslov="Kakovost in certifikati"
        opis="Evropske tehnične ocene ETA, izjave o lastnostih in navodila za vgradnjo."
      />
      <VPripravi kaj="Pripravljamo arhiv certifikatov ETA in izjav o lastnostih za prenos." />
    </>
  );
}
