"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const KLJUC = "as_privolitev";
const GA = process.env.NEXT_PUBLIC_GA_ID;
const PIXEL = process.env.NEXT_PUBLIC_META_PIXEL_ID;

// Odpre pasico za spremembo odločitve (gumb v nogi in plavajoča ikona).
export const ODPRI_PISKOTKE = "as-piskotki-odpri";

// Shranjena odločitev: { analitika: bool, oglasi: bool }.
// Starejši zapisi ("sprejeto" / "zavrnjeno") se pretvorijo.
function preberi() {
  try {
    const v = window.localStorage.getItem(KLJUC);
    if (!v) return null;
    if (v === "sprejeto") return { analitika: true, oglasi: true };
    if (v === "zavrnjeno") return { analitika: false, oglasi: false };
    const o = JSON.parse(v);
    return { analitika: !!o.analitika, oglasi: !!o.oglasi };
  } catch {
    return null;
  }
}

// Merilni skripti se naložijo šele po privolitvi (GDPR, ZEKom-2).
// Gumbi so enako poudarjeni, da noben ne namiguje na »sprejmi vse«.
export default function Merjenje() {
  const [izbira, setIzbira] = useState(undefined); // undefined = še ne vemo, null = ni odločitve
  const [odprto, setOdprto] = useState(false);
  const [nastavitve, setNastavitve] = useState(false);
  const [osnutek, setOsnutek] = useState({ analitika: false, oglasi: false });

  useEffect(() => {
    const v = preberi();
    setIzbira(v);
    if (!v) setOdprto(true);
    function odpri() {
      const t = preberi();
      setOsnutek(t ?? { analitika: false, oglasi: false });
      setNastavitve(true);
      setOdprto(true);
    }
    window.addEventListener(ODPRI_PISKOTKE, odpri);
    return () => window.removeEventListener(ODPRI_PISKOTKE, odpri);
  }, []);

  function shrani(v) {
    const prej = preberi();
    try {
      window.localStorage.setItem(KLJUC, JSON.stringify(v));
    } catch {}
    setIzbira(v);
    setOdprto(false);
    setNastavitve(false);
    // preklic že naloženih skriptov zahteva ponovno nalaganje strani
    if (prej && ((prej.analitika && !v.analitika) || (prej.oglasi && !v.oglasi))) window.location.reload();
  }

  const analitika = !!izbira?.analitika;
  const oglasi = !!izbira?.oglasi;

  return (
    <>
      {analitika && GA && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} strategy="afterInteractive" />
          <Script id="ga" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA}', { anonymize_ip: true });`}
          </Script>
        </>
      )}

      {oglasi && PIXEL && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
            document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init','${PIXEL}');fbq('track','PageView');`}
        </Script>
      )}

      {/* Plavajoča ikona za spremembo odločitve */}
      {izbira && !odprto && (
        <button
          type="button"
          className="piskotki-ikona"
          aria-label="Nastavitve piškotkov"
          title="Nastavitve piškotkov"
          onClick={() => window.dispatchEvent(new Event(ODPRI_PISKOTKE))}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5Zm-3.5 8a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm-5 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm-2-11a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"
            />
          </svg>
        </button>
      )}

      {izbira !== undefined && odprto && (
        <div className="piskotki" role="dialog" aria-label="Piškotki">
          <div className="piskotki-tx">
            <b>Piškotki</b>
            <p>
              Nujni piškotki skrbijo za delovanje strani in košarice. Analitične in oglaševalske piškotke uporabimo
              samo, če jih dovolite. Več v <a href="/zasebnost">politiki zasebnosti</a>.
            </p>

            {nastavitve && (
              <div className="piskotki-izbira">
                <label>
                  <input type="checkbox" checked disabled />
                  <span>
                    <b>Nujni</b> Delovanje strani, košarica in prijava. Vedno vključeni.
                  </span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={osnutek.analitika}
                    onChange={(e) => setOsnutek({ ...osnutek, analitika: e.target.checked })}
                  />
                  <span>
                    <b>Analitični</b> Google Analytics: koliko obiskovalcev imamo in katere strani berejo.
                  </span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={osnutek.oglasi}
                    onChange={(e) => setOsnutek({ ...osnutek, oglasi: e.target.checked })}
                  />
                  <span>
                    <b>Oglaševalski</b> Meta Pixel: merjenje učinka oglasov na Facebooku in Instagramu.
                  </span>
                </label>
              </div>
            )}
          </div>

          <div className="piskotki-gumbi">
            <button type="button" className="b b-d" onClick={() => shrani({ analitika: false, oglasi: false })}>
              Zavrni vse
            </button>
            {nastavitve ? (
              <button type="button" className="b b-d" onClick={() => shrani(osnutek)}>
                Shrani izbiro
              </button>
            ) : (
              <button
                type="button"
                className="b b-d"
                onClick={() => {
                  setOsnutek(izbira ?? { analitika: false, oglasi: false });
                  setNastavitve(true);
                }}
              >
                Nastavitve
              </button>
            )}
            <button type="button" className="b b-d" onClick={() => shrani({ analitika: true, oglasi: true })}>
              Sprejmi vse
            </button>
          </div>
        </div>
      )}
    </>
  );
}
