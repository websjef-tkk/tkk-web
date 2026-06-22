/**
 * NIF Activity API (data.nif.no) — henter klubbens terminliste fra iSonen.
 *
 * Dokumentasjon (Swagger UI): https://data.nif.no/index.html
 *   GET /api/v1/activity/EventsForOrg/Schedule — terminliste for en organisasjon
 *
 * Autentisering: OAuth2 client credentials, scope "data_activity_read".
 * NB: API-tilgang er ikke søkt om/innvilget ennå (se PRODUKSJON.md pkt. 7).
 * Eksakt responsformat er derfor ukjent — feltmapping under må verifiseres
 * og sannsynligvis justeres når reell tilgang er på plass.
 *
 * Konfigurer følgende miljøvariabler når API-tilgang er tilgjengelig:
 *   NIF_ACTIVITY_API_BASE_URL  – Base-URL for NIF activity-API
 *   NIF_ACTIVITY_CLIENT_ID     – OAuth2 client id
 *   NIF_ACTIVITY_CLIENT_SECRET – OAuth2 client secret
 *   NIF_ORG_ID                 – TKKs organisasjons-ID i NIF (gjenbrukt fra PersonInfo-oppsettet)
 *   NIF_ACTIVITY_MOCK          – "true" for å bruke fabrikkerte testdata lokalt
 */

const ALLOWED_ORGANIZERS = ["Trondhjems Kajakklubb", "Trondhjems Kajakklubb - Padling"];

export interface IsonenEvent {
  externalId: string;
  title: string;
  description?: string;
  date: string;
  endDate?: string;
  location?: string;
  registerUrl: string;
  organizerName: string;
}

async function getAccessToken(baseUrl: string, clientId: string, clientSecret: string): Promise<string> {
  const res = await fetch(`${baseUrl}/connect/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope: "data_activity_read",
    }),
  });
  if (!res.ok) throw new Error(`Klarte ikke hente OAuth2-token: HTTP ${res.status}`);
  const data = await res.json();
  return data.access_token as string;
}

/**
 * Henter klubbens aktiviteter fra iSonen, filtrert til de to godkjente
 * arrangør-navnene. Returnerer fabrikkerte testdata i mock-modus.
 */
export async function fetchIsonenEvents(): Promise<IsonenEvent[]> {
  const baseUrl = process.env.NIF_ACTIVITY_API_BASE_URL;
  const clientId = process.env.NIF_ACTIVITY_CLIENT_ID;
  const clientSecret = process.env.NIF_ACTIVITY_CLIENT_SECRET;
  const orgId = process.env.NIF_ORG_ID;

  if (process.env.NIF_ACTIVITY_MOCK === "true" || !baseUrl || !clientId || !clientSecret || !orgId) {
    return mockEvents();
  }

  const token = await getAccessToken(baseUrl, clientId, clientSecret);
  const res = await fetch(
    `${baseUrl}/api/v1/activity/EventsForOrg/Schedule?orgId=${encodeURIComponent(orgId)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error(`Klarte ikke hente aktiviteter fra iSonen: HTTP ${res.status}`);

  const data = await res.json();
  // NB: feltnavnene under (id/name/description/startDate/endDate/location/organizer/registrationUrl)
  // er en antagelse basert på Swagger-beskrivelsen og må verifiseres mot reell respons.
  const raw = Array.isArray(data) ? data : data.events ?? data.items ?? [];

  return raw
    .map((e: Record<string, unknown>): IsonenEvent => ({
      externalId: String(e.id ?? e.eventId),
      title: String(e.name ?? e.title ?? ""),
      description: typeof e.description === "string" ? e.description : undefined,
      date: String(e.startDate ?? e.date ?? ""),
      endDate: typeof e.endDate === "string" ? e.endDate : undefined,
      location: typeof e.location === "string" ? e.location : undefined,
      registerUrl: String(e.registrationUrl ?? e.url ?? ""),
      organizerName: String(e.organizer ?? e.organizerName ?? ""),
    }))
    .filter((e: IsonenEvent) => ALLOWED_ORGANIZERS.includes(e.organizerName));
}

function mockEvents(): IsonenEvent[] {
  const inTwoWeeks = new Date();
  inTwoWeeks.setDate(inTwoWeeks.getDate() + 14);
  const inThreeWeeks = new Date();
  inThreeWeeks.setDate(inThreeWeeks.getDate() + 21);

  return [
    {
      externalId: "MOCK-1001",
      title: "Mock: Søndagspadling Skansen",
      description: "Testaktivitet generert lokalt (NIF_ACTIVITY_MOCK=true).",
      date: inTwoWeeks.toISOString(),
      location: "Skansen",
      registerUrl: "https://isonen.no/finder/?eventId=MOCK-1001",
      organizerName: "Trondhjems Kajakklubb",
    },
    {
      externalId: "MOCK-1002",
      title: "Mock: Havpadlekurs nybegynner",
      description: "Testaktivitet generert lokalt (NIF_ACTIVITY_MOCK=true).",
      date: inThreeWeeks.toISOString(),
      location: "Østmarkneset",
      registerUrl: "https://isonen.no/finder/?eventId=MOCK-1002",
      organizerName: "Trondhjems Kajakklubb - Padling",
    },
  ];
}
