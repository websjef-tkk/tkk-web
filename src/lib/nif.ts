/**
 * NIF PersonInfo API
 *
 * Dokumentasjon:
 *   https://idrettsforbundet.atlassian.net/wiki/spaces/DDTII/pages/520257541/PT+-+PersonInfo
 *   https://idrettsforbundet.atlassian.net/wiki/spaces/DDTII/pages/520290315/PT+-+PersonInfo+-+eksempel
 *
 * Konfigurer følgende miljøvariabler når API-tilgang er tilgjengelig:
 *   NIF_API_BASE_URL   – Base-URL for NIF API
 *   NIF_API_KEY        – API-nøkkel / Bearer token
 *   NIF_ORG_ID         – Organisasjons-ID for TKK
 */

export type NifPerson = {
  personId: string;
  firstName: string;
  lastName: string;
  birthDate: string;        // ISO 8601: "YYYY-MM-DD"
  primaryEmail: string;
  primaryPhoneMobile: string;
};

export type NifResult =
  | { found: true; person: NifPerson }
  | { found: false; reason: "not_found" | "not_member" | "api_unavailable" | "api_error" };

/**
 * Henter personinfo fra NIF-APIet basert på e-postadresse.
 * Returnerer persondata hvis personen er aktiv medlem av TKK.
 */
export async function fetchNifMember(email: string): Promise<NifResult> {
  const baseUrl = process.env.NIF_API_BASE_URL;
  const apiKey = process.env.NIF_API_KEY;
  const orgId = process.env.NIF_ORG_ID;

  // Stub: returnér mock-data i dev når API ikke er konfigurert
  if (!baseUrl || !apiKey || !orgId) {
    return mockLookup(email);
  }

  try {
    // Oppslag via NIF PersonInfo-endepunkt med e-post som nøkkel
    const res = await fetch(
      `${baseUrl}/organizations/${orgId}/persons?email=${encodeURIComponent(email)}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        // Ikke cache – data kan endres
        cache: "no-store",
      }
    );

    if (res.status === 404) return { found: false, reason: "not_found" };
    if (!res.ok) return { found: false, reason: "api_error" };

    const data = await res.json();

    // Tilpass feltnavnene fra NIF-responsen til vår NifPerson-type
    const person: NifPerson = {
      personId: String(data.personId),
      firstName: data.firstName ?? "",
      lastName: data.lastName ?? "",
      birthDate: data.birthDate ?? "",
      primaryEmail: data.primaryEmail ?? email,
      primaryPhoneMobile: data.primaryPhoneMobile ?? "",
    };

    return { found: true, person };
  } catch {
    return { found: false, reason: "api_unavailable" };
  }
}

/**
 * Mock-oppslag for utvikling.
 * Returnerer testdata for e-poster som slutter på @tkk.no,
 * "ikke funnet" for alle andre.
 */
function mockLookup(email: string): NifResult {
  if (process.env.NIF_MOCK_ALWAYS_FOUND === "true" || email.endsWith("@tkk.no")) {
    return {
      found: true,
      person: {
        personId: "MOCK-001",
        firstName: "Test",
        lastName: "Testesen",
        birthDate: "1990-01-15",
        primaryEmail: email,
        primaryPhoneMobile: "400 00 000",
      },
    };
  }
  return { found: false, reason: "not_found" };
}
