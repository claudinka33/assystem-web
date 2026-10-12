// Sprožitev konverzije v Google Analytics in Meta Pixlu.
// Klic je varen tudi, kadar obiskovalec ni privolil — takrat se ne zgodi nič.

// GA4 ime -> standardni Meta dogodek (fbq "track"); ostali gredo kot "trackCustom".
const META_STANDARD = {
  povprasevanje_poslano: "Lead",
  prijava_zaposlitev: "SubmitApplication",
  katalog_prenos: "ViewContent",
  add_to_cart: "AddToCart",
  begin_checkout: "InitiateCheckout",
  purchase: "Purchase",
};

export function dogodek(ime, podatki = {}) {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", ime, podatki);
  }

  if (typeof window.fbq === "function") {
    const meta = META_STANDARD[ime];
    const { value, currency, ...ostalo } = podatki;
    const mp = value !== undefined ? { value, currency: currency ?? "EUR", ...ostalo } : podatki;
    if (meta) window.fbq("track", meta, mp);
    else window.fbq("trackCustom", ime, podatki);
  }
}

// Za dogodke takoj ob nalaganju strani: počaka, da se merilni skripti naložijo (največ ~6 s).
export function dogodekKoJePripravljeno(ime, podatki = {}) {
  if (typeof window === "undefined") return;
  let poskusi = 0;
  const t = setInterval(() => {
    poskusi++;
    if (typeof window.gtag === "function" || typeof window.fbq === "function" || poskusi > 20) {
      clearInterval(t);
      dogodek(ime, podatki);
    }
  }, 300);
}
