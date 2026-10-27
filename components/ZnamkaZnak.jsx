import Image from "next/image";
import Link from "next/link";
import { ZNAMKE_INFO, normZnamka } from "@/lib/znamke";

// Logotip znamke pri izdelku. velik = stran izdelka (s povezavo na stran znamke).
export default function ZnamkaZnak({ znamka, velik = false }) {
  const info = ZNAMKE_INFO[normZnamka(znamka)];
  if (!info) return null;
  const z = { ...info, ...(info.znak ?? {}) };
  const visina = velik ? (z.visinaVelik ?? 30) : (z.visina ?? 18);
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
