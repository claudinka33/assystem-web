"use server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-server";
import { zahtevajAdmina } from "@/lib/akcije/skupno";
import { normZnamka, razcleniSkrite, KLJUC_SKRITE, ZNAMKE_INFO } from "@/lib/znamke";
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

// Stikalo »Na spletu: vklop/izklop« za celo znamko. Izdelkov ne briše in ne spreminja —
// javna stran izklopljene znamke ne pokaže nikjer (meni, strani, iskanje, Rešitve, sitemap).
export async function preklopiZnamkoNaSpletu(formData) {
  await zahtevajAdmina();
  const znamka = normZnamka(formData.get("znamka"));
  if (!znamka) return;
  const izklopi = formData.get("akcija") === "izklopi";
  const sb = supabaseAdmin();
  const { data: obst } = await sb.from("nastavitve").select("kljuc, vrednost").eq("kljuc", KLJUC_SKRITE).maybeSingle();
  const zdaj = razcleniSkrite(obst?.vrednost);
  const nove = izklopi ? [...new Set([...zdaj, znamka])] : zdaj.filter((z) => z !== znamka);
  const vrednost = nove.join(",");
  if (obst) {
    await sb.from("nastavitve").update({ vrednost }).eq("kljuc", KLJUC_SKRITE);
  } else {
    const { error } = await sb
      .from("nastavitve")
      .insert({ kljuc: KLJUC_SKRITE, vrednost, opis: "Znamke, skrite na spletu (urejaj v Admin → Znamke)" });
    if (error) await sb.from("nastavitve").insert({ kljuc: KLJUC_SKRITE, vrednost });
  }
  revalidatePath("/", "layout");
  revalidatePath("/admin/znamke");
  for (const z of Object.values(ZNAMKE_INFO)) revalidatePath(z.pot);
}
