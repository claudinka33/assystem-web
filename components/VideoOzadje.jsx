"use client";

import { useEffect, useRef } from "react";
import { prevedeno } from "@/lib/i18n/odjemalec";

/* Video v ozadju glave: lasten MP4 (brez YouTuba), predvaja se takoj,
   brez zvoka in v zanki. Ob »zmanjšanem gibanju« ostane samo slika (poster). */
function VideoOzadje({ src, poster, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      return;
    }
    // »muted« mora biti lastnost, sicer brskalnik zavrne samodejno predvajanje
    v.muted = true;
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, [src]);

  return (
    <video
      ref={ref}
      className={`vid-oz ${className}`}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}

export default prevedeno(VideoOzadje);
