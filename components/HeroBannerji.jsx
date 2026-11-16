"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import VideoOzadje from "@/components/VideoOzadje";
import { prevedeno } from "@/lib/i18n/odjemalec";

const CAS = 5000; // menjava bannerja na 5 s

/* Glava domače strani: bannerji, ki se menjajo vsakih 5 s.
   bannerji: [{ tip: "video" | "slika", oznaka, naslov, besedilo, gumbi: [{ naziv, pot, slog, zunanja }], video, poster, slika, alt, opomba }] */
function HeroBannerji({ bannerji = [] }) {
  const [i, setI] = useState(0);
  const [pavza, setPavza] = useState(false);
  const n = bannerji.length;

  useEffect(() => {
    if (n < 2 || pavza) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI((x) => (x + 1) % n), CAS);
    return () => clearTimeout(t);
  }, [i, n, pavza]);

  if (!n) return null;

  return (
    <div
      className="hb"
      onMouseEnter={() => setPavza(true)}
      onMouseLeave={() => setPavza(false)}
      onFocus={() => setPavza(true)}
      onBlur={() => setPavza(false)}
      aria-roledescription="carousel"
    >
      {bannerji.map((b, k) => {
        const Naslov = k === 0 ? "h1" : "h2";
        return (
          <section
            key={k}
            className={`hero hb-sl${b.tip === "video" ? " hero-video" : ""}${k === i ? " on" : ""}`}
            aria-hidden={k === i ? undefined : "true"}
            inert={k === i ? undefined : true}
          >
            {b.tip === "video" && (
              <>
                <VideoOzadje src={b.video} poster={b.poster} />
                <div className="vid-tema" aria-hidden="true" />
              </>
            )}
            <div className="w">
              <div>
                {b.oznaka && <span className="kick">{b.oznaka}</span>}
                <Naslov className="hb-naslov">{b.naslov}</Naslov>
                {b.besedilo && <p>{b.besedilo}</p>}
                {b.gumbi?.length > 0 && (
                  <div className="acts">
                    {b.gumbi.map((g) =>
                      g.slog === "video" ? (
                        <a key={g.naziv} className="b-video" href={g.pot} target="_blank" rel="noopener noreferrer">
                          <span aria-hidden="true" />
                          {g.naziv}
                        </a>
                      ) : (
                        <Link key={g.naziv} className={`b ${g.slog === "obroba" ? "b-o" : g.slog === "rdec" ? "b-r" : "b-w"}`} href={g.pot}>
                          {g.naziv}
                        </Link>
                      )
                    )}
                  </div>
                )}
              </div>
              {b.tip === "slika" && b.slika && (
                <div className="hero-im">
                  <Image
                    src={b.slika}
                    alt={b.alt ?? ""}
                    width={b.sirina ?? 1100}
                    height={b.visina ?? 1044}
                    priority={k === 0}
                    sizes="(max-width: 1000px) 100vw, 640px"
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              )}
            </div>
            {b.opomba && (
              <div className="vid-oznaka" aria-hidden="true">
                {b.opomba}
              </div>
            )}
          </section>
        );
      })}

      {n > 1 && (
        <div className="hb-nadzor">
          <button type="button" className="hb-puscica" aria-label="Prejšnji banner" onClick={() => setI((x) => (x - 1 + n) % n)}>
            ‹
          </button>
          {bannerji.map((b, k) => (
            <button
              key={k}
              type="button"
              className={k === i ? "hb-pika on" : "hb-pika"}
              aria-label={`Banner ${k + 1}: ${b.naslov}`}
              aria-current={k === i ? "true" : undefined}
              onClick={() => setI(k)}
            />
          ))}
          <button type="button" className="hb-puscica" aria-label="Naslednji banner" onClick={() => setI((x) => (x + 1) % n)}>
            ›
          </button>
        </div>
      )}
    </div>
  );
}

export default prevedeno(HeroBannerji);
