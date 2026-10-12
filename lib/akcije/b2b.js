"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin, supabaseServer } from "@/lib/supabase-server";
import { trenutniB2B, jeAktiven, posebneCene, cenaPakiranjaZaKupca, normDavcna } from "@/lib/b2b";
import { mailPotrditev, mailPonastavitev, mailProdajiNovaRegistracija, mailAktiviran } from "@/lib/b2b-maili";
import { zahtevajAdmina } from "@/lib/akcije/skupno";

const t = (v) => String(v ?? "").trim();

// ---------------- registracija ----------------
export async function registracija(_prej, formData) {
  const p = Object.fromEntries(formData);
  const podatki = {
    podjetje: t(p.podjetje),
    davcna: normDavcna(p.davcna),
    ime: t(p.ime),
    email: t(p.email).toLowerCase(),
    telefon: t(p.telefon),
    naslov: t(p.naslov),
    posta: t(p.posta),
    kraj: t(p.kraj),
  };
  const geslo = String(p.geslo ?? "");
  if (!podatki.podjetje || !podatki.ime || !podatki.email || !podatki.telefon) return { napaka: "Izpolni vsa obvezna polja." };
  if (podatki.davcna.length < 8) return { napaka: "Davčna številka ni pravilna (8 številk, npr. SI12345678)." };
  if (!/^\S+@\S+\.\S+$/.test(podatki.email)) return { napaka: "E-naslov ni pravilen." };
  if (geslo.length < 8) return { napaka: "Geslo mora imeti vsaj 8 znakov." };
  if (geslo !== String(p.geslo2 ?? "")) return { napaka: "Gesli se ne ujemata." };
  if (p.pogoji !== "on") return { napaka: "Potrdi splošne pogoje." };

  const sb = supabaseAdmin();
  const { data: obstaja } = await sb.from("b2b_kupci").select("id").eq("email", podatki.email).maybeSingle();
  if (obstaja) return { napaka: "Ta e-naslov je že registriran. Prijavi se ali ponastavi geslo." };

  const { data, error } = await sb.auth.admin.generateLink({ type: "signup", email: podatki.email, password: geslo });
  if (error || !data?.user) {
    const msg = /already/i.test(error?.message ?? "") ? "Ta e-naslov je že registriran. Prijavi se ali ponastavi geslo." : "Registracija ni uspela. Poskusi znova ali nas pokliči.";
    return { napaka: msg };
  }
  const { data: kupec, error: e2 } = await sb
    .from("b2b_kupci")
    .insert({ ...podatki, user_id: data.user.id, status: "preverjanje" })
    .select("*")
    .single();
  if (e2) {
    await sb.auth.admin.deleteUser(data.user.id).catch(() => {});
    return { napaka: "Registracija ni uspela. Poskusi znova ali nas pokliči." };
  }
  try {
    await mailPotrditev(podatki.email, data.properties.hashed_token);
  } catch (e) {
    console.error("B2B potrditveni mail:", e?.message);
    return { napaka: "Potrditvenega e-sporočila nismo mogli poslati. Pokliči nas, uredimo ročno." };
  }
  mailProdajiNovaRegistracija(kupec).catch((e) => console.error("B2B obvestilo prodaji:", e?.message));
  return { ok: true, email: podatki.email };
}

// ---------------- prijava / odjava ----------------
export async function prijava(_prej, formData) {
  const email = t(formData.get("email")).toLowerCase();
  const geslo = String(formData.get("geslo") ?? "");
  const sb = await supabaseServer();
  const { error } = await sb.auth.signInWithPassword({ email, password: geslo });
  if (error) {
    if (/confirm/i.test(error.message)) return { napaka: "E-naslov še ni potrjen. Klikni povezavo v e-sporočilu, ki smo ti ga poslali." };
    return { napaka: "Napačen e-naslov ali geslo." };
  }
  const naprej = t(formData.get("naprej"));
  redirect(naprej.startsWith("/") && !naprej.startsWith("//") ? naprej : "/b2b/racun");
}

export async function odjava() {
  const sb = await supabaseServer();
  await sb.auth.signOut();
  redirect("/b2b");
}

