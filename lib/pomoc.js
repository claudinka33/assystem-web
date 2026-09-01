// Navadne pomožne funkcije (ne server actions).

export function slugify(besedilo) {
  const zamenjave = { č: "c", ć: "c", š: "s", ž: "z", đ: "d" };
  return (besedilo || "")
    .toLowerCase()
    .replace(/[čćšžđ]/g, (z) => zamenjave[z])
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function stevilo(v) {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(String(v).replace(",", "."));
  return Number.isNaN(n) ? null : n;
}

export function datumSlo(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
}
