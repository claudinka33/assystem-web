"use client";
import { useEffect, useRef } from "react";

/* Ena ploščica Instagram objave. Video se predvaja sam (brez zvoka, v zanki),
   ko je ploščica na zaslonu; ko gre z zaslona, se ustavi. Prenese se šele,
   ko je viden. Pri »manj gibanja« v sistemu se predvaja samo ob prehodu z miško. */
export default function IgPloscica({ o }) {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const manjGibanja = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (manjGibanja || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.5 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const igraj = () => ref.current?.play().catch(() => {});

  return (
    <a
      className="ig-obj"
      href={o.povezava}
      target="_blank"
      rel="noreferrer"
      aria-label={o.opis ? o.opis.slice(0, 90) : "Objava na Instagramu"}
      onMouseEnter={o.video ? igraj : undefined}
    >
      {o.video ? (
        <video ref={ref} src={o.video} poster={o.slika} muted loop playsInline preload="none" aria-hidden="true" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={o.slika} alt="" loading="lazy" />
      )}
      {o.tip === "VIDEO" && <i className="ig-znak ig-video" aria-hidden="true">▶</i>}
      {o.tip === "CAROUSEL_ALBUM" && <i className="ig-znak" aria-hidden="true">❐</i>}
      {o.opis && (
        <span className="ig-opis">
          <span>{o.opis}</span>
        </span>
      )}
    </a>
  );
}
