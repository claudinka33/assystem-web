import NaslovStrani from "@/components/NaslovStrani";
import VPripravi from "@/components/VPripravi";

export const metadata = {
  title: "Varstvo osebnih podatkov",
  description: "Kako ravnamo z osebnimi podatki.",
  alternates: { canonical: "/zasebnost" },
};

export default function Stran() {
  return (
    <>
      <NaslovStrani
        oznaka="Pravno"
        naslov="Varstvo osebnih podatkov"
        opis="Kako ravnamo z osebnimi podatki."
      />
      <VPripravi kaj="Besedilo pripravljamo skupaj s pravno službo." />
    </>
  );
}
