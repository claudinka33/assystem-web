import { pridobiInstagramObjave } from "@/lib/instagram";

/* --------------------------------------------------------------
   Zadnje objave z Instagrama @assystem.si (domača stran, pred nogo).
   Če ni žetona ali objav, se sekcija ne pokaže.
   -------------------------------------------------------------- */
const PROFIL = "https://www.instagram.com/assystem.si/";

function IgIkona({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default async function InstagramObjave() {
  const objave = await pridobiInstagramObjave(16);
  if (!objave.length) return null;

  return (
    <section className="sec ig-sec" id="instagram">
      <div className="w">
        <div className="st row">
          <div>
            <span>Instagram · @assystem.si</span>
            <h2>Iz našega dela</h2>
            <p>Novi izdelki, montaže na terenu in utrinki iz proizvodnje v Šmarju in Bistrici ob Sotli.</p>
          </div>
          <a className="b b-r ig-sledi" href={PROFIL} target="_blank" rel="noreferrer">
            <IgIkona /> Sledite nam
          </a>
        </div>

        <div className="ig-mreza">
          {objave.map((o) => (
            <a key={o.id} className="ig-obj" href={o.povezava} target="_blank" rel="noreferrer" aria-label={o.opis ? o.opis.slice(0, 90) : "Objava na Instagramu"}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={o.slika} alt="" loading="lazy" />
              {o.tip === "VIDEO" && <i className="ig-znak ig-video" aria-hidden="true">▶</i>}
              {o.tip === "CAROUSEL_ALBUM" && <i className="ig-znak" aria-hidden="true">❐</i>}
              {o.opis && (
                <span className="ig-opis">
                  <span>{o.opis}</span>
                </span>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
