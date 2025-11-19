const config = {
  reactStrictMode: true,
  swcMinify: true,
  optimizeFonts: false,
  compress: true, // Habilitar compresión GZIP
  
  // Optimización de imágenes
  images: {
    domains: ['img.youtube.com', 'i.ytimg.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    unoptimized: false,
  },
  
  webpack(config) {
    // Configura el manejo de SVG
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    // Optimización de code splitting
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

        // Chunk para componentes
        components: {
          filename: 'chunks/components.js',
          test: /[\\/]components[\\/]/,
          name: 'components',
          priority: 20,
          reuseExistingChunk: true,
        },

        // Chunk para hooks
        hooks: {
          filename: 'chunks/hooks.js',
          test: /[\\/]hooks[\\/]/,
          name: 'hooks',
          priority: 15,
          reuseExistingChunk: true,
        },
      },
    }

    return config;
  },

  // Configuración para evitar warnings de console en producción
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Headers para caching
  headers: async () => {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.css',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Experimental optimizations
  experimental: {
    optimizePackageImports: [
      '@chakra-ui/react',
      'framer-motion',
      'react-icons',
      'lucide-react',
    ],
  },
};

export default config;