"use server";

import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { supabaseAdmin, supabaseServer } from "@/lib/supabase-server";
import { trenutniB2B, jeAktiven, posebneCene, cenaPakiranjaZaKupca, normDavcna, B2B_STATUSI } from "@/lib/b2b";
import { mailPotrditev, mailPonastavitev, mailProdajiNovaRegistracija, mailAktiviran, mailPovabilo } from "@/lib/b2b-maili";
import { poisciPoDavcni } from "@/lib/vies";
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
    if (!/already/i.test(error?.message ?? "")) return { napaka: "Registracija ni uspela. Poskusi znova ali nas pokliči." };
    // E-naslov že ima račun (npr. admin spletne strani): z istim geslom B2B priključimo obstoječemu računu.
    const anon = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: pr, error: pe } = await anon.auth.signInWithPassword({ email: podatki.email, password: geslo });
    if (pe || !pr?.user) return { napaka: "Ta e-naslov že ima račun. Vpiši geslo tega računa ali uporabi drug e-naslov." };
    const { data: kupec, error: e3 } = await sb
      .from("b2b_kupci")
      .insert({ ...podatki, user_id: pr.user.id, status: "preverjanje" })
      .select("*")
      .single();
    if (e3) return { napaka: "Registracija ni uspela. Poskusi znova ali nas pokliči." };
    mailProdajiNovaRegistracija(kupec).catch((e) => console.error("B2B obvestilo prodaji:", e?.message));
    return { ok: true, email: podatki.email, obstojec: true };
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
  } else if (akcija === "povabilo") {
    try {
      await posljiPovabilo(k);
    } catch (e) {
      console.error("B2B povabilo:", e?.message);
    }
    await sb.from("b2b_kupci").update({ opomba_interna: opomba, posodobljeno: zdaj }).eq("id", id);
  } else if (akcija === "shrani") {
    await sb.from("b2b_kupci").update({ opomba_interna: opomba, posodobljeno: zdaj }).eq("id", id);
  }
  revalidatePath("/admin/b2b");
}

// ---------------- ročno odprt B2B kupec (komercialist v administraciji) ----------------

// Povezava za potrditev + geslo. Nov uporabnik -> invite, obstoječ -> recovery. Vrne user_id.
async function posljiPovabilo(kupec) {
  const sb = supabaseAdmin();
  let { data, error } = await sb.auth.admin.generateLink({ type: "invite", email: kupec.email });
  let tip = "invite";
  if (error || !data?.properties?.hashed_token) {
    ({ data, error } = await sb.auth.admin.generateLink({ type: "recovery", email: kupec.email }));
    tip = "recovery";
  }
  if (error || !data?.properties?.hashed_token) throw new Error(error?.message || "povezave ni bilo mogoče ustvariti");
  await mailPovabilo(kupec, data.properties.hashed_token, tip);
  return data.user?.id ?? null;
}

export async function poisciPodjetje(davcna) {
  await zahtevajAdmina();
  const r = await poisciPoDavcni(davcna);
  if (r.davcna) {
    const { data } = await supabaseAdmin().from("b2b_kupci").select("email, status").eq("davcna", r.davcna).limit(5);
    if (data?.length) r.obstojeci = data.map((k) => `${k.email} (${B2B_STATUSI[k.status] ?? k.status})`);
  }
  return r;
}

export async function ustvariB2B(_prej, formData) {
  const admin = await zahtevajAdmina();
  const p = Object.fromEntries(formData);
  const podatki = {
    podjetje: t(p.podjetje),
    davcna: normDavcna(p.davcna),
    ime: t(p.ime),
    email: t(p.email).toLowerCase(),
    telefon: t(p.telefon) || null,
    naslov: t(p.naslov) || null,
    posta: t(p.posta) || null,
    kraj: t(p.kraj) || null,
  };
  const partner = Number(String(p.vasco_partner ?? "").replace(/\D/g, "")) || null;
  if (!podatki.podjetje || !podatki.ime || !podatki.email) return { napaka: "Vpiši podjetje, ime in e-naslov kontaktne osebe." };
  if (podatki.davcna.length !== 8) return { napaka: "Davčna mora imeti 8 številk." };
  if (!/^\S+@\S+\.\S+$/.test(podatki.email)) return { napaka: "E-naslov ni pravilen." };

  const sb = supabaseAdmin();
  const { data: obstaja } = await sb.from("b2b_kupci").select("id").eq("email", podatki.email).maybeSingle();
  if (obstaja) return { napaka: "Ta e-naslov že ima B2B dostop. Pri kupcu spodaj klikni »Pošlji povabilo za geslo«." };

  const opombe = [
    `Odprl/a: ${admin.ime || admin.email} (${new Date().toLocaleDateString("sl-SI", { timeZone: "Europe/Ljubljana" })})`,
    t(p.kontakti) ? `Kontakti: ${t(p.kontakti)}` : "",
    t(p.opomba_interna),
  ].filter(Boolean);

  let userId;
  try {
    userId = await posljiPovabilo(podatki);
  } catch (e) {
    console.error("B2B povabilo:", e?.message);
    return { napaka: "Povabila nismo mogli poslati. Preveri e-naslov in poskusi znova." };
  }
  if (!userId) return { napaka: "Računa nismo mogli ustvariti. Poskusi znova." };

  const { error } = await sb.from("b2b_kupci").insert({
    ...podatki,
    user_id: userId,
    status: "preverjanje",
    odobreno_rocno: true,
    vasco_partner: partner,
    opomba_interna: opombe.join(" · "),
  });
  if (error) {
    console.error("B2B ročni vnos:", error.message);
    return { napaka: /user_id/.test(error.message) ? "Ta uporabnik je že povezan z drugim B2B podjetjem." : "Shranjevanje ni uspelo." };
  }
  revalidatePath("/admin/b2b");
  return { ok: true, email: podatki.email, podjetje: podatki.podjetje };
}
