import Image from "next/image";
import Link from "next/link";
import { ZNAMKE, ZNAMKE_INFO } from "@/lib/znamke";
import { skriteZnamke } from "@/lib/podatki";

const STEVNIK = { 1: "Ena znamka", 2: "Dve znamki", 3: "Tri znamke", 4: "Štiri znamke", 5: "Pet znamk" };

/* --------------------------------------------------------------
   Naše znamke (brez tistih, ki so v Admin → Znamke izklopljene). Isti blok na začetni
   strani in na straneh znamk (trenutna je označena »Ste tukaj«).
   -------------------------------------------------------------- */

const DODATNO = {
  ASfix: { podpis: "Pritrdilna tehnika", embalaza: "Škatle, vrečke z izveskom, police 1, 2 in 4 m" },
  ASco: { podpis: "Vijaki po DIN in ISO", embalaza: "Škatle, modre (ZnB) in zelene (INOX) vrečke, stojalo" },
  MUNGO: { podpis: "Vložki, sidra, kemične mase", embalaza: "Vrečke in škatle Mungo" },
  Silvermate: { podpis: "Lesni vijaki", embalaza: "Križ ali torx, cel ali delni navoj" },
  HAMMEX: { podpis: "Žeblji", embalaza: "Za ročno zabijanje in pnevmatske žebljalnike" },
};

export default async function DveZnamki({ trenutna, siv = true }) {
  const skrite = await skriteZnamke();
  const vidne = ZNAMKE.filter((k) => !skrite.includes(k));
  return (
    <section className={`sec${siv ? " grey" : ""}`}>
      <div className="w">
        <div className="st">
          <span>Naše znamke</span>
          <h2>{STEVNIK[vidne.length] ?? "Naše znamke"}, en dobavitelj</h2>
          <p>
            Pritrdilna tehnika, vijačno blago, lesni vijaki in žeblji pod znamkami, ki jih poznate — vse z enim naročilom,
            eno dobavo in enim računom.
          </p>
        </div>
        <div className="dz">
          {vidne.map((k) => {
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
