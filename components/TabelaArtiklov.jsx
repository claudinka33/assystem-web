"use client";

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { cenaArtikla, eur } from "@/lib/cene";
import { dodaj } from "@/lib/kosarica";
import { dogodek } from "@/lib/dogodki";
import { useB2BCene } from "@/lib/b2b-klient";

// Tabela artiklov na strani izdelka: iskanje, filtri po lastnostih
// (material, trdnost, pakiranje ...) in postopen prikaz pri dolgih seznamih.
const KORAK = 80;

// Ko artikla ni na zalogi, roka dobave ne poznamo -> kupec ga z enim klikom vpraša prek obrazca.
function Zaloga({ vrednost, sifra, izdelek }) {
  if (vrednost === null || vrednost === undefined) return "—";
  if (vrednost > 0) return <span style={{ color: "#1a7f3c", fontWeight: 700 }}>Na zalogi</span>;
  const kaj = encodeURIComponent(`${izdelek?.naziv ?? ""} ${sifra ?? ""}`.trim());
  return (
    <span className="zal-ni">
      <b>Po naročilu</b>
      <a href={`/kontakt?izdelek=${kaj}&vir=rok-dobave`}>Vprašaj za rok →</a>
    </span>
  );
}

function VKosarico({ a, cena, izdelek, b2b }) {
  const [kol, setKol] = useState(1);
  const [ok, setOk] = useState(false);
  if (!cena) return <span className="izd-siv">na povpraševanje</span>;
  const vPak = cena.kos > 1; // cena velja za pakiranje (npr. 100 kos), količina = število pakiranj
  return (
    <span className="vk-w">
    <span className="vk">
      <input type="number" min="1" value={kol} onChange={(e) => setKol(Math.max(1, Number(e.target.value) || 1))} aria-label={vPak ? `Število pakiranj po ${cena.kos} kos` : "Količina"} />
      <span className="vk-x">{vPak ? `× ${cena.kos} kos` : "kos"}</span>
      <button
        type="button"
        className={ok ? "on" : ""}
        onClick={() => {
          dodaj(
            {
              id: a.id,
              sifra: a.sifra,
              naziv: izdelek?.naziv ?? a.naziv,
              dimenzija: a.dimenzija,
              lastnosti: a.lastnosti ?? {},
              kos: cena.kos,
              cenaBruto: cena.bruto,
              cenaNeto: cena.neto,
              b2b: Boolean(b2b),
              pot: izdelek?.pot,
              slika: izdelek?.slika ?? null,
            },
            kol
          );
          dogodek("add_to_cart", {
            currency: "EUR",
            value: Math.round(cena.bruto * kol * 100) / 100,
            items: [{ item_id: a.sifra, item_name: `${izdelek?.naziv ?? a.naziv} ${a.dimenzija ?? ""}`.trim(), price: cena.bruto, quantity: kol }],
          });
          setOk(true);
          setTimeout(() => setOk(false), 1500);
        }}
        aria-label="Dodaj v košarico"
      >
        {ok ? "✓" : "V košarico"}
      </button>
    </span>
    <span className="vk-sk">
      {vPak ? `= ${(kol * cena.kos).toLocaleString("sl-SI")} kos · ` : ""}
      {b2b ? `${eur(Math.round(cena.neto * kol * 100) / 100)} + DDV` : eur(Math.round(cena.bruto * kol * 100) / 100)}
    </span>
    </span>
  );
}

