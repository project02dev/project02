/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Image optimization config (your existing setup)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/a/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3.tebi.io",
        pathname: "/project-02-files/**",
      },
    ],
  },

  // Webpack config (your existing fallback + new dev middleware tweaks)
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },

  // 🔹 Dev-only optimization to stop watching huge folders
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      ignored: [
        "**/node_modules/**",
        "**/.next/**",
        "**/.git/**",
        "**/public/**",
      ],
    };
    return config;
  },
};

module.exports = nextConfig;
