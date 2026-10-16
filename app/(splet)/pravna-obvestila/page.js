import PravnaStran from "@/components/PravnaStran";
import PodatkiPodjetja from "@/components/PodatkiPodjetja";
import { VELJA_OD } from "@/lib/pravno";

export const metadata = {
  title: "Podatki o podjetju in pravna obvestila",
  description: "Identifikacijski podatki podjetja AS system d.o.o. in pravna obvestila spletne strani.",
  alternates: { canonical: "/pravna-obvestila" },
};

export default function PravnaObvestila() {
  return (
    <PravnaStran pot="/pravna-obvestila" naslov="Podatki o podjetju" opis="Identifikacijski podatki in pravna obvestila." veljaOd={VELJA_OD}>
      <h2>Podatki o podjetju</h2>
      <PodatkiPodjetja />

      <h2>Avtorske pravice</h2>
      <p>
        Besedila, fotografije, risbe, grafična podoba in druge vsebine na tej strani so avtorsko delo podjetja AS system
        d.o.o. ali njegovih partnerjev. Brez pisnega dovoljenja jih ni dovoljeno kopirati ali objavljati drugje, razen za
        osebno rabo in za predstavitev naših izdelkov s povezavo na to stran.
      </p>

      <h2>Blagovne znamke</h2>
      <p>AS system in ASfix sta blagovni znamki podjetja AS system d.o.o. Druge omenjene blagovne znamke so last svojih imetnikov.</p>

      <h2>Odgovornost za vsebino</h2>
      <p>
        Vsebino skrbno pripravljamo in redno posodabljamo. Kljub temu so lahko podatki o izdelkih, zalogah ali cenah
        začasno nepopolni. Tehnični podatki so informativni; za nosilne pritrditve sta merodajni ETA in izjava o lastnostih.
        Za vsebino zunanjih strani, na katere vodijo povezave, ne odgovarjamo.
      </p>
    </PravnaStran>
  );
}
