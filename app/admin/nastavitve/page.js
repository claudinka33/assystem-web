import { supabaseAdmin } from "@/lib/supabase-server";
import { shraniNastavitve } from "@/lib/akcije/skupno";

export const dynamic = "force-dynamic";

export default async function Nastavitve() {
  const { data } = await supabaseAdmin().from("nastavitve").select("*").order("kljuc");
  const seznam = data ?? [];

  return (
    <>
      <div className="adm-glava">
        <h1>Nastavitve</h1>
      </div>
      <div className="adm-telo">
        <form className="adm-obr" action={shraniNastavitve}>
          {seznam.map((n) => (
            <div className="adm-polje" key={n.kljuc}>
              <label htmlFor={n.kljuc}>{n.opis ?? n.kljuc}</label>
              <input id={n.kljuc} name={`n_${n.kljuc}`} type="text" defaultValue={n.vrednost ?? ""} />
              <p className="namig">ključ: {n.kljuc}</p>
            </div>
          ))}
          <button className="gumb" type="submit">
            Shrani nastavitve
          </button>
        </form>
      </div>
    </>
  );
}
