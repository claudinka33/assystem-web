"use client";

import { useState } from "react";

/* YouTube video, ki se naloži šele ob kliku (youtube-nocookie).
   Do klika ni piškotkov YouTuba in stran ostane hitra. */
// samodejno: video se takoj predvaja v tišini (brez zvoka) in se ponavlja.
export default function YouTubeVideo({ id, naslov, samodejno = false }) {
  const [igra, setIgra] = useState(samodejno);
  return (
    <div className="yt">
      {igra ? (
        <iframe
          src={
            samodejno
              ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&playsinline=1&rel=0&modestbranding=1`
              : `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`
          }
          title={naslov}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setIgra(true)} aria-label={`Predvajaj video: ${naslov}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" />
          <span className="yt-gumb" aria-hidden="true" />
          <span className="yt-opomba">Ob predvajanju se video naloži z YouTuba.</span>
        </button>
      )}
    </div>
  );
}
