import Image from "next/image";
import Link from "next/link";

/* --------------------------------------------------------------
   Dve znamki, en dobavitelj — povezovalni blok na straneh ASfix
   in ASco. Obe znamki pokaže enakovredno, trenutno označi.
   Enaka zgradba logotipa (rdeč »AS« + ležeča končnica + podpis)
   in isti barvni sistem vrečk: rdeča ASfix, modra ZnB, zelena INOX.
   -------------------------------------------------------------- */

const ZNAMKI = [
  {
    id: "asfix",
    pot: "/asfix",
    logo: "/slike/znamke/asfix-logo-pozitiv.png",
    ime: "ASfix",
    podpis: "Pritrdilna tehnika",
    opis: "Jeklena sidra, zidni vložki, vložki za mavčne plošče, udarni in Turbo vijaki, kemične mase, perforiran trak.",
    vrecke: [["rdeca", "Rdeča vrečka"]],
    embalaza: "Škatle AFA / AFR, rdeče vrečke, police ASfix",
  },
  {
    id: "asco",
    pot: "/asco",
    logo: "/slike/znamke/asco-logo-pozitiv.png",
    ime: "ASco",
    podpis: "Vijaki po DIN in ISO",
    opis: "Kovinski vijaki, matice in podložke, samovrtni vijaki in vijaki za pločevino, lesni vijaki.",
    vrecke: [
      ["modra", "Modra vrečka · ZnB"],
      ["zelena", "Zelena vrečka · INOX"],
    ],
    embalaza: "Škatle, modre in zelene vrečke, stojalo ASco",
  },
];

export default function DveZnamki({ trenutna }) {
  return (
    <section className="sec grey">
      <div className="w">
        <div className="st">
          <span>Dve znamki, en dobavitelj</span>
          <h2>ASfix in ASco se dopolnjujeta</h2>
          <p>
            ASfix pokriva pritrdilno tehniko, ASco standardno vijačno blago. Obe znamki naročite pri AS system —
            trgovec ali izvajalec dobi sidra in vijake z enim naročilom, eno dobavo in enim računom.
          </p>
        </div>
        <div className="dz">
          {ZNAMKI.map((z) => {
            const tu = z.id === trenutna;
            return (
              <Link key={z.id} href={z.pot} className={`dz-k${tu ? " tu" : ""}`} aria-current={tu ? "page" : undefined}>
                <div className="dz-glava">
                  <Image src={z.logo} alt={z.ime} width={800} height={300} className="dz-logo" />
                  {tu && <em>Ste tukaj</em>}
                </div>
                <b>{z.podpis}</b>
                <p>{z.opis}</p>
                <ul className="dz-vrecke">
                  {z.vrecke.map(([barva, naziv]) => (
                    <li key={barva}>
                      <i className={barva} aria-hidden="true" />
                      {naziv}
                    </li>
                  ))}
                </ul>
                <small>{z.embalaza}</small>
                {!tu && <span className="dz-vec">Na stran {z.ime} →</span>}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
