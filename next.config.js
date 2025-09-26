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

  // Webpack config (keep minimal and compatible with Turbopack)
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },

  // Turbopack configuration placeholder (optional)
  // Note: Only used when running `next dev --turbo`
  turbopack: {
    // Example settings if needed later:
    // resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
    // resolveAlias: {},
    // rules: {}
  },
};

module.exports = nextConfig;
