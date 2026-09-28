import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ["192.168.31.244"],
  serverExternalPackages: ["mongoose"],
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async redirects() {
    return [
      {
        source: '/pages/contact',
        destination: '/contact-us',
        permanent: true,
      },
      {
        source: '/blogs/news',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/collections/all',
        destination: '/shop',
        permanent: true,
      },
      {
        source: '/pages/accessibility',
        destination: '/shop',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*.(png|jpg|jpeg|webp|avif|svg|gif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/assets/3d/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*.glb",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/hero-video.mp4",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;


