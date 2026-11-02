// Vrste člankov (blog / Aktualno). Ključ se shrani v novice.vrsta.
export const VRSTE_CLANKOV = [
  { kljuc: "novost", naziv: "Novost" },
  { kljuc: "aktualno", naziv: "Aktualno" },
  { kljuc: "how-to", naziv: "How to" },
  { kljuc: "nasvet", naziv: "Nasvet" },
];

export const nazivVrste = (k) => VRSTE_CLANKOV.find((v) => v.kljuc === k)?.naziv ?? "Aktualno";
