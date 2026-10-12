import Image from "next/image";
import ZnamkaZnak from "@/components/ZnamkaZnak";
import Link from "next/link";

// Mreža kartic izdelkov na dnu strani izdelka (isti videz kot stran kategorije).
// izdelki: [{ slug, naziv, kratek_opis, slika_url, href, znamka }]
export default function KarticeIzdelkov({ oznaka, naslov, izdelki, vec = null }) {
  if (!izdelki?.length) return null;
  return (
    <div className="izd-sorodni">
      <div className={vec ? "st row" : "st"}>
        <div>
          <span>{oznaka}</span>
          <h2>{naslov}</h2>
        </div>
        {vec && (
          <Link className="more" href={vec.href}>
            {vec.naziv} →
          </Link>
        )}
      </div>
      <div className="kats">
        {izdelki.map((i) => (
          <Link key={i.slug} className="k" href={i.href}>
            <div className={i.slika_url ? "im" : "im prazna"}>
              {i.slika_url && (
                <Image
                  src={i.slika_url}
                  alt={i.naziv}
                  fill
                  sizes="300px"
                  style={{ objectFit: "contain", padding: 18, mixBlendMode: "multiply" }}
                />
              )}
            </div>
            <div className="tx">
              <ZnamkaZnak znamka={i.znamka} />
              {i.skupina && <span className="izd-sk">{i.skupina}</span>}
              <h2>{i.naziv}</h2>
              {i.kratek_opis && <p>{i.kratek_opis}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
