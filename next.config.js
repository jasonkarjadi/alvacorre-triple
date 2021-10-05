// @ts-check

/**
 * @type {import('next').NextConfig}
 */

const { i18n } = require("./next-i18next.config");

const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      resourceQuery: /raw/,
      type: "asset/source",
      use: ["glslify-loader"],
    });

    return config;
  },
  i18n,
};

module.exports = nextConfig;
