module.exports = {
  distDir: 'build',
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: 'http://localhost:5000/:path*',
      },
    ];
  },
};
