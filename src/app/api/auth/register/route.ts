import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createVerificationToken } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { email, password, locale = "no" } = await req.json();

  if (!email || !password) {
    return Response.json({ error: "missing_fields" }, { status: 400 });
  }

  if (password.length < 8) {
    return Response.json({ error: "password_too_short" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return Response.json({ error: "email_taken" }, { status: 409 });
  }

  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, hashedPassword },
  });

  const token = await createVerificationToken(user.id);

  try {
    await sendVerificationEmail(email, token, locale);
  } catch (err) {
    console.error("Failed to send verification email:", err);
    // Slett brukeren slik at de kan prøve igjen
    await prisma.user.delete({ where: { id: user.id } });
    return Response.json({ error: "email_send_failed" }, { status: 500 });
  }

  return Response.json({ ok: true }, { status: 201 });
}
