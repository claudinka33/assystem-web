// Zbere vsa slovenska besedila iz komponent, ki tečejo v brskalniku
// ("use client"), in iz lib/ datotek, ki jih te komponente uvažajo.
// Rezultat: lib/i18n/nizi-odjemalca.json — postavitev strani zanje
// pripravi angleški in nemški slovar (glej app/(splet)/layout.js).
//
// Teče samodejno pred vsako gradnjo (npm run build → prebuild), zato se
// nova ali spremenjena besedila prevedejo brez ročnega dela.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const koren = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const izhod = path.join(koren, "lib/i18n/nizi-odjemalca.json");

let parser, traverse;
try {
  parser = await import("@babel/parser");
  traverse = (await import("@babel/traverse")).default;
  if (traverse.default) traverse = traverse.default;
} catch {
  console.log("[i18n-zberi] @babel/parser ni na voljo — ostane obstoječi seznam nizov.");
  process.exit(0);
}

const { zaPrevod, kljuc } = await import(path.join(koren, "lib/i18n/skupno.js"));

function datoteke(mapa, izid = []) {
  if (!fs.existsSync(mapa)) return izid;
  for (const d of fs.readdirSync(mapa, { withFileTypes: true })) {
    const p = path.join(mapa, d.name);
    if (d.isDirectory()) {
      if (d.name === "node_modules" || d.name === "admin") continue;
      datoteke(p, izid);
    } else if (/\.(jsx?|mjs)$/.test(d.name)) izid.push(p);
  }
  return izid;
}

const jeOdjemalska = (src) => /^\s*(\/\/[^\n]*\n|\/\*[\s\S]*?\*\/\s*)*["']use client["']/.test(src);

const kandidati = [...datoteke(path.join(koren, "components")), ...datoteke(path.join(koren, "app/(splet)"))];
const odjemalske = kandidati.filter((f) => jeOdjemalska(fs.readFileSync(f, "utf8")));

// lib datoteke, ki jih uvažajo komponente v brskalniku (do globine 2)
const libDatoteke = new Set();
function poisciUvoze(f, globina) {
  const src = fs.readFileSync(f, "utf8");
  for (const m of src.matchAll(/from\s+["']@\/lib\/([^"']+)["']/g)) {
    let p = path.join(koren, "lib", m[1]);
    for (const k of ["", ".js", ".jsx", "/index.js"]) {
      if (fs.existsSync(p + k) && fs.statSync(p + k).isFile()) {
        p = p + k;
        if (!p.includes("/i18n/") && !libDatoteke.has(p)) {
          libDatoteke.add(p);
          if (globina < 2) poisciUvoze(p, globina + 1);
        }
        break;
      }
    }
  }
}
odjemalske.forEach((f) => poisciUvoze(f, 0));

const PREZRI_ATRIBUTE = new Set(["className", "href", "src", "type", "name", "id", "key", "rel", "target", "method", "autoComplete", "inputMode", "role", "htmlFor", "action", "encType", "accept", "pattern", "sizes", "loading", "fetchPriority", "decoding", "lang", "as", "variant", "style", "viewBox", "fill", "stroke", "d", "points", "transform", "xmlns", "width", "height", "objectFit", "vir"]);
const jeCssRazred = (s) => s.split(/\s+/).every((t) => /^[a-z0-9]+([-_:][a-z0-9]+)*$/.test(t)) && /[-_:]/.test(s);

const nizi = new Set();
function dodaj(s, jsx = false) {
  const k = kljuc(s);
  if (!zaPrevod(k) || jeCssRazred(k)) return;
  if (jsx) return void nizi.add(k);
  if (/^[a-z][a-zA-Z0-9]*$/.test(k) && !/[čšžćđ]/.test(k)) return; // ključ ali ime spremenljivke (camelCase)
  if (/^(sb-|as_|x-|data-|application\/|image\/|video\/|text\/|\(|@\/|<|\[|[a-z]+\[)/.test(k)) return;
  if (/(var\(--|url\(|\d(px|vw|vh|rem|em)\b|=>|\{\{|\bfunction\b|;\s*\w+:)/.test(k)) return;
  if (/^[a-z]+(\/[a-z]+)+$/.test(k)) return; // pot API (checkout/sessions)
  nizi.add(k);
}

for (const f of [...odjemalske, ...libDatoteke]) {
  const src = fs.readFileSync(f, "utf8");
  let ast;
  try {
    ast = parser.parse(src, { sourceType: "module", plugins: ["jsx"] });
  } catch (e) {
    console.warn("[i18n-zberi] preskočeno:", path.relative(koren, f), e.message);
    continue;
  }
  traverse(ast, {
    JSXText(p) {
      dodaj(p.node.value, true);
    },
    StringLiteral(p) {
      const st = p.parent;
      if (st.type === "ImportDeclaration" || st.type === "ExportNamedDeclaration" || st.type === "ExportAllDeclaration") return;
      if (st.type === "Directive" || st.type === "DirectiveLiteral") return;
      if ((st.type === "ObjectProperty" || st.type === "ObjectMethod") && st.key === p.node) return;
      if (st.type === "JSXAttribute" && PREZRI_ATRIBUTE.has(st.name?.name)) return;
      if (st.type === "CallExpression" && st.callee?.name === "require") return;
      if (st.type === "MemberExpression") return;
      if (st.type === "BinaryExpression" && ["===", "!==", "==", "!="].includes(st.operator)) return;
      if (st.type === "CallExpression" && st.callee?.type === "MemberExpression" && ["getItem", "setItem", "removeItem", "querySelector", "querySelectorAll", "addEventListener", "removeEventListener", "getElementById", "startsWith", "includes", "endsWith", "split", "replace", "get", "has", "set", "delete", "from", "select", "eq", "order", "rpc", "matchMedia", "createElement", "setAttribute", "getAttribute"].includes(st.callee.property?.name)) return;
      dodaj(p.node.value);
    },
    TemplateLiteral(p) {
      if (p.node.expressions.length === 0) dodaj(p.node.quasis.map((q) => q.value.cooked).join(""));
    },
  });
}

const seznam = [...nizi].sort((a, b) => a.localeCompare(b, "sl"));
const prej = fs.existsSync(izhod) ? fs.readFileSync(izhod, "utf8") : "";
const novo = JSON.stringify(seznam, null, 0).replace(/","/g, '",\n"') + "\n";
if (prej !== novo) fs.writeFileSync(izhod, novo);
console.log(`[i18n-zberi] ${seznam.length} nizov iz ${odjemalske.length} komponent in ${libDatoteke.size} lib datotek.`);
