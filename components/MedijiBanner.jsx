import Image from "next/image";
import Link from "next/link";
import YouTubeVideo from "@/components/YouTubeVideo";

/* --------------------------------------------------------------
   Pas »VIDEO · LETAK · CERTIFIKAT« pod opisom izdelka (in na strani
   znamke). Pokažejo se samo ploščice, za katere imamo vsebino.
   video: { id, naslov } · letak: { url, slika, naziv } ·
   certifikat: { oznaka, url, opis }
   -------------------------------------------------------------- */
export default function MedijiBanner({ video, letak, certifikat, temno = false }) {
  if (!video && !letak && !certifikat) return null;
  return (
    <div className={`mediji${temno ? " temno" : ""}${video ? " z-videom" : ""}`}>
      {video && (
        <div className="medij medij-video">
          <span className="medij-oz">Video</span>
          <YouTubeVideo id={video.id} naslov={video.naslov} samodejno={video.samodejno !== false} />
          <p>{video.naslov}</p>
        </div>
      )}
      {letak && (
        <a className="medij medij-letak" href={letak.url} target="_blank" rel="noreferrer">
          <span className="medij-oz">Letak</span>
          <span className="medij-sl">
            {letak.slika ? (
              <Image src={letak.slika} alt={letak.naziv ?? "Letak"} fill sizes="260px" style={{ objectFit: "contain" }} />
            ) : (
              <span className="medij-ikona">PDF</span>
            )}
          </span>
          <b>{letak.naziv ?? "Letak"}</b>
          <em>Odpri PDF ↓</em>
        </a>
      )}
      {certifikat && (
        <Link className="medij medij-cert" href={certifikat.url} target={certifikat.url?.startsWith("http") || certifikat.url?.endsWith(".pdf") ? "_blank" : undefined}>
          <span className="medij-oz">Certifikat</span>
          <span className="medij-sl medij-eta">
            <span className="eta-kr">ETA</span>
            <b>{certifikat.oznaka}</b>
            <span className="eta-ce">CE</span>
          </span>
          <b>{certifikat.naslov ?? "Evropska tehnična ocena"}</b>
          <em>{certifikat.opis ?? "Odpri dokument ↓"}</em>
        </Link>
      )}
    </div>
  );
}
