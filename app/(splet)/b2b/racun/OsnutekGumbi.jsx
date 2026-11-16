"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { izprazni } from "@/lib/kosarica";
import { shraniKosarico } from "@/lib/akcije/b2b";
import { prevedeno } from "@/lib/i18n/odjemalec";

function OsnutekGumbi() {
  const router = useRouter();
  const [caka, setCaka] = useState(false);
  return (
    <div className="b2bp-osn-gumbi">
      <Link href="/kosarica" className="gumb">Nadaljuj z naročilom →</Link>
      <button
        type="button"
        className="gumb siv"
        disabled={caka}
        onClick={async () => {
          if (!window.confirm("Izbrišem osnutek naročila?")) return;
          setCaka(true);
          izprazni();
          await shraniKosarico([]).catch(() => {});
          router.refresh();
        }}
      >
        Izbriši osnutek
      </button>
    </div>
  );
}

export default prevedeno(OsnutekGumbi);
