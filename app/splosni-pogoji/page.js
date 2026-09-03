import NaslovStrani from "@/components/NaslovStrani";
import { site } from "@/lib/site";

export const metadata = {
  title: "Splošni pogoji poslovanja",
  description: "Pogoji naročanja, dobave in reklamacij podjetja AS system d.o.o.",
  alternates: { canonical: "/splosni-pogoji" },
};

const razdelki = [
  ["Splošno", `Ti pogoji veljajo za poslovanje podjetja ${site.ime} s kupci prek spletne strani assystem.si. Za posamezne pogodbene odnose lahko veljajo posebej dogovorjeni pogoji, ki imajo prednost pred temi.`],
  ["Povpraševanja in ponudbe", "Povpraševanje, oddano prek spletne strani, ni naročilo. Na podlagi povpraševanja pripravimo ponudbo z veljavnostjo, ki je navedena na ponudbi. Naročilo je sklenjeno, ko ga pisno potrdimo."],
  ["Cene", "Cene v ponudbah so izražene v evrih. Če ni navedeno drugače, ne vključujejo DDV in stroškov prevoza. Pridržujemo si pravico do spremembe cen zaradi bistvenih sprememb cen materiala."],
  ["Dobava", "Dobavni rok potrdimo ob potrditvi naročila. Blago odpremljamo iz skladišča v Šmarju pri Jelšah. Za izdelke po naročilu se rok določi posebej."],
  ["Reklamacije", "Očitne napake in odstopanja v količini javite v osmih dneh od prevzema, skrite napake pa nemudoma po odkritju. Reklamaciji priložite šifro artikla, številko dobavnice in fotografijo."],
  ["Tehnični podatki", "Podatki o nosilnosti, dimenzijah in uporabi so informativni in temeljijo na preizkusih v standardnih pogojih. Za nosilne pritrditve je merodajna dokumentacija ETA in izjava o lastnostih ter presoja projektanta."],
  ["Pravo in pristojnost", "Za razmerja velja pravo Republike Slovenije. Morebitne spore rešujemo sporazumno, sicer je pristojno sodišče po sedežu prodajalca."],
];

export default function SplosniPogoji() {
  return (
    <>
      <NaslovStrani
        oznaka="Pravno"
        naslov="Splošni pogoji poslovanja"
        opis="Pogoji naročanja, dobave in reklamacij."
      />
      <section className="sec">
        <div className="w" style={{ maxWidth: 860 }}>
          {razdelki.map(([naslov, besedilo], i) => (
            <div key={naslov} style={{ marginBottom: 30 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, textTransform: "uppercase" }}>
                {i + 1}. {naslov}
              </h2>
              <p style={{ color: "var(--color-muted)", marginTop: 10 }}>{besedilo}</p>
            </div>
          ))}
          <p style={{ color: "var(--color-muted-2)", fontSize: 13.5, marginTop: 40 }}>
            Osnutek za pregled. Pred objavo ga potrdi vodstvo oziroma pravna
            služba. Ob zagonu spletne trgovine se dopolni z določili o
            potrošniških nakupih.
          </p>
        </div>
      </section>
    </>
  );
}
