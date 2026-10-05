import { site } from "@/lib/site";

// Identifikacijski podatki ponudnika (ZGD-1, ZVPot-1, ZEPT)
export default function PodatkiPodjetja() {
  const p = site.podjetje;
  const vrstice = [
    ["Firma", p.polnoIme],
    ["Skrajšano ime", site.ime],
    ["Sedež", p.naslov],
    ["Matična številka", p.maticna],
    ["ID za DDV", p.davcna],
    ["Vpis v register", `${p.sodisce}, sodni register`],
    p.osnovniKapital && ["Osnovni kapital", p.osnovniKapital],
    ["Zastopnik", p.zastopnik],
    ["Transakcijski račun", p.trr],
    ["Telefon", site.telefon],
    ["E-pošta", `${site.email} · naročila: ${site.emailProdaja}`],
  ].filter(Boolean);
  return (
    <table>
      <tbody>
        {vrstice.map(([k, v]) => (
          <tr key={k}>
            <th style={{ width: "34%" }}>{k}</th>
            <td>{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
