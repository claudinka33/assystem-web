# assystem.si

Spletna stran AS system d.o.o. — Next.js 16 (App Router) + Tailwind 4, deploy na Vercel.

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
| Kategorije programa (naziv, opis, slug) | `lib/site.js` → `kategorije` |
| Barve, tipografija, vzorec vijakov | `app/globals.css` |
| Besedila domače strani | `app/page.js` |
| Posamezna podstran | `app/<ime-strani>/page.js` |
| Meta naslov in opis za Google | `metadata` na vrhu vsake `page.js` |
| Sitemap za Google | `app/sitemap.js` |

## Dizajn

- antracit `#2B2E32`, rdeča `#C8102E`
- naslovi: Barlow Condensed 800, besedilo: Barlow
- vzorec vijakov (`public/vzorec-vijaki.png`) samo na temnih in rdečih pasovih

## Okoljske spremenljivke (Vercel → Settings → Environment Variables)

Še niso v uporabi, dodamo jih ob naslednjem koraku:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
```
