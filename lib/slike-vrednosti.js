// Slike za filter z vrednostmi lastnosti (npr. material) na strani izdelka.
// Klik na vrednost filtrira tabelo in zamenja glavno sliko izdelka.
// Ključ = slug izdelka, nato vrednost lastnosti (male črke) → { naziv, slika }.
export const SLIKE_VREDNOSTI = {
  "zicniki-lepenkarji": {
    cinkani: { naziv: "Cinkani", slika: "https://fnyfdrqbxgbdyxxttpje.supabase.co/storage/v1/object/public/slike/lepenkar-cinkani-lezec-1793101066491-1793101066977.jpg" },
    aluminij: { naziv: "Aluminij", slika: "https://fnyfdrqbxgbdyxxttpje.supabase.co/storage/v1/object/public/slike/lepenkar-aluminij-lezec-1793101073861-1793101074479.jpg" },
    baker: { naziv: "Baker", slika: "https://fnyfdrqbxgbdyxxttpje.supabase.co/storage/v1/object/public/slike/lepenkar-baker-lezec-1793101077209-1793101077762.jpg" },
  },
  "vijak-za-beton-pbs": {
    "s podaljšano matico": { naziv: "S podaljšano matico", slika: "https://fnyfdrqbxgbdyxxttpje.supabase.co/storage/v1/object/public/slike/vijak-za-beton-pbs-matica-1793085280212.jpg" },
    "šestroba glava": { naziv: "Šestroba glava", slika: "https://fnyfdrqbxgbdyxxttpje.supabase.co/storage/v1/object/public/slike/vijak-za-beton-pbs-sestro-1793085277291.jpg" },
    "ugreznjena glava": { naziv: "Ugreznjena glava", slika: "https://fnyfdrqbxgbdyxxttpje.supabase.co/storage/v1/object/public/slike/vijak-za-beton-pbs-ugrez-1793085278653.jpg" },
  },
};
