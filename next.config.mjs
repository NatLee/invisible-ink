/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // GitHub Pages serves the site from https://natlee.github.io/invisible-ink/.
  // basePath also prefixes the JS/CSS/font URLs, in dev and in the export.
  basePath: "/invisible-ink",
};

export default nextConfig;
