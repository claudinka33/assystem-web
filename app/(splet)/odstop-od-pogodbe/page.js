import Link from "next/link";
import PravnaStran from "@/components/PravnaStran";
import { site } from "@/lib/site";
import { VELJA_OD } from "@/lib/pravno";

export const metadata = {
  title: "Odstop od pogodbe in vračilo",
  description: "Pravica potrošnika do odstopa od pogodbe v 14 dneh, postopek vračila in obrazec za odstop.",
  alternates: { canonical: "/odstop-od-pogodbe" },
};

export default function Odstop() {
  const p = site.podjetje;
  return (
    <PravnaStran pot="/odstop-od-pogodbe" naslov="Odstop od pogodbe in vračilo" opis="Blago lahko vrnete v 14 dneh brez navedbe razloga." veljaOd={VELJA_OD}>
      <div className="pravno-okvir">
        <p>
          Pravica do odstopa velja za <b>potrošnike</b> (fizične osebe, ki ne kupujejo za svojo dejavnost). Za podjetja in
          samostojne podjetnike ne velja.
        </p>
      </div>

      <h2>Rok za odstop</h2>
      <p>
        Od pogodbe lahko odstopite v <b>14 dneh</b> brez navedbe razloga. Rok začne teči naslednji dan po tem, ko vi ali
        oseba, ki jo določite (ne prevoznik), prejmete blago. Če ste v enem naročilu naročili več izdelkov, ki so dostavljeni
        ločeno, rok teče od prejema zadnjega.
      </p>

      <h2>Kako odstopite</h2>
      <ol>
        <li>
          Pred iztekom roka nam pošljete nedvoumno izjavo o odstopu: po e-pošti na <b>{site.emailProdaja}</b> ali po
          pošti na naslov {p.naslov}. Uporabite lahko obrazec spodaj, ni pa obvezen.
        </li>
        <li>Prejem izjave vam potrdimo po e-pošti.</li>
        <li>
          Blago nam vrnete najkasneje v <b>14 dneh</b> po izjavi o odstopu, na naslov {site.ime}, {p.naslov}. Blago lahko
          prinesete tudi osebno, pon–pet 7.00–15.00.
        </li>
      </ol>

      <h2>Vračilo denarja</h2>
      <ul>
        <li>
          Vrnemo vam vsa prejeta plačila, vključno s stroški prvotne dostave (do višine najcenejše standardne dostave, ki jo
          ponujamo), najkasneje v <b>14 dneh</b> od prejema izjave o odstopu.
        </li>
        <li>Vračilo izvedemo na enak način, kot ste plačali, oziroma na transakcijski račun, ki ga navedete, brez dodatnih stroškov za vas.</li>
        <li>Vračilo lahko zadržimo, dokler blaga ne prejmemo nazaj ali dokler nam ne pošljete dokazila, da ste ga poslali.</li>
      </ul>

      <h2>Stroški in stanje vrnjenega blaga</h2>
      <ul>
        <li>Neposredne stroške vračila blaga krije kupec.</li>
        <li>
          Blago vrnite nepoškodovano in v nespremenjeni količini, po možnosti v originalni embalaži. Odgovarjate za
          zmanjšanje vrednosti blaga, ki je posledica ravnanja, ki ni potrebno za ugotovitev narave in lastnosti blaga
          (npr. vgrajeni ali poškodovani izdelki).
        </li>
      </ul>

      <h2>Izjeme</h2>
      <p>Pravice do odstopa ni pri blagu, ki je bilo izdelano po posebnih navodilih kupca ali prilagojeno njegovim potrebam (na primer vijaki po risbi ali izdelki s potiskom po naročilu).</p>

      <h2>Obrazec za odstop od pogodbe</h2>
      <p>Izpolnite in pošljite ta obrazec samo, če želite odstopiti od pogodbe. Natisnete ga lahko neposredno s te strani.</p>
      <div className="pravno-obrazec">
        <p>
          <b>Prejemnik:</b> {site.ime}, {p.naslov}, e-pošta: {site.emailProdaja}
        </p>
        <p>Obveščam vas, da odstopam od pogodbe o nakupu naslednjega blaga:</p>
        <p>Številka naročila: ______________________________</p>
        <p>Šifre in količine izdelkov: _______________________________________________</p>
        <p>Datum naročila: ______________ Datum prejema blaga: ______________</p>
        <p>Ime in priimek: ______________________________</p>
        <p>Naslov: _______________________________________________</p>
        <p>IBAN za vračilo kupnine (pri plačilu po povzetju): ______________________________</p>
        <p>Datum: ______________ Podpis (samo pri pošiljanju v papirni obliki): ______________</p>
      </div>
      <p>
        Napake na blagu ne uveljavljate z odstopom, temveč z reklamacijo, glej{" "}
        <Link href="/reklamacije">Reklamacije in jamstvo</Link>.
      </p>
    </PravnaStran>
  );
}
