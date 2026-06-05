import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return Response.json({ error: "missing_fields" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.hashedPassword) {
    return Response.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.hashedPassword);
  if (!valid) {
    return Response.json({ error: "invalid_credentials" }, { status: 401 });
  }

  if (!user.emailVerified) {
    return Response.json({ error: "email_not_verified" }, { status: 403 });
  }

  const token = await createSession(user.id);
  await setSessionCookie(token);

  return Response.json({
    ok: true,
    nifConsentGiven: user.nifConsentGiven,
  });
}
