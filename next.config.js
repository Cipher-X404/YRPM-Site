/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
];

const privateHeaders = [
  ...securityHeaders,
  { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
  {
    key: "Cache-Control",
    value: "no-store, no-cache, must-revalidate, private",
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  allowedDevOrigins: [
    "*.e2b.app",
    "8080-ienjewkz0gxp0lit707qv.e2b.app",
    "localhost",
    "127.0.0.1",
  ],
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/dashboard/:path*", headers: privateHeaders },
      { source: "/admin/:path*", headers: privateHeaders },
      { source: "/api/admin/:path*", headers: privateHeaders },
    ];
  },
};
module.exports = nextConfig;
