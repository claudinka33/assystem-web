import NaslovStrani from "@/components/NaslovStrani";
import VPripravi from "@/components/VPripravi";

export const metadata = {
  title: "Proizvodnja in razvoj",
  description: "Hladno kovanje, brizganje plastike, lastna orodjarna in avtomatska montaža na dveh lokacijah v Sloveniji.",
  alternates: { canonical: "/proizvodnja" },
};

export default function Stran() {
  return (
    <>
      <NaslovStrani
        oznaka="Zmogljivosti"
        naslov="Proizvodnja in razvoj"
        opis="Hladno kovanje, brizganje plastike, lastna orodjarna in avtomatska montaža na dveh lokacijah v Sloveniji."
      />
      <VPripravi kaj="Pripravljamo fotografije strojnega parka in tehnične podatke o zmogljivostih." />
    </>
  );
}
