"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-server";
import { zahtevajAdmina } from "@/lib/akcije/skupno";
import { SILVERMATE_KATEGORIJA, SILVERMATE_IZDELKI } from "@/lib/silvermate";
import { SILVERMATE_ARTIKLI } from "@/lib/silvermate-artikli";

// Enkratni (ponovljivi) uvoz: kategorija »Lesni vijaki Silvermate«, izdelka Pozi in Torx
// ter vsi artikli AS811/812/814/816. Ponovni zagon samo posodobi obstoječe zapise po slugu/šifri.
export async function uvoziSilvermate() {
  await zahtevajAdmina();
  const sb = supabaseAdmin();
  const log = [];

  // 1) Kategorija (korenska, če nadrejena ni določena)
  const { data: starsi } = SILVERMATE_KATEGORIJA.nadrejena
    ? await sb.from("kategorije").select("id").eq("slug", SILVERMATE_KATEGORIJA.nadrejena).maybeSingle()
    : { data: null };
  const kat = {
    naziv: SILVERMATE_KATEGORIJA.naziv,
    slug: SILVERMATE_KATEGORIJA.slug,
    opis: SILVERMATE_KATEGORIJA.opis,
    slika_url: SILVERMATE_KATEGORIJA.slika,
    nadrejena_id: starsi?.id ?? null,
    vrstni_red: 90,
    objavljeno: true,
  };
  let { data: obstojeca } = await sb.from("kategorije").select("id").eq("slug", kat.slug).maybeSingle();
  let katId = obstojeca?.id;
  if (katId) {
    await sb.from("kategorije").update(kat).eq("id", katId);
    log.push("kategorija posodobljena");
  } else {
    const { data, error } = await sb.from("kategorije").insert(kat).select("id").single();
    if (error) redirect(`/admin/silvermate?napaka=${encodeURIComponent("Kategorija: " + error.message)}`);
    katId = data.id;
    log.push("kategorija ustvarjena");
  }

  // 2) Izdelka
  const idPoGlavi = {};
  for (const [glava, iz] of Object.entries(SILVERMATE_IZDELKI)) {
    const osnova = {
      naziv: iz.naziv,
      slug: iz.slug,
      kategorija_id: katId,
      kratek_opis: iz.kratekOpis,
      opis: iz.opis,
      tehnicni_opis: iz.tehnicniOpis,
      uporaba: iz.uporaba,
      prednosti: iz.prednosti,
      slika_url: iz.slika,
      galerija: iz.galerija,
      material: iz.material,
      eta_stevilka: iz.eta,
      vrstni_red: iz.vrstniRed,
      objavljeno: true,
      seo_naslov: iz.seoNaslov,
      seo_opis: iz.kratekOpis,
    };
    const polno = { ...osnova, znamka: "Silvermate", embalaza: iz.embalaza };
    const { data: ze } = await sb.from("izdelki").select("id").eq("slug", iz.slug).maybeSingle();
    let id = ze?.id;
    if (id) {
      const { error } = await sb.from("izdelki").update(polno).eq("id", id);
      if (error) {
        // stolpca znamka/embalaza morda še ni — poskusi brez njiju, nato vsakega posebej
        await sb.from("izdelki").update(osnova).eq("id", id);
        await sb.from("izdelki").update({ znamka: "Silvermate" }).eq("id", id);
        await sb.from("izdelki").update({ embalaza: iz.embalaza }).eq("id", id);
      }
    } else {
      let { data, error } = await sb.from("izdelki").insert(polno).select("id").single();
      if (error) {
        ({ data, error } = await sb.from("izdelki").insert(osnova).select("id").single());
        if (error) redirect(`/admin/silvermate?napaka=${encodeURIComponent("Izdelek: " + error.message)}`);
        await sb.from("izdelki").update({ znamka: "Silvermate" }).eq("id", data.id);
        await sb.from("izdelki").update({ embalaza: iz.embalaza }).eq("id", data.id);
      }
      id = data.id;
    }
    idPoGlavi[glava] = id;
    log.push(`izdelek ${iz.slug}`);
  }

  // 3) Artikli — kateri izdelki so jih imeli doslej?
  const sifre = SILVERMATE_ARTIKLI.map((a) => a[0]);
  const { data: prej } = await sb.from("artikli").select("sifra, izdelek_id").in("sifra", sifre);
  const nasa = new Set(Object.values(idPoGlavi).map(String));
  const stari = [...new Set((prej ?? []).map((a) => a.izdelek_id).filter((x) => x && !nasa.has(String(x))))];

  const vrstice = SILVERMATE_ARTIKLI.map(([sifra, glava, premer, dolzina, navoj, dn, pogon, kos, cena]) => {
    const ds = premer.toFixed(1).replace(".", ",");
    return {
      izdelek_id: idPoGlavi[glava],
      sifra,
      naziv: `Vijak lesni Silvermate ${glava === "pozi" ? "Pozi" : "Torx"} ZnB`,
      dimenzija: `${ds} × ${dolzina}`,
      premer,
      dolzina,
      enota: "kos",
      pakiranje: kos,
      vasco_enota: "GRT",
      cena_vasco: cena,
      lastnosti: {
        Navoj: navoj,
        "Dolžina navoja": dn,
        Nastavek: pogon,
        Material: "ZnB",
        Pakiranje: "škatla",
      },
      objavljeno: true,
      v_trgovini: true,
    };
  });
  const { error: napakaArt } = await sb.from("artikli").upsert(vrstice, { onConflict: "sifra" });
  if (napakaArt) redirect(`/admin/silvermate?napaka=${encodeURIComponent("Artikli: " + napakaArt.message)}`);
  log.push(`${vrstice.length} artiklov`);

  // 4a) Dokumenti starih izdelkov (ETA, DoP …) se prekopirajo na oba nova izdelka
  if (stari.length) {
    const { data: dok } = await sb.from("dokumenti").select("*").in("izdelek_id", stari);
    let kopij = 0;
    for (const novId of Object.values(idPoGlavi)) {
      const { data: ze } = await sb.from("dokumenti").select("datoteka_url").eq("izdelek_id", novId);
      const imamo = new Set((ze ?? []).map((d) => d.datoteka_url));
      for (const d of dok ?? []) {
        if (imamo.has(d.datoteka_url)) continue;
        const { id: _id, created_at: _c, izdelek_id: _i, ...ostalo } = d;
        const { error } = await sb.from("dokumenti").insert({ ...ostalo, izdelek_id: novId });
        if (!error) {
          kopij += 1;
          imamo.add(d.datoteka_url);
        }
      }
    }
    if (kopij) log.push(`kopiranih dokumentov: ${kopij}`);
  }

  // 4b) Stari izdelki, ki so ostali brez artiklov, se skrijejo (ne izbrišejo)
  let skriti = 0;
  for (const id of stari) {
    const { count } = await sb.from("artikli").select("id", { count: "exact", head: true }).eq("izdelek_id", id);
    if (!count) {
      await sb.from("izdelki").update({ objavljeno: false }).eq("id", id);
      skriti += 1;
    }
  }
  if (skriti) log.push(`skritih starih izdelkov: ${skriti}`);

  // 5) Iz seznama »novi artikli« (sinhronizacija) jih umaknemo, ker so zdaj na spletu
  await sb.from("vasco_novi_artikli").delete().in("sifra", sifre);

  revalidatePath("/admin/silvermate");
  revalidatePath("/program", "layout");
  revalidatePath("/silvermate");
  redirect(`/admin/silvermate?ok=${encodeURIComponent(log.join(" · "))}`);
}
