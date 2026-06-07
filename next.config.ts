import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "www.tkk.no" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  async redirects() {
    return [
      { source: "/:locale/om-klubben/refusjon", destination: "/:locale/om-klubben/kjoregodtgjorelse", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
