/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  // The PPE detection source. Override with the PPE_UPSTREAM env var if the
  // camera host moves. Consumed server-side by the API route handlers.
  env: {
    PPE_UPSTREAM: process.env.PPE_UPSTREAM || "http://192.168.0.161:8090",
  },
};

export default nextConfig;
