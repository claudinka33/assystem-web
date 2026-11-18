import Link from "next/link";
import PravnaStran from "@/components/PravnaStran";
import { site } from "@/lib/site";
import { VELJA_OD } from "@/lib/pravno";
import { prevedenaStran, prevediMetadata } from "@/lib/i18n/streznik";

const metadataSl = {
  title: "Reklamacije",
  description: "Reklamacije pri B2B naročilih AS system d.o.o.: roki, postopek in obravnava.",
  alternates: { canonical: "/reklamacije" },
};

function Reklamacije() {
  return (
    <PravnaStran pot="/reklamacije" naslov="Reklamacije" opis="Kaj storite, če z dobavo ali izdelkom ni vse v redu." veljaOd={VELJA_OD}>
      <h2>Roki za sporočanje napak</h2>
      <p>
        Spletno naročanje je namenjeno poslovnim kupcem, zato za napake veljajo določila Obligacijskega zakonika o
        stvarnih napakah pri gospodarskih pogodbah:
      </p>
      <ul>
        <li><b>Količinske razlike in vidne napake</b> (napačen artikel, manjkajoči kosi, poškodovana embalaža) sporočite ob prevzemu, najkasneje v <b>8 dneh</b> od prevzema.</li>
        <li><b>Skrite napake</b> sporočite takoj, ko jih odkrijete, najkasneje v <b>enem letu</b> od dobave.</li>
      </ul>
      <p>
        Pri utemeljeni reklamaciji blago zamenjamo, dobavimo manjkajoče ali izstavimo dobropis. Stroške vračila neskladnega
        blaga krijemo mi. Reklamacija ne velja za napake, ki so posledica nepravilne vgradnje, uporabe v nasprotju z
        navodili ali obrabe.
      </p>

      <h2>Kako oddate reklamacijo</h2>
      <ol>
        <li>Pišite na <b>{site.emailProdaja}</b> ali pokličite {site.telefon}.</li>
        <li>Navedite številko naročila ali računa, šifro artikla, količino in opis napake. Priložite fotografijo izdelka in etikete.</li>
        <li>Prejem reklamacije potrdimo v petih delovnih dneh in vam sporočimo, kako bomo nadaljevali.</li>
        <li>Če je potrebno, vam pošljemo navodila za vračilo blaga.</li>
      </ol>

      <h2>Spori</h2>
      <p>
        Spore skušamo rešiti sporazumno. Več v <Link href="/splosni-pogoji">Splošnih pogojih poslovanja</Link>.
      </p>
    </PravnaStran>
  );
}

export default prevedenaStran(Reklamacije);

export async function generateMetadata() {
  return prevediMetadata(metadataSl);
}
