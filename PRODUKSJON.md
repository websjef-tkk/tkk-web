# Huskeliste: Produksjonssetting

> **Status:** Siden kjører som testversjon på Vercel: https://tkk-web-seven.vercel.app/no
> Medlemsfunksjoner (innlogging, registrering, profil, admin) er foreløpig skjult bak `ENABLE_MEMBERS=false` — sett denne til `true` (og `NEXT_PUBLIC_ENABLE_MEMBERS=true`) når database og e-post er på plass.
> Databasen er fortsatt SQLite (kun til utvikling) — **må** byttes til ekstern Postgres før medlemsfunksjoner kan skrus på i produksjon, se punkt 4.

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
- [ ] Seede innhold til Sanity (kjør lokalt mot prod-prosjektet):
  ```bash
  npx tsx sanity/generate-ndjson.ts
  npx sanity dataset import sanity/seed-content.ndjson --dataset production --missing
  ```
  - `--missing` legger kun til dokumenter som ikke finnes fra før — tryggt å kjøre på nytt
  - `--replace` (ikke `--missing`) brukes bare ved strukturelle endringer i skjemaet
  - `sanity/seed-content.ndjson` er gitignored og genereres lokalt
- [ ] Logg inn på Studio (`/studio`) og legg inn innhold:
  - `siteSettings` — heltetittel, bunntekst-tagline, sosiale lenker, adresse
  - `person` — styre, gruppeledere og andre kontakter
  - `disciplinePage` — én per disiplin (hav, elv, flattvann, surfski, polo, junior); `body` er én sammenhengende Portable Text-editor der overskrifter brukes direkte
  - `flexiblePage` — alle HMS-sider + Klubben-sider + Medlemskap; `body` er én sammenhengende Portable Text-editor (h2 for seksjonsoverskrifter, h3 for underoverskrifter)
  - `event` — kommende aktiviteter og turer
  - `blogPost` — blogginnlegg

---

## 2. Admin-bruker (leder@tkk.no)

- [ ] Kjør `npm run seed` i produksjonsmiljøet (eller lokalt mot prod-databasen)
  - Scriptet oppretter `leder@tkk.no` med `isAdmin: true`, skriver ut engangspassord og e-postbekreftelseslenke til terminalen
- [ ] Klikk bekreftelseslenken → e-post bekreftet
- [ ] Logg inn på nettstedet med engangspassordet → bytt passord hvis ønskelig
- [ ] Verifiser at Admin-lenken vises i navigasjonen og at `/admin/members` er tilgjengelig

---

## 3. Hosting og domene

- [x] Velg hostingplattform — **Vercel** er valgt og prosjektet kjører allerede som testversjon på `tkk-web-seven.vercel.app`
- [ ] Koble domenet `tkk.no` til Vercel-prosjektet (Vercel-dashboard → Settings → Domains)
- [ ] Sett opp HTTPS (skjer automatisk på Vercel når domenet er koblet til)
- [ ] Verifiser at `www.tkk.no` og `tkk.no` begge virker (redirect én til den andre)
- [ ] Oppdater `NEXT_PUBLIC_APP_URL` i Vercel-miljøvariablene til `https://tkk.no` når domenet er live (i dag peker den sannsynligvis mot Vercel-URL-en)
- [ ] Sett `ENABLE_MEMBERS=true` og `NEXT_PUBLIC_ENABLE_MEMBERS=true` i Vercel når database (punkt 4) og e-post (punkt 6) er klare

---

## 4. Database

- [ ] Bytt ut SQLite med en ekstern database — SQLite er kun egnet for utvikling
  - Anbefalt: **Neon** (gratis PostgreSQL i skyen) eller **Supabase** — velg **EU-region** for GDPR
  - Obs: persondata (navn, fødselsdato, telefon) lagres her — EU er påkrevd
- [ ] Oppdater `prisma/schema.prisma`: endre `provider = "sqlite"` til `provider = "postgresql"`
- [ ] Oppdater `prisma.config.ts` med ny connection URL
- [ ] Fjern `@prisma/adapter-better-sqlite3` og `better-sqlite3` fra `package.json`; installer `@prisma/adapter-neon` eller tilsvarende
- [ ] Oppdater `src/lib/prisma.ts` til å bruke riktig adapter for valgt database
- [ ] Kjør `npx prisma migrate deploy` mot produksjonsdatabasen
- [ ] Legg til `DATABASE_URL` i miljøvariablene på hostingplattformen

---

## 5. Miljøvariabler (sett disse i Vercel-dashboardet, IKKE i kode)

Vercel → Project Settings → Environment Variables. Husk å sette de samme variablene for både **Production** og **Preview** (preview brukes f.eks. ved branch-deploys), og kjør en ny deploy etter endring.

### Database
- [ ] `DATABASE_URL` — produksjons-URL til PostgreSQL

### App
- [ ] `NEXT_PUBLIC_APP_URL` — f.eks. `https://tkk.no` (sett til Vercel-URL-en til domenet er koblet til)
- [ ] `SESSION_SECRET` — lang, tilfeldig streng (generer med `openssl rand -hex 32`)
- [ ] `ENABLE_MEMBERS` — `true` for å skru på medlemsfunksjoner (server-side gate i `next.config.ts`)
- [ ] `NEXT_PUBLIC_ENABLE_MEMBERS` — `true`, samme verdi som over (styrer synlighet av lenker i `Nav.tsx`)

### E-post
- [ ] `SMTP_HOST`
- [ ] `SMTP_PORT` — vanligvis `587` (STARTTLS) eller `465` (SSL)
- [ ] `SMTP_SECURE` — `true` hvis port 465, ellers `false`
- [ ] `SMTP_USER`
- [ ] `SMTP_PASS`
- [ ] `SMTP_FROM` — f.eks. `Trondhjems Kajakklubb <noreply@tkk.no>`

