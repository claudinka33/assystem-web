"use client";

import { useState } from "react";

/* YouTube video, ki se naloži šele ob kliku (youtube-nocookie).
   Do klika ni piškotkov YouTuba in stran ostane hitra. */
export default function YouTubeVideo({ id, naslov }) {
  const [igra, setIgra] = useState(false);
  return (
    <div className="yt">
      {igra ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
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
