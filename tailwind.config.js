/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        market: {
          // Cores para o modo light
          primary: '#2E7D32', // Verde vibrante para o tema principal
          secondary: '#FF6B6B', // Vermelho suave para ações secundárias
          accent: '#FFA000', // Laranja para destaques
          background: '#F8FAFC', // Fundo claro suave
          card: '#FFFFFF', // Fundo dos cards
          text: {
            primary: '#1A1A1A', // Texto principal
            secondary: '#666666', // Texto secundário
          },
          border: '#E2E8F0', // Bordas suaves
          hover: '#34A853', // Verde mais escuro para hover
        },
        // Cores para o modo dark
        marketDark: {
          primary: '#4CAF50', // Verde mais claro para contraste
          secondary: '#FF8A8A', // Vermelho mais suave
          accent: '#FFB74D', // Laranja mais suave
          background: '#1A1F2C', // Fundo escuro azulado
          card: '#2A3441', // Cards com tom azulado
          text: {
            primary: '#F8FAFC', // Texto principal claro
            secondary: '#A0AEC0', // Texto secundário suave
          },
          border: '#3A4556', // Bordas mais suaves
          hover: '#66BB6A', // Verde mais claro para hover
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
} 