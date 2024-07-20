/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["storage.googleapis.com"],
    unoptimized: true,
  },
  output: "export",
};

export default nextConfig;
