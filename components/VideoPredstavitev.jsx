"use client";

import { useEffect, useRef, useState } from "react";
import { prevedeno } from "@/lib/i18n/odjemalec";

/* Predstavitveni video podjetja: predvaja se takoj (brez zvoka, v zanki),
   z gumbom za vklop zvoka. Brskalniki samodejnega predvajanja z zvokom ne dovolijo. */
function VideoPredstavitev({ src, poster, naslov }) {
  const ref = useRef(null);
  const [zvok, setZvok] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, [src]);

  const vklopiZvok = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = false;
    v.loop = false;
    v.currentTime = 0;
    v.play().catch(() => {});
    setZvok(true);
  };

  return (
    <div className="vid-pred">
      <video
        ref={ref}
        src={src}
        poster={poster}
        title={naslov}
        aria-label={naslov}
        autoPlay
        muted
        loop
        playsInline
        controls={zvok}
        preload="auto"
      />
      {!zvok && (
        <button type="button" className="vid-pred-zvok" onClick={vklopiZvok}>
          <span aria-hidden="true" />
          Vklopi zvok in poglej od začetka
        </button>
      )}
    </div>
  );
}

export default prevedeno(VideoPredstavitev);
