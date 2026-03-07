/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // GitHub Pages: https://natlee.github.io/invisible-inkr/
  basePath: "/invisible-inkr",
  // Use full URL so assets load correctly when served at repo subpath
  assetPrefix: process.env.NODE_ENV === "production"
    ? "https://natlee.github.io/invisible-inkr"
    : undefined,
};

export default nextConfig;
