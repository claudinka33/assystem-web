// Slike za filter z vrednostmi lastnosti (npr. material) na strani izdelka.
// Klik na vrednost filtrira tabelo in zamenja glavno sliko izdelka.
// Ključ = slug izdelka, nato vrednost lastnosti (male črke) → { naziv, slika }.
export const SLIKE_VREDNOSTI = {
  "zicniki-lepenkarji": {
    cinkani: { naziv: "Cinkani", slika: "/slike/zicniki/lepenkar-cinkani.jpg" },
    aluminij: { naziv: "Aluminij", slika: "/slike/zicniki/lepenkar-aluminij.jpg" },
    baker: { naziv: "Baker", slika: "/slike/zicniki/lepenkar-baker.jpg" },
  },
  "vijak-za-beton-pbs": {
    "s podaljšano matico": { naziv: "S podaljšano matico", slika: "https://fnyfdrqbxgbdyxxttpje.supabase.co/storage/v1/object/public/slike/vijak-za-beton-pbs-matica-1793085280212.jpg" },
    "šestroba glava": { naziv: "Šestroba glava", slika: "https://fnyfdrqbxgbdyxxttpje.supabase.co/storage/v1/object/public/slike/vijak-za-beton-pbs-sestro-1793085277291.jpg" },
    "ugreznjena glava": { naziv: "Ugreznjena glava", slika: "https://fnyfdrqbxgbdyxxttpje.supabase.co/storage/v1/object/public/slike/vijak-za-beton-pbs-ugrez-1793085278653.jpg" },
  },
};
