<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Jeziki: /en in /de se prevedejo sami

Stran pišeš samo v slovenščini. Angleška (/en/...) in nemška (/de/...) različica nastaneta samodejno (lib/i18n/):
- `proxy.js` prepiše /en/x → /x in nastavi glavo `x-jezik`.
- Vsaka `page.js` v `app/(splet)` mora biti ovita: `export default prevedenaStran(Stran)` in metapodatki prek `generateMetadata() { return prevediMetadata(metadataSl) }` (`lib/i18n/streznik.js`).
- Vsaka komponenta z `"use client"` mora biti ovita: `export default prevedeno(Komponenta)` (`lib/i18n/odjemalec.jsx`). Nizi iz teh komponent se zberejo pred gradnjo (`scripts/i18n-zberi.mjs` → `lib/i18n/nizi-odjemalca.json`).
- Besedila, sestavljena iz spremenljivk v brskalniku (`` `${n} kosov` ``), se ne prevedejo — v takih primerih uporabi `const { t } = useJezik()` in `t("kosov")`.
- Prevodi so v tabeli `prevodi` (Supabase), naredi jih Claude API (`ANTHROPIC_API_KEY`); ročni popravki v /admin/prevodi.
- Česar ne smeš prevesti, označi z `translate="no"` (ali `data-ne-prevedi`).
