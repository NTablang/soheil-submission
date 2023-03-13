/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  distDir: "build",
  async rewrites() {
    return [
      {
        source: '/hello_world',
        destination: 'http://localhost:5000/hello_world',
      },
      {
        source: '/add_brightness',
        destination: 'http://localhost:5000/add_brightness',
      },
      {
        source: '/add_green_tint',
        destination: 'http://localhost:5000/add_green_tint',
      },
      {
        source: '/add_blur_blue',
        destination: 'http://localhost:5000/add_blur_blue',
      },
      {
        source: '/add_noise_blue',
        destination: 'http://localhost:5000/add_noise_blue',
      },
    ]
  },
}

module.exports = nextConfig
