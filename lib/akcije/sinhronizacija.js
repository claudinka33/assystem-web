"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-server";
import { zahtevajAdmina } from "@/lib/akcije/skupno";

// Gumb »Sinhroniziraj zdaj«: zapiše zahtevo, ki jo skripta na as-terminalu
// pobere v največ 2 minutah (Vasco je dosegljiv samo iz podjetja).
export async function zahtevajSinhronizacijo() {
  const admin = await zahtevajAdmina();
  const sb = supabaseAdmin();
  const { data: odprte } = await sb
    .from("vasco_sync_zahteve")
    .select("id")
    .in("status", ["caka", "v teku"])
    .limit(1);
  if (!odprte?.length) {
    await sb.from("vasco_sync_zahteve").insert({ zahteval: admin.ime ?? admin.email });
  }
  revalidatePath("/admin/sinhronizacija");
}

// Nov artikel iz Vasca: označi kot »ignoriraj« ali vrni na »nov«.
export async function oznaciNovArtikel(formData) {
  await zahtevajAdmina();
  await supabaseAdmin()
    .from("vasco_novi_artikli")
    .update({ status: formData.get("status") })
    .eq("sifra", formData.get("sifra"));
  revalidatePath("/admin/sinhronizacija");
}
