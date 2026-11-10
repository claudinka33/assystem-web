// Privzeta fotografija za delovno mesto, če v bazi ni slike.
export function slikaMesta(m) {
  const t = `${m.slug ?? ""} ${m.naziv ?? ""}`.toLowerCase();
  if (t.includes("orodjar")) return "/slike/foto/orodjarna-01.jpg";
  if (t.includes("operater") || t.includes("posluzev") || t.includes("strojev")) return "/slike/foto/ekipa-05.jpg";
  if (t.includes("objekt")) return "/slike/foto/ekipa-01.jpg";
  if (t.includes("komercial") || t.includes("prodaj")) return "/slike/foto/ekipa-02.jpg";
  if (t.includes("voznik") || t.includes("skladis")) return "/slike/foto/ekipa-09.jpg";
  return "/slike/foto/ekipa-11.jpg";
}
