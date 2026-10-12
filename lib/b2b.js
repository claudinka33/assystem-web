// B2B kupci: prijavljeni kupec, njegove cene in poslovalnice. Samo strežnik.
import { supabaseAdmin, supabaseServer } from "@/lib/supabase-server";
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
    const sb = await supabaseServer();
    ({ data: { user } } = await sb.auth.getUser());
  } catch {
    return null;
  }
  if (!user) return null;
  const { data } = await supabaseAdmin().from("b2b_kupci").select("*").eq("user_id", user.id).maybeSingle();
  return data ? { ...data, user } : null;
}

export const jeAktiven = (k) => Boolean(k && k.status === "aktiven" && k.vasco_partner);

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

// Cena na Vasco enoto za kupca: posebna cena (z rabatom) ali VPC − rabat partnerja.
export function cenaEnoteZaKupca(a, kupec, posebne) {
  const p = posebne?.[a.sifra];
  if (p && Number(p.cena) > 0) return { cena: Number(p.cena) * (1 - Number(p.rabat || 0) / 100), posebna: true };
  const vpc = Number(a.cena_vasco);
  if (!vpc || vpc <= 0) return null;
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
