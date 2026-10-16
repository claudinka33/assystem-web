import Link from "next/link";
import { supabaseAdmin, trenutniAdmin } from "@/lib/supabase-server";
import { Ikona } from "../AdminMeni";

export const dynamic = "force-dynamic";

async function prestej(tabela, filter) {
  try {
    let q = supabaseAdmin().from(tabela).select("id", { count: "exact", head: true });
    if (filter) q = q.eq(filter[0], filter[1]);
    const { count } = await q;
    return count ?? 0;
  } catch {
    return 0;
  }
}

async function zadnji(tabela, stolpci, red, n = 5) {
  try {
    const { data } = await supabaseAdmin().from(tabela).select(stolpci).order(red, { ascending: false }).limit(n);
    return data ?? [];
  } catch {
    return [];
  }
}

function cas(t) {
  if (!t) return "";
  return new Date(t).toLocaleString("sl-SI", { timeZone: "Europe/Ljubljana", day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" });
}

function eur(v) {
  return new Intl.NumberFormat("sl-SI", { style: "currency", currency: "EUR" }).format(Number(v) || 0);
}

function pozdrav() {
  const ura = Number(new Date().toLocaleString("en-GB", { timeZone: "Europe/Ljubljana", hour: "2-digit", hour12: false }));
  if (ura < 10) return "Dobro jutro";
  if (ura < 18) return "Dober dan";
  return "Dober večer";
}

export default async function NadzornaPlosca() {
  const admin = await trenutniAdmin();

  const [kategorij, izdelkov, artiklov, novihNarocil, b2bCaka, novihPovp, narocila, povprasevanja] = await Promise.all([
    prestej("kategorije"),
    prestej("izdelki"),
    prestej("artikli"),
    prestej("narocila", ["status", "novo"]),
    prestej("b2b_kupci", ["status", "caka_odobritev"]),
    prestej("povprasevanja", ["status", "novo"]),
    zadnji("narocila", "id, stevilka, kontakt_ime, skupaj, status, ustvarjeno", "id"),
    zadnji("povprasevanja", "id, ime, podjetje, status, ustvarjeno", "ustvarjeno"),
  ]);

  const caka = [
    { n: novihNarocil, naziv: "novih naročil", pot: "/admin/narocila", ikona: "narocila" },
    { n: b2bCaka, naziv: "B2B kupcev čaka odobritev", pot: "/admin/b2b", ikona: "b2b" },
    { n: novihPovp, naziv: "novih povpraševanj", pot: "/admin/povprasevanja", ikona: "povprasevanja" },
  ].filter((x) => x.n > 0);

  const ime = (admin?.ime ?? "").split(" ")[0];

  return (
    <>
      <div className="adm-glava">
        <div>
          <div className="adm-nad">Nadzorna plošča</div>
          <h1>{pozdrav()}{ime ? `, ${ime}` : ""}</h1>
        </div>
        <a className="gumb siv" href="/" target="_blank" rel="noreferrer">
          <Ikona ime="zunaj" size={15} /> Odpri spletno stran
        </a>
      </div>

      <div className="adm-telo">
        {caka.length > 0 ? (
          <div className="adm-pozornost">
            <b>Čaka na vas</b>
            {caka.map((x) => (
              <Link key={x.pot} href={x.pot} className="adm-pozornost-el">
                <Ikona ime={x.ikona} /> <strong>{x.n}</strong> {x.naziv} →
              </Link>
            ))}
          </div>
        ) : (
          <div className="adm-mirno">✓ Vse urejeno — ni novih naročil, povpraševanj ali B2B prijav.</div>
        )}

        <div className="adm-kartice">
          <Link href="/admin/kategorije" className="adm-kartica">
            <span className="ik"><Ikona ime="kategorije" size={20} /></span>
            <b>{kategorij}</b>
            <span>Kategorij</span>
          </Link>
          <Link href="/admin/izdelki" className="adm-kartica">
            <span className="ik"><Ikona ime="izdelki" size={20} /></span>
            <b>{izdelkov}</b>
            <span>Izdelkov</span>
          </Link>
          <Link href="/admin/sinhronizacija" className="adm-kartica">
            <span className="ik"><Ikona ime="sinhro" size={20} /></span>
            <b>{artiklov.toLocaleString("sl-SI")}</b>
            <span>Artiklov s šifro</span>
          </Link>
          <Link href="/admin/povprasevanja" className={`adm-kartica${novihPovp ? " vroca" : ""}`}>
            <span className="ik"><Ikona ime="povprasevanja" size={20} /></span>
            <b>{novihPovp}</b>
            <span>Novih povpraševanj</span>
          </Link>
        </div>

        <h2 className="adm-naslov">Hitra dejanja</h2>
        <div className="adm-hitro">
          <Link href="/admin/izdelki/nov"><Ikona ime="izdelki" /> Nov izdelek</Link>
          <Link href="/admin/kategorije/nova"><Ikona ime="kategorije" /> Nova kategorija</Link>
          <Link href="/admin/novice/nova"><Ikona ime="novice" /> Nova novica</Link>
          <Link href="/admin/e-novice"><Ikona ime="mail" /> Pošlji e-novice</Link>
          <Link href="/admin/delovna-mesta/novo"><Ikona ime="delo" /> Novo delovno mesto</Link>
          <Link href="/admin/vsebine"><Ikona ime="besedila" /> Uredi besedila</Link>
        </div>

        <div className="adm-dva">
          <section className="adm-panel">
            <header>
              <h2>Zadnja naročila</h2>
              <Link href="/admin/narocila">Vsa →</Link>
            </header>
            {narocila.length === 0 ? (
              <p className="prazno">Naročil še ni.</p>
            ) : (
              <ul>
                {narocila.map((n) => (
                  <li key={n.id}>
                    <div>
                      <b>{n.stevilka}</b>
                      <small>{n.kontakt_ime} · {cas(n.ustvarjeno)}</small>
                    </div>
                    <span className="desno">
                      {eur(n.skupaj)}
                      <span className={n.status === "novo" ? "znacka novo" : "znacka ne"}>{n.status}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="adm-panel">
            <header>
              <h2>Zadnja povpraševanja</h2>
              <Link href="/admin/povprasevanja">Vsa →</Link>
            </header>
            {povprasevanja.length === 0 ? (
              <p className="prazno">Povpraševanj še ni.</p>
            ) : (
              <ul>
                {povprasevanja.map((p) => (
                  <li key={p.id}>
                    <div>
                      <b>{p.ime}</b>
                      <small>{p.podjetje ? `${p.podjetje} · ` : ""}{cas(p.ustvarjeno)}</small>
                    </div>
                    <span className={p.status === "novo" ? "znacka novo" : "znacka ne"}>{p.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {kategorij === 0 && (
          <div className="opozorilo" style={{ marginTop: 28 }}>
            Baza je še prazna. Začni s kategorijami — izdelek se veže na kategorijo,
            artikel pa na izdelek.
          </div>
        )}
      </div>
    </>
  );
}
