const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7100'

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  // Исправляем проблему с hydration
  experimental: {
    // Отключаем проблемные функции в dev режиме
    optimizePackageImports: [],
  },
  async rewrites() {
    return [
      { source: '/api/product/:path*', destination: `${NEXT_PUBLIC_API_URL}/api/product/:path*` },
      { source: '/api/translations/:lang', destination: `${NEXT_PUBLIC_API_URL}/api/translations/:lang` },
      { source: '/api/orders', destination: `${NEXT_PUBLIC_API_URL}/api/orders` },
      { source: '/api/auth/:path*', destination: `${NEXT_PUBLIC_API_URL}/api/auth/:path*` },
      { source: '/api/cart/:path*', destination: `${NEXT_PUBLIC_API_URL}/api/cart/:path*` },
    ]
  },
}