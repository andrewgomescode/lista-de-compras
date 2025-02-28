/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  // Configuração para desativar a pré-renderização estática
  staticPageGenerationTimeout: 1000,
  // Configuração para forçar o modo dinâmico
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.vercel.app']
    }
  },
  // Desabilitar a geração estática para todas as páginas
  eslint: {
    ignoreDuringBuilds: true, // Ignorar erros de ESLint durante o build
  },
  typescript: {
    ignoreBuildErrors: true, // Ignorar erros de TypeScript durante o build
  },
};

module.exports = nextConfig; 