### Sanity
- [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID` — fra manage.sanity.io (erstatt `placeholder`)
- [ ] `NEXT_PUBLIC_SANITY_DATASET` — `production`
- [ ] `SANITY_API_READ_TOKEN` — Viewer-token fra Sanity
- [ ] `SANITY_WEBHOOK_SECRET` — hemmelig token for ISR-webhook

### NIF
- [ ] `NIF_API_BASE_URL` — base-URL fra NIF (fyll inn når tilgang er innvilget)
- [ ] `NIF_API_KEY` — API-nøkkel fra NIF
- [ ] `NIF_ORG_ID` — TKKs organisasjons-ID i NIF
- [ ] `NIF_MOCK_ALWAYS_FOUND` — sett til `false` i produksjon

---

## 6. E-post

- [ ] Sett opp en e-posttjeneste for utgående e-post — vanlig webhotell-SMTP kan blokkeres av spamfiltre
  - Anbefalt: **Resend** (enkel, rimelig, god leveringsrate) eller **Postmark**
  - Alternativ: Gmail/Workspace SMTP hvis dere allerede bruker det
- [ ] Verifiser at domenet `tkk.no` har riktige **SPF**, **DKIM** og **DMARC**-oppføringer i DNS
- [ ] Test at bekreftelsesmail faktisk leveres og ikke havner i spam

---

## 7. NIF API-integrasjon

- [ ] Søk om API-tilgang hos Norges Idrettsforbund
- [ ] Finn riktig endepunkt for PersonInfo-oppslag på e-post
- [ ] Oppdater `src/lib/nif.ts` hvis endepunkt-URL eller responsformat avviker fra stubben
- [ ] Test oppslaget mot NIF staging-miljø før produksjon
- [ ] Verifiser at feltene (`personId`, `firstName`, `lastName`, `birthDate`, `primaryEmail`, `primaryPhoneMobile`) stemmer med faktisk API-respons

---

## 8. Sikkerhet

- [ ] Sjekk at `.env.local` **ikke** er committet til GitHub (det er det ikke — `.env*` er i `.gitignore`)
- [ ] Sett `NODE_ENV=production` på hostingplattformen (Vercel gjør dette automatisk)
- [ ] Aktiver `SMTP_SECURE=true` og bruk port 465 hvis SMTP-leverandøren støtter det
- [ ] Vurder rate-limiting på `/api/auth/register` og `/api/auth/login` for å hindre brute-force
  - Vercel Edge Middleware eller Upstash Ratelimit
- [ ] Vurder å aktivere Content Security Policy (CSP)-header i `next.config.ts`
- [ ] Sanity lagrer data i EU (Belgia) som standard — ingen ekstra konfigurasjon nødvendig for GDPR

---

## 9. Bilder og statiske filer

- [ ] Last opp bilder til Sanity Studio (brukes av `disciplinePage` og `blogPost`)
- [ ] Erstatt evt. gjenværende bilder under `public/images/` med egne bilder dere har rettigheter til
- [ ] Legg til `favicon.ico` og evt. `apple-touch-icon.png` under `public/`

---

## 10. Analytics og overvåking (valgfritt, men anbefalt)

- [ ] Sett opp **Plausible** eller **Fathom** for personvernvennlig statistikk (ingen cookie-banner nødvendig)
- [ ] Sett opp feillogging, f.eks. **Sentry**, for å fange opp produksjonsfeil
- [ ] Verifiser siden i **Google Search Console** for å overvåke synlighet

---

## 11. Sluttsjekk

- [ ] Test hele registreringsflyt i produksjonsmiljø (registrer → e-post → NIF-samtykke → profil)
- [ ] Test logg inn / logg ut
- [ ] Test admin-tilgang: logg inn som `leder@tkk.no` → Admin-lenke vises → `/admin/members` laster
- [ ] Bekreft at Sanity-innhold vises på alle sider (blogg, aktiviteter, disiplinside, HMS-sider, osv.)
- [ ] Test Sanity-webhook: publiser en endring i Studio → vent ~10 sek → bekreft at siden oppdateres
- [ ] Test at `/studio` laster og at du kan redigere innhold
- [ ] Test at NIF-data hentes korrekt (eller at mock-modus er deaktivert)
- [ ] Test språkbytte (norsk ↔ engelsk)
- [ ] Test på mobil og nettbrett
- [ ] Kjør Lighthouse (i Chrome DevTools) og sjekk ytelse, tilgjengelighet og SEO

---

## Rask prioritert rekkefølge

> Hosting (Vercel) er allerede satt opp og kjører som testversjon — gjenstående arbeid er innhold, database og domene før medlemsfunksjoner og `tkk.no` kan skrus på.

1. **Sanity CMS** — opprett prosjekt (EU), kopier Project ID, fyll inn innhold
2. **Database** (PostgreSQL i EU) + **miljøvariabler i Vercel** → uten dette kan ikke autentisering kjøre
3. **E-post** (SMTP + DNS) → uten dette kan ikke brukere bekrefte kontoen sin
4. **Admin-bruker** — kjør `npm run seed`, klikk verifiseringslenke
5. **Domene** — koble `tkk.no` til Vercel-prosjektet, oppdater `NEXT_PUBLIC_APP_URL`
6. **Skru på medlemsfunksjoner** — sett `ENABLE_MEMBERS=true` / `NEXT_PUBLIC_ENABLE_MEMBERS=true` i Vercel
7. **NIF API** → søk om tilgang tidlig, det kan ta tid å få svar
8. **Innhold** → legg inn alt i Sanity Studio
