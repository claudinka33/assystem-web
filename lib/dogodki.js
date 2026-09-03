// Sprožitev konverzije v Google Analytics in Meta Pixlu.
// Klic je varen tudi, kadar obiskovalec ni privolil — takrat se ne zgodi nič.
export function dogodek(ime, podatki = {}) {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", ime, podatki);
  }

  if (typeof window.fbq === "function") {
    const metaImena = {
      povprasevanje_poslano: "Lead",
      prijava_zaposlitev: "SubmitApplication",
      katalog_prenos: "ViewContent",
    };
    window.fbq("trackCustom", metaImena[ime] ?? ime, podatki);
  }
}
