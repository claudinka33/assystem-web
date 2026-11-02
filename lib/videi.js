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
  "vijak-hanger": { mp4: "/videi/asfix-cevno-drzalo-strop.mp4", naslov: "Hanger vijak in cevno držalo v strop – montaža" },
  "univerzalni-vijak-z-vlozkom-af-rk": { mp4: "/videi/asfix-af-rk.mp4", naslov: "ASfix AF-RK – montaža" },
  "univerzalni-vijak-z-vlozkom-af-rs": { mp4: "/videi/asfix-af-rs.mp4", naslov: "ASfix AF-RS – montaža" },
  "zidni-vlozek-mq": { mp4: "/videi/asfix-vlozek-mq.mp4", naslov: "Zidni vložek AS MQ – montaža" },
  "kemicno-sidro-easf-top": { mp4: "/videi/asfix-kemicne-mase.mp4", naslov: "Kemični masi EASF in PESF – montaža" },
  "kemicno-sidro-pesf-top": { mp4: "/videi/asfix-kemicne-mase.mp4", naslov: "Kemični masi EASF in PESF – montaža" },
  "perforiran-vlozek-kovinski-1m": { mp4: "/videi/asfix-kemicne-mase.mp4", naslov: "Kemična masa s kovinsko mrežico – montaža" },
  "jekleno-sidro-txh7": { mp4: "/videi/asfix-txh7.mp4", naslov: "Jekleno sidro TXH7 – montaža" },
  "turbo-vijak-za-beton": { mp4: "/videi/asfix-turbo-vijak.mp4", naslov: "Turbo vijak za beton – montaža" },
  "udarni-vijak-nylon": { mp4: "/videi/asfix-uvs.mp4", naslov: "Udarni vijak UVS – montaža" },
  "komplet-za-wc-skoljko": { mp4: "/videi/asfix-wc-komplet.mp4", naslov: "Komplet za WC školjko – montaža" },
  "komplet-za-bojler": { mp4: "/videi/asfix-komplet-bojler.mp4", naslov: "Komplet za bojler – montaža" },
  "komplet-za-umivalnik": { mp4: "/videi/asfix-komplet-umivalnik.mp4", naslov: "Komplet za umivalnik – montaža" },
  "perforiran-trak": { mp4: "/videi/asfix-perforiran-trak.mp4", naslov: "Perforiran trak – montaža" },
  "vlozek-za-gips-plasticni": { mp4: "/videi/asfix-vlozek-gips.mp4", naslov: "Vložek za gips – montaža" },
  "vlozek-za-stiropor": { mp4: "/videi/asfix-vlozek-stiropor.mp4", naslov: "Vložek za stiropor – montaža" },
  "jekleno-sidro-tx1-siroka-podlozka": { mp4: "/videi/asfix-tx1-siroka-podlozka.mp4", naslov: "Jekleno sidro TX1 s široko podložko – montaža" },
  "vijak-din-603": { mp4: "/videi/asco-din-603.mp4", naslov: "Sponski vijak DIN 603 – montaža" },
  "vijak-din-7504": { mp4: "/videi/asco-din-7504.mp4", naslov: "Samovrtalni vijak DIN 7504 – montaža" },
  "vijak-din-7504k": { mp4: "/videi/asco-din-7504.mp4", naslov: "Samovrtalni vijak DIN 7504 K – montaža" },
  "vijak-din-7504n": { mp4: "/videi/asco-din-7504.mp4", naslov: "Samovrtalni vijak DIN 7504 N – montaža" },
  "vijak-din-7504p": { mp4: "/videi/asco-din-7504.mp4", naslov: "Samovrtalni vijak DIN 7504 P – montaža" },
  "vijak-din-7981c": { mp4: "/videi/asco-kniping.mp4", naslov: "Kniping vijak DIN 7981 – montaža" },
  "vijak-din-7982c": { mp4: "/videi/asco-kniping.mp4", naslov: "Kniping vijak DIN 7982 – montaža" },
  "vijak-din-7983": { mp4: "/videi/asco-kniping.mp4", naslov: "Kniping vijak – montaža" },
  "lesni-vijak-din-571": { mp4: "/videi/asco-din-571.mp4", naslov: "Vijak stojalni DIN 571 – montaža" },
  "navojna-palica-din-975": { mp4: "/videi/asco-din-975.mp4", naslov: "Navojna palica DIN 975 – montaža" },
  "vijak-din-933": { mp4: "/videi/asco-maticni-spoj.mp4", naslov: "Spoj z vijakom, matico in podložko po DIN" },
  "vijak-din-931": { mp4: "/videi/asco-maticni-spoj.mp4", naslov: "Spoj z vijakom, matico in podložko po DIN" },
  "matica-din-934": { mp4: "/videi/asco-maticni-spoj.mp4", naslov: "Spoj z vijakom, matico in podložko po DIN" },
  "matica-din-985": { mp4: "/videi/asco-maticni-spoj.mp4", naslov: "Spoj z vijakom, matico in podložko po DIN" },
  "podlozka-din-125": { mp4: "/videi/asco-maticni-spoj.mp4", naslov: "Spoj z vijakom, matico in podložko po DIN" },
  "podlozka-din-127b": { mp4: "/videi/asco-maticni-spoj.mp4", naslov: "Spoj z vijakom, matico in podložko po DIN" },
};

export const VIDEI_IZDELKOV = { ...Object.fromEntries(MUNGO_VIDEI.map((v) => [v.slug, { id: v.id, naslov: v.naslov }])), ...MP4_VIDEI };
