"use server";

import { revalidatePath } from "@/lib/predpomnilnik";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-server";
import { zahtevajAdmina } from "@/lib/akcije/skupno";
import { MODULI } from "@/lib/dovoljenja";
import { mailAdminVabilo } from "@/lib/b2b-maili";

async function posljiVabiloInZabelezi(d, admin) {
  const deli = MODULI.filter((m) => (d.dovoljenja ?? []).includes(m.kljuc)).map((m) => m.naziv);
  try {
    const id = await mailAdminVabilo({ email: d.email, ime: d.ime, deli, povabil: admin.ime });
    return { ok: true, id };
  } catch (e) {
    console.error("Vabilo v admin ni bilo poslano:", e?.message);
    return { ok: false, napaka: e?.message };
  }
}

function potVabila(email, r) {
  const sp = new URLSearchParams({ vabilo: email, ok: r.ok ? "1" : "0" });
  if (r.id) sp.set("id", r.id);
  if (r.napaka) sp.set("napaka", r.napaka.slice(0, 200));
  return `/admin/uporabniki?${sp}`;
}

async function zahtevajPolnega() {
  const admin = await zahtevajAdmina();
  if (admin.dovoljenja != null) throw new Error("Dostope ureja samo polni administrator.");
  return admin;
}

export async function shraniDostop(formData) {
  const admin = await zahtevajPolnega();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return;

  const veljavni = MODULI.map((m) => m.kljuc);
  const dovoljenja = formData
    .getAll("dovoljenja")
    .map(String)
    .filter((k) => veljavni.includes(k));

  const sb = supabaseAdmin();
  const { data: prej } = await sb.from("admin_dostopi").select("email").eq("email", email).maybeSingle();

  const zapis = {
    email,
    ime: String(formData.get("ime") || "").trim() || null,
    dovoljenja,
    aktiven: formData.get("aktiven") === "on",
    dodal: admin.email,
    posodobljeno: new Date().toISOString(),
  };
  const { error } = await sb.from("admin_dostopi").upsert(zapis, { onConflict: "email" });

  // Vabilo po mailu samo ob prvem dodajanju (ne pri vsaki spremembi kljukic).
  let r = null;
  if (!error && !prej && zapis.aktiven) r = await posljiVabiloInZabelezi(zapis, admin);
  revalidatePath("/admin/uporabniki");
  if (r) redirect(potVabila(email, r));
}

export async function izbrisiDostop(formData) {
  await zahtevajPolnega();
  await supabaseAdmin().from("admin_dostopi").delete().eq("email", String(formData.get("email") || ""));
  revalidatePath("/admin/uporabniki");
}

// Ročno ponovno pošlji vabilo (npr. če ga je kdo izgubil).
export async function ponovnoPosljiVabilo(formData) {
  const admin = await zahtevajPolnega();
  const { data: d } = await supabaseAdmin()
    .from("admin_dostopi")
    .select("email, ime, dovoljenja")
    .eq("email", String(formData.get("email") || ""))
    .maybeSingle();
  const r = d ? await posljiVabiloInZabelezi(d, admin) : null;
  revalidatePath("/admin/uporabniki");
  if (r) redirect(potVabila(d.email, r));
}
