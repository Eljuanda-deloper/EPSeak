/**
 * Bundle Analyzer Configuration
 * Analiza el tamaño del bundle para identificar oportunidades de optimización
 */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer

/**
 * Next.js Configuration
 * Optimizaciones de performance integradas
 */
export const nextConfig = {
  // Habilitar SWC minification (más rápido que Terser)
  swcMinify: true,

  // Optimización de imágenes
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Compression
  compress: true,

  // Lazy load routes
  experimental: {
    optimizePackageImports: [
      '@chakra-ui/react',
      'framer-motion',
      'react-icons',
    ],
  },

  // Code splitting
  webpack: (config: any) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,

        // Vendor chunk para node_modules
        vendor: {
          filename: 'chunks/vendor.js',
          test: /node_modules/,
          name: 'vendors',
          priority: 10,
          reuseExistingChunk: true,
        },

        // Common chunk para código compartido
        common: {
          filename: 'chunks/common.js',
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
          enforce: true,
        },

        // Chunk para componentes UI
        ui: {
          filename: 'chunks/ui.js',
          test: /[\\/]components[\\/]ui[\\/]/,
          name: 'ui-components',
          priority: 20,
          reuseExistingChunk: true,
        },

        // Chunk para hooks
        hooks: {
          filename: 'chunks/hooks.js',
          test: /[\\/]hooks[\\/]/,
          name: 'hooks-chunk',
          priority: 15,
          reuseExistingChunk: true,
        },
      },
    }
    return config
  },
}
