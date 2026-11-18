// B2B kupci: prijavljeni kupec, njegove cene in poslovalnice. Samo strežnik.
import { supabaseAdmin, supabaseServer, supabaseB2B } from "@/lib/supabase-server";
import { cenaArtikla, zaokrozi } from "@/lib/cene";
import { site } from "@/lib/site";

export const B2B_STATUSI = {
  preverjanje: "Preverjamo podatke",
  caka_odobritev: "Čaka na odobritev",
  aktiven: "Aktiven",
  zavrnjen: "Zavrnjen",
};

export const osnovaUrl = () => (process.env.SPLET_URL || site.url).replace(/\/$/, "");

// Prijavljeni uporabnik in njegov B2B profil (ali null).
export async function trenutniB2B() {
  let user = null;
  try {
    const sb = await supabaseB2B();
    ({ data: { user } } = await sb.auth.getUser());
  } catch {
    return null;
  }
  if (!user) return null;
  const { data } = await supabaseAdmin().from("b2b_kupci").select("*").eq("user_id", user.id).maybeSingle();
  return data ? { ...data, user } : null;
}

export const jeAktiven = (k) => Boolean(k && k.status === "aktiven" && k.vasco_partner);

// Ali obiskovalec sme videti police in stran za trgovce: aktiven B2B kupec, ki ga je
// prodaja označila kot trgovca (ali admin). Vrne { dostop, prijavljen } —
// prijavljen = ima B2B profil, ki (še) nima dostopa za trgovce.
export async function dostopPolice() {
  const k = await trenutniB2B();
  if (jeAktiven(k) && k.trgovec === true) return { dostop: true, prijavljen: true };
  try {
    const sb = await supabaseServer();
    const { data: { user } } = await sb.auth.getUser();
    if (user) {
      const { data } = await supabaseAdmin().from("admin_uporabniki").select("id").eq("id", user.id).maybeSingle();
      if (data) return { dostop: true, prijavljen: true };
    }
  } catch {}
  return { dostop: false, prijavljen: Boolean(k) };
}

// Posebne cene partnerja za podane šifre: { sifra: { cena, rabat } }
export async function posebneCene(partner, sifre) {
  if (!partner || !sifre?.length) return {};
  const out = {};
  const sb = supabaseAdmin();
  for (let i = 0; i < sifre.length; i += 300) {
    const { data } = await sb
      .from("b2b_cene")
      .select("sifra, cena, rabat")
      .eq("vasco_partner", partner)
      .in("sifra", sifre.slice(i, i + 300));
    for (const r of data ?? []) out[r.sifra] = r;
  }
  return out;
}

// VPC iz Vasca (PRODAJNA_CENA); dokler ni prenesena, spletna cena.
export const vpcArtikla = (a) => Number(a?.cena_vpc) > 0 ? Number(a.cena_vpc) : Number(a?.cena_vasco) || 0;

// Cena na Vasco enoto za kupca (B2B): posebna cena (z rabatom) ali VPC − rabat partnerja.
export function cenaEnoteZaKupca(a, kupec, posebne) {
  const p = posebne?.[a.sifra];
  if (p && Number(p.cena) > 0) return { cena: Number(p.cena) * (1 - Number(p.rabat || 0) / 100), posebna: true };
  const vpc = vpcArtikla(a);
  if (!vpc || vpc <= 0) return null;
  // Rabat za artikel iz Vasca (rabatna pravila po skupinah; vrstica v b2b_cene s ceno 0)
  if (p && Number(p.rabat) > 0) return { cena: vpc * (1 - Number(p.rabat) / 100), posebna: true };
  return { cena: vpc * (1 - Number(kupec?.rabat || 0) / 100), posebna: false };
}

// Cena pakiranja za kupca (isti izhod kot cenaArtikla) ali null.
export function cenaPakiranjaZaKupca(a, kupec, posebne) {
  const e = cenaEnoteZaKupca(a, kupec, posebne);
  if (!e) return null;
  const c = cenaArtikla(a, zaokrozi(e.cena * 10000) / 10000);
  return c ? { ...c, posebna: e.posebna } : null;
}

export async function prodajalneKupca(partner) {
  if (!partner) return [];
  const { data } = await supabaseAdmin()
    .from("b2b_prodajalne")
    .select("sifra, naziv, naziv2, naslov, posta")
    .eq("vasco_partner", partner)
    .order("naziv2");
  return data ?? [];
}

// Normalizacija davčne: samo številke (SI12345678 -> 12345678)
export const normDavcna = (d) => String(d ?? "").toUpperCase().replace(/^SI/, "").replace(/\D/g, "");

// Računi v B2B: ali ima podjetje (partner) vklopljene račune.
export async function racuniVklopljeni(partner) {
  if (!partner) return false;
  const { data, error } = await supabaseAdmin().from("b2b_racuni_partnerji").select("vasco_partner").eq("vasco_partner", partner).maybeSingle();
  return !error && Boolean(data);
}

// Enota iz Vasca za prikaz (C = 100 kosov).
export const enotaVasco = (e) => ({ C: "100 kos", M: "1000 kos", KOS: "kos" }[String(e ?? "").toUpperCase()] ?? (e || ""));

// Količina v kosih za prikaz: 20 × C (100 kos) -> "2.000 kos"; dodatek pove, koliko enot je bilo.
export function kolicinaZaPrikaz(kolicina, enota) {
  const e = String(enota ?? "").toUpperCase();
  const k = Number(kolicina) || 0;
  const f = { C: 100, M: 1000, MIL: 1000 }[e];
  const st = (x) => new Intl.NumberFormat("sl-SI", { maximumFractionDigits: 2, useGrouping: "always" }).format(x);
  if (f) return { glavno: `${st(k * f)} kos`, dodatek: `${st(k)} × ${f} kos`, kosov: k * f };
  const kosov = ["KOS", "KOM"].includes(e) ? k : null;
  return { glavno: `${st(k)} ${enotaVasco(enota) || ""}`.trim(), dodatek: "", kosov };
}

// Testni B2B uporabniki: lahko naročajo tudi pri ustavljeni prodaji, naročilo gre v Vasco z opombo TESTNO NAROČILO.
export const TESTNI_B2B = ["claudinka33@gmail.com"];
export const jeTestniB2B = (kupec) => TESTNI_B2B.includes(String(kupec?.email ?? "").toLowerCase());
