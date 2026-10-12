"use server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-server";
import { zahtevajAdmina } from "@/lib/akcije/skupno";
import { normZnamka } from "@/lib/znamke";
import { izdelkiZPredlogi } from "@/lib/znamke-admin";

// Vpiše predlagano znamko vsem izdelkom, ki je še nimajo (vpisanih ne spreminja).
export async function vpisiPredloge() {
  await zahtevajAdmina();
  const { seznam, stolpec } = await izdelkiZPredlogi();
  if (!stolpec) return;
  const sb = supabaseAdmin();
  const brez = seznam.filter((i) => !i.vpis);
  const po = {};
  for (const i of brez) (po[i.predlog] ??= []).push(i.id);
  for (const [znamka, ids] of Object.entries(po)) {
    await sb.from("izdelki").update({ znamka }).in("id", ids);
  }
  revalidatePath("/admin/znamke");
  revalidatePath("/program", "layout");
}

// Ročna sprememba ene vrstice v pregledu.
export async function nastaviZnamko(formData) {
  await zahtevajAdmina();
  const id = formData.get("id");
  if (!id) return;
  await supabaseAdmin().from("izdelki").update({ znamka: normZnamka(formData.get("znamka")) }).eq("id", id);
  revalidatePath("/admin/znamke");
  revalidatePath("/program", "layout");
}
