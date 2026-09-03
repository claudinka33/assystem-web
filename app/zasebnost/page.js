import NaslovStrani from "@/components/NaslovStrani";
import { site } from "@/lib/site";

export const metadata = {
  title: "Varstvo osebnih podatkov",
  description: "Kako AS system d.o.o. ravna z osebnimi podatki obiskovalcev spletne strani.",
  alternates: { canonical: "/zasebnost" },
  robots: { index: true, follow: true },
};

const razdelki = [
  ["Upravljavec podatkov", `${site.ime}, ${site.lokacije[0].naslov}. Za vprašanja o osebnih podatkih pišite na ${site.email}.`],
  ["Kateri podatki se zbirajo", "Prek obrazcev na strani zbiramo ime, e-naslov, telefon, ime podjetja in vsebino sporočila. Pri prijavi na delovno mesto tudi življenjepis, ki ga priložite."],
  ["Zakaj jih obdelujemo", "Podatke uporabljamo izključno za odgovor na vaše povpraševanje, pripravo ponudbe ali izvedbo izbirnega postopka. Ne uporabljamo jih za oglaševanje brez vaše privolitve in jih ne prodajamo."],
  ["Kako dolgo jih hranimo", "Povpraševanja hranimo dve leti od zadnjega stika. Prijave na delovna mesta hranimo eno leto, nato jih izbrišemo."],
  ["Komu jih posredujemo", "Podatki so shranjeni pri ponudnikih, ki jih uporabljamo za delovanje strani: Supabase (baza, EU), Vercel (gostovanje) in Resend (pošiljanje e-pošte). Zunaj tega jih ne posredujemo tretjim osebam."],
  ["Piškotki", "Nujni piškotki omogočajo delovanje strani. Merilne piškotke (Google Analytics, Meta) naložimo šele, ko v pasici privolite. Privolitev lahko kadar koli prekličete tako, da počistite piškotke v brskalniku."],
  ["Vaše pravice", "Kadar koli lahko zahtevate vpogled, popravek, izbris ali omejitev obdelave svojih podatkov, ali ugovarjate obdelavi. Zahtevo pošljite na naš e-naslov. Če menite, da ravnamo napačno, se lahko pritožite Informacijskemu pooblaščencu RS."],
];

export default function Zasebnost() {
  return (
    <>
      <NaslovStrani
        oznaka="Pravno"
        naslov="Varstvo osebnih podatkov"
        opis="Kako ravnamo s podatki, ki nam jih zaupate."
      />
      <section className="sec">
        <div className="w" style={{ maxWidth: 860 }}>
          {razdelki.map(([naslov, besedilo]) => (
            <div key={naslov} style={{ marginBottom: 30 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, textTransform: "uppercase" }}>
                {naslov}
              </h2>
              <p style={{ color: "var(--color-muted)", marginTop: 10 }}>{besedilo}</p>
            </div>
          ))}
          <p style={{ color: "var(--color-muted-2)", fontSize: 13.5, marginTop: 40 }}>
            Besedilo je informativno in ga pred objavo pregleda pravna služba.
          </p>
        </div>
      </section>
    </>
  );
}
