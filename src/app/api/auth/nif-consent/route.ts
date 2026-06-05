import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fetchNifMember } from "@/lib/nif";

export async function POST() {
  const session = await getSession();

  if (!session) {
    return Response.json({ error: "unauthenticated" }, { status: 401 });
  }

  if (!session.emailVerified) {
    return Response.json({ error: "email_not_verified" }, { status: 403 });
  }

  // Registrer samtykke
  await prisma.user.update({
    where: { id: session.id },
    data: { nifConsentGiven: true, nifConsentAt: new Date() },
  });

  // Hent data fra NIF
  const result = await fetchNifMember(session.email);

  if (!result.found) {
    return Response.json({
      ok: true,
      nifFound: false,
      reason: result.reason,
    });
  }

  const { person } = result;

  await prisma.user.update({
    where: { id: session.id },
    data: {
      nifPersonId: person.personId,
      firstName: person.firstName,
      lastName: person.lastName,
      birthDate: person.birthDate ? new Date(person.birthDate) : null,
      primaryPhoneMobile: person.primaryPhoneMobile,
      nifDataFetchedAt: new Date(),
    },
  });

  return Response.json({ ok: true, nifFound: true, person });
}

// Avvis samtykke — slett brukerkonto
export async function DELETE() {
  const session = await getSession();

  if (!session) {
    return Response.json({ error: "unauthenticated" }, { status: 401 });
  }

  await prisma.user.delete({ where: { id: session.id } });

  const { clearSessionCookie } = await import("@/lib/auth");
  await clearSessionCookie();

  return Response.json({ ok: true });
}
