"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-server";
import { zahtevajAdmina } from "@/lib/akcije/skupno";
import { normKoda } from "@/lib/popusti";

const t = (v) => String(v ?? "").trim();
const st = (v) => (t(v) === "" ? null : Number(String(v).replace(",", ".")));

export async function shraniKodo(_prej, formData) {
  await zahtevajAdmina();
  const f = Object.fromEntries(formData);
  const koda = normKoda(f.koda);
  if (!/^[A-Z0-9_-]{3,30}$/.test(koda)) return { napaka: "Koda: 3–30 znakov, samo črke, številke, - in _." };
  const tip = ["odstotek", "znesek", "dostava"].includes(f.tip) ? f.tip : "odstotek";
  const vrednost = tip === "dostava" ? 0 : st(f.vrednost);
  if (tip !== "dostava" && !(vrednost > 0)) return { napaka: "Vpiši vrednost popusta." };
  if (tip === "odstotek" && vrednost > 100) return { napaka: "Odstotek ne more biti nad 100." };
  const velja_za = ["trgovina", "kategorija", "znamka", "artikel"].includes(f.velja_za) ? f.velja_za : "trgovina";
  if (velja_za === "kategorija" && !t(f.kategorija_id)) return { napaka: "Izberi kategorijo." };
  if (velja_za === "znamka" && !t(f.znamka)) return { napaka: "Izberi znamko." };
  if (velja_za === "artikel" && !t(f.artikel_sifra)) return { napaka: "Vpiši šifro artikla." };
  const podatki = {
    koda,
    opis: t(f.opis) || null,
    tip,
    vrednost: vrednost ?? 0,
    velja_za,
    kategorija_id: velja_za === "kategorija" ? t(f.kategorija_id) : null,
    znamka: velja_za === "znamka" ? t(f.znamka) : null,
    artikel_sifra: velja_za === "artikel" ? t(f.artikel_sifra).toUpperCase() : null,
    kupci: ["vsi", "b2c", "b2b"].includes(f.kupci) ? f.kupci : "vsi",
    min_znesek: st(f.min_znesek),
    max_uporab: st(f.max_uporab),
    velja_od: t(f.velja_od) || null,
    velja_do: t(f.velja_do) || null,
    aktivno: true,
  };
  const sb = supabaseAdmin();
  const { error } = f.id
    ? await sb.from("popust_kode").update(podatki).eq("id", f.id)
    : await sb.from("popust_kode").insert(podatki);
  if (error) return { napaka: /duplicate|unique/i.test(error.message) ? "Ta koda že obstaja." : "Shranjevanje ni uspelo." };
  revalidatePath("/admin/popusti");
  return { ok: `Koda ${koda} je shranjena.` };
}

export async function preklopiKodo(formData) {
  await zahtevajAdmina();
  await supabaseAdmin().from("popust_kode").update({ aktivno: formData.get("aktivno") === "1" }).eq("id", formData.get("id"));
  revalidatePath("/admin/popusti");
}

export async function izbrisiKodo(formData) {
  await zahtevajAdmina();
  await supabaseAdmin().from("popust_kode").delete().eq("id", formData.get("id"));
  revalidatePath("/admin/popusti");
}
