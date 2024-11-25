/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { canvas: false }; // Disable Node.js-specific dependencies
    return config;
  },
};

export default nextConfig;