function Cena({ cena, b2b }) {
  if (!cena) return b2b ? <span className="izd-siv">na povpraševanje</span> : "—";
  if (b2b)
    return (
      <span className="izd-cena b2b-c">
        {cena.redna && (
          <s className="b2b-redna" title="Redna cena brez DDV">{eur(cena.redna)}</s>
        )}
        <b>
          {eur(cena.neto)}
          {cena.posebna ? (
            <span className="b2b-cena" title="Posebna cena, dogovorjena za vaše podjetje">VAŠA CENA</span>
          ) : cena.popust > 0 ? (
            <span className="b2b-cena" title="Vaš rabat na redno ceno">−{String(cena.popust).replace(".", ",")} %</span>
          ) : null}
        </b>
        <em>{cena.kos > 1 ? `za ${cena.kos} kos · ` : ""}brez DDV</em>
        {cena.na100Neto !== null && <em>{eur(cena.na100Neto)} / 100 kos</em>}
        <em>z DDV {eur(cena.bruto)}</em>
      </span>
    );
  return (
    <span className="izd-cena">
      <b>{eur(cena.bruto)}</b>
      {cena.na100Bruto !== null ? <em>{eur(cena.na100Bruto)} / 100 kos</em> : cena.kos > 1 && <em>za {cena.kos} kos</em>}
    </span>
  );
}

function pakiranje(a) {
  if (a.pakiranje) return `${a.pakiranje} ${a.enota && a.enota !== "kos" ? a.enota : "kos"}`;
  if (a.enota && a.enota !== "kos") return a.enota;
  return "—";
}

// Vrstni red vrednosti: najprej ZnB, nato črn, inox A2, inox A4, vroče cinkano, medenina
const VRSTNI_RED = {
  Material: ["ZnB", "ZnR", "črn", "črn (brez zaščite)", "INOX A2", "INOX A4", "vroče cinkano", "vroče cinkano (HDG)", "medenina", "poliamid"],
  Pakiranje: ["škatla", "škatla AFR41", "škatla AFR51", "škatla AFR71", "škatla AFR81", "osnovno", "razsuto (cena/100 kos)", "vrečka", "blister", "mala škatla", "pakirano"],
};
function rang(k, v) {
  const r = (VRSTNI_RED[k] ?? []).indexOf(v);
  return r === -1 ? 99 : r;
}
function primerjaj(k) {
  return (x, y) => rang(k, x) - rang(k, y) || String(x).localeCompare(String(y), "sl", { numeric: true });
}

// Privzeta legenda pakiranj (izdelek jo lahko dopolni s poljem "embalaza").
// ASco (vijačno blago) ima modro vrečko in sivo škatlo, ASfix (pritrdilna tehnika) rdečo vrečko in škatlo AFR.
function privzetaEmbalaza(asco, znamka) {
  // Silvermate in Mungo imata svojo embalažo — brez slik ASfix/ASco
  if (znamka === "Silvermate" || znamka === "MUNGO")
    return [
      { lastnost: "Pakiranje", vrednost: "škatla", naziv: "Škatla", opis: "Število kosov v škatli je v stolpcu »Pakiranje«." },
      { lastnost: "Pakiranje", vrednost: "vrečka", naziv: "Vrečka", opis: "Maloprodajna vrečka." },
    ];
  return [
    asco
      ? { lastnost: "Pakiranje", vrednost: "škatla", naziv: "Škatla", opis: "Originalno pakiranje za podjetja in serviserje. Število kosov v škatli je v stolpcu »Kos v pak.«.", slika: "/slike/embalaza/ASco_skatla.png" }
      : { lastnost: "Pakiranje", vrednost: "škatla", naziv: "Škatla", opis: "ASfix škatla za podjetja in serviserje. Število kosov v škatli je v stolpcu »Kos v pak.«.", slika: "/slike/embalaza/AFR41.png" },
    asco
      ? { lastnost: "Pakiranje", vrednost: "vrečka", naziv: "Vrečka", opis: "Maloprodajna vrečka z eurolukno za obešanje na prodajno stojalo.", slika: "/slike/embalaza/ASco_vrecka_modra.png" }
      : { lastnost: "Pakiranje", vrednost: "vrečka", naziv: "Vrečka", opis: "Rdeča ASfix vrečka z eurolukno za obešanje na prodajno stojalo. Število kosov v vrečki je v stolpcu »Kos v pak.«.", slika: "/polica/vrecka-rdeca.png" },
    { lastnost: "Pakiranje", vrednost: "blister", naziv: "Blister", opis: "Maloprodajno pakiranje v blistru za obešanje na stojalo." },
  ];
}

