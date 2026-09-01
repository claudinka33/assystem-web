"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";

export default function PrijavaObrazec() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [geslo, setGeslo] = useState("");
  const [napaka, setNapaka] = useState("");
  const [caka, setCaka] = useState(false);

  async function prijavi(e) {
    e.preventDefault();
    setNapaka("");
    setCaka(true);

    const { error } = await supabaseBrowser().auth.signInWithPassword({
      email,
      password: geslo,
    });

    if (error) {
      setNapaka("Napačen e-naslov ali geslo.");
      setCaka(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={prijavi}>
      {napaka && <div className="opozorilo">{napaka}</div>}
      <div className="adm-polje">
        <label htmlFor="email">E-naslov</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          required
        />
      </div>
      <div className="adm-polje">
        <label htmlFor="geslo">Geslo</label>
        <input
          id="geslo"
          type="password"
          value={geslo}
          onChange={(e) => setGeslo(e.target.value)}
          autoComplete="current-password"
          required
        />
      </div>
      <button className="gumb" type="submit" disabled={caka} style={{ width: "100%" }}>
        {caka ? "Prijavljam…" : "Prijava"}
      </button>
    </form>
  );
}
