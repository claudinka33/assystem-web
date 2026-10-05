// Začasno: pregled strukture tabel (samo za admina), za razvoj trgovine.
export const dynamic = "force-dynamic";

export default async function Shema() {
  const r = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
    headers: { apikey: process.env.SUPABASE_SECRET_KEY, Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}` },
    cache: "no-store",
  });
  const j = await r.json();
  const defs = j.definitions ?? {};
  const vrstice = Object.entries(defs)
    .map(([t, d]) => `${t}: ${Object.entries(d.properties ?? {}).map(([k, v]) => `${k}(${v.format ?? v.type})`).join(", ")}`)
    .join("\n\n");
  const rpc = Object.keys(j.paths ?? {}).filter((p) => p.startsWith("/rpc/")).join(", ");
  return <article><pre style={{ whiteSpace: "pre-wrap", fontSize: 12, padding: 20 }}>{vrstice + "\n\nRPC: " + rpc}</pre></article>;
}
