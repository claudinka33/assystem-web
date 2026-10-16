import Link from "next/link";
import PravnaStran from "@/components/PravnaStran";
import { site } from "@/lib/site";
import { VELJA_OD } from "@/lib/pravno";

export const metadata = {
  title: "Načini plačila",
  description: "Plačilo s kartico, PayPal, po predračunu ali po povzetju v spletni trgovini AS system.",
  alternates: { canonical: "/nacini-placila" },
};

export default function NaciniPlacila() {
  return (
    <PravnaStran pot="/nacini-placila" naslov="Načini plačila" opis="Kako plačate naročilo v spletni trgovini." veljaOd={VELJA_OD}>
      <h2>Plačilo po predračunu</h2>
      <p>
        Po oddaji naročila vam na e-naslov pošljemo predračun. Znesek nakažete na naš transakcijski račun{" "}
        <b>{site.podjetje.trr}</b>, za sklic pa uporabite številko predračuna oziroma naročila.
      </p>
      <ul>
        <li>Plačilo pričakujemo v 8 dneh od prejema predračuna. Če plačila ne prejmemo, naročilo prekličemo.</li>
        <li>Naročilo odpremimo, ko je plačilo vidno na našem računu (običajno naslednji delovni dan po nakazilu).</li>
        <li>Primerno je za podjetja in za kupce, ki želijo plačati iz spletne banke.</li>
      </ul>

      <h2>Plačilo po povzetju</h2>
      <p>
        Znesek naročila plačate dostavljavcu (Pošti Slovenije) ob prevzemu paketa. Plačilo po povzetju je mogoče samo pri
        dostavi na naslov, ne pa pri osebnem prevzemu. Za plačilo po povzetju zaračunamo doplačilo 1,50 € (z DDV), ki je prikazano na blagajni.
      </p>

      <h2>Plačilna kartica</h2>
      <p>
        Plačate lahko s kartico Visa, Mastercard ali Maestro ter z Apple Pay in Google Pay. Plačilo izvede ponudnik
        Stripe na varni plačilni strani; podatkov o kartici ne prejmemo in jih ne hranimo. Znesek je bremenjen ob oddaji
        naročila, naročilo pa odpremimo praviloma v 1–2 delovnih dneh.
      </p>

      <h2>PayPal</h2>
      <p>
        Po oddaji naročila vas preusmerimo na PayPal, kjer plačilo potrdite s svojim PayPal računom. Ko je plačilo potrjeno,
        prejmete potrdilo naročila po e-pošti.
      </p>

      <h2>Račun</h2>
      <p>
        Račun z izkazanim DDV prejmete s pošiljko ali po e-pošti. Podjetja na blagajni vpišejo naziv podjetja; za
        izstavitev računa na podjetje nam v opombi navedite še ID za DDV.
      </p>
      <p>
        Vprašanja o plačilu: {site.emailProdaja}, {site.telefon}. Splošne določbe so v{" "}
        <Link href="/splosni-pogoji">Splošnih pogojih poslovanja</Link>.
      </p>
    </PravnaStran>
  );
}
