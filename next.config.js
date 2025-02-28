/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Desativa a pré-renderização estática para evitar erros com useSession
    appDir: true,
  },
  // Configuração para desativar a pré-renderização estática
  staticPageGenerationTimeout: 1000,
};

module.exports = nextConfig; 