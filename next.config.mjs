// @ts-check
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

import nextTranslate from "next-translate";

// @ts-ignore
export default nextTranslate(nextConfig);
