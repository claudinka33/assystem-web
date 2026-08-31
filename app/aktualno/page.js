import NaslovStrani from "@/components/NaslovStrani";
import VPripravi from "@/components/VPripravi";

export const metadata = {
  title: "Aktualno",
  description: "Novosti iz proizvodnje, novi izdelki in obvestila o poslovanju.",
  alternates: { canonical: "/aktualno" },
};

export default function Stran() {
  return (
    <>
      <NaslovStrani
        oznaka="Novice"
        naslov="Aktualno"
        opis="Novosti iz proizvodnje, novi izdelki in obvestila o poslovanju."
      />
      <VPripravi kaj="Prvi zapisi bodo objavljeni, ko bo urejevalnik vsebin pripravljen." />
    </>
  );
}
