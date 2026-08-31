import NaslovStrani from "@/components/NaslovStrani";
import VPripravi from "@/components/VPripravi";

export const metadata = {
  title: "Katalogi in prenosi",
  description: "Katalogi, letaki in tehnični listi v PDF obliki.",
  alternates: { canonical: "/katalogi" },
};

export default function Stran() {
  return (
    <>
      <NaslovStrani
        oznaka="Gradiva"
        naslov="Katalogi in prenosi"
        opis="Katalogi, letaki in tehnični listi v PDF obliki."
      />
      <VPripravi kaj="Pripravljamo urejen arhiv katalogov in letakov za prenos." />
    </>
  );
}
