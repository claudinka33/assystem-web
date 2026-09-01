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
    <button
      type="button"
      onClick={odjavi}
      style={{
        background: "none",
        border: 0,
        color: "#8e969e",
        padding: 0,
        marginTop: 6,
        cursor: "pointer",
        font: "inherit",
        fontSize: "12.5px",
      }}
    >
      Odjava
    </button>
  );
}
