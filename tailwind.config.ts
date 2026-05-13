import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './app.vue',
    './pages/**/*.vue',
    './components/**/*.vue',
    './composables/**/*.ts',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:  ['Atkinson Hyperlegible', 'system-ui', 'sans-serif'],
        bijbel: ['Lusitana', 'Georgia', 'serif'],
      },
      borderRadius: {
        DEFAULT: '0.375rem', // pas dit aan om alle 'rounded' tegelijk te wijzigen
        full: '9999px',
      },
      colors: {
        black:   '#1A1714',   // warme near-black
        white:   '#FFFFFF',   // echt wit (inputs, vlakken)
        paper:   '#F8F6F2',   // warme paginaachtergrond
        surface: '#252220',   // verhoogd vlak in dark mode
      },
    },
  },
} satisfies Config
