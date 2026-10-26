// Blagovne znamke v prodajnem programu — en vir za logotipe, imena in pravila.
// Ključ je vrednost v stolpcu izdelki.znamka (MUNGO ostane z velikimi črkami,
// ker je tako zapisan v bazi in v kodah za popust; prikaže se kot »Mungo«).

export const ZNAMKE_INFO = {
  ASfix: {
    ime: "ASfix",
    pot: "/asfix",
    logo: "/slike/znamke/asfix-logo-pozitiv.png",
    w: 800,
    h: 297,
    opis: "Pritrdilna tehnika — sidra, vložki, udarni in Turbo vijaki, kemične mase.",
  },
  ASco: {
    ime: "ASco",
    pot: "/asco",
    logo: "/slike/znamke/asco-logo-pozitiv.png",
    w: 800,
    h: 301,
    opis: "Vijačno blago po DIN in ISO — vijaki, matice in podložke.",
  },
  MUNGO: {
    ime: "Mungo",
    pot: "/mungo",
    logo: "/slike/znamke/mungo-logo-2026.png",
    w: 646,
    h: 396,
    opis: "Najlonski vložki, kovinska sidra in kemične mase.",
  },
  Silvermate: {
    ime: "Silvermate",
    pot: "/silvermate",
    logo: "/slike/znamke/silvermate-logo.png",
    w: 800,
    h: 157,
    opis: "Lesni vijaki s križno in torx glavo, s celim ali delnim navojem.",
  },
};

export const ZNAMKE = Object.keys(ZNAMKE_INFO);

// Nastavitev »znamke_skrite« (npr. "MUNGO") — te znamke se na javni strani ne prikažejo.
// Izdelki ostanejo v bazi in v administraciji; vklop/izklop je v Admin → Znamke.
export const KLJUC_SKRITE = "znamke_skrite";
// Privzeto (dokler v bazi ni vpisa) je MUNGO izklopljen — odločitev 26. 10. 2026.
export const PRIVZETO_SKRITE = ["MUNGO"];
export function razcleniSkrite(vrednost) {
  if (vrednost === undefined || vrednost === null) return [...PRIVZETO_SKRITE];
  return [...new Set(String(vrednost ?? "").split(/[,;\s]+/).map(normZnamka).filter(Boolean))];
}

// Pretvori zapis iz baze ali obrazca v ključ (neobčutljivo na velike črke).
export function normZnamka(z) {
  const t = String(z ?? "").trim().toLowerCase();
  if (!t) return null;
  if (t === "asfix") return "ASfix";
  if (t === "asco" || t === "asko") return "ASco";
  if (t === "mungo") return "MUNGO";
  if (t === "silvermate") return "Silvermate";
  return null;
}

// Silvermate: AS811 križ cel navoj, AS812 križ delni, AS814 torx cel, AS816 torx delni.
const SILVERMATE = /^AS81[1246]/i;
const MUNGO_SIFRA = /^M[A-Z]/i;

// Znamka izdelka. Prednost ima vpis v adminu; če ga ni, pravilo po šifrah in kategoriji.
// sifre: šifre artiklov izdelka; korenska: slug korenske kategorije izdelka.
export function dolociZnamko({ znamka, sifre = [], slug = "", korenska = "" } = {}) {
  const vpis = normZnamka(znamka);
  if (vpis) return vpis;
  return predlogZnamke({ sifre, slug, korenska });
}

// Samo pravilo (brez vpisa) — uporablja tudi admin za predlog.
export function predlogZnamke({ sifre = [], slug = "", korenska = "" } = {}) {
  const s = sifre.map((x) => String(x ?? "").trim()).filter(Boolean);
  if (s.some((x) => SILVERMATE.test(x))) return "Silvermate";
  if (/^mungo-/i.test(slug) || s.some((x) => MUNGO_SIFRA.test(x))) return "MUNGO";
  if (s.some((x) => /^AF/i.test(x))) return "ASfix";
  if (korenska === "vijacno-blago") return "ASco";
  return "ASfix";
}

// Znamka posameznega artikla (za kode za popust v košarici).
export function znamkaPoSifri(sifra) {
  const x = String(sifra ?? "");
  if (SILVERMATE.test(x)) return "Silvermate";
  if (/^AF/i.test(x)) return "ASfix";
  if (MUNGO_SIFRA.test(x)) return "MUNGO";
  return "ASco";
}
