/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // GitHub Pages: https://natlee.github.io/zero-width-generator/
  basePath: "/zero-width-generator",
  assetPrefix: "/zero-width-generator/",
};

export default nextConfig;
