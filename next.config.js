const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Next 14.2.x has no patch for GHSA-2xp9-vwfh-vxw4 (RCE in the Image
  // Optimization API, fixed only in 15.5.24+). Turning the optimizer off
  // removes the /_next/image endpoint entirely. The only next/image use is the
  // small Route22 logo; listing photos are CSS backgrounds. Remove this once
  // the app is on a patched Next 15/16.
  images: { unoptimized: true },
  // Same rule as OpDesk: these sites may be embedded in an <iframe> ONLY on
  // rollingrover.co.za (the client showcase) and their own pages. Browsers
  // enforce frame-ancestors; X-Frame-Options is deliberately not set because
  // it can't express "this one external origin".
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://rollingrover.co.za https://www.rollingrover.co.za;",
          },
        ],
      },
    ];
  },
  experimental: {
    // Admin CSV import uploads through a server action (default limit is 1 MB).
    serverActions: { bodySizeLimit: "3mb" },
  },
};

module.exports = withNextIntl(nextConfig);
