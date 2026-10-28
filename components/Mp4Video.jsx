"use client";

import { useEffect, useRef } from "react";

/* Lastni MP4 video (brez YouTuba): vedno v polni kakovosti, brez tujih logotipov.
   samodejno: predvaja se takoj, brez zvoka in v zanki (pravilo brskalnikov za autoplay). */
export default function Mp4Video({ src, poster, naslov, samodejno = true }) {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || !samodejno) return;
    // »muted« mora biti nastavljen kot lastnost, sicer brskalnik zavrne samodejno predvajanje
    v.muted = true;
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, [src, samodejno]);

  return (
    <div className="yt yt-mp4">
      <video
        ref={ref}
        src={src}
        poster={poster || undefined}
        title={naslov}
        aria-label={naslov}
        autoPlay={samodejno}
        muted
        loop={samodejno}
        playsInline
        controls={!samodejno}
        preload={samodejno ? "auto" : "metadata"}
      />
    </div>
  );
}
