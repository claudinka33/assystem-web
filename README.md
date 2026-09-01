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
