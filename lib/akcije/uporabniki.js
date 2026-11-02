"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-server";
import { zahtevajAdmina } from "@/lib/akcije/skupno";
import { MODULI } from "@/lib/dovoljenja";

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

  await supabaseAdmin()
    .from("admin_dostopi")
    .upsert(
      {
        email,
        ime: String(formData.get("ime") || "").trim() || null,
        dovoljenja,
        aktiven: formData.get("aktiven") === "on",
        dodal: admin.email,
        posodobljeno: new Date().toISOString(),
      },
      { onConflict: "email" }
    );
  revalidatePath("/admin/uporabniki");
}

export async function izbrisiDostop(formData) {
  await zahtevajPolnega();
  await supabaseAdmin().from("admin_dostopi").delete().eq("email", String(formData.get("email") || ""));
  revalidatePath("/admin/uporabniki");
}
