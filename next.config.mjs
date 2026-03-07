/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // GitHub Pages: https://natlee.github.io/invisible-ink/
  basePath: "/invisible-ink",
  assetPrefix: process.env.NODE_ENV === "production" ? "/invisible-ink" : "",
};

export default nextConfig;
