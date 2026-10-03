/**
 * NIF Activity API (data.nif.no) — henter klubbens aktiviteter fra iSonen.
 *
 * Dokumentasjon:
 *   EventsForOrg:    https://idrettsforbundet.atlassian.net/wiki/spaces/DDTII/pages/649658403/AT+-+EventsForOrg
 *   Autentisering:   https://idrettsforbundet.atlassian.net/wiki/spaces/DDTII/pages/335577089
 *
 * Token hentes med OAuth2 client credentials (én POST til id.nif.no — påkrevd av
 * OAuth2). Selve dataene hentes kun med GET, og kun for TKKs egen org-ID.
 *
 * Miljøvariabler:
 *   NIF_ACTIVITY_CLIENT_ID     – OAuth2 client id
 *   NIF_ACTIVITY_CLIENT_SECRET – OAuth2 client secret
 *   NIF_ACTIVITY_MOCK          – "true" for å bruke fabrikkerte testdata lokalt
 */

const TOKEN_URL = "https://id.nif.no/connect/token";
const EVENTS_URL = "https://data.nif.no/api/v1/activity/eventsfororg";

/** TKKs org-ID i NIF. Hardkodet med vilje: vi har bare lov å hente data for vår egen org. */
export const NIF_ORG_ID = 26548;

/** Vi har bare lov å hente aktiviteter fra og med denne datoen. */
const EARLIEST_START_DATE = "2026-07-01";

/** iSonen markerer avlyste aktiviteter ved å sette "AVLYST" først i tittelen. */
const CANCELLED_PREFIX = /^\s*AVLYST\b[\s:–-]*/i;

export interface IsonenEvent {
  externalId: string;
  title: string;
  date: string;
  endDate?: string;
  location?: string;
  registerUrl: string;
  category: string;
  cancelled: boolean;
  imageUrl?: string;
}

/** Felt vi bruker fra EventsForOrg-svaret. */
interface ApiEvent {
  id: string;
  title: string;
  eventType: string;
  eventIsSecret: boolean;
  organizerOrgId: number;
  eventUrl: string;
  locationName: string | null;
  imageDownloadUrl: string | null;
  scheduleStartDateTime: string;
  scheduleEndDateTime: string | null;
}

/** Dagens dato i norsk tid, men aldri tidligere enn EARLIEST_START_DATE. */
export function isonenStartDate(): string {
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Oslo" });
  return today > EARLIEST_START_DATE ? today : EARLIEST_START_DATE;
}

async function getAccessToken(clientId: string, clientSecret: string): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({ grant_type: "client_credentials", scope: "data_activity_read" }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Klarte ikke hente OAuth2-token: HTTP ${res.status}`);
  const data = await res.json();
  return data.access_token as string;
}

function toIsonenEvent(e: ApiEvent): IsonenEvent {
  const cancelled = CANCELLED_PREFIX.test(e.title);
  return {
    externalId: e.id,
    title: (cancelled ? e.title.replace(CANCELLED_PREFIX, "") : e.title).trim(),
    date: new Date(e.scheduleStartDateTime).toISOString(),
    endDate: e.scheduleEndDateTime ? new Date(e.scheduleEndDateTime).toISOString() : undefined,
    location: e.locationName?.trim() || undefined,
    registerUrl: e.eventUrl,
    category: e.eventType === "WORKSHOP" ? "kurs" : "tur",
    cancelled,
    imageUrl: e.imageDownloadUrl ?? undefined,
  };
}

/**
 * Henter TKKs aktiviteter fra iSonen med start fra og med `startDate` (yyyy-mm-dd).
 * Hemmelige aktiviteter (f.eks. maler) utelates. Kaster ved feil, slik at synken
 * aldri tolker et feilet kall som "ingen aktiviteter".
 */
export async function fetchIsonenEvents(startDate: string): Promise<IsonenEvent[]> {
  if (process.env.NIF_ACTIVITY_MOCK === "true") return mockEvents();

  const clientId = process.env.NIF_ACTIVITY_CLIENT_ID;
  const clientSecret = process.env.NIF_ACTIVITY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("NIF_ACTIVITY_CLIENT_ID og NIF_ACTIVITY_CLIENT_SECRET må være satt");
  }

  const token = await getAccessToken(clientId, clientSecret);
  const params = new URLSearchParams({ startDate, clubId: String(NIF_ORG_ID) });
  const res = await fetch(`${EVENTS_URL}?${params}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Klarte ikke hente aktiviteter fra iSonen: HTTP ${res.status}`);

  const data = await res.json();
  // Dokumentasjonen beskriver { data: { apiEventSearch: [...] } }, men API-et returnerer en liste direkte.
  const raw: ApiEvent[] = Array.isArray(data) ? data : data?.data?.apiEventSearch;
  if (!Array.isArray(raw)) throw new Error("Uventet svarformat fra iSonen");

  return raw.filter((e) => e.organizerOrgId === NIF_ORG_ID && !e.eventIsSecret).map(toIsonenEvent);
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
      date: inTwoWeeks.toISOString(),
      location: "Skansen",
      registerUrl: "https://isonen.no/event/MOCK-1001/",
      category: "tur",
      cancelled: false,
    },
    {
      externalId: "MOCK-1002",
      title: "Mock: Havpadlekurs nybegynner",
      date: inThreeWeeks.toISOString(),
      location: "Østmarkneset",
      registerUrl: "https://isonen.no/event/MOCK-1002/",
      category: "kurs",
      cancelled: false,
    },
  ];
}
