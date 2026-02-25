/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // Nếu dùng Public URL trong ảnh để test thì nhập:
        hostname: "pub-42f35cc96c1a45e8b9b913f38e4d950e.r2.dev",
        // Nếu đã gán Custom Domain (ví dụ cdn.dna-agency.vn) thì đổi hostname thành domain đó
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
