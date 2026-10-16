import Link from "next/link";
import PravnaStran from "@/components/PravnaStran";
import { site } from "@/lib/site";
import { VELJA_OD } from "@/lib/pravno";

export const metadata = {
  title: "Reklamacije in jamstvo",
  description: "Jamstvo za skladnost blaga, uveljavljanje reklamacij in pritožb pri AS system d.o.o.",
  alternates: { canonical: "/reklamacije" },
};

export default function Reklamacije() {
  return (
    <PravnaStran pot="/reklamacije" naslov="Reklamacije in jamstvo" opis="Kaj storite, če z izdelkom ni vse v redu." veljaOd={VELJA_OD}>
      <h2>Jamstvo za skladnost blaga</h2>
      <p>
        Kot prodajalec odgovarjamo za vsako neskladnost blaga s pogodbo (na primer napačna dimenzija, napaka v materialu,
        manjkajoči kosi), ki obstaja ob dobavi in se pokaže v <b>dveh letih</b> od dobave. Za neskladnost, ki se pokaže v
        enem letu od dobave, se domneva, da je obstajala že ob dobavi.
      </p>
      <p>Pri neskladnosti lahko potrošnik zahteva, da:</p>
      <ul>
        <li>blago brezplačno zamenjamo ali popravimo,</li>
        <li>če to ni mogoče ali ni izvedeno v razumnem roku: ustrezno znižamo kupnino ali</li>
        <li>odstopimo od pogodbe in vrnemo kupnino (razen pri neznatni neskladnosti).</li>
      </ul>
      <p>
        Zamenjavo ali popravilo izvedemo v razumnem roku, najkasneje v 30 dneh od prejema zahtevka. Če to ni mogoče, vas
        pred iztekom roka obvestimo, za koliko ga podaljšujemo (največ za 15 dni). Stroške vračila neskladnega blaga krijemo
        mi.
      </p>
      <p>Jamstvo ne velja za napake, ki so posledica nepravilne vgradnje, uporabe v nasprotju z navodili ali obrabe.</p>

      <h2>Kako oddate reklamacijo</h2>
      <ol>
        <li>Pišite na <b>{site.emailProdaja}</b> ali pokličite {site.telefon}. Napako sporočite čim prej po tem, ko jo odkrijete.</li>
        <li>Navedite številko naročila ali računa, šifro artikla in opis napake. Priložite fotografijo izdelka in etikete.</li>
        <li>Prejem reklamacije potrdimo v petih delovnih dneh in vam sporočimo, kako bomo nadaljevali.</li>
        <li>Če je potrebno, vam pošljemo navodila za vračilo blaga.</li>
      </ol>

      <h2>Garancija</h2>
      <p>
        Za izdelke v naši ponudbi ni predpisana obvezna garancija. Če je za izdelek izdana prostovoljna garancija, so njeni
        pogoji navedeni v garancijski izjavi, ki je priložena izdelku. Garancija ne vpliva na vaše pravice iz jamstva za
        skladnost.
      </p>

      <h2>Poslovni kupci</h2>
      <p>
        Za poslovne kupce veljajo določila Obligacijskega zakonika o stvarnih napakah: vidne napake in količinske razlike
        sporočite najkasneje v 8 dneh od prevzema, skrite napake pa takoj, ko jih odkrijete, najkasneje v enem letu od
        dobave.
      </p>

      <h2>Pritožbe in spori</h2>
      <p>
        Postopek obravnave pritožb in informacije o izvensodnem reševanju potrošniških sporov so v 13. točki{" "}
        <Link href="/splosni-pogoji">Splošnih pogojev poslovanja</Link>.
      </p>
    </PravnaStran>
  );
}
