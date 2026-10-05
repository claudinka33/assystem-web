import Link from "next/link";
import NaslovStrani from "@/components/NaslovStrani";
import { PRAVNE } from "@/lib/pravno";

// Skupna postavitev za pravne strani (pogoji, dostava, odstop, reklamacije ...)

export default function PravnaStran({ pot, naslov, opis, veljaOd, children }) {
  return (
    <>
      <NaslovStrani oznaka="Pravno" naslov={naslov} opis={opis} />
      <section className="sec">
        <div className="w pravno">
          <article className="pravno-tx">
            {children}
            {veljaOd && <p className="pravno-velja">Veljavno od {veljaOd}.</p>}
          </article>
          <aside className="pravno-meni">
            <p>Pravne informacije</p>
            {PRAVNE.map((x) => (
              <Link key={x.pot} href={x.pot} className={x.pot === pot ? "on" : undefined}>
                {x.naziv}
              </Link>
            ))}
          </aside>
        </div>
      </section>
    </>
  );
}
