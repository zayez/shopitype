const path = require('path')
const { routes } = require('./routes.config')

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:2222/:path*', // Proxy to Backend
      },
      ...routes,
    ]
  },
}
