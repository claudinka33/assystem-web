// Videi izdelkov (YouTube). Ključ = slug izdelka v katalogu.
// Pokažejo se v pasu VIDEO · LETAK · CERTIFIKAT na strani izdelka in na strani znamke.
export const MUNGO_VIDEI = [
  { slug: "mungo-vlozek-mq", id: "FlI0BrjT37M", naslov: "Najlonski vložek MQ Quattro" },
  { slug: "jekleno-sidro-m1", href: "/program/pritrdila-za-beton/jekleno-sidro-m1", id: "YmR_lEKGw5c", naslov: "Jekleno sidro m1" },
  { slug: "jekleno-sidro-txm2", href: "/program/pritrdila-za-beton/jekleno-sidro-txm2", id: "09LwqShaQ4I", naslov: "Jekleno sidro m2" },
  { slug: "mungo-vlozek-mfj", id: "o4RsumkDaJ8", naslov: "Vložek MFJ" },
  { slug: "mungo-vlozek-mjp", id: "dm3ryXMhBCg", naslov: "Vložek MJP" },
];

export const VIDEI_IZDELKOV = Object.fromEntries(MUNGO_VIDEI.map((v) => [v.slug, { id: v.id, naslov: v.naslov }]));
