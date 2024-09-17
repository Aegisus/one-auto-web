/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    FLASK_API_PORT: process.env.FLASK_API_PORT,
  },
};

module.exports = nextConfig;
