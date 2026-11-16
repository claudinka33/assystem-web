import { filtrRegije } from "@/lib/baza-regije";
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
  const c = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [
    ["email", "ime", "podjetje", "poslovalnica", "posta", "kraj", "davcna", "telefon", "panoge", "vir", "soglasje", "odjavljen", "dodan"].join(";"),
    ...vrstice.map((k) =>
      [k.email, k.ime, k.podjetje, k.poslovalnica, k.posta, k.kraj, k.davcna, k.telefon, (k.panoge ?? []).map((x) => ime[x]).join(", "), k.vir, k.soglasje ? "da" : "ne", k.odjavljen ? "da" : "ne", String(k.ustvarjeno).slice(0, 10)].map(c).join(";")
    ),
  ].join("\r\n");
  return new Response("﻿" + csv, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="baza-kontaktov.csv"` },
  });
}
