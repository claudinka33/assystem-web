import { supabaseAdmin } from "@/lib/supabase-server";
import { KLJUC_POPUP, razcleniPopup } from "@/lib/popup";
import ObrazecPopup from "./ObrazecPopup";

export const dynamic = "force-dynamic";

export default async function Popup() {
  const { data } = await supabaseAdmin().from("nastavitve").select("vrednost").eq("kljuc", KLJUC_POPUP).maybeSingle();
  const n = razcleniPopup(data?.vrednost);
  return (
    <>
      <div className="adm-glava">
        <div>
          <div className="adm-nad">Prodaja</div>
          <h1>Pop-up »Kupujete za podjetje?«</h1>
        </div>
        <a className="gumb siv" href="/?popup=1" target="_blank" rel="noreferrer">Predogled na strani ↗</a>
      </div>
      <div className="adm-telo">
        <p className="adm-namig" style={{ marginTop: 0 }}>
          Pop-up se obiskovalcu pokaže po izbranem času na strani (ne B2B kupcem in ne na izbranih straneh). Oddani kontakti pridejo v »Povpraševanja« (oznaka Pop-up B2B) in v Bazo kontaktov.
          Besedila se samodejno prevedejo v angleščino in nemščino.
        </p>
        <ObrazecPopup n={n} />
      </div>
    </>
  );
}
