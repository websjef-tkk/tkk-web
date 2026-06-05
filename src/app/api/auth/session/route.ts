import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return Response.json({ authenticated: false });
  }

  return Response.json({
    authenticated: true,
    user: {
      email: session.email,
      emailVerified: session.emailVerified,
      nifConsentGiven: session.nifConsentGiven,
      firstName: session.firstName,
      lastName: session.lastName,
    },
  });
}
