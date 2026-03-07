/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // 若部署於 username.github.io/repo-name，請取消並改為你的 repo 名稱：
  // basePath: '/zero-width-generator',
  // assetPrefix: '/zero-width-generator/',
};

export default nextConfig;
