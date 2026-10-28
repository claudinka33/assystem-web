// Brskalniški del lastnega merjenja (brez piškotkov, brez localStorage).
// Pošilja oglede strani, dogodke in čas na strani na /api/obisk.

let prviOgled = true;
let aktivnaPot = null;
let od = 0;
let nabrano = 0;

export function poslji(ime, { pot, vrednost, podatki, notranje } = {}) {
  if (typeof window === "undefined") return;
  // avtomatizirani brskalniki (roboti, preverjanja strežnikov) se ne štejejo
  if (navigator.webdriver) return;
  try {
    const telo = JSON.stringify({
      ime,
      pot: pot ?? window.location.pathname,
      naslov: document.title || null,
      q: window.location.search || "",
      ref: ime === "ogled" && prviOgled ? document.referrer || "" : "",
      notranje: notranje ?? !(ime === "ogled" && prviOgled),
      jezik: navigator.language || null,
      w: window.screen?.width || window.innerWidth || 0,
      vrednost,
      podatki,
    });
    if (ime === "ogled") prviOgled = false;
    const blob = new Blob([telo], { type: "text/plain" });
    if (!(navigator.sendBeacon && navigator.sendBeacon("/api/obisk", blob))) {
      fetch("/api/obisk", { method: "POST", body: telo, keepalive: true }).catch(() => {});
    }
  } catch {}
}

// Čas na strani: šteje samo, ko je zavihek viden.
function izplacaj() {
  if (!aktivnaPot) return;
  if (od) {
    nabrano += Date.now() - od;
    od = document.visibilityState === "visible" ? Date.now() : 0;
  }
  const s = Math.round(nabrano / 1000);
  nabrano = 0;
  if (s >= 1) poslji("cas_na_strani", { pot: aktivnaPot, vrednost: Math.min(s, 1800), notranje: true });
}

let poslusam = false;
function poslusaj() {
  if (poslusam) return;
  poslusam = true;
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") izplacaj();
    else od = Date.now();
  });
  window.addEventListener("pagehide", izplacaj);
}

export function ogledStrani(pot) {
  if (typeof window === "undefined") return;
  poslusaj();
  izplacaj();
  aktivnaPot = pot;
  nabrano = 0;
  od = document.visibilityState === "visible" ? Date.now() : 0;
  // naslov strani se nastavi malo po menjavi poti
  setTimeout(() => poslji("ogled", { pot }), 150);
}
