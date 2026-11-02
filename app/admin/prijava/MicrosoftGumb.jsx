"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";

export default function MicrosoftGumb() {
  const [caka, setCaka] = useState(false);
  const [napaka, setNapaka] = useState("");

  async function prijavi() {
    setCaka(true);
    setNapaka("");
    const { error } = await supabaseBrowser().auth.signInWithOAuth({
      provider: "azure",
      options: {
        scopes: "email openid profile",
        redirectTo: `${window.location.origin}/admin/auth/callback`,
      },
    });
    if (error) {
      setNapaka("Prijava z Microsoft ni uspela.");
      setCaka(false);
    }
  }

  return (
    <>
      {napaka && <div className="opozorilo">{napaka}</div>}
      <button
        type="button"
        className="gumb"
        onClick={prijavi}
        disabled={caka}
        style={{ width: "100%", background: "#2b2b2b", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
      >
        <svg width="18" height="18" viewBox="0 0 21 21" aria-hidden="true">
          <rect x="1" y="1" width="9" height="9" fill="#f25022" />
          <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
          <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
          <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
        </svg>
        {caka ? "Preusmerjam…" : "Prijava z Microsoft"}
      </button>
    </>
  );
}
