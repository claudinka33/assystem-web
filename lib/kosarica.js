"use client";

// Košarica v brskalniku (localStorage). Cene se ob oddaji naročila
// na strežniku ponovno izračunajo iz baze, zato tu služijo samo za prikaz.
import { useSyncExternalStore } from "react";

const KLJUC = "as_kosarica";
const poslusalci = new Set();
let predpomnilnik = null;

function beri() {
  if (predpomnilnik) return predpomnilnik;
  try {
    predpomnilnik = JSON.parse(localStorage.getItem(KLJUC) || "[]");
  } catch {
    predpomnilnik = [];
  }
  return predpomnilnik;
}

function pisi(postavke) {
  predpomnilnik = postavke;
  try {
    localStorage.setItem(KLJUC, JSON.stringify(postavke));
  } catch {}
  poslusalci.forEach((f) => f());
}

const PRAZNO = [];
export function useKosarica() {
  return useSyncExternalStore(
    (f) => {
      poslusalci.add(f);
      const ob = (e) => {
        if (e.key === KLJUC) {
          predpomnilnik = null;
          f();
        }
      };
      window.addEventListener("storage", ob);
      return () => {
        poslusalci.delete(f);
        window.removeEventListener("storage", ob);
      };
    },
    beri,
    () => PRAZNO
  );
}

export function dodaj(postavka, kolicina = 1) {
  const p = [...beri()];
  const i = p.findIndex((x) => x.id === postavka.id);
  if (i >= 0) p[i] = { ...p[i], kolicina: p[i].kolicina + kolicina };
  else p.push({ ...postavka, kolicina });
  pisi(p);
}

export function nastaviKolicino(id, kolicina) {
  pisi(beri().map((x) => (x.id === id ? { ...x, kolicina: Math.max(1, kolicina) } : x)));
}

export function odstrani(id) {
  pisi(beri().filter((x) => x.id !== id));
}

export function izprazni() {
  pisi([]);
}
