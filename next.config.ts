import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["canvas", "chart.js", "chartjs-node-canvas"],
  webpack(config: { module: { rules: { test: RegExp; use: string[]; }[]; }; }) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

};

export default nextConfig;