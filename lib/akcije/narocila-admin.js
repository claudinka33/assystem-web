"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-server";
import { zahtevajAdmina } from "@/lib/akcije/skupno";

export async function spremeniNarocilo(formData) {
  await zahtevajAdmina();
  await supabaseAdmin()
    .from("narocila")
    .update({
      status: formData.get("status"),
      status_placila: formData.get("status_placila"),
      opomba_interna: formData.get("opomba_interna") || null,
      posodobljeno: new Date().toISOString(),
    })
    .eq("id", formData.get("id"));
  revalidatePath("/admin/narocila");
}
