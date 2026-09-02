import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "www.tkk.no" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  async redirects() {
    // Nettstedet var tidligere tospråklig med /no- og /en-prefiks. Behold
    // gamle lenker og søketreff ved å sende dem til den norske siden.
    return ["no", "en"].flatMap((locale) => [
      { source: `/${locale}`, destination: "/", permanent: true },
      { source: `/${locale}/:path*`, destination: "/:path*", permanent: true },
    ]);
  },
};

export default nextConfig;
