import Image from "next/image";
import Link from "next/link";
import { kategorije, poti, site } from "@/lib/site";

export const metadata = {
  title: "AS system — razvoj in proizvodnja pritrdilne tehnike",
  description:
    "Jeklena sidra, zidni vložki in vijaki iz lastne proizvodnje. Hladno kovanje, brizganje plastike in avtomatsko pakiranje pod znamko ASfix ali vašo lastno.",
  alternates: { canonical: "/" },
};

const dejstva = [
  ["Na trgu od", `${site.ustanovljeno}`],
  ["Dobavljamo v", `${site.drzave} držav`],
  ["Proizvodni lokaciji", "2"],
  ["Sidra z oceno", "ETA"],
];

const zmoznosti = [
  {
    naziv: "Hladno kovanje",
    opis: "Vijaki in sidra iz jekla, od žice do končnega izdelka na eni lokaciji.",
  },
  {
    naziv: "Brizganje plastike",
    opis: "Najlonski vložki in tulci iz poliamida, izdelani na lastnih orodjih.",
  },
  {
    naziv: "Lastna orodjarna",
    opis: "Orodja razvijemo in vzdrzujemo sami, zato so spremembe hitre.",
  },
  {
    naziv: "Avtomatska montaža",
    opis: "Sestavljanje in pakiranje kompletov v škatle ali vrečke brez rocnega dela.",
  },
];

