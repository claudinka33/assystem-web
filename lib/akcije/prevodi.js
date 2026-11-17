"use server";

import { revalidatePath } from "@/lib/predpomnilnik";
import { supabaseAdmin } from "@/lib/supabase-server";
import { zahtevajAdmina } from "@/lib/akcije/skupno";

// Ročni popravek prevoda: ostane za vedno (samodejni prevod ga ne prepiše).
export async function shraniPrevod(formData) {
  await zahtevajAdmina();
  const id = Number(formData.get("id"));
  const prevod = String(formData.get("prevod") ?? "").trim();
  if (!id || !prevod) throw new Error("Prevod ne sme biti prazen.");
  const { error } = await supabaseAdmin()
    .from("prevodi")
    .update({ prevod, rocno: true, posodobljeno: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/prevodi");
}

// Izbriše prevod: ob naslednjem obisku strani se naredi nov samodejni prevod.
export async function prevediZnova(formData) {
  await zahtevajAdmina();
  const id = Number(formData.get("id"));
  if (!id) return;
  const { error } = await supabaseAdmin().from("prevodi").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/prevodi");
}
