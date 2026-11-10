"use client";

import { useState } from "react";

/* Google zemljevid se naloži šele ob kliku, da brez privolitve
   ne pošiljamo podatkov Googlu (GDPR, ZEKom-2). */
export default function Zemljevid({ naslov, poizvedba }) {
  const [odprt, setOdprt] = useState(false);
  if (odprt) {
    return (
      <iframe
        title={`Zemljevid: ${naslov}`}
        src={`https://www.google.com/maps?q=${encodeURIComponent(poizvedba)}&z=15&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    );
  }
  return (
    <div className="zemljevid-zaklep">
      <button type="button" className="b b-d" onClick={() => setOdprt(true)}>
        Prikaži zemljevid
      </button>
      <p>Ob prikazu se zemljevid naloži z Google Zemljevidov, ki lahko uporabijo piškotke.</p>
    </div>
  );
}
