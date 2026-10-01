/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Admin CSV import uploads through a server action (default limit is 1 MB).
    serverActions: { bodySizeLimit: "3mb" },
  },
};

module.exports = nextConfig;
