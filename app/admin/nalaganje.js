"use client";

import { pripraviNalaganje } from "@/lib/akcije/skupno";
import { supabaseBrowser } from "@/lib/supabase";

// Naloži datoteko neposredno v Supabase shrambo (brez omejitve 4,5 MB) in vrne javno povezavo.
export async function naloziVShrambo(datoteka, vedro = "slike") {
  const p = await pripraviNalaganje(datoteka.name, vedro);
  if (p?.napaka) return { napaka: p.napaka };
  const { error } = await supabaseBrowser()
    .storage.from(vedro)
    .uploadToSignedUrl(p.pot, p.token, datoteka, { contentType: datoteka.type || undefined });
  if (error) return { napaka: error.message };
  return { url: p.url };
}
