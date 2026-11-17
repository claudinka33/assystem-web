"use server";

import { revalidatePath } from "@/lib/predpomnilnik";
import { supabaseAdmin } from "@/lib/supabase-server";
import { zahtevajAdmina } from "@/lib/akcije/skupno";
import { KLJUC_POPUP, PRIVZETO_POPUP } from "@/lib/popup";

const t = (v) => String(v ?? "").trim();
const vrstice = (v) => t(v).split(/\r?\n/).map((x) => x.trim()).filter(Boolean);

export async function shraniPopup(_prej, formData) {
  await zahtevajAdmina();
  const st = (k, min, max, priv) => Math.min(max, Math.max(min, Number(formData.get(k)) || priv));
  const nast = {
    vklopljen: formData.get("vklopljen") === "on",
    zakasnitev: st("zakasnitev", 0, 600, PRIVZETO_POPUP.zakasnitev),
    premor: st("premor", 0, 365, PRIVZETO_POPUP.premor),
    znacka: t(formData.get("znacka")).slice(0, 12),
    naslovLevo: t(formData.get("naslovLevo")).slice(0, 80),
    alineje: vrstice(formData.get("alineje")).slice(0, 6).map((x) => x.slice(0, 60)),
    nadnaslov: t(formData.get("nadnaslov")).slice(0, 120),
    naslov: t(formData.get("naslov")).slice(0, 120) || PRIVZETO_POPUP.naslov,
    opis: t(formData.get("opis")).slice(0, 500),
    gumb: t(formData.get("gumb")).slice(0, 40) || PRIVZETO_POPUP.gumb,
    hvalaNaslov: t(formData.get("hvalaNaslov")).slice(0, 120) || PRIVZETO_POPUP.hvalaNaslov,
    hvalaBesedilo: t(formData.get("hvalaBesedilo")).slice(0, 400),
    brezStrani: vrstice(formData.get("brezStrani")).map((x) => (x.startsWith("/") ? x : `/${x}`)).slice(0, 30),
  };
  const sb = supabaseAdmin();
  const { error } = await sb.from("nastavitve").upsert({ kljuc: KLJUC_POPUP, vrednost: JSON.stringify(nast) }, { onConflict: "kljuc" });
  if (error) return { napaka: error.message };
  revalidatePath("/", "layout");
  revalidatePath("/admin/popup");
  return { ok: true };
}
