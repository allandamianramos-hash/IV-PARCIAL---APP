/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/hero/**/*.{ts,tsx}', './public/index.html'],
  // Los estilos globales existentes siguen controlando el resto de Rumbo.
  // No se usa important global: los ajustes del hero se limitan en su CSS.
  corePlugins: { preflight: false },
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'] },
    },
  },
  plugins: [],
};
