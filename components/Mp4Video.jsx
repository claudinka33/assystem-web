"use client";

import { useEffect, useRef, useState } from "react";
import { prevedeno } from "@/lib/i18n/odjemalec";

/* Lastni MP4 video (brez YouTuba): vedno v polni kakovosti, brez tujih logotipov.
   samodejno: predvaja se takoj, brez zvoka in v zanki (pravilo brskalnikov za autoplay). */
function Mp4Video({ src, poster, naslov, samodejno = true }) {
  const ref = useRef(null);
  // video se prenese šele, ko je blizu zaslona (hitrejše nalaganje strani)
  const [blizu, setBlizu] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (!("IntersectionObserver" in window)) { setBlizu(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setBlizu(true); io.disconnect(); } }, { rootMargin: "300px" });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v || !samodejno || !blizu) return;
    // »muted« mora biti nastavljen kot lastnost, sicer brskalnik zavrne samodejno predvajanje
    v.muted = true;
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, [src, samodejno, blizu]);

  return (
    <div className="yt yt-mp4">
      <video
        ref={ref}
        src={blizu ? src : undefined}
        poster={blizu ? poster || undefined : undefined}
        title={naslov}
        aria-label={naslov}
        autoPlay={samodejno && blizu}
        muted
        loop={samodejno}
        playsInline
        controls={!samodejno}
        preload={blizu ? (samodejno ? "auto" : "metadata") : "none"}
      />
    </div>
  );
}

export default prevedeno(Mp4Video);
