// Deli administracije, do katerih lahko polni admin dodeli dostop zaposlenemu.
// Ključ = prvi del poti za /admin/ (npr. /admin/narocila → "narocila").
// Brez strežniških importov — uporablja jo tudi meni v brskalniku.

export const MODULI = [
  { kljuc: "statistika", naziv: "Statistika obiska", skupina: "Analitika" },
  { kljuc: "kategorije", naziv: "Kategorije", skupina: "Katalog" },
  { kljuc: "izdelki", naziv: "Izdelki", skupina: "Katalog" },
  { kljuc: "znamke", naziv: "Znamke izdelkov", skupina: "Katalog" },
  { kljuc: "sinhronizacija", naziv: "Sinhronizacija Vasco", skupina: "Katalog" },
  { kljuc: "narocila", naziv: "Naročila", skupina: "Prodaja" },
  { kljuc: "b2b", naziv: "B2B kupci", skupina: "Prodaja" },
  { kljuc: "popusti", naziv: "Kode za popust", skupina: "Prodaja" },
  { kljuc: "popup", naziv: "Pop-up (B2B kontakti)", skupina: "Prodaja" },
  { kljuc: "povprasevanja", naziv: "Povpraševanja", skupina: "Prodaja" },
  { kljuc: "vsebine", naziv: "Besedila na strani", skupina: "Vsebina" },
  { kljuc: "gradiva", naziv: "Katalogi in gradiva", skupina: "Vsebina" },
  { kljuc: "novice", naziv: "Novice", skupina: "Vsebina" },
  { kljuc: "prevodi", naziv: "Prevodi (EN, DE)", skupina: "Vsebina" },
  { kljuc: "e-novice", naziv: "E-novice", skupina: "E-mailing" },
  { kljuc: "baza", naziv: "Baza kontaktov", skupina: "E-mailing" },
  { kljuc: "poslano", naziv: "Poslana sporočila", skupina: "E-mailing" },
  { kljuc: "email-predloge", naziv: "Sporočila strankam (predloge)", skupina: "E-mailing" },
  { kljuc: "delovna-mesta", naziv: "Delovna mesta", skupina: "Zaposlovanje" },
  { kljuc: "prijave", naziv: "Prijave za delo", skupina: "Zaposlovanje" },
  { kljuc: "nastavitve", naziv: "Nastavitve", skupina: "Sistem" },
];

const ALIAS = { "porocilo-enovice": "e-novice" };
const SAMO_POLNI = ["uporabniki"];
const PROSTE = ["prijava", "auth"];

export function kljucIzPoti(pot) {
  const m = /^\/admin\/([^/?#]+)/.exec(pot || "");
  if (!m) return null;
  const k = m[1];
  if (PROSTE.includes(k)) return null;
  return ALIAS[k] ?? k;
}

// admin.dovoljenja === null → polni admin (vidi vse).
export function imaDostop(admin, kljuc) {
  if (!admin) return false;
  if (!kljuc) return true;
  if (admin.dovoljenja == null) return true;
  if (SAMO_POLNI.includes(kljuc)) return false;
  return Array.isArray(admin.dovoljenja) && admin.dovoljenja.includes(kljuc);
}
