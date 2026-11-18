import type { NextConfig } from "next";

// Servi depuis https://<user>.github.io/<repo>/iron-man/
// Fourni par la CI (voir .github/workflows/pages.yml).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // GitHub Pages sert des fichiers statiques uniquement.
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
