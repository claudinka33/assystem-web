import Blagajna from "./Blagajna";
import { pridobiDostave } from "@/lib/akcije/narocila";

export const metadata = { title: "Blagajna", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Stran() {
  const dostave = await pridobiDostave();
  return (
    <section className="sec">
      <div className="w" style={{ maxWidth: 1000 }}>
        <h1 className="izd-h1" style={{ marginBottom: 20 }}>Blagajna</h1>
        <Blagajna dostave={dostave} />
      </div>
    </section>
  );
}
