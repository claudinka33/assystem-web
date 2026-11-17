"use client";
import { useEffect, useRef, useState } from "react";
import { prevedeno } from "@/lib/i18n/odjemalec";

/* Ena ploščica Instagram objave. Video se predvaja sam (brez zvoka, v zanki),
   ko je ploščica na zaslonu; ko gre z zaslona, se ustavi. Prenese se šele,
   ko je viden. Pri »manj gibanja« v sistemu se predvaja samo ob prehodu z miško. */
function IgPloscica({ o }) {
  const ref = useRef(null);
  const ovoj = useRef(null);
  // video (in njegov poster) se naloži šele, ko je ploščica blizu zaslona
  const [blizu, setBlizu] = useState(false);

  useEffect(() => {
    const a = ovoj.current;
    if (!a || !o.video) return;
    if (!("IntersectionObserver" in window)) { setBlizu(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setBlizu(true); io.disconnect(); } }, { rootMargin: "200px" });
    io.observe(a);
    return () => io.disconnect();
  }, [o.video]);

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
  }, [blizu]);

  const igraj = () => ref.current?.play().catch(() => {});

  return (
    <a
      ref={ovoj}
      className="ig-obj"
      href={o.povezava}
      target="_blank"
      rel="noreferrer"
      aria-label={o.opis ? o.opis.slice(0, 90) : "Objava na Instagramu"}
      onMouseEnter={o.video ? igraj : undefined}
    >
      {o.video && blizu ? (
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

export default prevedeno(IgPloscica);
