import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      "24.media.tumblr.com",
      "25.media.tumblr.com",
      "27.media.tumblr.com",
      "28.media.tumblr.com",
      "29.media.tumblr.com",
      "30.media.tumblr.com",
      "64.media.tumblr.com",
    ],
  },
};

export default nextConfig;
