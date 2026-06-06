-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "hashedPassword" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "nifConsentGiven" BOOLEAN NOT NULL DEFAULT false,
    "nifConsentAt" DATETIME,
    "nifDataFetchedAt" DATETIME,
    "nifPersonId" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "birthDate" DATETIME,
    "primaryPhoneMobile" TEXT
);
INSERT INTO "new_User" ("birthDate", "createdAt", "email", "emailVerified", "firstName", "hashedPassword", "id", "lastName", "nifConsentAt", "nifConsentGiven", "nifDataFetchedAt", "nifPersonId", "primaryPhoneMobile", "updatedAt") SELECT "birthDate", "createdAt", "email", "emailVerified", "firstName", "hashedPassword", "id", "lastName", "nifConsentAt", "nifConsentGiven", "nifDataFetchedAt", "nifPersonId", "primaryPhoneMobile", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