// ---------------- geslo ----------------
export async function pozabljenoGeslo(_prej, formData) {
  const email = t(formData.get("email")).toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return { napaka: "E-naslov ni pravilen." };
  const sb = supabaseAdmin();
  const { data: k } = await sb.from("b2b_kupci").select("id").eq("email", email).maybeSingle();
  if (k) {
    const { data, error } = await sb.auth.admin.generateLink({ type: "recovery", email });
    if (!error && data?.properties?.hashed_token) {
      try {
        await mailPonastavitev(email, data.properties.hashed_token);
      } catch (e) {
        console.error("B2B mail za geslo:", e?.message);
      }
    }
  }
  // enak odgovor ne glede na to, ali račun obstaja
  return { ok: true };
}

export async function novoGeslo(_prej, formData) {
  const geslo = String(formData.get("geslo") ?? "");
  if (geslo.length < 8) return { napaka: "Geslo mora imeti vsaj 8 znakov." };
  if (geslo !== String(formData.get("geslo2") ?? "")) return { napaka: "Gesli se ne ujemata." };
  const sb = await supabaseServer();
  const { error } = await sb.auth.updateUser({ password: geslo });
  if (error) return { napaka: "Povezava je potekla. Zahtevaj novo povezavo za geslo." };
  redirect("/b2b/racun?geslo=1");
}

// ---------------- podatki za glavo in cenik ----------------
export async function mojStatus() {
  const k = await trenutniB2B();
  if (!k) return null;
  return { podjetje: k.vasco_naziv || k.podjetje, status: k.status, aktiven: jeAktiven(k) };
}

// B2B cene za artikle (id-ji iz tabele artikli). Vrne null, če kupec ni aktiven B2B.
export async function b2bCene(ids) {
  const k = await trenutniB2B();
  if (!jeAktiven(k)) return null;
  const seznam = (Array.isArray(ids) ? ids : []).map(Number).filter(Boolean).slice(0, 2000);
  if (!seznam.length) return { podjetje: k.vasco_naziv || k.podjetje, cene: {} };
  const sb = supabaseAdmin();
  const art = [];
  for (let i = 0; i < seznam.length; i += 300) {
    const { data } = await sb
      .from("artikli")
      .select("id, sifra, pakiranje, cena_vasco, vasco_enota, objavljeno")
      .in("id", seznam.slice(i, i + 300));
    art.push(...(data ?? []));
  }
  const posebne = await posebneCene(k.vasco_partner, art.map((a) => a.sifra));
  const cene = {};
  for (const a of art) {
    if (!a.objavljeno) continue;
    const c = cenaPakiranjaZaKupca(a, k, posebne);
    if (c) cene[a.id] = c;
  }
  return { podjetje: k.vasco_naziv || k.podjetje, cene };
}

// ---------------- administracija ----------------
export async function adminB2B(formData) {
  await zahtevajAdmina();
  const sb = supabaseAdmin();
  const id = formData.get("id");
  const akcija = formData.get("akcija");
  const { data: k } = await sb.from("b2b_kupci").select("*").eq("id", id).single();
  if (!k) return;
  const zdaj = new Date().toISOString();
  const partner = Number(String(formData.get("vasco_partner") ?? "").replace(/\D/g, "")) || null;
  const opomba = t(formData.get("opomba_interna")) || null;

  if (akcija === "zavrni") {
    await sb.from("b2b_kupci").update({ status: "zavrnjen", opomba_interna: opomba, posodobljeno: zdaj }).eq("id", id);
  } else if (akcija === "odobri") {
    // Odobritev: če je partner že prenesen iz Vasca, je dostop aktiven takoj; sicer ga as-terminal prenese in aktivira.
    const novPartner = partner && partner !== Number(k.vasco_partner);
    if (!novPartner && k.vasco_partner && k.vasco_sync_ob) {
      await sb.from("b2b_kupci").update({ status: "aktiven", odobreno_rocno: true, opomba_interna: opomba, posodobljeno: zdaj }).eq("id", id);
      await mailAktiviran({ ...k, status: "aktiven" }).catch((e) => console.error("B2B mail aktiviran:", e?.message));
    } else {
      await sb
        .from("b2b_kupci")
        .update({ status: "preverjanje", odobreno_rocno: true, vasco_partner: partner ?? k.vasco_partner, opomba_interna: opomba, posodobljeno: zdaj })
        .eq("id", id);
    }
  } else if (akcija === "preveri") {
    await sb.from("b2b_kupci").update({ status: "preverjanje", vasco_partner: partner ?? k.vasco_partner, opomba_interna: opomba, posodobljeno: zdaj }).eq("id", id);
  } else if (akcija === "shrani") {
    await sb.from("b2b_kupci").update({ opomba_interna: opomba, posodobljeno: zdaj }).eq("id", id);
  }
  revalidatePath("/admin/b2b");
}
