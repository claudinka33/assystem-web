import PravnaStran from "@/components/PravnaStran";
import { site } from "@/lib/site";
import { VELJA_OD } from "@/lib/pravno";

export const metadata = {
  title: "Izjava o dostopnosti",
  description: "Izjava o dostopnosti spletne strani in spletne trgovine assystem.si.",
  alternates: { canonical: "/izjava-o-dostopnosti" },
};

export default function Dostopnost() {
  return (
    <PravnaStran pot="/izjava-o-dostopnosti" naslov="Izjava o dostopnosti" opis="Želimo, da stran lahko uporablja vsak." veljaOd={VELJA_OD}>
      <p>
        {site.ime} se zavezuje, da bo spletno stran in spletno trgovino assystem.si omogočil dostopno v skladu z Zakonom o
        dostopnosti do proizvodov in storitev za invalide (ZDPSI). Kot merilo uporabljamo smernice WCAG 2.1 na ravni AA
        oziroma standard EN 301 549.
      </p>

      <h2>Stanje skladnosti</h2>
      <p>Spletna stran je <b>delno skladna</b> z zahtevami. Pri razvoju upoštevamo:</p>
      <ul>
        <li>pregledno strukturo naslovov in vsebine, ki jo berejo bralniki zaslona,</li>
        <li>zadosten barvni kontrast besedila in vidno označen fokus pri uporabi tipkovnice,</li>
        <li>opise slik in oznake polj v obrazcih, košarici in blagajni,</li>
        <li>prilagodljivo postavitev za telefone in povečavo besedila,</li>
        <li>omejene animacije, kadar je v napravi vklopljena nastavitev za zmanjšano gibanje.</li>
      </ul>

      <h2>Znane omejitve</h2>
      <ul>
        <li>Nekateri katalogi in tehnični dokumenti v obliki PDF niso v celoti dostopni.</li>
        <li>Pri delu fotografij izdelkov opisi niso podrobni.</li>
        <li>Interaktivne igre vgradnje so namenjene ponazoritvi in niso v celoti uporabne s tipkovnico; enake informacije so zapisane v besedilu pri izdelku.</li>
      </ul>
      <p>Omejitve postopoma odpravljamo.</p>

      <h2>Povratne informacije in kontakt</h2>
      <p>
        Če naletite na vsebino, ki vam ni dostopna, nam pišite na <b>{site.email}</b> ali pokličite {site.telefon}.
        Zahtevane informacije vam posredujemo v dostopni obliki, odgovorimo pa v 8 delovnih dneh.
      </p>

      <h2>Nadzor</h2>
      <p>
        Nadzor nad izvajanjem zakona izvaja Tržni inšpektorat Republike Slovenije,{" "}
        <a href="https://www.gov.si/drzavni-organi/organi-v-sestavi/trzni-inspektorat/" target="_blank" rel="noreferrer">gov.si</a>.
      </p>
    </PravnaStran>
  );
}
