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
        Podatke obdelujemo v skladu s Splošno uredbo o varstvu podatkov (GDPR), Zakonom o varstvu osebnih podatkov (ZVOP-2)
        in Zakonom o elektronskih komunikacijah (ZEKom-2).
      </p>

      <h2>2. Pooblaščena oseba za varstvo osebnih podatkov</h2>
      <p>
        Pooblaščena oseba za varstvo osebnih podatkov je <b>Sara Jagodič</b>,{" "}
        <a href="mailto:sara.jagodic@as-system.si">sara.jagodic@as-system.si</a>, telefon {site.telefon}. Nanjo se
        obrnite z vsemi vprašanji o osebnih podatkih in z zahtevami za uveljavljanje pravic.
      </p>

      <h2>3. Pravne podlage</h2>
      <p>Osebne podatke obdelujemo samo na eni od naslednjih pravnih podlag (člen 6(1) GDPR):</p>
      <ul>
        <li><b>Pogodba</b>: podatki so potrebni za izvedbo naročila ali poslovnega sodelovanja oziroma za ukrepe pred sklenitvijo pogodbe, na primer za odgovor na povpraševanje.</li>
        <li><b>Zakonska obveznost</b>: zakon nam nalaga hrambo podatkov, na primer računov po davčni zakonodaji.</li>
        <li><b>Zakoniti interes</b>: obdelava je potrebna za naše upravičene poslovne interese, ki ne prevladajo nad vašimi pravicami, na primer anonimna statistika obiska in obveščanje obstoječih strank o podobnih izdelkih.</li>
        <li><b>Privolitev</b>: podatke obdelujemo, ker ste v to privolili, na primer za e-novice, analitične in oglaševalske piškotke ter hrambo življenjepisa za prihodnje razpise. Privolitev lahko kadar koli prekličete.</li>
      </ul>

      <h2>4. Katere podatke obdelujemo, za kaj in kako dolgo</h2>
      <table className="mob-kartice">
        <thead>
          <tr><th>Namen</th><th>Podatki</th><th>Pravna podlaga</th><th>Hramba</th></tr>
        </thead>
        <tbody>
          <tr>
            <td className="mk-gl">Spletno naročilo, dostava in račun</td>
            <td data-l="Podatki">ime in priimek, naslov, e-naslov, telefon, podjetje in davčna številka, naročeni izdelki, način plačila</td>
            <td data-l="Pravna podlaga">pogodba (6(1)(b) GDPR)</td>
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
            <td data-l="Pravna podlaga">pogodba (6(1)(b) GDPR)</td>
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
            <td data-l="Pravna podlaga">ukrepi pred sklenitvijo pogodbe (6(1)(b) GDPR), za hrambo za prihodnje razpise privolitev (6(1)(a) GDPR)</td>
            <td data-l="Hramba">do konca izbirnega postopka, s privolitvijo največ 1 leto</td>
          </tr>
          <tr>
            <td className="mk-gl">E-novice za nove prijavljene</td>
            <td data-l="Podatki">e-naslov, ime (neobvezno), panoga, odpiranje sporočil in kliki</td>
            <td data-l="Pravna podlaga">privolitev (6(1)(a) GDPR)</td>
            <td data-l="Hramba">do odjave</td>
          </tr>
          <tr>
            <td className="mk-gl">E-novice za obstoječe poslovne stranke</td>
            <td data-l="Podatki">e-naslov, ime, podjetje, panoga</td>
            <td data-l="Pravna podlaga">zakoniti interes in 226. člen ZEKom-2: samo o podobnih izdelkih, z možnostjo odjave v vsakem sporočilu</td>
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

      <h2>5. Prijave na delovna mesta</h2>
      <p>
        Prijave in življenjepise uporabimo samo za izbirni postopek, za katerega ste se prijavili. Dostop do njih imajo
        kadrovska služba, direktor in vodja oddelka, za katerega iščemo sodelavca. Po zaključku postopka prijavo izbrišemo,
        razen če privolite, da jo hranimo za prihodnje razpise. V tem primeru jo hranimo največ 1 leto oziroma do preklica
        privolitve.
      </p>

      <h2>6. E-novice in razvrščanje po panogi</h2>
      <p>
        Novim prejemnikom e-novice pošiljamo na podlagi privolitve, ki jo dajo ob prijavi. Obstoječim poslovnim strankam
        lahko pošljemo obvestila o izdelkih, podobnih tistim, ki so jih že kupile, kar dovoljuje 226. člen ZEKom-2. Odjava
        je mogoča v vsakem sporočilu.
      </p>
      <p>
        Prejemnike razvrstimo po panogi (na primer inštalaterji, gradbeništvo, lesarstvo, trgovine), da vsak prejme
        vsebine, ki so zanj uporabne. Panogo izberete sami ob prijavi ali pa jo poznamo iz poslovnega sodelovanja.
        Razvrščanju lahko kadar koli ugovarjate.
      </p>

      <h2>7. Komu podatke posredujemo</h2>
      <p>Podatke posredujemo samo, kadar je to potrebno za namen iz točke 4:</p>
      <ul>
        <li><b>Pošta Slovenije d.o.o.</b>: ime, naslov in telefon za dostavo pošiljke.</li>
        <li><b>Ponudniki plačil</b> (Stripe, PayPal): podatki, potrebni za izvedbo plačila s kartico ali prek PayPala.</li>
        <li>
          <b>Obdelovalci</b>: Supabase (baza podatkov), Vercel (gostovanje strani), Resend (pošiljanje e-pošte in e-novic),
          Google (Google Analytics, Google Zemljevidi, YouTube), Meta (Meta Pixel) ter ponudniki našega poslovnega
          informacijskega sistema, računovodskih in IT storitev. Obdelovalci podatke obdelujejo samo po naših navodilih na
          podlagi pogodbe o obdelavi osebnih podatkov (člen 28 GDPR).
        </li>
        <li>Državni organi, kadar to zahteva zakon.</li>
      </ul>

      <h2>8. Prenos podatkov izven EGP</h2>
      <p>
        Nekateri ponudniki imajo sedež izven Evropskega gospodarskega prostora, zato se lahko podatki prenesejo v tretje
        države. Prenos poteka samo z ustreznimi varovalkami po poglavju V GDPR:
      </p>
      <table className="mob-kartice">
        <thead>
          <tr><th>Ponudnik</th><th>Sedež</th><th>Namen</th><th>Varovalka</th></tr>
        </thead>
        <tbody>
          <tr>
            <td className="mk-gl">Google LLC</td>
            <td data-l="Sedež">ZDA</td>
            <td data-l="Namen">Google Analytics, Google Zemljevidi, YouTube</td>
            <td data-l="Varovalka">okvir EU–ZDA za zasebnost podatkov (DPF), standardne pogodbene klavzule</td>
          </tr>
          <tr>
            <td className="mk-gl">Meta Platforms Inc.</td>
            <td data-l="Sedež">ZDA</td>
            <td data-l="Namen">Meta Pixel (merjenje oglasov)</td>
            <td data-l="Varovalka">okvir DPF, standardne pogodbene klavzule</td>
          </tr>
          <tr>
            <td className="mk-gl">Stripe</td>
            <td data-l="Sedež">Irska, ZDA</td>
            <td data-l="Namen">spletna plačila s kartico</td>
            <td data-l="Varovalka">okvir DPF, standardne pogodbene klavzule</td>
          </tr>
          <tr>
            <td className="mk-gl">PayPal</td>
            <td data-l="Sedež">Luksemburg, ZDA</td>
            <td data-l="Namen">plačila prek PayPala</td>
            <td data-l="Varovalka">standardne pogodbene klavzule oziroma zavezujoča poslovna pravila</td>
          </tr>
          <tr>
            <td className="mk-gl">Supabase Inc.</td>
            <td data-l="Sedež">ZDA (strežniki v EU)</td>
            <td data-l="Namen">baza podatkov spletne strani</td>
            <td data-l="Varovalka">standardne pogodbene klavzule</td>
          </tr>
          <tr>
            <td className="mk-gl">Vercel Inc.</td>
            <td data-l="Sedež">ZDA</td>
            <td data-l="Namen">gostovanje spletne strani</td>
            <td data-l="Varovalka">okvir DPF, standardne pogodbene klavzule</td>
          </tr>
          <tr>
            <td className="mk-gl">Resend Inc.</td>
            <td data-l="Sedež">ZDA</td>
            <td data-l="Namen">pošiljanje e-pošte in e-novic</td>
            <td data-l="Varovalka">standardne pogodbene klavzule</td>
          </tr>
        </tbody>
      </table>
      <p>Podatke za Google Analytics in Meta Pixel prenesemo samo, če piškotkom privolite.</p>

      <h2>9. Piškotki in upravljanje privolitev</h2>
      <table className="mob-kartice">
        <thead>
          <tr><th>Piškotek</th><th>Vrsta</th><th>Namen</th><th>Trajanje</th></tr>
        </thead>
        <tbody>
          <tr>
            <td className="mk-gl">as_privolitev</td>
            <td data-l="Vrsta">nujni (lokalna shramba brskalnika)</td>
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
          <tr>
            <td className="mk-gl">Google Zemljevidi, YouTube</td>
            <td data-l="Vrsta">tretje osebe</td>
            <td data-l="Namen">prikaz zemljevida oziroma videa</td>
            <td data-l="Trajanje">naložijo se šele, ko kliknete »Prikaži zemljevid« ali predvajate video</td>
          </tr>
        </tbody>
      </table>
      <p>
        Ob prvem obisku izberete, katere piškotke dovolite: »Zavrni vse«, »Sprejmi vse« ali posamezne vrste v
        »Nastavitvah«. Dokler ne privolite, se analitični in oglaševalski piškotki ne naložijo. Odločitev lahko kadar koli
        spremenite ali prekličete s klikom na ikono piškotka v spodnjem levem kotu ali na povezavo »Nastavitve piškotkov«
        na dnu strani.
      </p>

      <h2>10. Vaše pravice</h2>
      <p>Kadar koli lahko zahtevate:</p>
      <ul>
        <li>dostop do svojih podatkov in kopijo podatkov (člen 15 GDPR),</li>
        <li>popravek netočnih ali dopolnitev nepopolnih podatkov (člen 16),</li>
        <li>izbris podatkov, kadar jih ne potrebujemo več ali ni podlage za obdelavo (člen 17),</li>
        <li>omejitev obdelave (člen 18),</li>
        <li>prenos podatkov k drugemu upravljavcu (člen 20),</li>
        <li>ugovor obdelavi na podlagi zakonitega interesa in profiliranju ter kadar koli ugovor neposrednemu trženju (člen 21),</li>
        <li>preklic privolitve, ne da bi to vplivalo na zakonitost obdelave pred preklicem (člen 7(3)).</li>
      </ul>
      <p>
        Zahtevo pošljite pooblaščeni osebi na sara.jagodic@as-system.si. Odgovorimo brezplačno, najkasneje v enem mesecu.
        Pri zahtevnih zahtevah lahko rok podaljšamo za največ dva meseca, o čemer vas obvestimo.
      </p>

      <h2>11. Pritožba</h2>
      <p>
        Če menite, da podatke obdelujemo nezakonito, lahko vložite pritožbo pri Informacijskem pooblaščencu RS, Dunajska
        cesta 22, 1000 Ljubljana, <a href="https://www.ip-rs.si" target="_blank" rel="noreferrer">www.ip-rs.si</a>.
      </p>

      <h2>12. Spremembe</h2>
      <p>
        Politiko zasebnosti po potrebi posodobimo. Veljavna različica je vedno objavljena na tej strani. Glej tudi{" "}
        <Link href="/splosni-pogoji">Splošne pogoje poslovanja</Link>.
      </p>
    </PravnaStran>
  );
}
