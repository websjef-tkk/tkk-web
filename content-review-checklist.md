# Innholdsgjennomgang i Sanity Studio

Sjekkliste etter import/oppdatering av innhold fra gammel side (tkk.no). Se også samtalehistorikken for full sammenligningstabell mellom gammel og ny side.

## 🔴 Høy prioritet — kladder og nytt innhold

| Side/dokument | Type | Hva å sjekke | Begrunnelse |
|---|---|---|---|
| 9 turrapporter (Froanturen 2021, Sommerturen 2021, Kortreist overnattingstur, Femunden 2020, Sommerturen Hitra 2020, Herøy/Dønna 2019, Froan-tur 2019, Sommertur Helgeland 2018, Sommertur Lofoten 2017) | `blogPost` (kladd) | Skriv ekte sammendrag (plassholdertekst er satt inn), verifiser publiseringsdato (satt til 1. august i antatt år — eksakt dato fantes ikke i gammel HTML), sjekk at bilder vises korrekt, **publiser** når godkjent | Disse er upubliserte kladder med plassholdertekst — må kvalitetssikres før de blir synlige på siden |
| 12 turrapporter runde 2 (Bohuslän, Knarrlagsundet nybegynner, Skansen-Orkanger langtur, Sula fyr, Lysøysundet nybegynner, 17.mai-tur Lysøysund 2024, Vårtur Hitra, Knarrlagsund 2023, Skansen-Orkanger 240826, Skansen-Orkanger 240825, Lysøysund, Første jentetur) | `blogPost` (kladd) | Samme som over — skriv sammendrag, verifiser år (de fleste år er **gjettet til 2024** siden eksakt dato ikke alltid fantes i URL/tekst), sjekk bilder, publiser når godkjent | Disse var ikke kategorisert som "turrapport" på gammel side og ble derfor ikke fanget opp i første runde |
| `tripreport-sommertur-bohuslaen`, `tripreport-skansen-orkanger-langtur`, `tripreport-midtsommartur-sula-fyr`, `tripreport-skansen-orkanger-240826`, `tripreport-skansen-orkanger-240825`, `tripreport-turrapport-lysoysund` | `blogPost` (kladd) | Sammenlign manuelt med originalsiden — bekreft at alt innhold er fanget opp | Disse fikk uvanlig få blokker (2–6) ved automatisk import. Kan være ekte korte rapporter, men bør dobbeltsjekkes siden en tidligere parser-versjon gikk glipp av `&lt;div&gt;`-baserte avsnitt på nyere sider |
| `klubben-organisasjonsplanen` | `flexiblePage` (ny) | Sjekk at nøstede lister (årsmøtets oppgaver, styrets oppgaver) gir mening som flate punktlister | Lang, strukturert legal/styringsdokument — HTML-konverteringen flater ut nøstede underlister, kan ha mistet hierarki |
| `klubben-vedtektene` | `flexiblePage` (re-importert) | Sjekk at alle 15 paragrafer er med og i riktig rekkefølge | Opprinnelig innhold var bare 109 ord — for tynt for et vedtektsdokument. Fullstendig tekst re-importert |
| `klubben-skjemaer` | `flexiblePage` (ny) | Bekreft at de 3 skjema-lenkene fungerer (xlsx-filer) | Lenker peker fortsatt til **gammel side** sine filer (ikke lastet ned/re-hostet til ny side) |
| `klubben-huskalender` | `flexiblePage` (ny) | Vurder om Google Kalender-lenken bør bygges inn som faktisk embed i stedet for en ren lenke | Gammel side hadde kalenderen innebygd som iframe; vårt skjema støtter ikke iframe-embedding, så det er forenklet til en lenke |
| `klubben-stotte-konkurransepadling` | `flexiblePage` (ny) | Generell korrekturlesing | Helt ny side, transkribert manuelt fra gammel side |

## 🟡 Middels prioritet — store/komplekse oppdateringer

| Side/dokument | Type | Hva å sjekke | Begrunnelse |
|---|---|---|---|
| `hms` (HMS-plan) | `flexiblePage` | Sjekk om lenker til lovdata.no, sdir.no, norskfriluftsliv.no, miljødirektoratet.no bør legges inn som klikkbare lenker | 120 blokker importert, men eksterne lov-/forskriftslenker fra originalen ble notert som "ikke talt" og kan ha falt bort i konverteringen |
| `padling-turledelse-hav` | `flexiblePage` | Sjekk at risikovurderingstabellen (vind/bølgehøyde/dagsdistanse per kompetansenivå) ikke har falt helt bort | Tabeller i HTML blir **ikke** konvertert (skjemaet støtter bare tekstblokker) — denne siden hadde en konkret tabell med 4 rader |
| `padling-flattvann-surfski` | `flexiblePage` | Sjekk for dobbeltinnhold/repetisjon | Innholdet kommer fra **to** gamle sider slått sammen (`/padling/flattvann/surfski` og `/padling/surfski/surfski`) |

## 🟢 Lavere prioritet — uventet tynt resultat

| Side/dokument | Type | Hva å sjekke | Begrunnelse |
|---|---|---|---|
| `discipline-junior` | `disciplinePage` | Sammenlign manuelt med https://www.tkk.no/padling/junior | Fikk bare 3 blokker — uventet lite, kan tyde på at uttrekket gikk glipp av innhold |
| `padling-junior-velkommen` | `flexiblePage` | Sammenlign manuelt med gammel side | Samme — bare 3 blokker |
| `padling-hav-fyrmestergrad` | `flexiblePage` | Sammenlign manuelt med gammel side | Bare 5 blokker, mot et estimert ordtall på 720 ord i originalen |
| `padling-flattvann-flattvann-surfski` | `flexiblePage` | Sammenlign manuelt | Bare 4 blokker |

## ⚪ Generelt for alle 25 oppdaterte sider

| Sjekk | Begrunnelse |
|---|---|
| E-postadresser vises korrekt (f.eks. `leder@tkk.no`, `havsjef@tkk.no`) | Gammel side skjulte e-poster med spam-beskyttelse (base64-kodet) — disse er dekodet automatisk, men bør stikkprøvekontrolleres |
| Lenke-tekst og URL-er gir mening | Lenker fra gammel HTML er bevart der mulig, men noen kan peke til interne gammel-side-stier som ikke finnes på ny side |
| Punktlister (•) ser ryddige ut | Alle `<ul>`/`<ol>`-lister er flatet til enkle tekstlinjer med et punktum-symbol foran — ingen ekte nøstet liste-rendering |

## Andre kjente forhold fra denne arbeidsrunden

- Duplikat-kladd for `padling-hav-havpadling` er slettet (var tom, ingen innhold gikk tapt)
- `/om-klubben/sosialgruppe` (tidligere 404) fungerer nå
- Ny kategori `turrapport` lagt til i `blogPost`-skjemaet
- Nye Next.js-ruter lagt til: `/om-klubben/huskalender`, `/om-klubben/organisasjonsplanen`, `/om-klubben/skjemaer`, `/om-klubben/stotte-konkurransepadling`
