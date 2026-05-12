import { readFileSync } from 'fs'
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8')) as { version: string }

export default defineNuxtConfig({
  runtimeConfig: {
    public: { versie: pkg.version },
  },
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: { lang: 'nl' },
      meta: [
        { name: 'theme-color', content: '#F8F6F2' },
        { name: 'robots', content: 'index, follow' },
      ],
      link: [
        { rel: 'canonical', href: 'https://gelukt.be' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Lusitana:wght@400;700&display=swap' },
      ],
    },
  },

  typescript: { strict: true },
  compatibilityDate: '2024-11-01',
})
