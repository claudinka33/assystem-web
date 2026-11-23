"use client";

// Ovije strežniško akcijo obrazca: datoteke iz polja (cv ali priloga) najprej naloži
// naravnost v Supabase Storage, nato akciji pošlje samo poti do njih (»nalozeno«).
import { supabaseBrowser } from "@/lib/supabase";
import { pripraviNalaganje } from "@/lib/akcije/nalaganje";
import { NAJVEC_MB } from "@/lib/nalaganje-pravila";

export function zNalaganjem(akcija, polje) {
  return async function (prejsnje, formData) {
    const datoteke = formData.getAll(polje).filter((f) => f && typeof f !== "string" && f.size > 0);
    formData.delete(polje);
    if (!datoteke.length) return akcija(prejsnje, formData);

    const prevelika = datoteke.find((f) => f.size > NAJVEC_MB * 1024 * 1024);
    if (prevelika) return { stanje: "napaka", sporocilo: `Datoteka ${prevelika.name} je večja od ${NAJVEC_MB} MB.` };

    const priprava = await pripraviNalaganje(polje, datoteke.map((f) => ({ ime: f.name, velikost: f.size })));
    if (priprava?.napaka) return { stanje: "napaka", sporocilo: priprava.napaka };

    const sb = supabaseBrowser();
    const nalozeno = [];
    for (const [i, d] of priprava.datoteke.entries()) {
      const f = datoteke[i];
      const { error } = await sb.storage.from("prijave").uploadToSignedUrl(d.pot, d.token, f, { contentType: f.type || undefined });
      if (error) return { stanje: "napaka", sporocilo: `Datoteke ${f.name} ni bilo mogoče naložiti. Poskusite znova.` };
      nalozeno.push({ ime: f.name, pot: d.pot });
    }
    formData.set("nalozeno", JSON.stringify(nalozeno));
    return akcija(prejsnje, formData);
  };
}
