// Slike za filter z vrednostmi lastnosti (npr. material) na strani izdelka.
// Klik na vrednost filtrira tabelo in zamenja glavno sliko izdelka.
// Ključ = slug izdelka, nato vrednost lastnosti (male črke) → { naziv, slika }.
export const SLIKE_VREDNOSTI = {
  "zicniki-lepenkarji": {
    cinkani: { naziv: "Cinkani", slika: "/slike/zicniki/lepenkar-cinkani.jpg" },
    aluminij: { naziv: "Aluminij", slika: "/slike/zicniki/lepenkar-aluminij.jpg" },
    baker: { naziv: "Baker", slika: "/slike/zicniki/lepenkar-baker.jpg" },
  },
};
