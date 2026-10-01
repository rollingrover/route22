/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Next 14.2.x has no patch for GHSA-2xp9-vwfh-vxw4 (RCE in the Image
  // Optimization API, fixed only in 15.5.24+). Turning the optimizer off
  // removes the /_next/image endpoint entirely. The only next/image use is the
  // small Route22 logo; listing photos are CSS backgrounds. Remove this once
  // the app is on a patched Next 15/16.
  images: { unoptimized: true },
  experimental: {
    // Admin CSV import uploads through a server action (default limit is 1 MB).
    serverActions: { bodySizeLimit: "3mb" },
  },
};

module.exports = nextConfig;
