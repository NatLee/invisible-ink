/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // GitHub Pages: https://natlee.github.io/zero-width-generator/
  basePath: "/zero-width-generator",
  // Use full URL so assets load correctly when served at repo subpath
  assetPrefix: process.env.NODE_ENV === "production"
    ? "https://natlee.github.io/zero-width-generator"
    : undefined,
};

export default nextConfig;
