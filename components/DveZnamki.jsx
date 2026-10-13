import Image from "next/image";
import Link from "next/link";
import { ZNAMKE, ZNAMKE_INFO } from "@/lib/znamke";

/* --------------------------------------------------------------
   Naše znamke — ASfix, ASco, Mungo, Silvermate. Isti blok na začetni
   strani in na straneh znamk (trenutna je označena »Ste tukaj«).
   -------------------------------------------------------------- */

const DODATNO = {
  ASfix: { podpis: "Pritrdilna tehnika", embalaza: "Škatle, vrečke z izveskom, police 1, 2 in 4 m" },
  ASco: { podpis: "Vijaki po DIN in ISO", embalaza: "Škatle, modre (ZnB) in zelene (INOX) vrečke, stojalo" },
  MUNGO: { podpis: "Vložki, sidra, kemične mase", embalaza: "Vrečke in škatle Mungo" },
  Silvermate: { podpis: "Lesni vijaki", embalaza: "Križ ali torx, cel ali delni navoj" },
};

export default function DveZnamki({ trenutna, siv = true }) {
  return (
    <section className={`sec${siv ? " grey" : ""}`}>
      <div className="w">
        <div className="st">
          <span>Naše znamke</span>
          <h2>Štiri znamke, en dobavitelj</h2>
          <p>
            Pritrdilna tehnika, vijačno blago in lesni vijaki pod znamkami, ki jih poznate — vse z enim naročilom,
            eno dobavo in enim računom.
          </p>
        </div>
        <div className="dz">
          {ZNAMKE.map((k) => {
            const z = ZNAMKE_INFO[k];
            const tu = k === trenutna;
            return (
              <Link key={k} href={z.pot} className={`dz-k${tu ? " tu" : ""}`} aria-current={tu ? "page" : undefined}>
                <div className="dz-glava">
                  <div className="dz-logo-ok">
                    <Image src={z.logo} alt={z.ime} width={z.w} height={z.h} className="dz-logo" />
                  </div>
                  {tu && <em>Ste tukaj</em>}
                </div>
                <b>{DODATNO[k].podpis}</b>
                <p>{z.opis}</p>
                <small>{DODATNO[k].embalaza}</small>
                {!tu && <span className="dz-vec">Več o znamki {z.ime} →</span>}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