export default function Domov() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="pattern-vijaki bg-ink text-paper">
        <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-5 py-20 lg:grid-cols-[1.25fr_1fr] lg:py-24">
          <div>
            <span className="eyebrow">Pritrdilna tehnika od {site.ustanovljeno}</span>
            <h1 className="mt-6 text-[clamp(2.75rem,7vw,5.25rem)]">
              Razvijemo, skujemo
              <br />
              in zapakiramo.
              <br />
              <span className="text-red">Pod našo ali vašo znamko.</span>
            </h1>
            <p className="mt-7 text-lg leading-relaxed text-paper/75">
              Jeklena sidra, najlonski vložki, udarni vijaki in vijaki po naročilu
              iz dveh proizvodnih obratov v Sloveniji. Za trgovce, distributerje
              in blagovne znamke, ki pritrdila prodajajo pod svojim imenom.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/program"
                className="bg-red px-7 py-3.5 font-semibold uppercase tracking-wide text-paper transition-colors hover:bg-red-dark"
              >
                Prodajni program
              </Link>
              <Link
                href="/private-label"
                className="border border-paper/30 px-7 py-3.5 font-semibold uppercase tracking-wide text-paper transition-colors hover:border-paper"
              >
                Private label
              </Link>
            </div>
          </div>

          <div className="relative self-center">
            <div className="relative aspect-4/3 w-full overflow-hidden">
              <Image
                src="/slike/as-system-smarje.jpg"
                alt="Sedež podjetja AS system v Šmarju pri Jelšah"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover"
              />
            </div>
            <span className="absolute bottom-0 left-0 bg-red px-4 py-2 text-[0.8125rem] font-semibold uppercase tracking-wide text-paper">
              Smarje pri Jelsah
            </span>
          </div>
        </div>

        {/* pas s podatki pod herom */}
        <div className="border-t border-ink-line">
          <dl className="mx-auto grid max-w-[1240px] grid-cols-2 gap-px bg-ink-line px-5 lg:grid-cols-4 lg:px-0">
            {dejstva.map(([k, v]) => (
              <div key={k} className="bg-ink px-5 py-7">
                <dt className="text-[0.8125rem] uppercase tracking-wide text-paper/55">
                  {k}
                </dt>
                <dd className="mt-2 font-display text-4xl font-extrabold uppercase">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- Tri poti ---------- */}
      <section className="mx-auto max-w-[1240px] px-5 py-20">
        <span className="eyebrow">Kaj iščete</span>
        <h2 className="mt-5 text-[clamp(2rem,4vw,3rem)]">Trije načini sodelovanja</h2>
        <div className="mt-12 grid gap-px bg-line sm:grid-cols-3">
          {poti.map((p) => (
            <div key={p.naziv} className="bg-paper p-7">
              <h3 className="text-2xl">{p.naziv}</h3>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
                {p.opis}
              </p>
              <Link
                href={p.pot}
                className="mt-6 inline-block font-semibold text-red hover:text-red-dark"
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Program ---------- */}
      <section className="bg-mist">
        <div className="mx-auto max-w-[1240px] px-5 py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="eyebrow">Prodajni program</span>
              <h2 className="mt-5 text-[clamp(2rem,4vw,3rem)]">
                Pritrdila za vsako podlago
              </h2>
            </div>
            <Link
              href="/program"
              className="font-semibold text-red hover:text-red-dark"
            >
              Vse kategorije
            </Link>
          </div>

          <ul className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
            {kategorije.map((k) => (
              <li key={k.slug}>
                <Link
                  href={`/program/${k.slug}`}
                  className="group block h-full bg-paper p-6 transition-colors hover:bg-ink"
                >
                  <h3 className="text-xl group-hover:text-paper">{k.naziv}</h3>
                  <p className="mt-3 text-[0.875rem] leading-relaxed text-muted group-hover:text-paper/70">
                    {k.opis}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Private label ---------- */}
      <section className="pattern-vijaki bg-red text-paper">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-20 lg:grid-cols-[1fr_1fr]">
          <div>
            <span className="eyebrow text-paper">Private label</span>
            <h2 className="mt-5 text-[clamp(2rem,4.5vw,3.5rem)]">
              Vaš logotip. Naša proizvodnja.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-paper/85">
              Za evropske blagovne znamke izdelujemo pritrdila od prve risbe do
              zapakirane police. Vi določite izdelek in embalažo, mi poskrbimo za
              orodje, proizvodnjo, certifikat in pakiranje.
            </p>
            <Link
              href="/private-label"
              className="mt-8 inline-block bg-ink px-7 py-3.5 font-semibold uppercase tracking-wide text-paper transition-colors hover:bg-ink-soft"
            >
              Kako poteka
            </Link>
          </div>
          <ol className="grid gap-px self-start bg-paper/25 sm:grid-cols-2">
            {[
              "Razvoj in risba izdelka",
              "Izdelava orodja v lastni orodjarni",
              "Proizvodnja in kontrola kakovosti",
              "Pakiranje v vašo embalažo",
            ].map((korak, i) => (
              <li key={korak} className="bg-red p-6">
                <span className="font-display text-4xl font-extrabold text-paper/45">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 font-semibold leading-snug">{korak}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Proizvodnja ---------- */}
      <section className="mx-auto max-w-[1240px] px-5 py-20">
        <span className="eyebrow">Proizvodnja</span>
        <h2 className="mt-5 text-[clamp(2rem,4vw,3rem)]">Vse pod svojo streho</h2>
        <p className="mt-6 text-lg leading-relaxed text-muted">
          Ker ne kupujemo polizdelkov, lahko spremenimo dimenzijo, material ali
          pakiranje brez čakanja na zunanjega dobavitelja.
        </p>

        <div className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {zmoznosti.map((z) => (
            <div key={z.naziv} className="bg-paper p-6">
              <div className="h-1 w-10 bg-red" />
              <h3 className="mt-5 text-xl">{z.naziv}</h3>
              <p className="mt-3 text-[0.875rem] leading-relaxed text-muted">
                {z.opis}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {site.lokacije.map((l) => (
            <div key={l.naziv} className="border border-line p-7">
              <h3 className="text-2xl">{l.naziv}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                {l.vloga}
              </p>
              <p className="mt-4 text-[0.9375rem] text-muted">{l.naslov}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Kakovost ---------- */}
      <section className="bg-ink text-paper">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-20 lg:grid-cols-[1fr_1fr]">
          <div>
            <span className="eyebrow">Kakovost</span>
            <h2 className="mt-5 text-[clamp(2rem,4vw,3rem)]">
              Dokazila, ki jih projekt zahteva
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-paper/75">
              Nosilna sidra imajo evropsko tehničo oceno ETA in izjavo o
              lastnostih. Vsa dokumentacija je na voljo za prenos, v slovenščini
              in angleščini.
            </p>
            <Link
              href="/kakovost"
              className="mt-8 inline-block border border-paper/30 px-7 py-3.5 font-semibold uppercase tracking-wide transition-colors hover:border-paper"
            >
              Certifikati in prenosi
            </Link>
          </div>
          <dl className="self-center border-t border-ink-line">
            {[
              ["Evropska tehniča ocena", "ETA"],
              ["Oznaka skladnosti", "CE"],
              ["Izjava o lastnostih", "DoP"],
              ["Sistem vodenja", "ISO 9001"],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex items-baseline justify-between gap-4 border-b border-ink-line py-4"
              >
                <dt className="text-[0.9375rem] text-paper/60">{k}</dt>
                <dd className="font-display text-2xl font-extrabold">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- Kontakt ---------- */}
      <section className="mx-auto max-w-[1240px] px-5 py-20">
        <div className="border-t-[3px] border-red pt-10">
          <h2 className="text-[clamp(2rem,4vw,3rem)]">Povejte, kaj pritrjujete</h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Pošljite dimenzije, količino ali samo fotografijo vgradnje. Odgovorimo
            v enem delovnem dnevu.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/kontakt"
              className="bg-red px-7 py-3.5 font-semibold uppercase tracking-wide text-paper transition-colors hover:bg-red-dark"
            >
              Pošlji povpraševanje
            </Link>
            <a
              href={`tel:${site.telefonRaw}`}
              className="border border-line px-7 py-3.5 font-semibold uppercase tracking-wide transition-colors hover:border-ink"
            >
              {site.telefon}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
