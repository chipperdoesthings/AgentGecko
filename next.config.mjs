/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.nadapp.net",
      },
    ],
  },
};

export default nextConfig;
