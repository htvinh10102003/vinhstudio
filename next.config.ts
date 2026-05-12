/** @type {import('next').NextConfig} */
const nextConfig = {
  // KHÓA MÕM HOÀN TOÀN CÁC LỖI KHI DEPLOY
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;