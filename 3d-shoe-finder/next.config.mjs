/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  reactStrictMode: false,
  devIndicators: false,
  // Export statique pour GitHub Pages (servi depuis /<repo>/3d-shoe-finder/).
  output: 'export',
  basePath,
  images: { unoptimized: true },
  trailingSlash: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: ['raw-loader', 'glslify-loader'],
    });
    return config;
  },
};

export default nextConfig;
