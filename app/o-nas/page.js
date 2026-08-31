import NaslovStrani from "@/components/NaslovStrani";
import VPripravi from "@/components/VPripravi";

export const metadata = {
  title: "O nas",
  description: "Od leta 1993 razvijamo in proizvajamo pritrdilno tehniko. Danes dobavljamo v 19 držav.",
  alternates: { canonical: "/o-nas" },
};

export default function Stran() {
  return (
    <>
      <NaslovStrani
        oznaka="Podjetje"
        naslov="O nas"
        opis="Od leta 1993 razvijamo in proizvajamo pritrdilno tehniko. Danes dobavljamo v 19 držav."
      />
      <VPripravi kaj="Pripravljamo zgodovino podjetja, predstavitev ekipe in fotografije obratov." />
    </>
  );
}
