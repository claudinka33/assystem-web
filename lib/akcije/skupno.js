"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin, trenutniAdmin } from "@/lib/supabase-server";
import { slugify, stevilo } from "@/lib/pomoc";

// Vsaka akcija najprej preveri, ali je uporabnik res administrator.
export async function zahtevajAdmina() {
  const admin = await trenutniAdmin();
  if (!admin) redirect("/admin/prijava");
  return admin;
}

// ---------------- KATEGORIJE ----------------
export async function shraniKategorijo(formData) {
  await zahtevajAdmina();
  const sb = supabaseAdmin();

  const id = formData.get("id");
  const naziv = formData.get("naziv")?.trim();
  const podatki = {
    naziv,
    slug: formData.get("slug")?.trim() || slugify(naziv),
    opis: formData.get("opis")?.trim() || null,
    slika_url: formData.get("slika_url")?.trim() || null,
    nadrejena_id: formData.get("nadrejena_id") || null,
    vrstni_red: Number(formData.get("vrstni_red") || 0),
    objavljeno: formData.get("objavljeno") === "on",
    seo_naslov: formData.get("seo_naslov")?.trim() || null,
    seo_opis: formData.get("seo_opis")?.trim() || null,
  };

  if (id) await sb.from("kategorije").update(podatki).eq("id", id);
  else await sb.from("kategorije").insert(podatki);

  revalidatePath("/admin/kategorije");
  revalidatePath("/program");
  redirect("/admin/kategorije");
}

export async function izbrisiKategorijo(formData) {
  await zahtevajAdmina();
  await supabaseAdmin().from("kategorije").delete().eq("id", formData.get("id"));
  revalidatePath("/admin/kategorije");
  revalidatePath("/program");
}

// ---------------- IZDELKI ----------------
export async function shraniIzdelek(formData) {
  await zahtevajAdmina();
  const sb = supabaseAdmin();

  const id = formData.get("id");
  const naziv = formData.get("naziv")?.trim();
  const seznam = (v) =>
    (v || "")
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);

  const podatki = {
    naziv,
    slug: formData.get("slug")?.trim() || slugify(naziv),
    kategorija_id: formData.get("kategorija_id") || null,
    kratek_opis: formData.get("kratek_opis")?.trim() || null,
    opis: formData.get("opis")?.trim() || null,
    tehnicni_opis: formData.get("tehnicni_opis")?.trim() || null,
    uporaba: seznam(formData.get("uporaba")),
    prednosti: seznam(formData.get("prednosti")),
    slika_url: formData.get("slika_url")?.trim() || null,
    material: formData.get("material")?.trim() || null,
    eta_stevilka: formData.get("eta_stevilka")?.trim() || null,
    vrstni_red: Number(formData.get("vrstni_red") || 0),
    objavljeno: formData.get("objavljeno") === "on",
    seo_naslov: formData.get("seo_naslov")?.trim() || null,
    seo_opis: formData.get("seo_opis")?.trim() || null,
  };

  let izdelekId = id;
  if (id) {
    await sb.from("izdelki").update(podatki).eq("id", id);
  } else {
    const { data } = await sb.from("izdelki").insert(podatki).select("id").single();
    izdelekId = data?.id;
  }

  revalidatePath("/admin/izdelki");
  redirect(`/admin/izdelki/${izdelekId}`);
}

export async function izbrisiIzdelek(formData) {
  await zahtevajAdmina();
  await supabaseAdmin().from("izdelki").delete().eq("id", formData.get("id"));
  revalidatePath("/admin/izdelki");
  redirect("/admin/izdelki");
}

// ---------------- ARTIKLI ----------------
export async function shraniArtikel(formData) {
  await zahtevajAdmina();
  const sb = supabaseAdmin();

  const id = formData.get("id");
  const izdelekId = formData.get("izdelek_id");
  const podatki = {
    izdelek_id: izdelekId,
    sifra: formData.get("sifra")?.trim(),
    naziv: formData.get("naziv")?.trim(),
    ean: formData.get("ean")?.trim() || null,
    dimenzija: formData.get("dimenzija")?.trim() || null,
    premer: stevilo(formData.get("premer")),
    dolzina: stevilo(formData.get("dolzina")),
    enota: formData.get("enota")?.trim() || "kos",
    pakiranje: stevilo(formData.get("pakiranje")),
    teza_g: stevilo(formData.get("teza_g")),
    cena_mpc: stevilo(formData.get("cena_mpc")),
    zaloga: stevilo(formData.get("zaloga")),
    min_narocilo: Number(formData.get("min_narocilo") || 1),
    v_trgovini: formData.get("v_trgovini") === "on",
    objavljeno: formData.get("objavljeno") === "on",
  };

  if (id) await sb.from("artikli").update(podatki).eq("id", id);
  else await sb.from("artikli").insert(podatki);

  revalidatePath(`/admin/izdelki/${izdelekId}`);
}

