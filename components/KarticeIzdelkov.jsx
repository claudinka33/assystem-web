import Image from "next/image";
import Link from "next/link";

// Mreža kartic izdelkov na dnu strani izdelka (isti videz kot stran kategorije).
// izdelki: [{ slug, naziv, kratek_opis, slika_url, href, znamka }]
export default function KarticeIzdelkov({ oznaka, naslov, izdelki }) {
  if (!izdelki?.length) return null;
  return (
    <div className="izd-sorodni">
      <div className="st">
        <span>{oznaka}</span>
        <h2>{naslov}</h2>
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
              {i.znamka && <span className="znamka">{i.znamka} program</span>}
              <h2>{i.naziv}</h2>
              {i.kratek_opis && <p>{i.kratek_opis}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
