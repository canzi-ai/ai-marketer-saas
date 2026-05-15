/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/admin',
        destination: '/admin.html',
      },
    ];
  },
};

module.exports = nextConfig;
