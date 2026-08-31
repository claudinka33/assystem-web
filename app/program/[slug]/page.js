import { notFound } from "next/navigation";
import NaslovStrani from "@/components/NaslovStrani";
import VPripravi from "@/components/VPripravi";
import { kategorije } from "@/lib/site";

// Statično generiramo vseh 11 kategorij — hitro in dobro za Google.
export function generateStaticParams() {
  return kategorije.map((k) => ({ slug: k.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const k = kategorije.find((x) => x.slug === slug);
  if (!k) return {};
  return {
    title: k.naziv,
    description: k.opis,
    alternates: { canonical: `/program/${k.slug}` },
  };
}

export default async function Kategorija({ params }) {
  const { slug } = await params;
  const k = kategorije.find((x) => x.slug === slug);
  if (!k) notFound();

  return (
    <>
      <NaslovStrani oznaka="Prodajni program" naslov={k.naziv} opis={k.opis} />
      <VPripravi kaj="Izdelke te kategorije skupaj s šiframi, dimenzijami in tehničnimi listi vnašamo v urejevalnik vsebin." />
    </>
  );
}
