/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "*.github.dev", "*.app.github.dev"],
    },
  },
};

export default nextConfig;
