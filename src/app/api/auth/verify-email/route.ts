import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, setSessionCookie } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return Response.json({ error: "missing_token" }, { status: 400 });
  }

  const record = await prisma.verificationToken.findUnique({ where: { token } });

  if (!record || record.type !== "email_verification") {
    return Response.json({ error: "invalid_token" }, { status: 400 });
  }

  if (record.expiresAt < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });
    return Response.json({ error: "token_expired" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: record.userId },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationToken.delete({ where: { token } });

  // Logg inn brukeren automatisk etter bekreftelse
  const sessionToken = await createSession(record.userId);
  await setSessionCookie(sessionToken);

  return Response.json({ ok: true, userId: record.userId });
}
