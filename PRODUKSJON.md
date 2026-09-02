# Huskeliste: Produksjonssetting

> **Status:** Siden kjører som testversjon på Vercel: https://tkk-web-seven.vercel.app/
> Nettstedet er norskspråklig og har ingen innlogging eller medlemsdatabase — det er en
> ren innholdsside drevet av Sanity CMS.

## 1. Sanity CMS (gjør dette FØRST — prosjekt-ID trengs overalt)

- [ ] Gå til [manage.sanity.io](https://manage.sanity.io) og opprett nytt prosjekt
  - Sanity lagrer all data i EU (Belgia) som standard — ingen regionvalg nødvendig
  - Dataset-navn: `production`
- [ ] Kopier **Project ID** og oppdater `NEXT_PUBLIC_SANITY_PROJECT_ID` i hosting-miljøvariablene
- [ ] Opprett et **read token** (Settings → API → Tokens → Add API token → Viewer)
  - Bruk dette som `SANITY_API_READ_TOKEN`
- [ ] Opprett et **webhook-hemmelig token** for ISR-revalidering
  - Settings → API → Webhooks → Create webhook
  - URL: `https://tkk.no/api/revalidate?secret=<SANITY_WEBHOOK_SECRET>`
  - Trigger på: publish, unpublish, delete
  - Bruk samme token som `SANITY_WEBHOOK_SECRET`
- [ ] Inviter `leder@tkk.no` som **Administrator** (Settings → Members → Invite)
- [ ] Innholdet er allerede seedet til `production`-datasettet (engangsimport er gjort og de tilhørende scriptene er fjernet fra repoet) — bekreft heller at alt vises korrekt i Studio (`/studio`)
- [ ] Logg inn på Studio (`/studio`) og gå gjennom innholdet:
  - `siteSettings` — forsidekarusell, bunntekst-tagline, sosiale lenker, adresse, samarbeidspartnere
  - `person` — styre, gruppeledere og andre kontakter
  - `disciplinePage` — én per disiplin (hav, elv, flattvann, surfski, polo, junior); `body` er én sammenhengende Portable Text-editor der overskrifter brukes direkte
  - `flexiblePage` — alle HMS-sider + Klubben-sider + Medlemskap; `body` er én sammenhengende Portable Text-editor (h2 for seksjonsoverskrifter, h3 for underoverskrifter)
  - `event` — kommende aktiviteter og turer. Husk feltet **Disiplin** — det styrer grenmerkelappen på aktivitetskortene
  - `blogPost` — blogginnlegg

---

## 2. Hosting og domene

- [x] Velg hostingplattform — **Vercel** er valgt og prosjektet kjører allerede som testversjon på `tkk-web-seven.vercel.app`
- [ ] Koble domenet `tkk.no` til Vercel-prosjektet (Vercel-dashboard → Settings → Domains)
- [ ] Sett opp HTTPS (skjer automatisk på Vercel når domenet er koblet til)
- [ ] Verifiser at `www.tkk.no` og `tkk.no` begge virker (redirect én til den andre)
- [ ] Oppdater `NEXT_PUBLIC_APP_URL` i Vercel-miljøvariablene til `https://tkk.no` når domenet er live

---

## 3. Miljøvariabler (sett disse i Vercel-dashboardet, IKKE i kode)

Vercel → Project Settings → Environment Variables. Husk å sette de samme variablene for både **Production** og **Preview** (preview brukes f.eks. ved branch-deploys), og kjør en ny deploy etter endring.

### App
- [ ] `NEXT_PUBLIC_APP_URL` — f.eks. `https://tkk.no` (sett til Vercel-URL-en til domenet er koblet til)

### Sanity
- [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID` — fra manage.sanity.io
- [ ] `NEXT_PUBLIC_SANITY_DATASET` — `production`
- [ ] `SANITY_API_READ_TOKEN` — Viewer-token fra Sanity
- [ ] `SANITY_WEBHOOK_SECRET` — hemmelig token for ISR-webhook
- [ ] `SANITY_WRITE_TOKEN` — Sanity-token med skriverettigheter (Settings → API → Tokens → Add API token → Editor), brukes av iSonen-synken

### NIF Activity API (iSonen-synk)
- [ ] `NIF_ORG_ID` — TKKs organisasjons-ID i NIF
- [ ] `NIF_ACTIVITY_API_BASE_URL` — base-URL for data.nif.no activity-API (fyll inn når tilgang er innvilget)
- [ ] `NIF_ACTIVITY_CLIENT_ID` — OAuth2 client id
- [ ] `NIF_ACTIVITY_CLIENT_SECRET` — OAuth2 client secret
- [ ] `NIF_ACTIVITY_MOCK` — sett til `false` i produksjon (kun `true` for lokal testing uten reell tilgang)
- [ ] `CRON_SECRET` — beskytter `/api/sync-isonen`-endepunktet mot uautorisert kjøring

---

## 4. NIF Activity API — daglig import av aktiviteter fra iSonen

- [ ] Søk om API-tilgang til `data.nif.no` sitt activity-API (scope `data_activity_read`)
- [ ] Be om OAuth2 client-ID/secret når tilgang er innvilget
- [ ] Verifiser faktisk responsformat fra `EventsForOrg/Schedule` mot antagelsene i `src/lib/isonen.ts` (feltnavn er ikke bekreftet — se kommentar i filen) og juster mapping om nødvendig
- [ ] Test synk-ruten (`/api/sync-isonen`) manuelt mot reelle data før cron skrus på i produksjon
- [ ] Bekreft at kun aktiviteter fra "Trondhjems Kajakklubb" og "Trondhjems Kajakklubb - Padling" dukker opp som kladder i Sanity
- [ ] Sett `NIF_ACTIVITY_MOCK=false` i produksjon
- [ ] Bekreft at cron-jobben i `vercel.json` faktisk kjører daglig (Vercel-dashboard → Deployments → Cron Jobs)

---

## 5. Sikkerhet

- [ ] Sjekk at `.env` **ikke** er committet til GitHub (det er det ikke — `.env*` er i `.gitignore`)
- [ ] Sett `NODE_ENV=production` på hostingplattformen (Vercel gjør dette automatisk)
- [ ] Vurder å aktivere Content Security Policy (CSP)-header i `next.config.ts`
- [ ] Sanity lagrer data i EU (Belgia) som standard — ingen ekstra konfigurasjon nødvendig for GDPR

---

## 6. Bilder og statiske filer

- [ ] Last opp bilder til Sanity Studio (brukes av forsidekarusellen, `disciplinePage` og `blogPost`)
- [ ] Erstatt evt. gjenværende bilder under `public/images/` med egne bilder dere har rettigheter til
- [ ] Legg til `favicon.ico` og evt. `apple-touch-icon.png` under `public/`

---

## 7. Analytics og overvåking (valgfritt, men anbefalt)

- [ ] Sett opp **Plausible** eller **Fathom** for personvernvennlig statistikk (ingen cookie-banner nødvendig)
- [ ] Sett opp feillogging, f.eks. **Sentry**, for å fange opp produksjonsfeil
- [ ] Verifiser siden i **Google Search Console** for å overvåke synlighet
  - Gamle `/no/…`- og `/en/…`-adresser sender nå 308 videre til adressen uten språkprefiks

---

## 8. Sluttsjekk

- [ ] Bekreft at Sanity-innhold vises på alle sider (blogg, aktiviteter, disiplinside, HMS-sider, osv.)
- [ ] Test Sanity-webhook: publiser en endring i Studio → vent ~10 sek → bekreft at siden oppdateres
- [ ] Test at `/studio` laster og at du kan redigere innhold
- [ ] Test forsidekarusellen: at strekene nederst bytter bilde, og at knappene går dit de skal
- [ ] Test at "Loggbok" i menyen åpner padleboken.no i ny fane
- [ ] Test på mobil og nettbrett
- [ ] Kjør Lighthouse (i Chrome DevTools) og sjekk ytelse, tilgjengelighet og SEO

---

## Rask prioritert rekkefølge

> Hosting (Vercel) er allerede satt opp og kjører som testversjon — gjenstående arbeid er innhold og domene.

1. **Sanity CMS** — opprett prosjekt (EU), kopier Project ID, fyll inn innhold
2. **Miljøvariabler i Vercel**
3. **Domene** — koble `tkk.no` til Vercel-prosjektet, oppdater `NEXT_PUBLIC_APP_URL`
4. **NIF Activity API** → søk om tilgang tidlig, det kan ta tid å få svar
5. **Innhold** → legg inn alt i Sanity Studio
