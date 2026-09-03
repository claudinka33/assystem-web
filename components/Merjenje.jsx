"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const KLJUC = "as_privolitev";
const GA = process.env.NEXT_PUBLIC_GA_ID;
const PIXEL = process.env.NEXT_PUBLIC_META_PIXEL_ID;

// Merilni skripti se naložijo šele po privolitvi. Brez tega bi kršili
// pravila o piškotkih, poleg tega bi Meta Pixel delal brez podlage.
export default function Merjenje() {
  const [privolitev, setPrivolitev] = useState(null);

  useEffect(() => {
    try {
      setPrivolitev(window.localStorage.getItem(KLJUC));
    } catch {
      setPrivolitev("zavrnjeno");
    }
  }, []);

  function shrani(vrednost) {
    try {
      window.localStorage.setItem(KLJUC, vrednost);
    } catch {}
    setPrivolitev(vrednost);
  }

  const sprejeto = privolitev === "sprejeto";

  return (
    <>
      {sprejeto && GA && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA}`}
            strategy="afterInteractive"
          />
          <Script id="ga" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA}', { anonymize_ip: true });`}
          </Script>
        </>
      )}

      {sprejeto && PIXEL && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
            document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init','${PIXEL}');fbq('track','PageView');`}
        </Script>
      )}

      {privolitev === null && (
        <div className="piskotki">
          <div>
            <b>Piškotki</b>
            <p>
              Nujne piškotke potrebujemo za delovanje strani. Z merilnimi
              piškotki spremljamo obisk in učinek oglasov. Več v{" "}
              <a href="/zasebnost">politiki zasebnosti</a>.
            </p>
          </div>
          <div className="piskotki-gumbi">
            <button type="button" className="b b-d" onClick={() => shrani("zavrnjeno")}>
              Samo nujni
            </button>
            <button type="button" className="b b-r" onClick={() => shrani("sprejeto")}>
              Sprejmi vse
            </button>
          </div>
        </div>
      )}
    </>
  );
}
