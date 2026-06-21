import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const membersEnabled = process.env.ENABLE_MEMBERS === "true";

const GATED_PATHS = [
  "logg-inn",
  "registrer",
  "profil",
  "verifiser-epost",
  "verifiser-epost/bekreft",
  "nif-samtykke",
  "admin/:path*",
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "www.tkk.no" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  async redirects() {
    const permanentRedirects = [
      { source: "/:locale/om-klubben/refusjon", destination: "/:locale/om-klubben/kjoregodtgjorelse", permanent: true },
    ];

    if (membersEnabled) return permanentRedirects;

    const gatedRedirects = [
      { source: "/studio", destination: "/no", permanent: false },
      { source: "/studio/:path*", destination: "/no", permanent: false },
      ...GATED_PATHS.map((path) => ({
        source: `/:locale(no|en)/${path}`,
        destination: "/:locale",
        permanent: false,
      })),
    ];

    return [...permanentRedirects, ...gatedRedirects];
  },
};

export default withNextIntl(nextConfig);