export async function izbrisiArtikel(formData) {
  await zahtevajAdmina();
  await supabaseAdmin().from("artikli").delete().eq("id", formData.get("id"));
  revalidatePath(`/admin/izdelki/${formData.get("izdelek_id")}`);
}

// ---------------- DOKUMENTI ----------------
export async function shraniDokument(formData) {
  await zahtevajAdmina();
  const izdelekId = formData.get("izdelek_id");
  await supabaseAdmin().from("dokumenti").insert({
    izdelek_id: izdelekId,
    naziv: formData.get("naziv")?.trim(),
    tip: formData.get("tip"),
    jezik: formData.get("jezik") || "sl",
    datoteka_url: formData.get("datoteka_url")?.trim(),
  });
  revalidatePath(`/admin/izdelki/${izdelekId}`);
}

export async function izbrisiDokument(formData) {
  await zahtevajAdmina();
  await supabaseAdmin().from("dokumenti").delete().eq("id", formData.get("id"));
  revalidatePath(`/admin/izdelki/${formData.get("izdelek_id")}`);
}

// ---------------- NOVICE ----------------
export async function shraniNovico(formData) {
  await zahtevajAdmina();
  const sb = supabaseAdmin();
  const id = formData.get("id");
  const naslov = formData.get("naslov")?.trim();
  const podatki = {
    naslov,
    slug: formData.get("slug")?.trim() || slugify(naslov),
    povzetek: formData.get("povzetek")?.trim() || null,
    vsebina: formData.get("vsebina")?.trim() || null,
    slika_url: formData.get("slika_url")?.trim() || null,
    objavljeno_dne: formData.get("objavljeno_dne") || new Date().toISOString().slice(0, 10),
    objavljeno: formData.get("objavljeno") === "on",
    seo_naslov: formData.get("seo_naslov")?.trim() || null,
    seo_opis: formData.get("seo_opis")?.trim() || null,
  };

  if (id) await sb.from("novice").update(podatki).eq("id", id);
  else await sb.from("novice").insert(podatki);

  revalidatePath("/admin/novice");
  revalidatePath("/aktualno");
  redirect("/admin/novice");
}

export async function izbrisiNovico(formData) {
  await zahtevajAdmina();
  await supabaseAdmin().from("novice").delete().eq("id", formData.get("id"));
  revalidatePath("/admin/novice");
}

// ---------------- POVPRAŠEVANJA ----------------
export async function spremeniStatusPovprasevanja(formData) {
  await zahtevajAdmina();
  await supabaseAdmin()
    .from("povprasevanja")
    .update({
      status: formData.get("status"),
      opomba: formData.get("opomba")?.trim() || null,
    })
    .eq("id", formData.get("id"));
  revalidatePath("/admin/povprasevanja");
}

// ---------------- NASTAVITVE ----------------
export async function shraniNastavitve(formData) {
  await zahtevajAdmina();
  const sb = supabaseAdmin();
  const vnosi = [];
  for (const [kljuc, vrednost] of formData.entries()) {
    if (kljuc.startsWith("n_")) {
      vnosi.push({ kljuc: kljuc.slice(2), vrednost: String(vrednost) });
    }
  }
  for (const v of vnosi) {
    await sb.from("nastavitve").update({ vrednost: v.vrednost }).eq("kljuc", v.kljuc);
  }
  revalidatePath("/admin/nastavitve");
  revalidatePath("/");
}

// ---------------- NALAGANJE SLIK ----------------
export async function naloziDatoteko(formData) {
  await zahtevajAdmina();
  const datoteka = formData.get("datoteka");
  const vedro = formData.get("vedro") || "slike";
  if (!datoteka || datoteka.size === 0) return { napaka: "Ni datoteke" };

  const koncnica = datoteka.name.split(".").pop().toLowerCase();
  const ime = `${slugify(datoteka.name.replace(/\.[^.]+$/, ""))}-${Date.now()}.${koncnica}`;

  const sb = supabaseAdmin();
  const { error } = await sb.storage
    .from(vedro)
    .upload(ime, datoteka, { contentType: datoteka.type, upsert: false });

  if (error) return { napaka: error.message };

  const { data } = sb.storage.from(vedro).getPublicUrl(ime);
  return { url: data.publicUrl };
}
