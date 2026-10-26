import ExcelJS from "exceljs";
import { trenutniAdmin } from "@/lib/supabase-server";
import { podatkiPorocila, casSl, odstotek, imePovezave } from "@/lib/enovice-porocilo";

// Izvoz statistike kampanje v Excel (.xlsx): Povzetek, Prejemniki, Za klic, Odbiti.
const RDECA = "FFCB2026";
const ANTRACIT = "FF3F4140";

function glava(ws, stolpci) {
  ws.columns = stolpci;
  const r = ws.getRow(1);
  r.font = { bold: true, color: { argb: "FFFFFFFF" } };
  r.fill = { type: "pattern", pattern: "solid", fgColor: { argb: ANTRACIT } };
  r.alignment = { vertical: "middle" };
  r.height = 20;
  ws.views = [{ state: "frozen", ySplit: 1 }];
  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: stolpci.length } };
}

export async function GET(_req, { params }) {
  if (!(await trenutniAdmin())) return new Response("Ni dostopa", { status: 401 });
  const { id } = await params;
  const p = await podatkiPorocila(id);
  if (!p) return new Response("Kampanja ne obstaja", { status: 404 });
  const { k, povzetek: s, prave, prejemniki } = p;

  const wb = new ExcelJS.Workbook();
  wb.creator = "AS system";
  wb.created = new Date();

  // 1 · Povzetek
  const ws = wb.addWorksheet("Povzetek");
  ws.columns = [{ width: 34 }, { width: 70 }];
  ws.addRow(["Poročilo e-novic · AS system"]).font = { bold: true, size: 16, color: { argb: RDECA } };
  ws.addRow([]);
  [
    ["Zadeva", k.zadeva],
    ["Interno ime", k.naziv || ""],
    ["Komu (panoga)", k.segment_ime || ""],
    ["Poslano", casSl(k.poslano_ob)],
    ["Statistika na dan", casSl(k.statistika_ob)],
  ].forEach((r) => (ws.addRow(r).getCell(1).font = { bold: true }));
  ws.addRow([]);
  ws.addRow(["Številke", ""]).font = { bold: true, size: 13 };
  [
    ["Poslano prejemnikom", s.prejemniki],
    ["Dostavljeno", `${s.dostavljeno} (${odstotek(s.dostavljeno, s.prejemniki)} %)`],
    ["Odprli", `${s.odprli} (${odstotek(s.odprli, s.dostavljeno)} %)`],
    ["Kliknili", `${s.kliknili} (${odstotek(s.kliknili, s.dostavljeno)} %)`],
    ["Niso odprli", Math.max(0, s.dostavljeno - s.odprli - s.odjave)],
    ["Odbiti (naslov ne obstaja)", s.odbiti],
    ["Odjave", s.odjave],
    ["Prijave kot spam", s.pritozbe],
    ["Kliknili – verjetno pravo zanimanje", s.zanimanje],
    ["Odprli večkrat", s.vecOdprtij],
    ["Možni varnostni filtri", s.filtri],
  ].forEach((r) => (ws.addRow(r).getCell(1).font = { bold: true }));
  ws.addRow([]);
  ws.addRow(["Kliki po povezavah", "kliki / različnih oseb"]).font = { bold: true, size: 13 };
  prave.forEach((l) => ws.addRow([imePovezave(l.url), `${l.kliki} / ${l.unikatni}`]));
  ws.addRow([]);
  ws.addRow(["Opombe"]).font = { bold: true, size: 13 };
  [
    "Odprtja so približna: nekateri programi (Apple Mail, poslovni filtri) mail odprejo sami.",
    "Kliki na gumb za povpraševanje (mailto) se ne štejejo – prava povpraševanja so v nabiralniku prodaje.",
    "»Možen varnostni filter« = klik na vse povezave ali na odjavo brez odjave; najverjetneje ni človek.",
  ].forEach((t) => ws.addRow(["", t]).getCell(2).alignment = { wrapText: true });

  // 2 · Prejemniki
  const wp = wb.addWorksheet("Prejemniki");
  glava(wp, [
    { header: "E-naslov", key: "email", width: 36 },
    { header: "Podjetje (domena)", key: "podjetje", width: 26 },
    { header: "Ocena", key: "ocena", width: 44 },
    { header: "Dostavljeno", key: "dost", width: 12 },
    { header: "Odprtja", key: "odprl", width: 10 },
    { header: "Kliki", key: "kliknil", width: 8 },
    { header: "Kliknjene povezave", key: "pov", width: 50 },
  ]);
  prejemniki.forEach((x) =>
    wp.addRow({
      email: x.email,
      podjetje: x.podjetje,
      ocena: x.ocena.opis,
      dost: x.dostavljeno ? "da" : "ne",
      odprl: x.odprl || 0,
      kliknil: x.kliknil || 0,
      pov: (x.povezave ?? []).map((l) => `${imePovezave(l.url)} (${l.kliki})`).join(" | "),
    })
  );

  // 3 · Za klic (kliknili ali odprli večkrat, brez filtrov)
  const wk = wb.addWorksheet("Za klic");
  glava(wk, [
    { header: "E-naslov", key: "email", width: 36 },
    { header: "Podjetje (domena)", key: "podjetje", width: 26 },
    { header: "Zakaj", key: "ocena", width: 26 },
    { header: "Odprtja", key: "odprl", width: 10 },
    { header: "Kliki", key: "kliknil", width: 8 },
    { header: "Opomba prodaje", key: "op", width: 40 },
  ]);
  prejemniki
    .filter((x) => ["zanimanje", "vec-odprtij"].includes(x.ocena.oznaka))
    .forEach((x) => wk.addRow({ email: x.email, podjetje: x.podjetje, ocena: x.ocena.opis, odprl: x.odprl || 0, kliknil: x.kliknil || 0, op: "" }));

  // 4 · Odbiti (za čiščenje seznama)
  const wo = wb.addWorksheet("Odbiti");
  glava(wo, [
    { header: "E-naslov", key: "email", width: 36 },
    { header: "Podjetje (domena)", key: "podjetje", width: 26 },
    { header: "Razlog", key: "razlog", width: 24 },
  ]);
  prejemniki.filter((x) => x.odbit).forEach((x) => wo.addRow({ email: x.email, podjetje: x.podjetje, razlog: x.odbit }));

  const buf = await wb.xlsx.writeBuffer();
  const ime = `e-novice-${k.id}-${String(k.naziv || k.zadeva || "kampanja").replace(/[^\p{L}\p{N}]+/gu, "-").slice(0, 50)}.xlsx`;
  return new Response(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="e-novice-${k.id}.xlsx"; filename*=UTF-8''${encodeURIComponent(ime)}`,
    },
  });
}
