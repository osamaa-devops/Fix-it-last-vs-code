/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@fix-it/api",
    "@fix-it/schemas",
    "@fix-it/types",
    "@fix-it/utils",
  ],
};

module.exports = nextConfig;
