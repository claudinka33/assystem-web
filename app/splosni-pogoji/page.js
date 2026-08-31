import NaslovStrani from "@/components/NaslovStrani";
import VPripravi from "@/components/VPripravi";

export const metadata = {
  title: "Splošni pogoji poslovanja",
  description: "Pogoji naročanja, dobave in reklamacij.",
  alternates: { canonical: "/splosni-pogoji" },
};

export default function Stran() {
  return (
    <>
      <NaslovStrani
        oznaka="Pravno"
        naslov="Splošni pogoji poslovanja"
        opis="Pogoji naročanja, dobave in reklamacij."
      />
      <VPripravi kaj="Besedilo pripravljamo skupaj s pravno službo." />
    </>
  );
}
