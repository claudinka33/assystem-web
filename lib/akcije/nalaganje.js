"use server";

// Neposredno nalaganje večjih datotek (življenjepis, risbe) v Supabase Storage,
// mimo strežnika: Vercel sprejme največ 4,5 MB na zahtevek.
import { supabaseAdmin } from "@/lib/supabase-server";
import { VRSTE_NALAGANJA, NAJVEC_MB } from "@/lib/nalaganje-pravila";

export async function pripraviNalaganje(vrsta, datoteke) {
  const p = VRSTE_NALAGANJA[vrsta];
  if (!p || !Array.isArray(datoteke)) return { napaka: "Nalaganje ni mogoče." };
  const izbrane = datoteke.slice(0, p.najvec);
  const sb = supabaseAdmin();
  const rez = [];
  for (const [i, d] of izbrane.entries()) {
    const koncnica = String(d?.ime ?? "").split(".").pop().toLowerCase();
    if (!p.koncnice.includes(koncnica)) return { napaka: p.napakaVrsta };
    if (!(Number(d.velikost) > 0) || Number(d.velikost) > NAJVEC_MB * 1024 * 1024) {
      return { napaka: `Datoteka ${d.ime} je večja od ${NAJVEC_MB} MB.` };
    }
    const varno = String(d.ime).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w.-]+/g, "_").replace(/_+/g, "_").slice(-80) || `datoteka.${koncnica}`;
    const pot = `${p.mapa}${Date.now()}-${i}-${Math.random().toString(36).slice(2, 8)}/${varno}`;
    const { data, error } = await sb.storage.from("prijave").createSignedUploadUrl(pot);
    if (error) return { napaka: "Nalaganje trenutno ni mogoče. Poskusite znova." };
    rez.push({ ime: d.ime, pot: data.path ?? pot, token: data.token });
  }
  return { datoteke: rez };
}

// Preveri, da naložene datoteke obstajajo, so v pravi mapi in niso prevelike.
export async function preveriNalozene(vrsta, json) {
  const p = VRSTE_NALAGANJA[vrsta];
  let seznam = [];
  try { seznam = JSON.parse(json || "[]"); } catch { return []; }
  if (!p || !Array.isArray(seznam)) return [];
  const sb = supabaseAdmin();
  const ok = [];
  for (const x of seznam.slice(0, p.najvec)) {
    const pot = String(x?.pot ?? "");
    if (!pot.startsWith(p.mapa) || pot.includes("..")) continue;
    const mapa = pot.slice(0, pot.lastIndexOf("/") + 1).replace(/\/$/, "");
    const ime = pot.slice(pot.lastIndexOf("/") + 1);
    const { data } = await sb.storage.from("prijave").list(mapa, { search: ime, limit: 5 });
    const f = data?.find((d) => d.name === ime);
    if (!f) continue;
    if ((f.metadata?.size ?? 0) > NAJVEC_MB * 1024 * 1024) {
      await sb.storage.from("prijave").remove([pot]);
      continue;
    }
    ok.push({ naziv: String(x.ime ?? ime).slice(0, 200), datoteka: pot });
  }
  return ok;
}
