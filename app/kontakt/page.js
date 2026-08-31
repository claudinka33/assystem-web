import NaslovStrani from "@/components/NaslovStrani";
import VPripravi from "@/components/VPripravi";

export const metadata = {
  title: "Kontakt",
  description: "Odgovorimo v enem delovnem dnevu.",
  alternates: { canonical: "/kontakt" },
};

export default function Stran() {
  return (
    <>
      <NaslovStrani
        oznaka="Pišite nam"
        naslov="Kontakt"
        opis="Odgovorimo v enem delovnem dnevu."
      />
      <VPripravi kaj="Obrazec za povpraševanje bo delujoč, ko bo vzpostavljeno pošiljanje e-pošte." />
    </>
  );
}
