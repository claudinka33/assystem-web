import Link from "next/link";
import PravnaStran from "@/components/PravnaStran";
import { site } from "@/lib/site";
import { VELJA_OD } from "@/lib/pravno";

export const metadata = {
  title: "Politika zasebnosti",
  description: "Kako AS system d.o.o. ravna z osebnimi podatki kupcev, poslovnih partnerjev in obiskovalcev spletne strani.",
  alternates: { canonical: "/zasebnost" },
  robots: { index: true, follow: true },
};

export default function Zasebnost() {
  const p = site.podjetje;
  return (
    <PravnaStran pot="/zasebnost" naslov="Politika zasebnosti" opis="Kako ravnamo z osebnimi podatki, ki nam jih zaupate." veljaOd={VELJA_OD}>
      <h2>1. Upravljavec</h2>
      <p>
        Upravljavec osebnih podatkov je {p.polnoIme}, {p.naslov}, matična številka {p.maticna}, ID za DDV {p.davcna}.
      </p>
      <p>
        Za vsa vprašanja o osebnih podatkih in za uveljavljanje pravic pišite na <b>{site.email}</b> ali pokličite{" "}
        {site.telefon}. Podatke obdelujemo v skladu s Splošno uredbo o varstvu podatkov (GDPR), Zakonom o varstvu osebnih
        podatkov (ZVOP-2) in Zakonom o elektronskih komunikacijah (ZEKom-2).
      </p>

      <h2>2. Katere podatke obdelujemo, za kaj in kako dolgo</h2>
      <table className="mob-kartice">
        <thead>
          <tr><th>Namen</th><th>Podatki</th><th>Pravna podlaga</th><th>Hramba</th></tr>
        </thead>
        <tbody>
          <tr>
            <td className="mk-gl">Spletno naročilo, dostava in račun</td>
            <td data-l="Podatki">ime in priimek, naslov, e-naslov, telefon, podjetje in davčna številka, naročeni izdelki, način plačila</td>
            <td data-l="Pravna podlaga">izvedba pogodbe (6(1)(b) GDPR)</td>
            <td data-l="Hramba">do izteka jamstva in zastaralnih rokov</td>
          </tr>
          <tr>
            <td className="mk-gl">Računovodstvo in davki</td>
            <td data-l="Podatki">podatki na računu</td>
            <td data-l="Pravna podlaga">zakonska obveznost (6(1)(c) GDPR, ZDDV-1)</td>
            <td data-l="Hramba">10 let po koncu leta izdaje računa</td>
          </tr>
          <tr>
            <td className="mk-gl">B2B uporabniški račun</td>
            <td data-l="Podatki">podjetje, davčna številka, poslovalnica, ime in e-naslov uporabnika, zgodovina naročil</td>
            <td data-l="Pravna podlaga">izvedba pogodbe (6(1)(b) GDPR)</td>
            <td data-l="Hramba">dokler je račun aktiven, nato do izteka zastaralnih rokov</td>
          </tr>
          <tr>
            <td className="mk-gl">Povpraševanja in obrazci</td>
            <td data-l="Podatki">ime, e-naslov, telefon, podjetje, vsebina sporočila, priponke</td>
            <td data-l="Pravna podlaga">ukrepi pred sklenitvijo pogodbe in zakoniti interes (6(1)(b) in (f) GDPR)</td>
            <td data-l="Hramba">2 leti od zadnjega stika</td>
          </tr>
          <tr>
            <td className="mk-gl">Prijave na delovna mesta</td>
            <td data-l="Podatki">podatki iz prijave in življenjepis</td>
            <td data-l="Pravna podlaga">privolitev (6(1)(a) GDPR)</td>
            <td data-l="Hramba">do konca izbirnega postopka, s privolitvijo največ 1 leto</td>
          </tr>
          <tr>
            <td className="mk-gl">E-novice</td>
            <td data-l="Podatki">e-naslov, ime (neobvezno), panoga, odpiranje sporočil in kliki</td>
            <td data-l="Pravna podlaga">privolitev (6(1)(a) GDPR)</td>
            <td data-l="Hramba">do odjave</td>
          </tr>
          <tr>
            <td className="mk-gl">Analitika in oglaševanje</td>
            <td data-l="Podatki">piškotki in podobni identifikatorji, podatki o ogledih strani</td>
            <td data-l="Pravna podlaga">privolitev (ZEKom-2, 6(1)(a) GDPR)</td>
            <td data-l="Hramba">do preklica privolitve oziroma izteka piškotka</td>
          </tr>
          <tr>
            <td className="mk-gl">Lastna statistika obiska</td>
            <td data-l="Podatki">obiskana stran, država, vrsta naprave in dnevni anonimni odtis (IP naslova ne shranimo, piškotkov ne uporabljamo)</td>
            <td data-l="Pravna podlaga">zakoniti interes (6(1)(f) GDPR)</td>
            <td data-l="Hramba">največ 2 leti</td>
          </tr>
        </tbody>
      </table>
      <p>Podatkov ne prodajamo. Avtomatiziranega odločanja s pravnimi učinki ne izvajamo.</p>

      <h2>3. Profiliranje za e-novice</h2>
      <p>
        Prejemnike e-novic razvrstimo po panogi (na primer inštalaterji, gradbeništvo, lesarstvo, trgovine), da vsak
        prejme vsebine, ki so zanj uporabne. Panogo izberete sami ob prijavi ali pa jo poznamo iz poslovnega sodelovanja.
        Razvrščanju lahko kadar koli ugovarjate ali se odjavite z e-novic prek povezave v vsakem sporočilu.
      </p>

      <h2>4. Komu podatke posredujemo</h2>
      <p>Podatke posredujemo samo, kadar je to potrebno za namen iz točke 2:</p>
      <ul>
        <li><b>Pošta Slovenije d.o.o.</b>: ime, naslov in telefon za dostavo pošiljke.</li>
        <li><b>Ponudniki plačil</b> (Stripe, PayPal): podatki, potrebni za izvedbo plačila s kartico ali prek PayPala.</li>
        <li>
          <b>Obdelovalci po pogodbi</b>: Supabase (baza podatkov, strežniki v EU), Vercel (gostovanje strani), Resend
          (pošiljanje e-pošte in e-novic), Google (Google Analytics, Google Zemljevidi), Meta (Meta Pixel) ter ponudnik našega
          poslovnega informacijskega sistema in računovodstva.
        </li>
        <li>Državni organi, kadar to zahteva zakon.</li>
      </ul>

      <h2>5. Prenos podatkov v tretje države</h2>
      <p>
        Nekateri ponudniki imajo sedež v ZDA, zato se lahko vaši podatki prenesejo izven Evropske unije:
      </p>
      <ul>
        <li><b>Google LLC</b> (ZDA): Google Analytics in Google Zemljevidi.</li>
        <li><b>Meta Platforms Inc.</b> (ZDA): Meta Pixel za merjenje oglasov na Facebooku in Instagramu.</li>
        <li><b>Vercel Inc.</b> (ZDA): gostovanje spletne strani.</li>
        <li><b>Resend Inc.</b> (ZDA): pošiljanje e-pošte.</li>
        <li><b>Stripe in PayPal</b> (ZDA): izvedba spletnih plačil.</li>
      </ul>
      <p>
        Prenos poteka na podlagi okvira EU–ZDA za zasebnost podatkov (Data Privacy Framework) oziroma standardnih
        pogodbenih klavzul Evropske komisije. Podatke za Google Analytics in Meta Pixel prenesemo samo, če piškotkom privolite.
      </p>

      <h2>6. Piškotki</h2>
      <table className="mob-kartice">
        <thead>
          <tr><th>Piškotek</th><th>Vrsta</th><th>Namen</th><th>Trajanje</th></tr>
        </thead>
        <tbody>
          <tr>
            <td className="mk-gl">as_privolitev</td>
            <td data-l="Vrsta">nujni</td>
            <td data-l="Namen">shrani vašo odločitev o piškotkih</td>
            <td data-l="Trajanje">do izbrisa v brskalniku</td>
          </tr>
          <tr>
            <td className="mk-gl">košarica, sb-…</td>
            <td data-l="Vrsta">nujni</td>
            <td data-l="Namen">vsebina košarice in prijava v B2B račun</td>
            <td data-l="Trajanje">do odjave oziroma izbrisa</td>
          </tr>
          <tr>
            <td className="mk-gl">_ga, _ga_*</td>
            <td data-l="Vrsta">analitični (Google)</td>
            <td data-l="Namen">štetje obiskovalcev in ogledov strani</td>
            <td data-l="Trajanje">do 2 leti</td>
          </tr>
          <tr>
            <td className="mk-gl">_fbp</td>
            <td data-l="Vrsta">oglaševalski (Meta)</td>
            <td data-l="Namen">merjenje učinka oglasov</td>
            <td data-l="Trajanje">3 mesece</td>
          </tr>
        </tbody>
      </table>
      <p>
        Ob prvem obisku se odločite, katere piškotke dovolite. Odločitev lahko kadar koli spremenite s klikom na ikono
        piškotka v spodnjem levem kotu ali na povezavo »Nastavitve piškotkov« na dnu strani.
      </p>

      <h2>7. Vaše pravice</h2>
      <p>Kadar koli lahko zahtevate:</p>
      <ul>
        <li>dostop do svojih podatkov in kopijo podatkov,</li>
        <li>popravek netočnih podatkov,</li>
        <li>izbris podatkov, kadar jih ne potrebujemo več ali ni podlage za obdelavo,</li>
        <li>omejitev obdelave in prenos podatkov k drugemu upravljavcu,</li>
        <li>ugovor obdelavi na podlagi zakonitega interesa in profiliranju,</li>
        <li>preklic privolitve, ne da bi to vplivalo na zakonitost obdelave pred preklicem.</li>
      </ul>
      <p>Zahtevo pošljite na {site.email}. Odgovorimo najkasneje v enem mesecu.</p>

      <h2>8. Pritožba</h2>
      <p>
        Če menite, da podatke obdelujemo nezakonito, lahko vložite pritožbo pri Informacijskem pooblaščencu RS, Dunajska
        cesta 22, 1000 Ljubljana, <a href="https://www.ip-rs.si" target="_blank" rel="noreferrer">www.ip-rs.si</a>.
      </p>

      <h2>9. Spremembe</h2>
      <p>
        Politiko zasebnosti po potrebi posodobimo. Veljavna različica je vedno objavljena na tej strani. Glej tudi{" "}
        <Link href="/splosni-pogoji">Splošne pogoje poslovanja</Link>.
      </p>
    </PravnaStran>
  );
}
