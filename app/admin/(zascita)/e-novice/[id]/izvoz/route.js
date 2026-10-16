import { supabaseAdmin, trenutniAdmin } from "@/lib/supabase-server";

// Izvoz statistike kampanje za Excel (CSV s podpičji + BOM, da Excel pravilno
// prebere šumnike in stolpce v slovenskih nastavitvah).
const polje = (v) => {
  const s = String(v ?? "");
  return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export async function GET(_req, { params }) {
  if (!(await trenutniAdmin())) return new Response("Ni dostopa", { status: 401 });
  const { id } = await params;
  const sb = supabaseAdmin();

  const { data: k } = await sb.from("enovice_kampanje").select("id, zadeva, segment_ime, poslano_ob, statistika").eq("id", id).single();
  if (!k) return new Response("Kampanja ne obstaja", { status: 404 });

  const vrstice = [];
  for (let od = 0; ; od += 1000) {
    const { data } = await sb
      .from("enovice_prejemniki")
      .select("*")
      .eq("kampanja_id", id)
      .order("email")
      .range(od, od + 999);
    vrstice.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }

  const s = k.statistika || {};
  const odst = (a, b) => (b ? `${Math.round((100 * (a || 0)) / b)} %` : "");
  const izhod = [
    ["Kampanja", k.zadeva],
    ["Segment", k.segment_ime],
    ["Poslano", k.poslano_ob ? new Date(k.poslano_ob).toLocaleString("sl-SI", { timeZone: "Europe/Ljubljana" }) : ""],
    ["Dostavljeno", s.dostavljeno],
    ["Odprli", `${s.odprli ?? ""} (${odst(s.odprli, s.dostavljeno)})`],
    ["Kliknili", `${s.kliknili ?? ""} (${odst(s.kliknili, s.dostavljeno)})`],
    ["Odbiti", s.odbiti],
    ["Odjave", s.odjave],
    [],
    ["E-naslov", "Dostavljeno", "Odprtja", "Kliki", "Odbit", "Odjavljen", "Spam", "Kliknjene povezave"],
    ...vrstice.map((p) => [
      p.email,
      p.dostavljeno ? "da" : "ne",
      p.odprl || 0,
      p.kliknil || 0,
      p.odbit || "",
      p.odjavljen ? "da" : "",
      p.pritozba ? "da" : "",
      (p.povezave ?? []).map((l) => `${l.url} (${l.kliki})`).join(" | "),
    ]),
  ];

  const csv = "﻿" + izhod.map((r) => r.map(polje).join(";")).join("\r\n");
  const ime = `e-novice-${k.id}-${String(k.zadeva || "kampanja").replace(/[^\p{L}\p{N}]+/gu, "-").slice(0, 50)}.csv`;
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="e-novice-${k.id}.csv"; filename*=UTF-8''${encodeURIComponent(ime)}`,
    },
  });
}
