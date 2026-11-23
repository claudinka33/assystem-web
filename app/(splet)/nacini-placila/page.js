import Link from "next/link";
import PravnaStran from "@/components/PravnaStran";
import { site } from "@/lib/site";
import { VELJA_OD } from "@/lib/pravno";
import { prevedenaStran, prevediMetadata } from "@/lib/i18n/streznik";

const metadataSl = {
  title: "Načini plačila",
  description: "Plačilo B2B naročil na račun v dogovorjenem plačilnem roku.",
  alternates: { canonical: "/nacini-placila" },
};

function NaciniPlacila() {
  return (
    <PravnaStran pot="/nacini-placila" naslov="Načini plačila" opis="Kako plačate B2B naročilo." veljaOd={VELJA_OD}>
      <h2>Plačilo na račun</h2>
      <p>
        Naročila prek B2B portala plačate <b>na račun</b>. Račun z izkazanim DDV izstavimo ob odpremi in ga prejmete po
        e-pošti ali po pošti. Vsi računi podjetja so na voljo tudi v vašem B2B računu, kjer jih lahko natisnete.
      </p>
      <ul>
        <li>Plačilni rok je tisti, ki je dogovorjen z vašim podjetjem (viden je v B2B računu pod »Plačilo«).</li>
        <li>Znesek nakažete na naš transakcijski račun <b>{site.podjetje.trr}</b>, za sklic uporabite številko računa.</li>
        <li>Pri zamudi s plačilom obračunamo zakonske zamudne obresti in lahko ustavimo nadaljnje spletno naročanje do poravnave obveznosti.</li>
      </ul>

      <h2>Novi kupci</h2>
      <p>
        Plačilni pogoji za novo podjetje se določijo ob odobritvi B2B dostopa. Pri prvih naročilih lahko zahtevamo plačilo
        po predračunu pred odpremo.
      </p>

      <p>
        Vprašanja o plačilu: {site.emailProdaja}, {site.telefon}. Splošne določbe so v{" "}
        <Link href="/splosni-pogoji">Splošnih pogojih poslovanja</Link>.
      </p>
    </PravnaStran>
  );
}

export default prevedenaStran(NaciniPlacila);

export async function generateMetadata() {
  return prevediMetadata(metadataSl);
}
