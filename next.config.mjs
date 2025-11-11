const config = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['img.youtube.com', 'i.ytimg.com'],
  },
  webpack(config) {
    // Configura el manejo de SVG
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    return config;
  },
  // Configuración para evitar warnings de console en producción
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default config;