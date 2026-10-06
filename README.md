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
| `NIF_ACTIVITY_CLIENT_ID`, `NIF_ACTIVITY_CLIENT_SECRET`, `NIF_ACTIVITY_MOCK` | Tilgang til NIFs Activity API (iSonen), se under |
| `CRON_SECRET` | Beskytter `/api/sync-isonen` mot uautorisert kjøring |

Se [PRODUKSJON.md](PRODUKSJON.md) for full forklaring av hver variabel og oppsett i produksjon.

## Innholdsredigering

Alt redaksjonelt innhold ligger i Sanity, ikke i denne kodebasen — se `/studio`:

- `siteSettings` — forsidekarusell, bunntekst, sosiale lenker, samarbeidspartnere
- `person` — styret, gruppeledere og andre kontakter
- `disciplinePage` — én side per padledisiplin (hav, elv, flattvann, surfski, polo, junior)
- `flexiblePage` — HMS-sider, Klubben-sider, Medlemskap m.m. Feltet «Ligger under» plasserer siden i hierarkiet og gir første del av adressen; flyttes en publisert side, følger undersidene med og gamle adresser viderekobles
- `event` — aktiviteter, kurs og turer, også faste økter (importeres automatisk fra iSonen, se under)
- `blogPost` — blogginnlegg og turrapporter

Skjemaene for disse er definert i [sanity/schemas/](sanity/schemas/).

### Tilgang og roller

Klubben har Sanitys Growth-plan gjennom non-profit-programmet. Alle som skriver har sin egen konto, og rollen settes i [Sanity Manage](https://www.sanity.io/manage) under Members. Ingen kode må endres når noen kommer til, bytter rolle eller slutter.

| Rolle | Hvem | Kan |
|---|---|---|
| Administrator | Nettansvarlig og minst én til | Alt, også forside, meny, klubbinformasjon, medlemmer og tokens |
| Editor | Grensjefer og faste ressurspersoner | Skrive og publisere innhold |
| Contributor | Sporadiske skribenter | Skrive utkast som en Editor publiserer |

Studio sjekker rollen til den innloggede ([sanity/roles.ts](sanity/roles.ts)). For alle andre enn administratorer er «Forside og meny», «Klubbinformasjon» og «Alle sider» skjult, og Vision-fanen borte. `siteSettings`, `mainMenu`, `person` og klubbsider (`flexiblePage` med seksjonen Klubbinformasjon) er skrivebeskyttet for dem, og nye sider de oppretter blir alltid padling-innhold. Dette er et gjerde mot uhell og ikke en lås, for Sanitys API tillater fortsatt at en Editor endrer disse dokumentene. Ekte tilgang per dokumenttype krever egendefinerte roller på Enterprise-planen.

### Automatisk aktivitetssynk (iSonen)

`/api/sync-isonen` henter TKKs kommende aktiviteter (org-ID 26548) fra NIFs Activity API. Ruten kalles hver hele time av [GitHub Actions](.github/workflows/sync-isonen.yml) og daglig av Vercel Cron ([vercel.json](vercel.json)) som reserve. Vercel Hobby tillater ikke oftere enn daglig.

- **Nye aktiviteter** opprettes som kladder med bilde. Et menneske fyller ut beskrivelse, kategori og så videre i Studio og publiserer.
- **Feltene som kommer fra iSonen** (tittel, dato, sted, påmeldingslenke og avlyst) holdes oppdatert. Resten eies av redaksjonen og blir aldri overskrevet.
- **Avlysning:** «AVLYST» i tittelen i iSonen, eller at en kommende aktivitet forsvinner, gjør at aktiviteten merkes som avlyst.

Logikken ligger i [src/lib/isonen.ts](src/lib/isonen.ts). Du kan teste API-tilgangen uten å skrive noe til Sanity med `npx tsx sanity/test-isonen.ts [startdato]`.

## Prosjektstruktur

```
src/app/(site)/   Offentlige sider (App Router)
src/app/studio/   Sanity Studio, montert på /studio
src/components/   Delte React-komponenter
src/lib/          Sanity-klient, GROQ-spørringer, hjelpefunksjoner
sanity/schemas/   Sanity-skjemadefinisjoner
sanity/structure.ts  Egendefinert desk-struktur for Studio
sanity/roles.ts      Rollesjekk som styrer hva ikke-administratorer ser i Studio
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
