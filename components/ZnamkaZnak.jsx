import Image from "next/image";
import Link from "next/link";
import { ZNAMKE_INFO, normZnamka } from "@/lib/znamke";

// Logotip znamke pri izdelku. velik = stran izdelka (s povezavo na stran znamke).
export default function ZnamkaZnak({ znamka, velik = false }) {
  const z = ZNAMKE_INFO[normZnamka(znamka)];
  if (!z) return null;
  const visina = velik ? 30 : 18;
  const slika = (
    <Image
      src={z.logo}
      alt={z.ime}
      width={Math.round((z.w / z.h) * visina)}
      height={visina}
      style={{ height: visina, width: "auto" }}
    />
  );
  if (!velik) return <span className="znamka-znak" title={`Znamka ${z.ime}`}>{slika}</span>;
  return (
    <Link href={z.pot} className="znamka-znak velik" title={`Več o znamki ${z.ime}`}>
      {slika}
    </Link>
  );
}