// Pri pakiranju ločimo samo škatlo in vrečko — "škatla AFR41", "škatla AFR51" ... štejejo kot "škatla".
function skupina(k, v) {
  if (k === "Pakiranje" && typeof v === "string" && v.startsWith("škatla")) return "škatla";
  return v;
}
function ujema(a, k, v) {
  return skupina(k, (a.lastnosti ?? {})[k]) === v;
}

function Legenda({ vnosi, artikli, izbrani, izberi }) {
  const prisotni = vnosi
    .map((e) => ({ ...e, n: artikli.filter((a) => ujema(a, e.lastnost, e.vrednost)).length }))
    .filter((e) => e.n > 0);
  if (!prisotni.length) return null;
  // Vnos, ki velja za vse artikle (npr. edino pakiranje), ni filter — pokažemo ga samo kot podatek.
  const info = prisotni.filter((e) => e.n === artikli.length);
  const filtri = prisotni.filter((e) => e.n < artikli.length);
  const kljuci = [...new Set(filtri.map((e) => e.lastnost))];
  const nicIzbrano = kljuci.every((k) => !izbrani[k]);
  const samoPak = kljuci.every((k) => k === "Pakiranje");
  const slika = (e) => (
    <span className="izd-emb-sl">
      {e.slika ? <Image src={e.slika} alt={e.naziv} fill sizes="90px" style={{ objectFit: "contain", padding: 4 }} /> : <span className="izd-emb-ni">{e.naziv.slice(0, 1)}</span>}
    </span>
  );
  return (
    <div className="izd-emb">
      {filtri.length > 0 && (
        <p className="izd-mali">{samoPak ? "Pakiranje" : "Izberite"} — klikni za prikaz artiklov, ponoven klik prikaže vse</p>
      )}
      <div className="izd-emb-k">
        {filtri.length > 0 && (
          <button
            type="button"
            className={"izd-emb-vse" + (nicIzbrano ? " on" : "")}
            onClick={() => kljuci.forEach((k) => izberi(k, undefined))}
          >
            <span className="izd-emb-sl"><span className="izd-emb-ni">∑</span></span>
            <span className="izd-emb-tx">
              <b>{samoPak ? "Vsa pakiranja" : "Vse"}</b>
            </span>
          </button>
        )}
        {filtri.map((e) => {
          const on = izbrani[e.lastnost] === e.vrednost;
          return (
            <button key={e.lastnost + e.vrednost} type="button" className={on ? "on" : ""} aria-pressed={on} onClick={() => izberi(e.lastnost, on ? undefined : e.vrednost)}>
              {slika(e)}
              <span className="izd-emb-tx">
                <b>{e.naziv}</b>
              </span>
            </button>
          );
        })}
        {info.map((e) => (
          <div key={e.lastnost + e.vrednost} className="izd-emb-info">
            {slika(e)}
            <span className="izd-emb-tx">
              <b>{e.naziv}</b>
              <em>{e.lastnost === "Pakiranje" ? "pakiranje vseh artiklov" : "velja za vse artikle"}</em>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TabelaArtiklov({ artikli: vhodni, stolpci, naziviRazlicni, embalaza = [], izdelek = null, slikeVrednosti = null }) {
  const artikli = useMemo(
    () =>
      [...vhodni].sort((a, b) => {
        const la = a.lastnosti ?? {}, lb = b.lastnosti ?? {};
        return (
          rang("Material", la.Material) - rang("Material", lb.Material) ||
          (a.premer ?? 0) - (b.premer ?? 0) ||
          (a.dolzina ?? 0) - (b.dolzina ?? 0) ||
          rang("Pakiranje", la.Pakiranje) - rang("Pakiranje", lb.Pakiranje)
        );
      }),
    [vhodni]
  );
  const b2b = useB2BCene(useMemo(() => vhodni.map((a) => a.id), [vhodni]));
  const cenaZa = (a) => (b2b ? b2b.cene[a.id] ?? null : cenaArtikla(a));
  const [iskanje, setIskanje] = useState("");
  const [izbrani, setIzbrani] = useState({});
  const [prikazano, setPrikazano] = useState(KORAK);

  // Legenda: najprej posebnosti izdelka (npr. škatla AFR41), nato privzeta pakiranja
  const vnosiLegende = useMemo(() => {
    const asco = (izdelek?.pot ?? "").startsWith("/program/vijacno-blago");
    // Vrednosti lastnosti s slikami (npr. material cinkani / aluminij / baker)
    const izVrednosti = [];
    if (slikeVrednosti) {
      const kljuci = [...new Set(vhodni.flatMap((a) => Object.keys(a.lastnosti ?? {})))];
      for (const k of kljuci) {
        const vr = [...new Set(vhodni.map((a) => (a.lastnosti ?? {})[k]).filter(Boolean))];
        if (vr.length >= 2 && vr.every((v) => slikeVrednosti[String(v).toLowerCase()])) {
          for (const v of vr) izVrednosti.push({ lastnost: k, vrednost: v, ...slikeVrednosti[String(v).toLowerCase()] });
          break;
        }
      }
    }
    const vsi = [...izVrednosti, ...(Array.isArray(embalaza) ? embalaza : []), ...privzetaEmbalaza(asco, izdelek?.znamka)].map((e) => {
      const v = skupina(e.lastnost, e.vrednost);
      return v === e.vrednost ? e : { ...e, vrednost: v, naziv: "Škatla" };
    });
    const videni = new Set();
    return vsi.filter((e) => {
      const k = e.lastnost + "|" + e.vrednost;
      if (videni.has(k)) return false;
      videni.add(k);
      return true;
    });
  }, [embalaza, izdelek?.pot, izdelek?.znamka, slikeVrednosti, vhodni]);
  const kljuciLegende = useMemo(() => {
    const s = new Set();
    for (const e of vnosiLegende) if (artikli.some((a) => ujema(a, e.lastnost, e.vrednost))) s.add(e.lastnost);
    return s;
  }, [vnosiLegende, artikli]);
  const ponastavi = () => {
    setIzbrani({});
    setIskanje("");
    setPrikazano(KORAK);
  };
  const izberi = (k, v) => {
    setIzbrani((prej) => ({ ...prej, [k]: v }));
    setPrikazano(KORAK);
  };
  // Izbrana vrednost s sliko zamenja glavno sliko izdelka (GalerijaIzdelka posluša dogodek)
  useEffect(() => {
    if (!slikeVrednosti) return;
    const e = vnosiLegende.find((x) => x.slika && izbrani[x.lastnost] === x.vrednost && slikeVrednosti[String(x.vrednost).toLowerCase()]);
    window.dispatchEvent(new CustomEvent("izdelek-slika", { detail: e ? e.slika : null }));
  }, [izbrani, vnosiLegende, slikeVrednosti]);

  // Filtri samo za lastnosti z nekaj vrednostmi (2–10)
  const filtri = useMemo(
    () =>
      stolpci
        .map((k) => {
          const vrednosti = [...new Set(artikli.map((a) => (a.lastnosti ?? {})[k]).filter(Boolean))];
          return [k, vrednosti.sort(primerjaj(k))];
        })
        .filter(([k, v]) => v.length >= 2 && v.length <= 10 && !kljuciLegende.has(k)),
    [artikli, stolpci, kljuciLegende]
  );

  const vidni = useMemo(() => {
    const q = iskanje.trim().toLowerCase().replace(/\s+/g, "");
    return artikli.filter((a) => {
      for (const [k, v] of Object.entries(izbrani)) {
        if (v && !ujema(a, k, v)) return false;
      }
      if (!q) return true;
      const niz = `${a.sifra} ${a.dimenzija ?? ""} ${a.ean ?? ""}`.toLowerCase().replace(/\s+/g, "");
      return niz.includes(q);
    });
  }, [artikli, izbrani, iskanje]);

  const dolg = artikli.length > 20;
  const prikaz = vidni.slice(0, prikazano);

  return (
    <>
      <Legenda vnosi={vnosiLegende} artikli={artikli} izbrani={izbrani} izberi={izberi} />

      {dolg && (
        <div className="izd-filtri">
          <input
            type="search"
            placeholder="Išči po dimenziji ali šifri, npr. M8x40"
            value={iskanje}
            onChange={(e) => {
              setIskanje(e.target.value);
              setPrikazano(KORAK);
            }}
          />
          {filtri.map(([k, vrednosti]) => (
            <div key={k} className="izd-filter">
              <em>{k}</em>
              <button
                type="button"
                className={!izbrani[k] ? "on" : ""}
                onClick={() => setIzbrani({ ...izbrani, [k]: undefined })}
              >
                vse
              </button>
              {vrednosti.map((v) => (
                <button
                  key={v}
                  type="button"
                  className={izbrani[k] === v ? "on" : ""}
                  onClick={() => {
                    setIzbrani({ ...izbrani, [k]: izbrani[k] === v ? undefined : v });
                    setPrikazano(KORAK);
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          ))}
          {vidni.length !== artikli.length && (
            <span className="izd-stevec">
              Prikazanih {vidni.length} od {artikli.length} ·{" "}
              <button type="button" className="izd-ponastavi" onClick={ponastavi}>Prikaži vse</button>
            </span>
          )}
        </div>
      )}
      {!dolg && vidni.length !== artikli.length && (
        <p className="izd-stevec" style={{ marginBottom: 10 }}>
          Prikazanih {vidni.length} od {artikli.length} ·{" "}
          <button type="button" className="izd-ponastavi" onClick={ponastavi}>Prikaži vse</button>
        </p>
      )}

      <div style={{ overflowX: "auto" }}>
        <table className="mob-kartice">
          <thead>
            <tr>
              <th>Šifra</th>
              {naziviRazlicni && <th>Naziv</th>}
              <th>Dimenzija</th>
              {stolpci.map((k) => (
                <th key={k}>{k}</th>
              ))}
              <th className="izd-ean">EAN</th>
              <th>{stolpci.includes("Pakiranje") ? "Kos v pak." : "Pakiranje"}</th>
              <th>Zaloga</th>
              <th>{b2b ? "Vaša cena" : "Cena z DDV"}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {prikaz.map((a) => (
              <tr key={a.id}>
                <td className="mk-gl">
                  <span className="izd-sif">{a.sifra}</span>
                  {a.dimenzija && <span className="mk-dim">{a.dimenzija}</span>}
                </td>
                {naziviRazlicni && <td className="mk-cela" data-l="Naziv">{a.naziv}</td>}
                <td className="mk-skrij izd-dim" data-l="Dimenzija">{a.dimenzija ?? "—"}</td>
                {stolpci.map((k) => (
                  <td key={k} data-l={k}>{(a.lastnosti ?? {})[k] ?? "—"}</td>
                ))}
                <td className="izd-siv izd-ean" data-l="EAN">{a.ean ?? "—"}</td>
                <td data-l={stolpci.includes("Pakiranje") ? "Kos v pak." : "Pakiranje"}>{pakiranje(a)}</td>
                <td data-l="Zaloga">
                  <Zaloga vrednost={a.zaloga} sifra={a.sifra} izdelek={izdelek} />
                </td>
                <td data-l={b2b ? "Vaša cena" : "Cena z DDV"}>
                  <Cena cena={cenaZa(a)} b2b={b2b} />
                </td>
                <td className="mk-cela">
                  <VKosarico a={a} cena={cenaZa(a)} izdelek={izdelek} b2b={b2b} />
                </td>
              </tr>
            ))}
            {prikaz.length === 0 && (
              <tr>
                <td colSpan={20} className="izd-siv">
                  Ni zadetkov za izbrane filtre.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {vidni.length > prikazano && (
        <button type="button" className="izd-vec" onClick={() => setPrikazano(prikazano + KORAK * 3)}>
          Prikaži več ({vidni.length - prikazano} še)
        </button>
      )}
    </>
  );
}
