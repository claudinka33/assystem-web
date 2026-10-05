import Link from "next/link";
import PravnaStran from "@/components/PravnaStran";
import { site } from "@/lib/site";
import { VELJA_OD } from "@/lib/pravno";

export const metadata = {
  title: "Varstvo osebnih podatkov",
  description: "Kako AS system d.o.o. ravna z osebnimi podatki kupcev in obiskovalcev spletne strani.",
  alternates: { canonical: "/zasebnost" },
  robots: { index: true, follow: true },
};

export default function Zasebnost() {
  return (
    <PravnaStran pot="/zasebnost" naslov="Varstvo osebnih podatkov" opis="Kako ravnamo s podatki, ki nam jih zaupate." veljaOd={VELJA_OD}>
      <h2>Upravljavec</h2>
      <p>
        Upravljavec osebnih podatkov je {site.podjetje.polnoIme}, {site.podjetje.naslov}. Za vprašanja o osebnih podatkih
        pišite na <b>{site.email}</b>. Podatke obdelujemo v skladu s Splošno uredbo o varstvu podatkov (GDPR) in Zakonom o
        varstvu osebnih podatkov (ZVOP-2).
      </p>

      <h2>Katere podatke obdelujemo in zakaj</h2>
      <table className="mob-kartice">
        <thead>
          <tr><th>Namen</th><th>Podatki</th><th>Pravna podlaga</th><th>Hramba</th></tr>
        </thead>
        <tbody>
          <tr>
            <td className="mk-gl">Izvedba naročila, dostava, račun</td>
            <td data-l="Podatki">ime, naslov, e-naslov, telefon, podjetje, naročeni izdelki, način plačila</td>
            <td data-l="Pravna podlaga">pogodba (čl. 6(1)(b) GDPR)</td>
            <td data-l="Hramba">do izteka zastaralnih rokov oziroma do konca jamstva</td>
          </tr>
          <tr>
            <td className="mk-gl">Računovodstvo in davki</td>
            <td data-l="Podatki">podatki na računu</td>
            <td data-l="Pravna podlaga">zakonska obveznost (čl. 6(1)(c) GDPR, ZDDV-1)</td>
            <td data-l="Hramba">10 let po letu izdaje računa</td>
          </tr>
          <tr>
            <td className="mk-gl">Povpraševanja prek obrazcev</td>
            <td data-l="Podatki">ime, e-naslov, telefon, podjetje, sporočilo</td>
            <td data-l="Pravna podlaga">ukrepi pred sklenitvijo pogodbe, zakoniti interes</td>
            <td data-l="Hramba">2 leti od zadnjega stika</td>
          </tr>
          <tr>
            <td className="mk-gl">Prijave na delovna mesta</td>
            <td data-l="Podatki">podatki iz prijave in življenjepis</td>
            <td data-l="Pravna podlaga">privolitev, ukrepi pred sklenitvijo pogodbe</td>
            <td data-l="Hramba">1 leto</td>
          </tr>
          <tr>
            <td className="mk-gl">Merjenje obiska in oglaševanje</td>
            <td data-l="Podatki">piškotki in podobni identifikatorji</td>
            <td data-l="Pravna podlaga">privolitev (ZEKom-2)</td>
            <td data-l="Hramba">do preklica privolitve oziroma izteka piškotka</td>
          </tr>
        </tbody>
      </table>
      <p>Podatkov ne prodajamo in jih brez vaše privolitve ne uporabljamo za oglaševanje. Avtomatiziranega odločanja ne izvajamo.</p>

      <h2>Komu podatke posredujemo</h2>
      <ul>
        <li><b>Pošta Slovenije d.o.o.</b> — ime, naslov in telefon za dostavo pošiljke.</li>
        <li><b>Ponudniki, ki nam pomagajo pri delovanju strani</b> (obdelovalci po pogodbi): Supabase (baza podatkov v EU), Vercel (gostovanje), Resend (pošiljanje e-pošte), ponudnik našega poslovnega informacijskega sistema in računovodstva.</li>
        <li>Državni organi, kadar to zahteva zakon.</li>
      </ul>
      <p>
        Nekateri ponudniki imajo sedež v ZDA. Prenos podatkov poteka na podlagi okvira EU–ZDA za zasebnost podatkov ali
        standardnih pogodbenih klavzul Evropske komisije.
      </p>

      <h2>Piškotki</h2>
      <p>
        Nujni piškotki omogočajo delovanje strani in košarice. Merilne in oglaševalske piškotke (Google Analytics, Meta)
        naložimo šele, ko jim v pasici privolite. Privolitev lahko kadar koli prekličete tako, da v brskalniku izbrišete
        piškotke za to stran; ob naslednjem obisku vas pasica znova vpraša.
      </p>

      <h2>Vaše pravice</h2>
      <p>
        Kadar koli lahko zahtevate dostop do svojih podatkov, popravek, izbris, omejitev obdelave ali prenos podatkov ter
        ugovarjate obdelavi na podlagi zakonitega interesa. Privolitev lahko kadar koli prekličete. Zahtevo pošljite na{" "}
        {site.email}; odgovorimo najkasneje v enem mesecu.
      </p>
      <p>
        Če menite, da podatke obdelujemo nezakonito, lahko vložite pritožbo pri Informacijskem pooblaščencu RS, Dunajska
        cesta 22, 1000 Ljubljana, <a href="https://www.ip-rs.si" target="_blank" rel="noreferrer">www.ip-rs.si</a>.
      </p>
      <p>
        Glej tudi <Link href="/splosni-pogoji">Splošne pogoje poslovanja</Link>.
      </p>
    </PravnaStran>
  );
}
