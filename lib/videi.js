// Videi izdelkov (YouTube). Ključ = slug izdelka v katalogu.
// Pokažejo se v pasu VIDEO · LETAK · CERTIFIKAT na strani izdelka in na strani znamke.
export const MUNGO_VIDEI = [
  { slug: "mungo-vlozek-mq", id: "FlI0BrjT37M", naslov: "Najlonski vložek MQ Quattro" },
  { slug: "jekleno-sidro-m1", href: "/program/pritrdila-za-beton/jekleno-sidro-m1", id: "YmR_lEKGw5c", naslov: "Jekleno sidro m1" },
  { slug: "jekleno-sidro-txm2", href: "/program/pritrdila-za-beton/jekleno-sidro-txm2", id: "09LwqShaQ4I", naslov: "Jekleno sidro m2" },
  { slug: "mungo-vlozek-mfj", id: "o4RsumkDaJ8", naslov: "Vložek MFJ" },
  { slug: "mungo-vlozek-mjp", id: "dm3ryXMhBCg", naslov: "Vložek MJP" },
];

// Lastni montažni videi (MP4 v public/videi). Uporabijo se, če izdelek v adminu nima svojega videa.
export const MP4_VIDEI = {
  "zicniki-gradbeni": { mp4: "/videi/hammex-zicniki-gradbeni.mp4", naslov: "HAMMEX gradbeni žičniki – montaža" },
  "zicniki-lepenkarji": { mp4: "/videi/hammex-zicniki-lepenkarji.mp4", naslov: "HAMMEX lepenkarji – montaža" },
  "zicniki-strojni": { mp4: "/videi/hammex-zicniki-strojni.mp4", naslov: "HAMMEX strojni žičniki – montaža" },
  "zicniki-kolarniki": { mp4: "/videi/hammex-zicniki-kolarniki.mp4", naslov: "HAMMEX kolarniki – montaža" },
  "cevno-drzalo": { mp4: "/videi/asfix-cevno-drzalo.mp4", naslov: "ASfix cevno držalo – montaža" },
};

export const VIDEI_IZDELKOV = { ...Object.fromEntries(MUNGO_VIDEI.map((v) => [v.slug, { id: v.id, naslov: v.naslov }])), ...MP4_VIDEI };
