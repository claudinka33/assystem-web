"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import VideoOzadje from "@/components/VideoOzadje";
import { prevedeno } from "@/lib/i18n/odjemalec";

const CAS = 5000; // menjava bannerja na 5 s

/* Glava domače strani: bannerji, ki se menjajo vsakih 5 s.
   bannerji: [{ tip: "video" | "slika", oznaka, naslov, besedilo, gumbi: [{ naziv, pot, slog, zunanja }], video, poster, slika, alt, opomba }] */
/* Prikaz B2B portala: cenik podjetja, hitro naročanje, status naročila */
function B2bZaslon() {
  const vrstice = [
    ["Jekleno sidro TXH7 10x90", "1.200 kos", "−22 %"],
    ["Udarni vijak 6x60", "5.000 kos", "−18 %"],
    ["Zidni vložek MQ 8x40", "10.000 kos", "−25 %"],
  ];
  return (
    <div className="b2bz" aria-hidden="true">
      <div className="b2bz-vrh">
        <i /><i /><i />
        <span>B2B portal · as-system.si</span>
      </div>
      <div className="b2bz-tel">
        <div className="b2bz-gl">
          <b>Vaš cenik</b>
          <em>Podjetje d.o.o.</em>
        </div>
        <div className="b2bz-isci">Hitro naročilo po šifri …</div>
        {vrstice.map(([n, k, p]) => (
          <div className="b2bz-vr" key={n}>
            <span>{n}</span>
            <span>{k}</span>
            <b>{p}</b>
            <i>+</i>
          </div>
        ))}
        <div className="b2bz-spodaj">
          <span>✓ Naročilo odpremljeno</span>
          <span>Plačilo na račun · 30 dni</span>
        </div>
      </div>
    </div>
  );
}

function HeroBannerji({ bannerji = [], h1 = true }) {
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
        const Naslov = h1 && k === 0 ? "h1" : "h2";
        return (
          <section
            key={k}
            className={`hero hb-sl${b.tip === "video" ? " hero-video" : ""}${b.tip === "program" ? " hb-prog" : ""}${k === i ? " on" : ""}`}
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
              {b.tip === "b2b" && <B2bZaslon />}
              {b.tip === "program" && b.ploscice?.length > 0 && (
                <div className="hb-plosc">
                  {b.ploscice.map((p) => (
                    <Link key={p.pot} href={p.pot} className="hb-pl">
                      <span className="hb-pl-im">
                        {p.slika && (
                          <Image src={p.slika} alt={p.naziv ?? ""} fill sizes="160px" style={{ objectFit: "contain", padding: 10, mixBlendMode: "multiply" }} />
                        )}
                      </span>
                      <b>{p.naziv}</b>
                    </Link>
                  ))}
                </div>
              )}
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
