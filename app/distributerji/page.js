import NaslovStrani from "@/components/NaslovStrani";
import VPripravi from "@/components/VPripravi";

export const metadata = {
  title: "Postanite distributer",
  description: "Iščemo distributerje v EXYU, DACH, Skandinaviji, Baltiku in Vzhodni Evropi.",
  alternates: { canonical: "/distributerji" },
};

export default function Stran() {
  return (
    <>
      <NaslovStrani
        oznaka="Tuji trgi"
        naslov="Postanite distributer"
        opis="Iščemo distributerje v EXYU, DACH, Skandinaviji, Baltiku in Vzhodni Evropi."
      />
      <VPripravi kaj="Pripravljamo pogoje sodelovanja, zemljevid pokritosti in prijavni obrazec." />
    </>
  );
}
