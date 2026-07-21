/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@pixxl-tools/components"],
  async redirects() {
    return [
      "plot",
      "render-chart",
      "candlestick",
      "heatmap",
      "sparkline",
      "histogram",
      "renderers",
      "reference",
    ].map((surface) => ({
      destination: `/documentation/6.0.0/${surface}`,
      permanent: true,
      source: `/documentation/${surface}`,
    }));
  },
};

module.exports = nextConfig;
