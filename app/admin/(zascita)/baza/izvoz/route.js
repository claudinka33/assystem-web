import ExcelJS from "exceljs";
import { filtrRegije, REGIJE } from "@/lib/baza-regije";
import { trenutniAdmin, supabaseAdmin } from "@/lib/supabase-server";

// Izvoz baze (trenutni filter) v CSV za Excel.
export async function GET(req) {
  if (!(await trenutniAdmin())) return new Response("Ni dostopa", { status: 401 });
  const u = new URL(req.url);
  const q = u.searchParams.get("q") || "";
  const p = u.searchParams.get("p") || "";
  const vir = u.searchParams.get("vir") || "";
  const stanje = u.searchParams.get("stanje") || "";
  const regija = u.searchParams.get("regija") || "";
  const sb = supabaseAdmin();
  const { data: panoge } = await sb.from("baza_panoge").select("sifra, ime");
  const ime = Object.fromEntries((panoge ?? []).map((x) => [x.sifra, x.ime]));
  const vrstice = [];
  for (let od = 0; ; od += 1000) {
    let poiz = sb.from("baza_kontakti").select("*").order("email").range(od, od + 999);
    if (p === "nerazvrsceni") poiz = poiz.eq("panoge", "{}");
    else if (Number(p)) poiz = poiz.contains("panoge", [Number(p)]);
    if (vir) poiz = poiz.eq("vir", vir);
    if (stanje === "odjavljeni") poiz = poiz.eq("odjavljen", true);
    if (stanje === "soglasje") poiz = poiz.eq("soglasje", true);
    poiz = filtrRegije(poiz, regija);
    const s = q.trim().replace(/[,()%]/g, " ").trim();
    if (s) poiz = poiz.or(`email.ilike.%${s}%,ime.ilike.%${s}%,podjetje.ilike.%${s}%,poslovalnica.ilike.%${s}%,kraj.ilike.%${s}%,davcna.ilike.%${s}%`);
    const { data } = await poiz;
    vrstice.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }
  const regijaZa = (posta) => {
    const m = String(posta ?? "").match(/^(?:SI-?)?(\d)\d{3}/);
    if (m) return REGIJE.find((x) => x[0] === m[1])?.[1] ?? "";
    return posta ? "Tujina" : "";
  };
  const GLAVA = ["E-naslov", "Ime in priimek", "Podjetje", "Poslovalnica", "Pošta", "Kraj", "Regija", "Davčna", "Telefon", "Panoga", "Vir", "Soglasje", "Stanje", "Dodan"];
  const vrstica = (k) => [
    k.email, k.ime, k.podjetje, k.poslovalnica, k.posta, k.kraj, regijaZa(k.posta), k.davcna, k.telefon,
    (k.panoge ?? []).map((x) => ime[x]).join(", ") || "nerazvrščen", k.vir, k.soglasje ? "da" : "ne",
    k.odjavljen ? "Odjavljen" : "Aktiven", String(k.ustvarjeno).slice(0, 10),
  ];

  if (u.searchParams.get("format") === "xlsx") {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Baza kontaktov", { views: [{ state: "frozen", ySplit: 1 }] });
    ws.columns = GLAVA.map((h, i) => ({ header: h, width: [34, 24, 34, 28, 18, 18, 26, 12, 16, 30, 16, 10, 11, 11][i] }));
    vrstice.forEach((k) => ws.addRow(vrstica(k).map((v) => v ?? "")));
    const g = ws.getRow(1);
    g.font = { bold: true, color: { argb: "FFFFFFFF" } };
    g.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF3A3F45" } };
    ws.autoFilter = { from: "A1", to: { row: 1, column: GLAVA.length } };
    ws.getColumn(13).eachCell((c, r) => { if (r > 1) c.font = { color: { argb: c.value === "Odjavljen" ? "FFCB2026" : "FF1A7F3C" } }; });
    const buf = await wb.xlsx.writeBuffer();
    return new Response(buf, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="baza-kontaktov-${new Date().toISOString().slice(0, 10)}.xlsx"`,
      },
    });
  }

  const c = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [GLAVA.join(";"), ...vrstice.map((k) => vrstica(k).map(c).join(";"))].join("\r\n");
  return new Response("\ufeff" + csv, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="baza-kontaktov.csv"` },
  });
}
