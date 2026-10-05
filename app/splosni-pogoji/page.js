import Link from "next/link";
import PravnaStran from "@/components/PravnaStran";
import PodatkiPodjetja from "@/components/PodatkiPodjetja";
import { site } from "@/lib/site";
import { VELJA_OD, IRPS_SEZNAM, eur0 } from "@/lib/pravno";

export const metadata = {
  title: "Splošni pogoji poslovanja",
  description: "Splošni pogoji nakupa v spletni trgovini AS system d.o.o. — naročilo, cene, plačilo, dostava, odstop, reklamacije in reševanje sporov.",
  alternates: { canonical: "/splosni-pogoji" },
};

export default function SplosniPogoji() {
  const t = site.trgovina;
  return (
    <PravnaStran pot="/splosni-pogoji" naslov="Splošni pogoji poslovanja" opis="Pogoji nakupa v spletni trgovini assystem.si." veljaOd={VELJA_OD}>
      <h2>1. Ponudnik</h2>
      <p>Spletno trgovino na naslovu assystem.si upravlja:</p>
      <PodatkiPodjetja />

      <h2>2. Uporaba pogojev</h2>
      <p>
        Ti splošni pogoji urejajo nakup blaga v spletni trgovini assystem.si med ponudnikom in kupcem. Veljajo skupaj z
        zakonodajo Republike Slovenije, predvsem z Zakonom o varstvu potrošnikov (ZVPot-1), Obligacijskim zakonikom (OZ)
        in Zakonom o elektronskem poslovanju na trgu (ZEPT).
      </p>
      <ul>
        <li><b>Potrošnik</b> je fizična oseba, ki kupuje za namene zunaj svoje pridobitne dejavnosti.</li>
        <li><b>Poslovni kupec</b> je pravna oseba ali samostojni podjetnik, ki kupuje za svojo dejavnost. Za poslovne kupce veljajo tudi posebna določila v 11. točki.</li>
      </ul>
      <p>
        Z oddajo naročila kupec potrdi, da je pogoje prebral in se z njimi strinja. Pogoji so objavljeni na tej strani, kjer
        jih lahko kadar koli shranite ali natisnete. Pogodba se sklene v slovenskem jeziku.
      </p>

      <h2>3. Izdelki in tehnični podatki</h2>
      <p>
        Pri vsakem izdelku navajamo šifro, dimenzijo, material oziroma površinsko zaščito, število kosov v pakiranju,
        stanje zaloge in ceno. Fotografije so simbolične; barva embalaže in tisk se lahko razlikujeta.
      </p>
      <p>
        Podatki o nosilnosti in vgradnji so informativni. Za nosilne pritrditve sta merodajni evropska tehnična ocena (ETA)
        in izjava o lastnostih (DoP), ki sta objavljeni pri izdelku, ter presoja projektanta oziroma izvajalca.
      </p>

      <h2>4. Cene</h2>
      <ul>
        <li>Cene so v evrih (EUR) in vključujejo 22 % DDV.</li>
        <li>Cena velja za eno pakiranje (število kosov je navedeno pri artiklu). Cena za 100 kosov je zapisana samo za lažjo primerjavo.</li>
        <li>Stroški dostave niso vključeni v ceno izdelka. Pred oddajo naročila so jasno prikazani na blagajni (glej <Link href="/dostava">Dostava in pošiljanje</Link>).</li>
        <li>Velja cena, ki je prikazana ob oddaji naročila. Če je cena zaradi očitne tehnične napake napačna, vas o tem obvestimo in naročila ne izvedemo brez vaše ponovne potrditve.</li>
      </ul>

      <h2>5. Naročilo in sklenitev pogodbe</h2>
      <ol>
        <li>Izdelke v želeni količini dodate v košarico.</li>
        <li>Na blagajni vpišete podatke za račun in dostavo ter izberete način dostave in plačila.</li>
        <li>Pred oddajo vidite povzetek: izdelke, ceno, stroške dostave in skupni znesek.</li>
        <li>Naročilo oddate s klikom na gumb <b>»Oddaj naročilo z obveznostjo plačila«</b>.</li>
      </ol>
      <p>
        Po oddaji prejmete na e-naslov potrdilo o prejemu naročila s številko naročila in povzetkom. Pogodba je sklenjena,
        ko prejmete to potrdilo. Naročilo hranimo v elektronski obliki; na zahtevo vam pošljemo njegovo kopijo.
      </p>
      <p>
        Napake pri vnosu lahko popravite pred oddajo naročila (v košarici in na blagajni). Po oddaji nas za popravek
        pokličite ali pišite na {site.emailProdaja}, preden je naročilo odpremljeno.
      </p>

      <h2>6. Zaloga in dobavni rok</h2>
      <p>
        Pri vsakem artiklu je prikazano, ali je <b>na zalogi</b> ali dobavljiv <b>po naročilu</b>. Zaloga se usklajuje z
        našim skladiščem večkrat na dan. Izdelke na zalogi odpremimo {t.odprema}. Za artikle po naročilu vam dobavni rok
        sporočimo po e-pošti. Če izdelka ne moremo dobaviti, vas obvestimo, že plačani znesek pa vrnemo najkasneje v 14
        dneh.
      </p>

      <h2>7. Plačilo</h2>
      <p>
        Na voljo sta plačilo po predračunu in plačilo po povzetju. Podrobnosti so na strani{" "}
        <Link href="/nacini-placila">Načini plačila</Link>. Račun prejmete s pošiljko ali po e-pošti.
      </p>

      <h2>8. Dostava</h2>
      <p>
        Pošiljke dostavlja Pošta Slovenije, mogoč je tudi osebni prevzem v Šmarju pri Jelšah. Poštnina znaša{" "}
        {eur0(t.postnina)}, za naročila nad {eur0(t.brezplacnoNad)} je dostava brezplačna. Vse o rokih in prevzemu je na
        strani <Link href="/dostava">Dostava in pošiljanje</Link>.
      </p>

      <h2>9. Odstop od pogodbe</h2>
      <p>
        Potrošnik lahko v 14 dneh od prejema blaga odstopi od pogodbe brez navedbe razloga. Postopek, izjeme in obrazec so
        na strani <Link href="/odstop-od-pogodbe">Odstop od pogodbe in vračilo</Link>.
      </p>

      <h2>10. Jamstvo za skladnost in reklamacije</h2>
      <p>
        Za blago velja zakonsko jamstvo za skladnost dve leti od dobave. Kako uveljavljate reklamacijo, je opisano na
        strani <Link href="/reklamacije">Reklamacije in jamstvo</Link>.
      </p>

      <h2>11. Poslovni kupci</h2>
      <ul>
        <li>Pravica do odstopa od pogodbe in določila ZVPot-1, ki varujejo potrošnike, za poslovne kupce ne veljajo.</li>
        <li>Količinske razlike in vidne napake mora poslovni kupec sporočiti ob prevzemu oziroma najkasneje v 8 dneh, skrite napake pa takoj po odkritju (461. člen OZ).</li>
        <li>Posebne cene, rabati in plačilni roki veljajo po dogovoru oziroma pogodbi s ponudnikom, ki ima prednost pred temi pogoji.</li>
        <li>Za spore s poslovnimi kupci je pristojno stvarno pristojno sodišče v Celju.</li>
      </ul>

      <h2>12. Varstvo osebnih podatkov</h2>
      <p>
        Podatke kupcev uporabljamo samo za izvedbo naročila in zakonske obveznosti. Več na strani{" "}
        <Link href="/zasebnost">Varstvo osebnih podatkov</Link>.
      </p>

      <h2>13. Pritožbe in reševanje sporov</h2>
      <p>
        Pritožbo lahko oddate po e-pošti na {site.emailProdaja}, po telefonu {site.telefon} ali po pošti na naslov sedeža.
        Prejem pritožbe potrdimo v petih delovnih dneh, vas obvestimo, kako dolgo jo bomo obravnavali, in vas sproti
        obveščamo o poteku postopka. Spore skušamo vedno rešiti sporazumno.
      </p>
      <div className="pravno-okvir">
        <p>
          <b>Izvensodno reševanje potrošniških sporov (IRPS).</b> V skladu z zakonodajo ponudnik ne priznava nobenega
          izvajalca izvensodnega reševanja potrošniških sporov kot pristojnega za rešitev spora, ki bi ga lahko začel
          potrošnik. Seznam izvajalcev IRPS, ki jih je priznala Republika Slovenija, je objavljen na{" "}
          <a href={IRPS_SEZNAM} target="_blank" rel="noreferrer">portalu OPSI (podatki.gov.si)</a>.
        </p>
      </div>
      <p>Če spora ni mogoče rešiti sporazumno, je za potrošnike pristojno sodišče po zakonu, za razmerja pa velja pravo Republike Slovenije.</p>

      <h2>14. Spremembe pogojev</h2>
      <p>
        Ponudnik lahko pogoje spremeni. Za posamezno naročilo veljajo pogoji, ki so bili objavljeni ob njegovi oddaji.
      </p>
    </PravnaStran>
  );
}
