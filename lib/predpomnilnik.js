// Predpomnilnik javnih podatkov iz Supabase (Next Data Cache).
// Strani so dinamične (jezik iz glave zahteve), zato bi se brez tega ob vsakem
// obisku znova izvedle vse poizvedbe v bazo. Branja (GET) se zato shranijo za
// 60 s; ob vsaki spremembi v administraciji se predpomnilnik takoj počisti
// (glej osveziPodatke in lib/akcije/*).
import { revalidatePath as nextRevalidatePath, revalidateTag } from "next/cache";

export const ZNACKA_PODATKOV = "podatki";

export function fetchPodatki(url, opcije = {}) {
  const metoda = (opcije.method || "GET").toUpperCase();
  if (metoda !== "GET" && metoda !== "HEAD") return fetch(url, opcije);
  return fetch(url, { ...opcije, next: { revalidate: 60, tags: [ZNACKA_PODATKOV] } });
}

/** Počisti predpomnjene podatke (takoj, brez prikaza starih). */
export function osveziPodatke() {
  try {
    revalidateTag(ZNACKA_PODATKOV, { expire: 0 });
  } catch {}
}

/** Namesto revalidatePath iz next/cache: osveži pot in hkrati predpomnjene podatke. */
export function revalidatePath(...args) {
  osveziPodatke();
  return nextRevalidatePath(...args);
}
