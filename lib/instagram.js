// Instagram @assystem.si — zadnje objave za domačo stran (samo strežnik).
// Žeton je v zasebni tabeli `instagram_zeton` (brez RLS politik → bere ga samo
// tajni ključ). Žeton velja 60 dni; ko je starejši od 7 dni, ga sami osvežimo.
import { unstable_cache } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-server";

const API = "https://graph.instagram.com";
const OSVEZI_PO_DNEVIH = 7;

async function zeton() {
  const sb = supabaseAdmin();
  const { data } = await sb.from("instagram_zeton").select("token, osvezen").eq("id", 1).maybeSingle();
  let token = data?.token || process.env.INSTAGRAM_TOKEN;
  if (!token) return null;

  const star = !data?.osvezen || Date.now() - new Date(data.osvezen).getTime() > OSVEZI_PO_DNEVIH * 864e5;
  if (data && star) {
    try {
      const r = await fetch(`${API}/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`, {
        cache: "no-store",
      });
      const j = await r.json();
      if (j.access_token) {
        token = j.access_token;
        await sb.from("instagram_zeton").update({ token, osvezen: new Date().toISOString() }).eq("id", 1);
      }
    } catch {
      // osvežitev ni uspela — poskusimo ob naslednjem branju
    }
  }
  return token;
}

async function nalozi(stevilo) {
  try {
    const token = await zeton();
    if (!token) return [];
    const polja = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
    const r = await fetch(`${API}/me/media?fields=${polja}&limit=${stevilo}&access_token=${token}`, {
      cache: "no-store",
    });
    if (!r.ok) return [];
    const j = await r.json();
    return (j.data ?? [])
      .map((m) => ({
        id: m.id,
        tip: m.media_type, // IMAGE | VIDEO | CAROUSEL_ALBUM
        slika: m.media_type === "VIDEO" ? m.thumbnail_url : m.media_url,
        video: m.media_type === "VIDEO" ? m.media_url : null,
        povezava: m.permalink,
        opis: (m.caption ?? "").trim(),
        datum: m.timestamp,
      }))
      .filter((m) => m.slika);
  } catch {
    return [];
  }
}

// Predpomnjeno 30 minut — nova objava je na strani najkasneje v pol ure.
export const pridobiInstagramObjave = unstable_cache(nalozi, ["instagram-objave-v2"], { revalidate: 1800 });
