// Slike za filter z vrednostmi lastnosti (npr. material) na strani izdelka.
// Klik na vrednost filtrira tabelo in zamenja glavno sliko izdelka.
// Ključ = slug izdelka, nato vrednost lastnosti (male črke) → { naziv, slika }.
export const SLIKE_VREDNOSTI = {
  "zicniki-lepenkarji": {
    cinkani: { naziv: "Cinkani", slika: "/slike/zicniki/en-lepenkar-cinkani.jpg" },
    aluminij: { naziv: "Aluminij", slika: "/slike/zicniki/en-lepenkar-aluminij.jpg" },
    baker: { naziv: "Baker", slika: "/slike/zicniki/en-lepenkar-baker.jpg" },
  },
};
