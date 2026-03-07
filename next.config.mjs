/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // GitHub Pages: https://natlee.github.io/zero-width-generator/
  basePath: "/zero-width-generator",
  assetPrefix: process.env.NODE_ENV === "production" ? "/zero-width-generator" : "",
};

export default nextConfig;
