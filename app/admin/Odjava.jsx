"use client";

import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";

export default function Odjava() {
  const router = useRouter();

  async function odjavi() {
    await supabaseBrowser().auth.signOut();
    router.push("/admin/prijava");
    router.refresh();
  }

  return (
    <button type="button" className="adm-odjava" onClick={odjavi}>
      Odjava
    </button>
  );
}
