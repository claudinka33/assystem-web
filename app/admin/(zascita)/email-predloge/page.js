import { PREDLOGE, zdruziPredlogo } from "@/lib/email-predloge";
import { naloziShranjene } from "@/lib/email-predloge-streznik";
import UrejevalnikPredlog from "./UrejevalnikPredlog";

export const dynamic = "force-dynamic";

export default async function EmailPredloge() {
  const shranjeno = await naloziShranjene();
  const predloge = PREDLOGE.map((p) => ({
    kljuc: p.kljuc,
    skupina: p.skupina,
    naziv: p.naziv,
    kdaj: p.kdaj,
    gumb: p.gumb,
    izklopljivo: Boolean(p.izklopljivo),
    spremenljivke: p.spremenljivke,
    opisSpremenljivk: p.opisSpremenljivk || {},
    spremenjeno: Boolean(shranjeno[p.kljuc]),
    vrednost: zdruziPredlogo(p.kljuc, shranjeno),
  }));
  return (
    <>
      <div className="adm-glava">
        <div>
          <div className="adm-nad">E-mailing</div>
          <h1>Sporočila strankam</h1>
        </div>
      </div>
      <div className="adm-telo">
        <p className="adm-namig" style={{ marginTop: 0 }}>
          Vsa samodejna e-sporočila, ki jih dobijo stranke (in zaposleni). Spremenite besedilo in kliknite Shrani — velja takoj za vsa nova sporočila.
          Gumb s povezavo, tabela naročila in noga z naslovom AS system se dodajo samodejno. <b>**besedilo**</b> = krepko, prazna vrstica = nov odstavek,
          {" {ime} "}in podobno = vstavi se podatek stranke.
        </p>
        <UrejevalnikPredlog predloge={predloge} />
      </div>
    </>
  );
}
