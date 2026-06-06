/**
 * Seed script — kjøres én gang etter oppsett.
 * Oppretter leder@tkk.no som admin-bruker med forhåndsverifisert konto.
 *
 * Bruk: npm run seed
 */

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

const ADMIN_EMAIL = "leder@tkk.no";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
  if (existing) {
    console.log(`\n⚠️  Bruker ${ADMIN_EMAIL} finnes allerede. Seed avbrutt.\n`);
    return;
  }

  // Generer midlertidig passord
  const tempPassword = randomBytes(8).toString("hex"); // 16 hex-tegn
  const hashedPassword = await bcrypt.hash(tempPassword, 12);

  // Opprett bruker
  const user = await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      hashedPassword,
      firstName: "Leder",
      lastName: "TKK",
      isAdmin: true,
      nifConsentGiven: true,    // Hopper over NIF-samtykke ved innlogging
      emailVerified: null,       // E-post må verifiseres
    },
  });

  // Generer verifikasjonstoken (gyldig i 7 dager for å gi tid)
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.verificationToken.create({
    data: {
      userId: user.id,
      token,
      type: "email_verification",
      expiresAt,
    },
  });

  console.log("\n✅ Admin-bruker opprettet!\n");
  console.log(`   E-post:            ${ADMIN_EMAIL}`);
  console.log(`   Midlertidig passord: ${tempPassword}`);
  console.log(`\n   Bekreft e-post ved å åpne denne URL-en:`);
  console.log(`   ${APP_URL}/no/verifiser-epost/bekreft?token=${token}`);
  console.log("\n   Bytt passord etter første innlogging.\n");
}

main()
  .catch((e) => {
    console.error("Seed feilet:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
