/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        eco: {
          dark: '#0f2a17',   // fundo escuro do hero de login / sidebar
          green: '#16a34a',  // verde principal (botões, destaque)
          light: '#22c55e',  // verde claro (hover, badges)
          bg: '#f8fafc',     // fundo geral das telas internas
        },
      },
    },
  },
  plugins: [],
}
