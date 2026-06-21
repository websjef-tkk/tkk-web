import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const membersEnabled = process.env.ENABLE_MEMBERS === "true";

const intlMiddleware = createMiddleware(routing);

// Locale-relative paths that require the member area to be enabled
const GATED_PATHS = [
  "/logg-inn",
  "/registrer",
  "/profil",
  "/verifiser-epost",
  "/nif-samtykke",
  "/admin",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!membersEnabled) {
    // /studio has no locale prefix
    if (pathname === "/studio" || pathname.startsWith("/studio/")) {
      return NextResponse.redirect(new URL(`/${routing.defaultLocale}`, request.url));
    }

    // Locale-prefixed gated routes
    for (const locale of routing.locales) {
      for (const path of GATED_PATHS) {
        if (pathname === `/${locale}${path}` || pathname.startsWith(`/${locale}${path}/`)) {
          return NextResponse.redirect(new URL(`/${locale}`, request.url));
        }
      }
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all paths except _next internals, API routes, and static files
  matcher: ["/((?!_next|_vercel|api|.*\..*).*)"],
};
