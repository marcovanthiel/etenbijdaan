# CLAUDE.md — etenbijdaan.nl

> Overdrachtsdoc. Lees bij sessie-start. `git fetch && git pull` eerst —
> Marco werkt vanaf meerdere machines.

## Project

Nieuwe website voor **etenbijdaan.nl** ("Eten bij Daan"). De zaak heette
voorheen **Restaurant Voldaan** (domein voldaan.eu, eigenaar Daan,
Nijmegen-Oost). We zijn begonnen met een **getrouwe kopie** van de oude
site (Wayback-snapshot 2021-07-27 van voldaan.eu): inhoud + visueel zo
dicht mogelijk overgenomen, maar als **schone, eigen HTML/CSS** herbouwd
(niet het oude Joomla-template gekopieerd).

- **Repo**: `marcovanthiel/etenbijdaan`, lokaal `~/Developer/etenbijdaan`
- **Live**: `https://etenbijdaan.nl/` (domein staat in Cloudflare)
- **Stack**: statische site via **Cloudflare Workers Static Assets**
  (assets-only Worker, geen server-code). Bron in `public/`.

## Huisstijl (overgenomen van Voldaan)

- Fonts: **Quicksand** (koppen) + **Open Sans** (tekst)
- Accent: **#CB6500** (oranje); donkere secties #333/#262626; wit
- Hero-foto + 3 waardepijlers (Puur & Eerlijk / Beleven & Ervaren /
  Maatwerk) met food-foto's; "wij zijn gesloten"-boodschap van Daan
- Beelden in `public/images/` (logo, hero, 3 food-foto's) — uit het
  archief gehaald (eigen materiaal van de zaak)

## Belangrijk: nog te doen

1. **Rebranding Voldaan → Eten bij Daan**: de kopie draagt nu nog
   "Restaurant Voldaan". Zodra Daan de nieuwe naam/logo/teksten/adres
   aanlevert, ombouwen (naam, logo, e-mail info@etenbijdaan.nl,
   "gesloten"-boodschap vervangen door de nieuwe propositie).
2. **Custom domain koppelen**: `etenbijdaan.nl` (+ www) aan de Worker
   hangen. Via dashboard: Worker `etenbijdaan` → Settings → Domains &
   Routes → Add → Custom Domain. Of `routes` met `custom_domain = true`
   in `wrangler.toml` activeren (uitgecommentarieerd) en deployen.
3. **CI-secrets** op de repo zetten: `CLOUDFLARE_API_TOKEN` +
   `CLOUDFLARE_ACCOUNT_ID` (mag dezelfde token als andere projecten).

## Lokaal / deploy

```bash
export PATH="/opt/homebrew/opt/node@22/bin:$PATH"   # wrangler eist Node 22
npm install
npm run dev      # wrangler dev (lokale preview)
npm run deploy   # handmatig deployen (lokale wrangler-OAuth)
```

**Push naar `main` → GitHub Actions deployt automatisch** (`.github/workflows/deploy.yml`,
wrangler-action v4 SHA-gepind, `wranglerVersion 4.107.0` zodat `public/_headers`
wordt toegepast). Secrets `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` staan
sinds 12-9-2026 in de repo; GitHub = bron, lokaal deployen alleen als noodfix.
Dependabot + auto-merge zoals de andere repo's. Account-ID:
`04865fcd4034789d3970c1b51950227c`.

## Changelog

- **13-9-2026**: SEO-fixes (Track A). etenbijdaan.nl gekozen als **canoniek
  domein**: self-referencing `<link rel="canonical">` op elke pagina (absolute
  URL). De site is nu een Worker + Static Assets (`src/index.js`, `main` in
  wrangler.toml): alle niet-canonieke hosts (etenvandaan.nl, etenmetdaan.nl en
  alle www-varianten) krijgen een **301** naar etenbijdaan.nl met behoud van
  pad+query. `run_worker_first = true` zodat de redirect ook op `/` en assets
  werkt. **Soft 404 opgelost**: `not_found_handling` van `single-page-application`
  naar `404-page` + nette `public/404.html` (echte HTTP 404, noindex).
  **JSON-LD** toegevoegd (@graph: LocalBusiness/FoodEstablishment + Person "Daan"
  + Service + 5-sterren Review, absolute URL's). **Geo-zoekterm**: title en H1
  bevatten nu "private chef Nijmegen e.o." (H1-subtitel). **Fonts self-hosted**:
  Quicksand + Open Sans als woff2 (latin, variabel) in `public/assets/fonts/`,
  Google Fonts + de bijbehorende CSP-uitzonderingen verwijderd; hero-font
  gepreload. `width`/`height` op content-beelden (CLS). sitemap `lastmod`
  toegevoegd. LET OP: e-mail staat nog op **info@voldaan.eu** (vierde domein);
  bewust niet gewijzigd omdat info@etenbijdaan.nl nog geen werkende mailbox is
  (NAP-punt uit de audit blijft open tot de mailbox er is). Rebranding
  Voldaan -> Eten bij Daan nog niet uitgevoerd (wacht op Daan).

- **12-9-2026**: CI-deploy geactiveerd (GitHub Actions + Dependabot; fase 3 van de
  platform-gelijktrekking). Was handmatig `npm run deploy`; nu push = deploy.

- **10-9-2026**: Toegankelijkheidsverklaring toegevoegd op `/toegankelijkheid`
  (`public/toegankelijkheid.html`, WCAG 2.2 AA-streven conform EAA/EN 301 549,
  melden via info@voldaan.eu) + footerlink "Toegankelijkheidsverklaring" op de
  homepage, footerlinks in contrastkleur, pagina in sitemap.xml.

## Bron-content opnieuw ophalen

Snapshot: `https://web.archive.org/web/20210727092604/https://www.voldaan.eu/`
Raw asset: voeg `id_` toe achter het timestamp, bv.
`https://web.archive.org/web/20210727092604id_/https://www.voldaan.eu/images/<bestand>`
