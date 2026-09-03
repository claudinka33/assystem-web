import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pridobiNovico } from "@/lib/podatki";
import { datumSlo } from "@/lib/pomoc";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const n = await pridobiNovico(slug);
  if (!n) return {};
  return {
    title: n.seo_naslov ?? n.naslov,
    description: n.seo_opis ?? n.povzetek ?? undefined,
    alternates: { canonical: `/aktualno/${slug}` },
  };
}

export default async function Novica({ params }) {
  const { slug } = await params;
  const n = await pridobiNovico(slug);
  if (!n) notFound();

  return (
    <article className="sec">
      <div className="w" style={{ maxWidth: 860 }}>
        <nav className="drobtine">
          <Link href="/">Domov</Link> / <Link href="/aktualno">Aktualno</Link> / {n.naslov}
        </nav>

        <div className="st">
          <span>{datumSlo(n.objavljeno_dne)}</span>
          <h1>{n.naslov}</h1>
          {n.povzetek && <p>{n.povzetek}</p>}
        </div>

        {n.slika_url && (
          <div style={{ position: "relative", aspectRatio: "16 / 9", marginBottom: 28 }}>
            <Image src={n.slika_url} alt={n.naslov} fill sizes="860px" style={{ objectFit: "cover" }} />
          </div>
        )}

        {(n.vsebina ?? "").split("\n").filter(Boolean).map((odstavek, i) => (
          <p key={i} style={{ marginBottom: 16, fontSize: 16.5, color: "#2c3238" }}>
            {odstavek}
          </p>
        ))}

        <p style={{ marginTop: 32 }}>
          <Link className="more" href="/aktualno">
            ← Vse novice
          </Link>
        </p>
      </div>
    </article>
  );
}
