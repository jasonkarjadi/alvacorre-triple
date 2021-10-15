// @ts-check

/**
 * @type {import('next').NextConfig}
 */

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
};

const nextTranslate = require("next-translate");

// @ts-ignore
module.exports = nextTranslate(nextConfig);
