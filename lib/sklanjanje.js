// Slovensko sklanjanje glede na število: 1 zadetek, 2 zadetka, 3 zadetki, 5 zadetkov.
export const ZADETEK = ["zadetek", "zadetka", "zadetki", "zadetkov"];
export const DOKUMENT = ["dokument", "dokumenta", "dokumenti", "dokumentov"];

function oblika(n) {
  const d = Math.abs(n) % 100;
  if (d === 1) return 0;
  if (d === 2) return 1;
  if (d === 3 || d === 4) return 2;
  return 3;
}

export function stevilo(n, besede) {
  return `${n} ${besede[oblika(n)]}`;
}

// »Najden je 1 zadetek«, »Najdena sta 2 zadetka«, »Najdeni so 3 zadetki«, »Najdenih je 5 zadetkov«
export function najdenih(n) {
  const glagol = ["Najden je", "Najdena sta", "Najdeni so", "Najdenih je"][oblika(n)];
  return `${glagol} ${stevilo(n, ZADETEK)}`;
}
