# Huskeliste: Produksjonssetting

## 1. Hosting og domene

- [ ] Velg hostingplattform (Vercel anbefales for Next.js — gratis plan holder til en liten klubb)
- [ ] Koble domenet `tkk.no` til hostingplattformen
- [ ] Sett opp HTTPS (skjer automatisk på Vercel/Netlify)
- [ ] Verifiser at `www.tkk.no` og `tkk.no` begge virker (redirect én til den andre)

---

## 2. Database

- [ ] Bytt ut SQLite med en ekstern database — SQLite er kun egnet for utvikling
  - Anbefalt: **Neon** (gratis PostgreSQL i skyen) eller **PlanetScale**
  - Alternativ: PostgreSQL på egen VPS
- [ ] Oppdater `prisma/schema.prisma`: endre `provider = "sqlite"` til `provider = "postgresql"`
- [ ] Oppdater `prisma.config.ts` med ny connection URL
- [ ] Kjør `npx prisma migrate deploy` mot produksjonsdatabasen
- [ ] Legg til `DATABASE_URL` i miljøvariablene på hostingplattformen

---

## 3. Miljøvariabler (sett disse i hosting-dashboardet, IKKE i kode)

- [ ] `DATABASE_URL` — produksjons-URL til PostgreSQL
- [ ] `NEXT_PUBLIC_APP_URL` — f.eks. `https://tkk.no`
- [ ] `SESSION_SECRET` — lang, tilfeldig streng (generer med `openssl rand -hex 32`)
- [ ] `SMTP_HOST` — SMTP-server for utgående e-post
- [ ] `SMTP_PORT` — vanligvis `587` (STARTTLS) eller `465` (SSL)
- [ ] `SMTP_SECURE` — `true` hvis port 465, ellers `false`
- [ ] `SMTP_USER` — brukernavn for SMTP
- [ ] `SMTP_PASS` — passord for SMTP
- [ ] `SMTP_FROM` — f.eks. `Trondhjems Kajakklubb <noreply@tkk.no>`
- [ ] `NIF_API_BASE_URL` — base-URL fra NIF (fyll inn når tilgang er innvilget)
- [ ] `NIF_API_KEY` — API-nøkkel fra NIF
- [ ] `NIF_ORG_ID` — TKKs organisasjons-ID i NIF
- [ ] `NIF_MOCK_ALWAYS_FOUND` — sett til `false` i produksjon

---

## 4. E-post

- [ ] Sett opp en e-posttjeneste for utgående e-post — vanlig webhotell-SMTP kan blokkeres av spamfiltre
  - Anbefalt: **Resend** (enkel, rimelig, god leveringsrate) eller **Postmark**
  - Alternativ: Gmail/Workspace SMTP hvis dere allerede bruker det
- [ ] Verifiser at domenet `tkk.no` har riktige **SPF**, **DKIM** og **DMARC**-oppføringer i DNS
- [ ] Test at bekreftelsesmail faktisk leveres og ikke havner i spam

---

## 5. NIF API-integrasjon

- [ ] Søk om API-tilgang hos Norges Idrettsforbund (IT-avdelingen / idrettsforbundet.atlassian.net)
- [ ] Finn riktig endepunkt for PersonInfo-oppslag på e-post (se dokumentasjon)
- [ ] Oppdater `src/lib/nif.ts` hvis endepunkt-URL eller responsformat avviker fra stubben
- [ ] Test oppslaget mot NIF staging-miljø før produksjon
- [ ] Verifiser at feltene (`personId`, `firstName`, `lastName`, `birthDate`, `primaryEmail`, `primaryPhoneMobile`) stemmer med faktisk API-respons

---

## 6. Sikkerhet

- [ ] Sjekk at `.env.local` **ikke** er committet til GitHub (det er det ikke — `.env*` er i `.gitignore`)
- [ ] Sett `NODE_ENV=production` på hostingplattformen (Vercel gjør dette automatisk)
- [ ] Aktiver `SMTP_SECURE=true` og bruk port 465 hvis SMTP-leverandøren støtter det
- [ ] Vurder rate-limiting på `/api/auth/register` og `/api/auth/login` for å hindre brute-force
  - Vercel Edge Middleware eller et eksternt verktøy som Upstash Ratelimit
- [ ] Vurder å aktivere Content Security Policy (CSP)-header i `next.config.ts`

---

## 7. Bilder og statiske filer

- [ ] Erstatt eventuelle bilder fra `www.tkk.no` med egne bilder du har rettigheter til
  - Nåværende heltebilde (`hav.jpg`) er hentet fra tkk.no — sjekk om dere eier rettighetene
- [ ] Optimaliser bilder (Next.js `<Image>` håndterer mye automatisk, men sørg for riktige størrelser)
- [ ] Legg til `favicon.ico` og evt. `apple-touch-icon.png` under `public/`

---

## 8. Innhold

- [ ] Oppdater kontaktinformasjon og personliste i `src/app/[locale]/kontakt/page.tsx` og `om-klubben/page.tsx` ved styrevalg
- [ ] Oppdater blogginnlegg i `src/data/blog.ts` med aktuelt innhold
- [ ] Oppdater aktiviteter i `src/data/events.ts`
- [ ] Vurder å sette opp **Sanity.io** (allerede planlagt) for CMS-styrt innhold slik at ikke-tekniske redaktører kan publisere artikler og aktiviteter uten å redigere kode

---

## 9. Analytics og overvåking (valgfritt, men anbefalt)

- [ ] Sett opp **Plausible** eller **Fathom** for personvernvennlig statistikk (ingen cookie-banner nødvendig)
- [ ] Sett opp feillogging, f.eks. **Sentry**, for å fange opp produksjonsfeil
- [ ] Verifiser siden i **Google Search Console** for å overvåke synlighet

---

## 10. Sluttsjekk

- [ ] Test hele registreringsflyt i produksjonsmiljø (registrer → e-post → samtykke → profil)
- [ ] Test logg inn / logg ut
- [ ] Test at NIF-data hentes korrekt
- [ ] Test språkbytte (norsk ↔ engelsk)
- [ ] Test på mobil og nettbrett
- [ ] Kjør Lighthouse (i Chrome DevTools) og sjekk ytelse, tilgjengelighet og SEO

---

## Rask prioritert rekkefølge

1. **Database** (PostgreSQL) + **miljøvariabler** → uten dette kan ikke autentisering kjøre
2. **E-post** (SMTP + DNS) → uten dette kan ikke brukere bekrefte kontoen sin
3. **NIF API** → søk om tilgang tidlig, det kan ta tid å få svar
4. **Hosting + domene** → koble alt sammen
5. **Innhold** → oppdater med faktiske data
