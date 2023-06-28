const { i18n } = require('./next-i18next.config');

module.exports = {
  i18n,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*",
      },
    ];
  },
}