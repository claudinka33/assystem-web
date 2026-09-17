import Image from "next/image";
import { site } from "@/lib/site";

export const metadata = {
  title: "Spletna stran je v prenovi",
  description: "Spletna stran AS system je v prenovi. Dosegljivi smo po telefonu in e-pošti.",
  robots: { index: false, follow: false },
};

export default async function VPripravi({ searchParams }) {
  const params = await searchParams;
  const napaka = params?.napaka;

  return (
    <div className="zaklep">
      <div className="zaklep-box">
        <Image src="/logo-as-system.png" alt="AS system" width={336} height={159} priority />

        <span className="kick" style={{ marginTop: 26 }}>Spletna stran v prenovi</span>
        <h1>Kmalu na tem mestu</h1>
        <p>
          Prenavljamo spletno stran podjetja {site.ime}. Do takrat smo dosegljivi
          po telefonu in e-pošti — povpraševanja obdelujemo kot običajno.
        </p>

        <dl className="zaklep-stik">
          <div>
            <dt>Telefon</dt>
            <dd>
              <a href={`tel:${site.telefonRaw}`}>{site.telefon}</a>
            </dd>
          </div>
          <div>
            <dt>Prodaja</dt>
            <dd>
              <a href={`mailto:${site.emailProdaja}`}>{site.emailProdaja}</a>
            </dd>
          </div>
          <div>
            <dt>Zaposlitev</dt>
            <dd>
              <a href="mailto:zaposlitev@as-system.si">zaposlitev@as-system.si</a>
            </dd>
          </div>
        </dl>

        <form action="/api/vstop" method="post" className="zaklep-obr">
          {napaka && <p className="obr-napaka">Napačno geslo.</p>}
          <label htmlFor="geslo">Dostop za sodelavce</label>
          <div style={{ display: "flex", gap: 10 }}>
            <input id="geslo" name="geslo" type="password" placeholder="Geslo" autoComplete="current-password" />
            <button className="b b-r" type="submit">Vstopi</button>
          </div>
        </form>
      </div>
    </div>
  );
}
