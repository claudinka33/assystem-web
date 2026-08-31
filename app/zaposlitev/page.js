import NaslovStrani from "@/components/NaslovStrani";
import VPripravi from "@/components/VPripravi";

export const metadata = {
  title: "Zaposlitev",
  description: "Delo v stabilnem proizvodnem podjetju s tridesetletno tradicijo.",
  alternates: { canonical: "/zaposlitev" },
};

export default function Stran() {
  return (
    <>
      <NaslovStrani
        oznaka="Kariera"
        naslov="Zaposlitev"
        opis="Delo v stabilnem proizvodnem podjetju s tridesetletno tradicijo."
      />
      <VPripravi kaj="Pripravljamo seznam odprtih delovnih mest in prijavni obrazec." />
    </>
  );
}
