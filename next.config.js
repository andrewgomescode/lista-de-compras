/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  // Configuração para desativar a pré-renderização estática
  staticPageGenerationTimeout: 1000,
  // Configuração para forçar o modo dinâmico
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig; 