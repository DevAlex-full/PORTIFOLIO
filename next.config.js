// 📁 CAMINHO: next.config.js (ALTERADO)
// Adiciona o domínio do Supabase Storage para next/image.

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Suprimir warnings de SSR em componentes client que usam localStorage
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

module.exports = nextConfig