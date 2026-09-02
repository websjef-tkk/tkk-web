# Trondhjems Kajakklubb — nettside

Nettsiden til Trondhjems Kajakklubb (tkk.no). Bygget med Next.js og [Sanity](https://www.sanity.io/) som CMS — alt redaksjonelt innhold (sider, arrangementer, blogginnlegg, kontaktpersoner) redigeres i Sanity Studio, ikke i kode.

## Teknologier

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- [Sanity](https://www.sanity.io/) som headless CMS, innebygd i appen på `/studio`
- Tailwind CSS
- Hostes på Vercel

## Komme i gang

```bash
npm install
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000). Sanity Studio er tilgjengelig lokalt på [http://localhost:3000/studio](http://localhost:3000/studio).

### Miljøvariabler

Kopier `.env` (eller be en annen utvikler om verdiene) og fyll inn følgende i en lokal `.env.local`:

| Variabel | Beskrivelse |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity-prosjektets ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset-navn (`production`) |
| `SANITY_API_READ_TOKEN` | Lesetoken, brukes til å hente innhold |
| `SANITY_WRITE_TOKEN` | Skrivetoken, brukes av iSonen-synken (`/api/sync-isonen`) |
| `SANITY_WEBHOOK_SECRET` | Beskytter `/api/revalidate`-webhooken fra Sanity |
| `NEXT_PUBLIC_APP_URL` | Nettstedets URL (f.eks. `http://localhost:3000` lokalt) |
| `NIF_ORG_ID`, `NIF_ACTIVITY_API_BASE_URL`, `NIF_ACTIVITY_CLIENT_ID`, `NIF_ACTIVITY_CLIENT_SECRET`, `NIF_ACTIVITY_MOCK` | Tilgang til NIFs Activity API (iSonen), se under |
| `CRON_SECRET` | Beskytter `/api/sync-isonen` mot uautorisert kjøring |

Se [PRODUKSJON.md](PRODUKSJON.md) for full forklaring av hver variabel og oppsett i produksjon.

## Innholdsredigering

Alt redaksjonelt innhold ligger i Sanity, ikke i denne kodebasen — se `/studio`:

- `siteSettings` — forsidekarusell, bunntekst, sosiale lenker, samarbeidspartnere
- `person` — styret, gruppeledere og andre kontakter
- `disciplinePage` — én side per padledisiplin (hav, elv, flattvann, surfski, polo, junior)
- `flexiblePage` — HMS-sider, Klubben-sider, Medlemskap m.m.
- `event` — kommende aktiviteter og turer (fylles delvis automatisk, se under)
- `blogPost` — blogginnlegg og turrapporter

Skjemaene for disse er definert i [sanity/schemas/](sanity/schemas/).

### Automatisk aktivitetssynk (iSonen)

`/api/sync-isonen` henter daglig (se cron i [vercel.json](vercel.json)) aktiviteter fra NIFs Activity API og oppretter dem som kladder (`event`-dokumenter) i Sanity for godkjenning. Logikken ligger i [src/lib/isonen.ts](src/lib/isonen.ts).

## Prosjektstruktur

```
src/app/(site)/   Offentlige sider (App Router)
src/app/studio/   Sanity Studio, montert på /studio
src/components/   Delte React-komponenter
src/lib/          Sanity-klient, GROQ-spørringer, hjelpefunksjoner
sanity/schemas/   Sanity-skjemadefinisjoner
sanity/structure.ts  Egendefinert desk-struktur for Studio
```

## Scripts

```bash
npm run dev     # Start utviklingsserver
npm run build   # Produksjonsbygg
npm run start   # Start produksjonsbygg lokalt
npm run lint    # ESLint
```

## Produksjonssetting

Se [PRODUKSJON.md](PRODUKSJON.md) for full sjekkliste (Sanity-prosjekt, domene, miljøvariabler, NIF-tilgang osv.).
