# assystem.si

Spletna stran AS system d.o.o. — Next.js (App Router) + Vercel.

## Zagon lokalno

```
npm install
npm run dev
```

## Kje kaj popraviš

| Kaj | Datoteka |
|---|---|
| Telefon, e-pošta, naslovi, družbena omrežja | `lib/site.js` |
| Meni v glavi strani | `lib/site.js` → `navigacija` |
| Kategorije programa (naziv, opis, slug, slika) | `lib/site.js` → `kategorije` |
| Barve, pisave, ves videz | `app/globals.css` |
| Besedila domače strani | `app/page.js` |
| Posamezna podstran | `app/<ime-strani>/page.js` |
| Meta naslov in opis za Google | `metadata` na vrhu vsake `page.js` |
| Sitemap za Google | `app/sitemap.js` |

## Slike

Vse gredo v `public/slike/`. V kodo se pišejo kot `/slike/ime.jpg`.
Imena brez šumnikov, presledkov in velikih črk.

## Dizajn

- antracit `#1A1D21`, rdeča `#C8102E`, svetlo siva `#F4F6F7`
- naslovi: Archivo 800/900, velike tiskane
- besedilo: Inter
- rdeča nosi tri točke na strani: hero, poziv za private label, poudarki

## Okoljske spremenljivke (Vercel → Settings → Environment Variables)

Dodamo jih ob naslednjem koraku:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
```


## Administracija

Naslov: `/admin` — prijava z e-naslovom in geslom iz Supabase Authentication.

| Modul | Kaj urejaš |
|---|---|
| Kategorije | skupine in podskupine programa, slika, vrstni red, SEO |
| Izdelki | opis, uporaba, prednosti, slika + **artikli** (šifra, dimenzija, EAN, cena, zaloga) + **dokumenti** (ETA, DoP, letak, navodila) |
| Novice | objave za Aktualno |
| Povpraševanja | sporočila s strani, status obdelave |
| Besedila na strani | naslovi in odstavki na domači strani in podstraneh |
| Prijave za delo | prispele prijave z življenjepisi |
| Nastavitve | telefon, mail, naslovi, socialna omrežja |

Slike in PDF-ji se nalagajo neposredno v Supabase shrambo (`slike`, `dokumenti`).

## Okoljske spremenljivke

V Vercelu: Settings → Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://fnyfdrqbxgbdyxxttpje.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
```

`SUPABASE_SECRET_KEY` je tajni ključ iz Supabase → Settings → API Keys → Secret keys.
Uporablja se samo na strežniku, nikoli v brskalniku.


## Vrstni red SQL datotek

1. `01-baza.sql` — kategorije, izdelki, artikli, dokumenti, novice, povpraševanja
2. `02-trgovina.sql` — kupci, podjetja, ceniki, naročila, dostava
3. `03-vsebine.sql` — besedilni bloki za admin

## Merjenje

GA4 in Meta Pixel se naložita šele po privolitvi obiskovalca. Dodaj v Vercel:

```
NEXT_PUBLIC_GA_ID=G-XXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=123456789
```

Konverzije: `povprasevanje_poslano` (Meta: Lead), `prijava_zaposlitev`.
