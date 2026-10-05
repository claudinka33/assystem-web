import Link from "next/link";
import PravnaStran from "@/components/PravnaStran";
import { site } from "@/lib/site";
import { VELJA_OD, eur0 } from "@/lib/pravno";

export const metadata = {
  title: "Dostava in pošiljanje",
  description: "Dostava s Pošto Slovenije, brezplačna dostava nad 100 €, osebni prevzem v Šmarju pri Jelšah.",
  alternates: { canonical: "/dostava" },
};

export default function Dostava() {
  const t = site.trgovina;
  return (
    <PravnaStran pot="/dostava" naslov="Dostava in pošiljanje" opis={`Brezplačna dostava za naročila nad ${eur0(t.brezplacnoNad)}.`} veljaOd={VELJA_OD}>
      <h2>Načini in stroški dostave</h2>
      <table>
        <thead>
          <tr><th>Način</th><th>Cena</th><th>Opomba</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><b>Pošta Slovenije</b></td>
            <td>glede na težo paketa<br />brezplačno nad {eur0(t.brezplacnoNad)}</td>
            <td>Dostava na naslov v Sloveniji. Mogoče je plačilo po povzetju.</td>
          </tr>
          <tr>
            <td><b>Osebni prevzem</b></td>
            <td>brezplačno</td>
            <td>Šmarje pri Jelšah, {site.lokacije[0].naslov.split(",")[0]}. Pon–pet, 7.00–15.00, ko vas obvestimo, da je naročilo pripravljeno.</td>
          </tr>
        </tbody>
      </table>
      <p>
        Poštnina se izračuna glede na skupno težo paketa po ceniku Pošte Slovenije in je pred oddajo naročila prikazana na
        blagajni. Meja za brezplačno dostavo velja za vrednost blaga z DDV v enem naročilu. Za zelo težka naročila (nad
        30 kg) vas pred odpremo kontaktiramo glede načina dostave.
      </p>

      <h2>Kam dostavljamo</h2>
      <p>Prek spletne trgovine dostavljamo v Sloveniji. Za dostavo v tujino nam pišite na {site.emailProdaja}.</p>

      <h2>Roki</h2>
      <ul>
        <li>Izdelke na zalogi odpremimo {t.odprema}; pri plačilu po predračunu po prejemu plačila.</li>
        <li>{t.dostavaPosta}.</li>
        <li>Za izdelke, ki so dobavljivi po naročilu, vam dobavni rok sporočimo po e-pošti.</li>
        <li>Naročilo dostavimo najkasneje v 30 dneh od sklenitve pogodbe, razen če se dogovorimo drugače.</li>
      </ul>
      <p>Ob odpremi vas obvestimo po e-pošti; po možnosti vam pošljemo tudi številko za sledenje pošiljki.</p>

      <h2>Prevzem pošiljke</h2>
      <p>
        Ob prevzemu preverite, ali je paket nepoškodovan. Če je embalaža vidno poškodovana, to zabeležite v zapisnik pri
        dostavljavcu ali paketa ne prevzemite in nas čim prej obvestite. Tveganje za izgubo ali poškodbo blaga preide na
        kupca, ko blago prevzame.
      </p>
      <p>
        Če pošiljke ne prevzamete v roku hrambe na pošti, se vrne k nam. Za ponovno pošiljanje vas prosimo za ponovno
        plačilo poštnine.
      </p>
      <p>
        Več o naročanju v <Link href="/splosni-pogoji">Splošnih pogojih poslovanja</Link>.
      </p>
    </PravnaStran>
  );
}
