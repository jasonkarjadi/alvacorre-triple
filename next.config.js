// @ts-check

/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

const nextTranslate = require("next-translate");

// @ts-ignore
module.exports = nextTranslate(nextConfig);
