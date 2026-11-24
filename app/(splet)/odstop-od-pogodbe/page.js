import Link from "next/link";
import PravnaStran from "@/components/PravnaStran";
import { site } from "@/lib/site";
import { VELJA_OD } from "@/lib/pravno";
import { prevedenaStran, prevediMetadata } from "@/lib/i18n/streznik";

const metadataSl = {
  title: "Vračilo blaga",
  description: "Vračilo blaga pri B2B naročilih AS system d.o.o.: samo po predhodnem dogovoru s prodajo.",
  alternates: { canonical: "/odstop-od-pogodbe" },
};

function Odstop() {
  const p = site.podjetje;
  return (
    <PravnaStran pot="/odstop-od-pogodbe" naslov="Vračilo blaga" opis="Vračilo blaga pri B2B naročilih." veljaOd={VELJA_OD}>
      <div className="pravno-okvir">
        <p>
          Spletno naročanje na as-system.si je namenjeno samo <b>poslovnim kupcem</b> (podjetjem in samostojnim podjetnikom).
          Zakonska pravica potrošnika do odstopa od pogodbe v 14 dneh zato ne velja.
        </p>
      </div>

      <h2>Vračilo brezhibnega blaga</h2>
      <p>
        Vračilo pravilno dobavljenega, nepoškodovanega blaga je mogoče samo po <b>predhodnem dogovoru</b> s prodajo.
        Pišite na <b>{site.emailProdaja}</b> ali pokličite {site.telefon} in navedite številko naročila ali računa ter
        artikle in količine, ki jih želite vrniti.
      </p>
      <ul>
        <li>Vrniti je mogoče samo blago v originalni, nepoškodovani in neodprti embalaži.</li>
        <li>Blaga, izdelanega ali pakiranega po naročilu kupca (vijaki po risbi, private label), ni mogoče vrniti.</li>
        <li>Stroške vračila krije kupec, razen če se dogovorimo drugače.</li>
        <li>Po prejemu in pregledu blaga izstavimo dobropis.</li>
      </ul>
      <p>
        Blago po dogovoru vrnete na naslov {site.ime}, {p.naslov}, ali ga prinesete osebno, pon–pet 7.00–15.00.
      </p>

      <h2>Napačna ali poškodovana dobava</h2>
      <p>
        Če ste prejeli napačno, manjkajoče ali poškodovano blago, to ni vračilo, ampak reklamacija. Postopek je na strani{" "}
        <Link href="/reklamacije">Reklamacije</Link>.
      </p>
    </PravnaStran>
  );
}

export default prevedenaStran(Odstop);

export async function generateMetadata() {
  return prevediMetadata(metadataSl);
}
