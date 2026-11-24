import Link from "next/link";
import PravnaStran from "@/components/PravnaStran";
import PodatkiPodjetja from "@/components/PodatkiPodjetja";
import { site } from "@/lib/site";
import { VELJA_OD } from "@/lib/pravno";
import { prevedenaStran, prevediMetadata } from "@/lib/i18n/streznik";

const metadataSl = {
  title: "Splošni pogoji poslovanja",
  description: "Splošni pogoji B2B spletnega naročanja pri AS system d.o.o.: registracija, cene, naročilo, plačilo na račun, dostava, reklamacije in reševanje sporov.",
  alternates: { canonical: "/splosni-pogoji" },
};

function SplosniPogoji() {
  const t = site.trgovina;
  return (
    <PravnaStran pot="/splosni-pogoji" naslov="Splošni pogoji poslovanja" opis="Pogoji B2B spletnega naročanja na as-system.si za podjetja in samostojne podjetnike." veljaOd={VELJA_OD}>
      <h2>1. Ponudnik</h2>
      <p>Spletni B2B portal na naslovu as-system.si upravlja:</p>
      <PodatkiPodjetja />

      <h2>2. Komu je namenjena spletna prodaja</h2>
      <p>
        Spletno naročanje na as-system.si je namenjeno izključno <b>poslovnim kupcem</b>: pravnim osebam in samostojnim
        podjetnikom, ki kupujejo za svojo dejavnost (B2B). Prodaje potrošnikom (B2C) prek spletne strani ne izvajamo.
      </p>
      <p>
        Ti pogoji urejajo razmerje med ponudnikom in poslovnim kupcem pri naročanju prek B2B portala. Veljajo skupaj z
        zakonodajo Republike Slovenije, predvsem z Obligacijskim zakonikom (OZ) in Zakonom o elektronskem poslovanju na trgu
        (ZEPT). Določila Zakona o varstvu potrošnikov (ZVPot-1), med njimi pravica do odstopa od pogodbe, za poslovne kupce
        ne veljajo.
      </p>
      <p>
        Posebne cene, rabati, plačilni roki in drugi pogoji, dogovorjeni s posameznim kupcem (pogodba, ponudba, cenik),
        imajo prednost pred temi pogoji. Z oddajo naročila kupec potrdi, da je pogoje prebral in se z njimi strinja.
        Pogodba se sklene v slovenskem jeziku.
      </p>

      <h2>3. B2B registracija in dostop</h2>
      <ul>
        <li>Cene, zaloga, certifikati in spletno naročanje so na voljo samo registriranim B2B uporabnikom.</li>
        <li>Podjetje se registrira z davčno številko in kontaktnimi podatki. Po potrditvi e-naslova uporabnik vidi redne veleprodajne cene (brez DDV).</li>
        <li>Prodaja podatke preveri in dostop odobri ročno. Po odobritvi uporabnik vidi cene po svojem ceniku (posebne cene oziroma rabat) in lahko oddaja naročila.</li>
        <li>Ponudnik lahko registracijo zavrne ali dostop ukine, predvsem če podatki niso točni ali kupec ne izpolnjuje obveznosti.</li>
        <li>Kupec skrbi za varnost svojih gesel in odgovarja za naročila, oddana z dostopom njegovega podjetja. Eno podjetje ima lahko več uporabnikov in poslovalnic.</li>
      </ul>

      <h2>4. Izdelki in tehnični podatki</h2>
      <p>
        Pri izdelkih navajamo šifro, dimenzijo, material oziroma površinsko zaščito in pakiranje. Fotografije so
        simbolične; barva embalaže in tisk se lahko razlikujeta.
      </p>
      <p>
        Podatki o nosilnosti in vgradnji so informativni. Za nosilne pritrditve sta merodajni evropska tehnična ocena (ETA)
        in izjava o lastnostih (DoP), ki sta B2B uporabnikom na voljo pri izdelku, ter presoja projektanta oziroma izvajalca.
      </p>

      <h2>5. Cene</h2>
      <ul>
        <li>Cene so v evrih (EUR) in <b>ne vključujejo DDV</b>, ki se obračuna na računu po veljavni stopnji.</li>
        <li>Cena velja za eno pakiranje (število kosov je navedeno pri artiklu). Cena za 100 kosov je zapisana samo za lažjo primerjavo.</li>
        <li>Odobren kupec vidi svojo ceno; ob njej je zaradi primerjave prikazana redna veleprodajna cena (VPC).</li>
        <li>Velja cena, ki je prikazana ob oddaji naročila. Če je cena zaradi očitne tehnične napake napačna, kupca obvestimo in naročila ne izvedemo brez njegove ponovne potrditve.</li>
      </ul>

      <h2>6. Naročilo in sklenitev pogodbe</h2>
      <ol>
        <li>Prijavljeni B2B uporabnik doda izdelke v košarico.</li>
        <li>Na blagajni izbere poslovalnico oziroma naslov dostave in način dostave.</li>
        <li>Pred oddajo vidi povzetek: izdelke, cene, stroške dostave in skupni znesek.</li>
        <li>Naročilo odda s potrditvijo na blagajni.</li>
      </ol>
      <p>
        Po oddaji kupec prejme potrdilo o prejemu naročila po e-pošti. Pogodba je sklenjena, ko ponudnik naročilo potrdi
        oziroma izdelke odpremi. Naročila in račune podjetja kupec vidi v svojem B2B računu.
      </p>
      <p>
        Za popravek ali preklic že oddanega naročila nas pokličite na {site.telefon} ali pišite na {site.emailProdaja},
        preden je naročilo odpremljeno.
      </p>

      <h2>7. Zaloga in dobavni rok</h2>
      <p>
        B2B uporabnik pri artiklu vidi, ali je na zalogi. Zaloga se usklajuje z našim skladiščem večkrat na dan. Izdelke na
        zalogi odpremimo {t.odprema}. Za artikle, ki niso na zalogi, dobavni rok sporočimo na zahtevo oziroma po e-pošti.
        Dobavni roki so informativni, razen če so pisno dogovorjeni.
      </p>

      <h2>8. Plačilo</h2>
      <p>
        Naročila prek B2B portala se plačajo <b>na račun</b>, v plačilnem roku, ki je dogovorjen s kupcem. Pri zamudi s
        plačilom ponudnik obračuna zakonske zamudne obresti in lahko ustavi nadaljnje dobave do poravnave obveznosti.
        Podrobnosti so na strani <Link href="/nacini-placila">Načini plačila</Link>.
      </p>

      <h2>9. Dostava in prevzem</h2>
      <p>
        Pošiljke dostavlja Pošta Slovenije, mogoč je tudi osebni prevzem v Šmarju pri Jelšah. Poštnina je odvisna od
        vrednosti blaga brez DDV: {t.razredi}. Osebni prevzem je brezplačen. Tveganje za izgubo ali poškodbo blaga preide na
        kupca ob prevzemu. Več na strani <Link href="/dostava">Dostava in pošiljanje</Link>.
      </p>

      <h2>10. Vračilo blaga</h2>
      <p>
        Ker gre za poslovno prodajo, zakonska pravica do odstopa od pogodbe v 14 dneh ne velja. Vračilo brezhibnega blaga je
        mogoče samo po predhodnem dogovoru s prodajo. Več na strani <Link href="/odstop-od-pogodbe">Vračilo blaga</Link>.
      </p>

      <h2>11. Stvarne napake in reklamacije</h2>
      <ul>
        <li>Količinske razlike in vidne napake mora kupec sporočiti ob prevzemu oziroma najkasneje v 8 dneh od prevzema.</li>
        <li>Skrite napake mora kupec sporočiti takoj, ko jih odkrije, najkasneje pa v enem letu od dobave (461. in 462. člen OZ).</li>
        <li>Ponudnik ne odgovarja za napake, ki so posledica nepravilne vgradnje, uporabe v nasprotju z navodili ali obrabe.</li>
      </ul>
      <p>
        Postopek je opisan na strani <Link href="/reklamacije">Reklamacije</Link>.
      </p>

      <h2>12. Omejitev odgovornosti</h2>
      <p>
        Ponudnik odgovarja za skladnost dobavljenega blaga s specifikacijo. Za posredno škodo in izgubljeni dobiček ponudnik
        ne odgovarja, razen če je škoda povzročena namerno ali iz hude malomarnosti.
      </p>

      <h2>13. Varstvo osebnih podatkov</h2>
      <p>
        Podatke kontaktnih oseb kupcev uporabljamo za upravljanje B2B dostopa, izvedbo naročil in zakonske obveznosti. Več
        na strani <Link href="/zasebnost">Politika zasebnosti</Link>.
      </p>

      <h2>14. Reševanje sporov</h2>
      <p>
        Spore skušamo vedno rešiti sporazumno. Pritožbo lahko oddate po e-pošti na {site.emailProdaja}, po telefonu{" "}
        {site.telefon} ali po pošti na naslov sedeža. Če spora ni mogoče rešiti sporazumno, je pristojno stvarno pristojno
        sodišče v Celju. Za razmerja velja pravo Republike Slovenije.
      </p>

      <h2>15. Spremembe pogojev</h2>
      <p>
        Ponudnik lahko pogoje spremeni. Za posamezno naročilo veljajo pogoji, ki so bili objavljeni ob njegovi oddaji.
      </p>
    </PravnaStran>
  );
}

export default prevedenaStran(SplosniPogoji);

export async function generateMetadata() {
  return prevediMetadata(metadataSl);
}
